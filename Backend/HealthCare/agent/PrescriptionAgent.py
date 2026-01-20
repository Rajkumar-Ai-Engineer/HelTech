import sys 
from HealthCare.exception.HealthAI import HealthAIException
from HealthCare.logging.logger import logging
from HealthCare.tools.image_to_ocr import ImageToOCR
from HealthCare.tools.retriever import RagTool
from HealthCare.utils.main_utils import read_txt_file
from HealthCare.config.settings import Prescription_Constants 
from HealthCare.llm import llm_client
from langchain.messages import SystemMessage, HumanMessage
from langchain.agents import create_agent 
from langchain.agents.middleware import ModelFallbackMiddleware 



class PrescriptionAgent:
    def __init__(self):
        self.prompt = read_txt_file(Prescription_Constants.System_prompt_path)
        self.llm = llm_client(temperature=Prescription_Constants.PrescriptionTemperature)
        self.llm_fallback = llm_client(temperature=Prescription_Constants.PrescriptionTemperature,model_name="openai/gpt-oss-120b")
        self.ImageOCR = ImageToOCR()
        self.Retriever = RagTool()
    def create_prescription_agent(self):
        agent = create_agent(
            model= self.llm,
            tools = [self.ImageOCR.extract_text,self.Retriever.get_details],
            system_prompt=self.prompt,
            middleware=[ModelFallbackMiddleware(self.llm_fallback)]
        )
        return agent 
    def invoke(self, image_path):
        try:
            # Normalize path to prevent escaping issues
            import os
            normalized_path = os.path.normpath(image_path)
            
            agent = self.create_prescription_agent()
            response = agent.invoke({"messages": [HumanMessage(content=f"Process this prescription image: {normalized_path}")]})
            raw_response = response['messages'][-1].content
            logging.info(f"Raw LLM response: {raw_response[:200]}...")
            return raw_response
        except Exception as e:
            error_message = str(e).lower()
            
            # Enhanced error detection and logging
            if "413" in error_message or "payload too large" in error_message or "request too large" in error_message:
                logging.error(f"Token limit exceeded error: {error_message}")
                logging.error("Suggestion: The prompt or context is too large. Consider reducing database results or prompt size.")
            elif "429" in error_message or "rate_limit" in error_message:
                logging.error(f"Rate limit error: {error_message}")
                logging.error("Suggestion: Too many requests. The system will retry automatically.")
            else:
                logging.error(f"Error Occured: {error_message}")
            
            raise HealthAIException(error_message, sys)
