import argparse
import time
import yaml
import logging
import timeit
from src.modules.chatbot import Chatbot


logging.basicConfig(level=logging.INFO)


if __name__ == "__main__":

    parser = argparse.ArgumentParser()
    parser.add_argument("--params", type=str, default="config/params.yaml", help="params path")
    parser.add_argument("--prompts", type=str, default="config/prompts.yaml", help="prompts path")
    args = parser.parse_args()

    # load parameters
    params = yaml.safe_load(open(args.params, "r"))
    prompts = yaml.safe_load(open(args.prompts, "r"))

    chatbot = Chatbot(params, prompts)

    inp = ""
    while inp != "exit":
        try:
            inp = input("Ask: ")
            print(chatbot.generate(inp))
        except Exception as e:
            print(e)
    # print(chatbot.generate("GPD gestisce già i pagamenti rateali multipli?"))
