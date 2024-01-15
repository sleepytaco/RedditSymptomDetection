from flask import Flask, request
from model import roberta_clf

app = Flask(__name__)

@app.route("/", methods=["GET"])
def home():
    # query params
    text = request.args.get("text", "Hello world!")
    sym_probs = roberta_clf.run_roberta_classifiers(text, roberta_clf.roberta_sym_classifiers)
    # handle GET
    return {"text": text, **sym_probs}

if __name__ == "__main__":
    app.run(debug=True)