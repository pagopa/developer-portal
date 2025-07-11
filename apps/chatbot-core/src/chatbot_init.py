import yaml
from logging import getLogger
from src.modules.chatbot import Chatbot
from src.modules.logger import get_logger

LOGGER = get_logger(__name__)

LOGGER.info("Initializing chatbot...")

params = yaml.safe_load(open("config/params.yaml", "r"))
prompts = yaml.safe_load(open("config/prompts.yaml", "r"))
chatbot = Chatbot(params, prompts)
