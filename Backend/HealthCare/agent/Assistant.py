import sys 
from HealthCare.exception.HealthAI import HealthAIException
from HealthCare.logging.logger import logging
from HealthCare.config.settings import Assistant_Constants 
from langchain_core.messages import SystemMessage, HumanMessage
from HealthCare.llm import llm_client
from HealthCare.utils.main_utils import read_txt_file
from langchain.agents import create_agent
from langchain.agents.middleware import SummarizationMiddleware,ModelFallbackMiddleware 
from langgraph.checkpoint.memory import InMemorySaver


class Assistant_Agent:
    def __init__(self):
        self.system_prompt_path = Assistant_Constants.Assistant_System_prompt_path
        self.prompt = read_txt_file(self.system_prompt_path)
        self.temperature = Assistant_Constants.Assistant_Temperature
        self.llm = llm_client(temperature=self.temperature,model_name="openai/gpt-oss-120b")
        self.summarizer =  llm_client(model_name="llama-3.1-8b-instant",temperature=0.5)
        self.agent = create_agent(
            model= self.llm,
            system_prompt=self.prompt,
            checkpointer=InMemorySaver(),
            middleware= [SummarizationMiddleware(
                model = self.summarizer,
                trigger = ("messages",6),
                keep_on = ("messages",4),
                ),
                ModelFallbackMiddleware(
                    "groq:llama-3.3-70b-versatile",
                    "groq:llama-3.1-8b-instant",
                    "groq:qwen/qwen3-32b"
                )]
        )
        logging.info("Assistant Agent initialized")
        self.config = {"configurable":{"thread_id":"test_1"}}  
              
    def run(self, user_input):
        try:
            response = self.agent.invoke({"messages": [HumanMessage(content=user_input)]},config=self.config)
            return response["messages"][-1].content
        except Exception as e:
            logging.error(f"Error in run: {e}")
            raise HealthAIException(e, sys)
        
        