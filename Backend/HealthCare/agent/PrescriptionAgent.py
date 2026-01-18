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


class PrescriptionAgent:
    def __init__(self):
        self.prompt = read_txt_file(Prescription_Constants.System_prompt_path)
        self.llm = llm_client(temperature=Prescription_Constants.PrescriptionTemperature)
        self.ImageOCR = ImageToOCR()
        self.Retriever = RagTool()
    def create_prescription_agent(self):
        agent = create_agent(
            model= self.llm,
            tools = [self.ImageOCR.extract_text,self.Retriever.get_details],
            system_prompt=self.prompt
        )
        return agent 
    def invoke(self, image_path):
        try:
            agent = self.create_prescription_agent()
            response = agent.invoke({"messages": [HumanMessage(content=f"Process this prescription image: {image_path}")]})
            raw_response = response['messages'][-1].content
            logging.info(f"Raw LLM response: {raw_response[:200]}...")
            return raw_response
        except Exception as e:
            error_message = str(e).lower()
            logging.error(f"Error Occured:{error_message}")
            raise HealthAIException(error_message, sys)