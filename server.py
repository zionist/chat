#!/usr/bin/env python

from flask import Flask
from flask import request, make_response

import time
app = Flask(__name__)

@app.route("/", methods=["POST", "GET", "OPTIONS"])
def new():
    print "# "
    # print request.headers
    print request.get_json()
    print request.headers
    headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
        'Access-Control-Max-Age': '100',
        'Access-Control-Allow-Headers':
            'origin, x-csrftoken, content-type, accept',
    }
    if request.method == "OPTIONS":
        return make_response(("", 200, headers))
    # print request.data
    # print request.form.get('data')
    return make_response(("data", 200, headers))

# Access-Control-Allow-Origin: *

if __name__ == "__main__":
    app.run()
