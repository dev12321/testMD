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


from face_verification import register_face, verify
UPLOAD_FOLDER = '/tmp'
ALLOWED_EXTENSIONS = set([ 'png', 'jpg', 'jpeg'])

app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS



@app.route('/register', methods=['GET', 'POST'])
@cross_origin()
def register_face_handler():
    print("START register_face")
   
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
        data = register_face(file.filename,img)
        if(data==1):
            return jsonify({
            "state":'complete',
            "error":None,
            })
        else:
            return jsonify({
            "state":'not_complete',
            "error":data,
            })
        # PIL_image = Image.fromarray(np.uint8(npimg)).convert('RGB')
        # PIL_image.save('ASDF2.jpg')
        # PIL_image = Image.fromarray(npimg.astype('uint8'), 'RGB')
        # PIL_image.save('ASDF3.jpg')

      
    else:
        return "<h1>Welcome to our server !!</h1>"


@app.route('/verify', methods=['GET', 'POST'])
@cross_origin()
def upload_file():
    print("START")
    if request.method == 'POST':
        try:
            # check if the post request has the file part
            if 'file' not in request.files:
                print('No file part')
                return redirect(request.url)
            file = request.files['file']
            print(file.filename)
            img = Image.open(file)
            data = verify(file.filename,img)
            if(data==1):
                return jsonify({
                "state":'verified',
                "error":None,
                })
            else:
                return jsonify({
                "state":'not_verfied',
                "error":data,
                })
        except:
            return jsonify({
            "state":'not_verfied',
            "error":data,
            })
        
        # npimg = np.array(img)
        # PIL_image = Image.fromarray(np.uint8(npimg)).convert('RGB')
        # PIL_image.save('ASDF2.jpg')
        # PIL_image = Image.fromarray(npimg.astype('uint8'), 'RGB')
        # PIL_image.save('ASDF3.jpg')

        # return "<h1>Welcome to our server !!</h1>"
    else:
        return "<h1>Welcome to our server !!</h1>"

if __name__ == '__main__':
   app.run( debug=True, port=5002)
