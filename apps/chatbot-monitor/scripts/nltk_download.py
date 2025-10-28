import nltk
import os

task_root = os.getenv("LAMBDA_TASK_ROOT")
nltk_data_dir = f"{task_root}/_static/nltk_cache"

if nltk_data_dir not in nltk.data.path:
    nltk.data.path.append(nltk_data_dir)

nltk.download("stopwords", download_dir=nltk_data_dir)
nltk.download("punkt_tab", download_dir=nltk_data_dir)