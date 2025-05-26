import yaml
from logging import getLogger
from src.modules.chatbot import Chatbot

logger = getLogger(__name__)

logger.info("Initializing chatbot...")

params = yaml.safe_load(open("config/params.yaml", "r"))
prompts = yaml.safe_load(open("config/prompts.yaml", "r"))
chatbot = Chatbot(params, prompts)