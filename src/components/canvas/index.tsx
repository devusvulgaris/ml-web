"use client";
import { type FC, useRef, useEffect, useState } from "react";
import { Button, Card, CardBody, image } from "@nextui-org/react";

const Drawing: FC = (props) => {
  const [drawing, setDrawing] = useState(false);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const context = canvas.getContext("2d");
      if (context) {
        context.fillStyle = "#000";
        ctxRef.current = context;
      }
    }
  }, []);

  useEffect(() => {}, []);

  const startDraw = ({ nativeEvent }) => {
    const { offsetX, offsetY } = nativeEvent;
    ctxRef.current.beginPath();
    ctxRef.current.moveTo(offsetX, offsetY);
    setDrawing(true);
  };

  const draw = ({ nativeEvent }) => {
    if (!drawing) {
      return;
    }

    const { offsetX, offsetY } = nativeEvent;
    ctxRef.current.lineTo(offsetX, offsetY);
    ctxRef.current.stroke();
  };

  const stopDraw = () => {
    ctxRef.current.closePath();
    setDrawing(false);
  };

  const clear = () => {
    ctxRef.current.clearRect(
      0,
      0,
      ctxRef.current.canvas.width,
      ctxRef.current.canvas.height
    );
  };

  const send = async () => {
    const imageData = ctxRef.current.getImageData(
      0,
      0,
      canvasRef.current.width,
      canvasRef.current.height
    );

    try {
      setLoading(true);
      setResult(null);
      const arrayData = [...imageData.data];
      console.log(
        "Drawing data: ",
        JSON.stringify({
          imageData: arrayData,
          width: imageData.width,
          height: imageData.height,
        })
      );
      const response = await fetch("http://localhost:8000/api/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          imageData: arrayData,
          width: imageData.width,
          height: imageData.height,
        }),
      });

      const result = await response.json();
      const { prediction } = result;
      setResult(prediction);
      console.log("response result: ", result);
    } catch (e) {
      console.error(e);
      setError(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div
        className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4"
        role="alert"
      >
        <p>
          Currently drawing canva has size equal to 28 x 28 pixels due to Model
          input restriction.
        </p>
      </div>
      <p className="mb-2">Please draw digit in the box below:</p>
      <canvas
        ref={canvasRef}
        onMouseDown={startDraw}
        onMouseUp={stopDraw}
        onMouseMove={draw}
        width={28}
        height={28}
        style={{
          width: 28,
          height: 28,
        }}
        className="border mb-4"
      />
      <div className="flex gap-2 mb-4">
        <Button onClick={clear}>Clear</Button>
        <Button variant="solid" color="primary" onClick={send}>
          Send
        </Button>
      </div>
      <div>
        <p>Prediction</p>
        {result}
      </div>
    </div>
  );
};

export default Drawing;
