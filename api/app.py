from flask import Flask, request
from model import roberta_clf
from flask_cors import CORS

app = Flask(__name__)
CORS(app) # this allows cross-origin requests from any origin

@app.route("/", methods=["GET"])
def home():
    # query params
    text = request.args.get("text", "Hello world!")
    sym_probs = roberta_clf.run_roberta_classifiers(text)
    # handle GET
    return {"text": text, **sym_probs}

if __name__ == "__main__":
    app.run(debug=True)