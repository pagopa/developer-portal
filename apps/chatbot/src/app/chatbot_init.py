from src.modules.chatbot import Chatbot
from src.modules.settings import SETTINGS
from src.modules.logger import get_logger

LOGGER = get_logger(__name__, level=SETTINGS.log_level)

LOGGER.info("Initializing chatbot...")

chatbot = Chatbot()
