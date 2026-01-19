from dotenv import load_dotenv
load_dotenv()
import os 
from pathlib import Path

# Base directory - this points to Backend/HealthCare
BASE_DIR = Path(__file__).resolve().parent.parent.parent

########################################
"1.API_KEY"
GROQ_API_KEY = os.getenv("GROQ_API_KEY")

# Prescription
GPT_120b_ID = "llama-3.3-70b-versatile"
# googlevisionAPI is at Backend/ level, not HealthCare/ level, so go up one more directory
VISION_OCR_Path = str(BASE_DIR.parent / "googlevisionAPI" / "credientials.json")
PRESCRIPTION_MODEL_TEMPERATURE = 0.2
SYSTEM_PROMPT_PATH = str(BASE_DIR / "prompts" / "Prescription" / "Main.txt")
HUGGINGFACE_API_KEY = os.getenv("HUGGINGFACE_API_KEY")
HUGGINFACE_EMBEDDING_MODEL_ID = os.getenv("HUGGINFACE_EMBEDDING_MODEL_ID", "sentence-transformers/all-MiniLM-L6-v2")

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")
table_name="documents"
query_name="similarity_search_documents"


#Assistant
ASSISTANT_SYSTEM_PROMPT_PATH = str(BASE_DIR / "prompts" / "Assistant" / "System.txt")
ASSISTANT_MODEL_TEMPERATURE = 0.2



