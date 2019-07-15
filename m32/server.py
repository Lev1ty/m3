from flask import Flask, request
app = Flask(__name__)
@app.route('/', methods=['GET', 'POST'])
def root():
    return request.data if request.method == 'POST' else '/ GET'
