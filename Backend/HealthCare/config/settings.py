from HealthCare.constant import llm_pipeline
from dataclasses import dataclass

@dataclass
class Model_API_KEY:
    model_api_key = llm_pipeline.GROQ_API_KEY
    
@dataclass
class Prescription_Constants:
    gpt_120b_id = llm_pipeline.GPT_120b_ID
    OCR_Client_Path = llm_pipeline.VISION_OCR_Path
    PrescriptionTemperature = llm_pipeline.PRESCRIPTION_MODEL_TEMPERATURE
    System_prompt_path = llm_pipeline.SYSTEM_PROMPT_PATH
    HuggingFaceApiKey = llm_pipeline.HUGGINGFACE_API_KEY
    HuggingFaceEmbedModel = llm_pipeline.HUGGINFACE_EMBEDDING_MODEL_ID
    Supabase_url = llm_pipeline.SUPABASE_URL
    Supabase_key = llm_pipeline.SUPABASE_KEY
    Table = llm_pipeline.table_name
    QueryName = llm_pipeline.query_name
    
@dataclass
class Assistant_Constants:
    Assistant_System_prompt_path = llm_pipeline.ASSISTANT_SYSTEM_PROMPT_PATH
    Assistant_Temperature = llm_pipeline.ASSISTANT_MODEL_TEMPERATURE
