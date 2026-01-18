import sys 
from HealthCare.exception.HealthAI import HealthAIException
from HealthCare.logging.logger import logging 

from HealthCare.vector_database.prescription_store import PrescriptionStore

ps = PrescriptionStore()

class RagTool:
    def __init__(self):
        self.vs = ps.vs 
        self.embeddings = ps.Embeddings
        self.sb_client = ps.sb_client
    
    def get_details(self, drugname: str):
        """Get drug interactions and effects based on medicine name"""
        try:
            if not drugname or not drugname.strip():
                logging.warning("Empty drug name provided to retriever")
                return {"data": [], "error": "Invalid drug name"}
            
            logging.info(f"Retrieving details for drug: {drugname}")
            
            # First attempt: High similarity threshold
            query_embedding = self.embeddings.embed_query(drugname)
            search_result = self.sb_client.rpc("similarity_search_documents", {
                "query_embedding": query_embedding,
                "match_threshold": 0.5,  # Increased from 0.3 for better relevance
                "match_count": 5  # Increased from 3 for more context
            }).execute()
            
            if search_result.data and len(search_result.data) > 0:
                logging.info(f"Found {len(search_result.data)} results for {drugname}")
                return search_result.data
            
            # Fallback: Lower threshold if no results
            logging.info(f"No results with high threshold, trying lower threshold for {drugname}")
            search_result = self.sb_client.rpc("similarity_search_documents", {
                "query_embedding": query_embedding,
                "match_threshold": 0.3,
                "match_count": 5
            }).execute()
            
            if search_result.data:
                logging.info(f"Found {len(search_result.data)} results with lower threshold")
                return search_result.data
            
            logging.warning(f"No database results found for drug: {drugname}")
            return {"data": [], "message": "No database results - use general knowledge"}
            
        except Exception as e:
            logging.error(f"Error retrieving drug details for {drugname}: {str(e)}")
            return {"data": [], "error": str(e)}
        