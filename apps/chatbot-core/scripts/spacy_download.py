import spacy
import yaml
import os

if __name__ == "__main__":
    task_root = os.getenv("LAMBDA_TASK_ROOT")

    # Define the path to the YAML file
    yaml_file_path = 'config/params.yaml'
    
    # Read models
    with open(yaml_file_path, 'r') as file:
        config = yaml.safe_load(file)

    # Access the "models" array from the "config_presidio" section
    models = config.get('config_presidio', {}).get('models', [])

    # Print the models
    for model in models:
        print(f"Downloading model {model['model_name']}")
        spacy.cli.download(model['model_name'])