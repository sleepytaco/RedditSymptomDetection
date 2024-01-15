venv:
	python3 -m venv venv

install:
	pip install -r requirements.txt	 

activate:
	source venv/bin/activate

run-roberta:
	cd backend/model; python roberta_clf.py

run-flask:
	cd backend; python app.py;