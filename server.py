#!/usr/bin/env python

import time
import json
from flask import Flask
from flask import request, make_response

app = Flask(__name__)

messages = []
names = []
options_headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-iOrigin': '*',
    'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
    'Access-Control-Max-Age': '100',
    'Access-Control-Allow-Credentials': 'true',
    'Access-Control-Allow-Headers':
        'origin, x-csrftoken, content-type, accept',
    }

@app.route("/messages/send", methods=["POST", "OPTIONS"])
def send():
    if request.get_json():
        data = request.get_json()
        print data
        messages.append(data)
        print messages
    if request.method == "OPTIONS":
        return make_response(("", 200, options_headers))
    return make_response(("", 200, options_headers))

@app.route("/login", methods=["POST", "OPTIONS"])
def login():
    data = request.get_json()
    print data
    if request.method == "OPTIONS":
        return make_response(("", 200, options_headers))
    name = data.get("login")
    if not name:
        return make_response(("", 403))
    if name in names:
        return make_response(("", 403, options_headers))
    else:
        names.append(name)
        print names
        return make_response(("", 200, options_headers))

@app.route("/logout", methods=["POST", "OPTIONS"])
def logout():
    data = request.get_json()
    if request.method == "OPTIONS":
        return make_response(("", 200, options_headers))
    name = data.get("login")
    if not name:
        return make_response(("", 500))
    if name in names:
        names.remove(name)
        return make_response(("", 200, options_headers))
    else:
        return make_response(("", 204, options_headers))

@app.route("/messages/<int:num>", methods=["GET", "OPTIONS"])
def get_messages():
    if request.method == "OPTIONS":
        return make_response(("", 200, options_headers))
    else:
        if messages:
            data = messages[-1]
        else:
            data = ""
        return make_response((json.dumps(data),  200, options_headers))

@app.route("/messages/count", methods=["GET", "OPTIONS"])
def get_messages_count():
    if request.method == "OPTIONS":
        return make_response(("", 200, options_headers))
    else:
        if messages:
            data = messages[-1]
        else:
            data = ""
        return make_response((json.dumps(len(messages)),  200, options_headers))

@app.route("/history", methods=["GET", "OPTIONS"])
def get_history():
    if request.method == "OPTIONS":
        return make_response(("", 200, options_headers))
    return make_response((json.dumps(messages), 200, options_headers))

if __name__ == "__main__":
    app.run(threaded=True)
