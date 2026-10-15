import redis
import logging

# Set up logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

def clean_redis_indices(redis_client: redis.Redis, exclusion_list: list[str]) -> None:
    """
    Deletes all RediSearch indices and their associated documents, 
    except those specified in the exclusion_list.
    """
    try:
        # Get all RediSearch indices
        indices = redis_client.execute_command("FT._LIST")
        
        if not indices:
            logging.info("No indices found in Redis.")
            return

        logging.info(f"Found {len(indices)} indices: {indices}")
        
        for index_name in indices:
            # decode if the client is not returning strings
            if isinstance(index_name, bytes):
                index_name = index_name.decode('utf-8')
                
            if index_name in exclusion_list:
                logging.info(f"Skipping excluded index: {index_name}")
                continue
                
            try:
                # FT.DROPINDEX deletes the index. 
                # The 'DD' argument ensures the underlying documents are also deleted.
                redis_client.execute_command("FT.DROPINDEX", index_name, "DD")
                logging.info(f"Successfully deleted index and documents for: {index_name}")
            except redis.exceptions.ResponseError as e:
                logging.error(f"Failed to drop index '{index_name}': {e}")

    except redis.exceptions.ResponseError as e:
        logging.error(f"Error listing indices (is RediSearch loaded?): {e}")
    except Exception as e:
        logging.error(f"An unexpected error occurred: {e}")

if __name__ == "__main__":
    # 1. Configure your exclusion list here
    EXCLUDED_INDICES = [
        "devportal-index",
        "cittadino-index",
    ]

    # 2. Connect to Redis (Adjust host, port, and password as needed)
    client = redis.Redis(
        host='localhost', 
        port=16379, 
        password=None,
        decode_responses=True # Ensures we get strings instead of bytes
    )
    
    # Check connection before running
    try:
        client.ping()
        logging.info("Successfully connected to Redis.")
        
        # 3. Run the cleanup
        clean_redis_indices(client, EXCLUDED_INDICES)
        
    except redis.exceptions.ConnectionError:
        logging.error("Could not connect to Redis. Check your host and port.")