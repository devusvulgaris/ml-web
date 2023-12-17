from fastapi import FastAPI, UploadFile
from fastapi.middleware.cors import CORSMiddleware
import pickle
import numpy as np
from pydantic import BaseModel
from typing import Sequence
import json
from skimage.transform import resize
from skimage import io, color


class Data(BaseModel):
    imageData: Sequence[int]
    width: int
    height: int


app = FastAPI()

origins = [
    '*'
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_methods=["*"],
)


def rgb2gray(rgb):
    return np.dot(rgb, grayscale_list)


grayscale_list = [0.299, 0.587, 0.144]


@app.get("/api/healthcheck")
def healthcheck():
    return {"status": "success", "message": "Machine learning is not easy.."}


lr_model = pickle.load(open("api/models/lr_model.pkl", "rb"))


@app.post("/api/predict")
async def predict(data: Data):

    model = pickle.load(open("api/models/lr_model.pkl", "rb"))
    # convert to array of rgba data
    rgba_data = np.array(data.imageData).reshape(-1, 4)

    intensity_list = []
    for item in rgba_data:
        intensity_list.append(rgb2gray(item[:-1]))

    print("intensity_list ", intensity_list[:5], len(intensity_list))
    np_intensity_array = np.array(intensity_list).reshape(1, -1)
    print("Shape", np_intensity_array.shape)

    prediction = model.predict(np_intensity_array)

    print("prediction", prediction)
    return {"prediction": json.dumps(prediction.tolist())}


@app.post("/api/predict-image")
async def predict(image: UploadFile):

    bytes = await image.read()

    image_array = io.imread(bytes, plugin='imageio')

    gray_image = rgb2gray(image_array)

    resized_image = resize(gray_image, (28, 28), anti_aliasing=True)

    flattened_image = resized_image.flatten()

    image_to_predict = flattened_image.reshape(1, -1)

    prediction = lr_model.predict(image_to_predict)

    print("prediction", prediction[0])

    return {
        "message": "Good",
        "type": image.content_type,
        "prediction": prediction[0]
    }
