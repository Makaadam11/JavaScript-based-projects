import requests
import json

class MistralAI:
    def __init__(self):
        self.api_url = 'http://localhost:8081/generate_text'
        self.headers = {"Content-Type": "application/json"}

    def generate_text(self, text):
        # Create a dictionary with the input text
        data = {"text": text}

        # Convert the dictionary to a JSON string
        json_data = json.dumps(data)

        # Send the POST request
        response = requests.post(self.api_url, data=json_data, headers=self.headers)

        # Handle the response
        if response.status_code == 200:
            print("Request was successful.")
            # Get the generated text
            generated_text = response.json()['output']
            print("Generated text: ", generated_text)
            return generated_text
        else:
            print(f"Request failed with status code {response.status_code}.")
            return None