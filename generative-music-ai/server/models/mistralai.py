import requests
import json

class MistralAI:
    def __init__(self):
        self.api_url = 'http://localhost:8081/generate_text'
        self.headers = {"Content-Type": "application/json"}

    def generate_text(self, text):
        data = {"text": text}
        json_data = json.dumps(data)
        response = requests.post(self.api_url, data=json_data, headers=self.headers)

        if response.status_code == 200:
            print("\n\n  ----------- Generating song description... -----------  \n\n")
            generated_text = response.json()['output']
            print("\n\n  ----------- Song description created. -----------  \n\n")

            # print("Generated text from MistralAI: ", generated_text)
            return generated_text
        else:
            print(f"Request failed with status code {response.status_code}.")
            return None