"use client";
import { type FC } from "react";

import { Tabs, Tab } from "@nextui-org/react";
import Canvas from "@/components/canvas";
import ImageUploader from "./ImageUploader";
import ModelDropdown from "./ModelDropdown";

const DigitRecognition: FC = () => {
  return (
    <div>
      <p className="text-lg mb-3">Digit recognition</p>
      <div className="mb-4">
        <p className="text-lg mb-3">Select a model</p>
        <ModelDropdown />
      </div>
      <Tabs>
        <Tab key="draw" title="Draw">
          <Canvas />
        </Tab>
        <Tab key="upload" title="Upload">
          <ImageUploader />
        </Tab>
      </Tabs>
    </div>
  );
};

export default DigitRecognition;
