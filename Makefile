.ONESHELL:

.PHONY: venv
venv:
	. venv/bin/activate

.PHONY: install-api
install-api:
	python3 -m venv venv
	. venv/bin/activate
	pip install -r backend/requirements.txt	

.PHONY: install-client
install-client:
	cd client; yarn;

.PHONY: activate
activate:
	source venv/bin/activate

.PHONY: run-api
run-api:
	cd backend; python app.py;

.PHONY: run-client
run-client:
	cd client; yarn run dev;