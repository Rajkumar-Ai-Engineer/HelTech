from dotenv import load_dotenv
load_dotenv()
import os 

########################################
"1.API_KEY"
GROQ_API_KEY = os.getenv("GROQ_API_KEY")

# Prescription
GPT_120b_ID = "llama-3.3-70b-versatile"
VISION_OCR_Path = "C:\\Hackathons\\Thiagarajar\\main\\Backend\\googlevisionAPI\\credientials.json"
PRESCRIPTION_MODEL_TEMPERATURE = 0.2
SYSTEM_PROMPT_PATH = "C:\\Hackathons\\Thiagarajar\\main\\Backend\\HealthCare\\prompts\\Prescription\\Main.txt"
HUGGINGFACE_API_KEY = os.getenv("HUGGINGFACE_API_KEY")
HUGGINFACE_EMBEDDING_MODEL_ID = os.getenv("HUGGINFACE_EMBEDDING_MODEL_ID")

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")
table_name="documents"
query_name="similarity_search_documents"


#Assistant
ASSISTANT_SYSTEM_PROMPT_PATH = "C:\\Hackathons\\Thiagarajar\\main\\Backend\\HealthCare\\prompts\\Assistant\\System.txt"
ASSISTANT_MODEL_TEMPERATURE = 0.2



