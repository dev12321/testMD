import os
from flask import Flask, request, redirect,jsonify
from werkzeug.utils import secure_filename
import requests
import numpy as np
import io
import cv2
import json
from PIL import Image
import base64
from flask_cors import CORS, cross_origin


UPLOAD_FOLDER = '/tmp'
ALLOWED_EXTENSIONS = set([ 'png', 'jpg', 'jpeg'])

app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS



@app.route('/', methods=['GET', 'POST'])
@cross_origin()
def object_detection_handler():
    print("START object_detection")
   
    # print(request.data.get('file'))
    if request.method == 'POST':
        # check if the post request has the file part
        print('request.files')
        print(request.files)
        if 'file' not in request.files:
            print('No file part')
            return jsonify({
            "state":'error',
            "error":'file not passed',
            })
        file = request.files['file']
        print(file.filename)
        img = Image.open(file)
        data = 1#register_face(file.filename,img)
        # if(data==1):
        #     return jsonify({
        #     "state":'complete',
        #     "error":None,
        #     })
        # else:
        #     return jsonify({
        #     "state":'not_complete',
        #     "error":data,
        #     })
        # PIL_image = Image.fromarray(np.uint8(npimg)).convert('RGB')
        # PIL_image.save('ASDF2.jpg')
        # PIL_image = Image.fromarray(npimg.astype('uint8'), 'RGB')
        # PIL_image.save('ASDF3.jpg')

      
    else:
        return "<h1>Welcome to our server !!</h1>"


if __name__ == '__main__':
   app.run( debug=True, port=5003)
