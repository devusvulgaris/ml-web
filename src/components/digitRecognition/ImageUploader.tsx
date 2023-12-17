import { FormEvent, useEffect, useState } from "react";
import { Button, Input } from "@nextui-org/react";
import { Image } from "@nextui-org/react";
import NextImage from "next/image";

type Props = {};

const ImageUploader = (props: Props) => {
  const [image, setImage] = useState(null);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  const handleSubmit = async (ev: FormEvent<HTMLFormElement>) => {
    ev.preventDefault();

    try {
      setLoading(true);
      if (image) {
        const formData = new FormData();
        formData.append("image", image);

        const response = await fetch("/api/predict-image", {
          method: "POST",
          body: formData,
        });
        const result = await response.json();
        const { prediction } = result;
        setResult(prediction);
      }
    } catch (err) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (image) {
      const src = URL.createObjectURL(image);
      setImageSrc(src);

      return () => {
        URL.revokeObjectURL(src);
      };
    }
  }, [image]);

  const clearImage = () => {
    setImage(null);
    setImageSrc(null);
  };

  console.log("image", image);

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div>
          <Input
            name="image"
            type="file"
            onChange={(ev) => setImage(ev.target.files[0])}
          />
          {image && <Button onClick={clearImage}>Clear</Button>}
        </div>

        {imageSrc && (
          <Image
            as={NextImage}
            width={100}
            height={100}
            src={imageSrc}
            alt="preview"
          />
        )}
        <Button type="submit">Upload</Button>
      </form>
      <div>
        <p>Prediction</p>
        {result}
      </div>
    </div>
  );
};

export default ImageUploader;
