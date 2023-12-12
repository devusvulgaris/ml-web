from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import pickle
import numpy as np
from pydantic import BaseModel
from typing import Sequence
import json


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
