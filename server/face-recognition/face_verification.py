from mtcnn import MTCNN
from tensorflow.keras.models import load_model
import os
from PIL import Image, ImageFont, ImageDraw, ImageEnhance
import matplotlib.pyplot as plt
import numpy as np
from PIL import Image

detector = MTCNN()


model = load_model('model/facenet_keras.h5')

# path where the face embedding will be saved of the registered user
face_print_registry_database = 'Registry_database/Face Print/' 



def get_face(image,resize_scale=(160,160)):
    
    """ 
    This function is used to extract the face of 160x160 from the given image 
    
    Input : image directory path as input
    Returns : A tuple containing list of faces found, the original image.
    
    """
    
    
    face_list=list()
    
    # image = Image.open(path)
    # image = image.convert('RGB')
        
    pixels = np.asarray(image)
#     print(pixels.shape)

    faces_detected = detector.detect_faces(pixels)

    for detected_faces in faces_detected:
        x1, y1, width, height = detected_faces['box']
        components = detected_faces
        x1,y1 = abs(x1),abs(y1)

        x2, y2 = x1+width, y1+height

        final_face = pixels[y1:y2,x1:x2]
        
#         marker_function(detected_faces,image,x1,x2,y1,y2)
        # marker_function(detected_faces,image,x1,x2,y1,y2)

        
        pic = Image.fromarray(final_face)        
        pic = pic.resize(resize_scale)
        
        face_array = np.asarray(pic)
#         print(f'Extracted : {face_array.shape}')
        
        face_list.append(face_array)
    # plt.imshow(image)
    # plt.show()
    
    return face_list,image

def get_face_embeddings(face_pixels):
    
    """ This function takes faces extracted by get_face() and return a vector of 128 numbers known as Face Embeddings """
    
    face_pixels = face_pixels.astype('float32')
    
    mean, std = face_pixels.mean(), face_pixels.std()
    face_pixels = (face_pixels - mean) / std

    samples = np.expand_dims(face_pixels, axis=0)
    yhat = model.predict(samples)
    return yhat[0]



def register_face(attempt_id,image):
    
    """ Saves the face embeddings into directory for comparision """
    
    pixels_extracted, pixels_img = get_face(image) 
    if pixels_extracted:
        features_extracted = get_face_embeddings(pixels_extracted[0])
        if len(features_extracted):
            np.savez_compressed(f'{face_print_registry_database}{attempt_id}.npz',features_extracted)
            return 1
        else:
            return 'Cannot extract the features'
    else:
        return 'face not found'
    
    
feature_threshold = 10 # The threshold used to estimate the similarity 


def verify(attempt_id,image):
    
    '''
    Main function
    
    Work : 
        Extract the face embeddings of the given face
        compare those embaddings with the saved ones.
    
    '''
    loaded_embeddings = np.load(face_print_registry_database+attempt_id+'.npz')['arr_0']
    target_face, target_img = get_face(image)
    if target_face:
        for faces in target_face:
            target_face_embeddings = get_face_embeddings(faces)
            print(loaded_embeddings.shape,target_face_embeddings.shape)
            dist = np.linalg.norm(loaded_embeddings-target_face_embeddings) # matching the image

            if dist<feature_threshold:
                print(f'Face Recognised as : {attempt_id}, Authentication Successfull | Vector Distance: {dist}')
                return 1
            else:
                return f'Face Not Recognised... | Vector Distance: {dist}'

    else:
        return 'No face detected in the input image...\nTry keping ur face in center and straight.'
        # return 404 # no face detected

