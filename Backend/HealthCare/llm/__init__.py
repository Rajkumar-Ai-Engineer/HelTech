from langchain_groq import ChatGroq
from HealthCare.config.settings import Model_API_KEY,Prescription_Constants

def llm_client(temperature=0.2,model_name=Prescription_Constants.gpt_120b_id):
    return ChatGroq(
        api_key=Model_API_KEY.model_api_key,
        model_name=model_name, 
        temperature=temperature
    )
    
