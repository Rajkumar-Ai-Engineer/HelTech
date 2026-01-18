from langchain_huggingface import HuggingFaceEndpointEmbeddings
from HealthCare.config.settings import Prescription_Constants
from supabase import create_client
from langchain_community.vectorstores import SupabaseVectorStore 

class PrescriptionStore:
    def __init__(self):
        self.Embeddings = HuggingFaceEndpointEmbeddings(
            huggingfacehub_api_token=Prescription_Constants.HuggingFaceApiKey,
            model=Prescription_Constants.HuggingFaceEmbedModel
            )
        self.sb_client = create_client(
            supabase_key=Prescription_Constants.Supabase_key,
            supabase_url=Prescription_Constants.Supabase_url
            )
        self.vs = SupabaseVectorStore(
                client=self.sb_client,
                embedding=self.Embeddings,
                table_name=Prescription_Constants.Table,
                query_name=Prescription_Constants.QueryName
            )
