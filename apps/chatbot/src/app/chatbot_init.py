from src.modules.chatbot import Chatbot
from src.modules.logger import get_logger

LOGGER = get_logger(__name__)

LOGGER.info("Initializing chatbot...")

chatbot = Chatbot()
