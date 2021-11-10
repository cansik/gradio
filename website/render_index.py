import os
import json
from jinja2 import Template
import requests

def generate():
    os.makedirs("generated", exist_ok=True)
    with open("src/tweets.json") as tweets_file:
        tweets = json.load(tweets_file)
    star_count = "{:,}".format(requests.get("https://api.github.com/repos/gradio-app/gradio"
        ).json()["stargazers_count"])
    with open("src/index_template.html") as template_file:
        template = Template(template_file.read())
        output_html = template.render(tweets=tweets, star_count=star_count)
    with open(os.path.join("generated", "index.html"), "w") as generated_template:
        generated_template.write(output_html)

if __name__ == "__main__":
    generate()
