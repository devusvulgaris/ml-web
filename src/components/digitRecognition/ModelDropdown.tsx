import React from "react";
import { Select, Dropdown, SelectItem } from "@nextui-org/react";

type Props = {};

const models = [
  { label: "Logistic Regression", value: "logistic_regresion" },
  { label: "Decision tree", value: "decision_tree" },
];
const ModelDropdown = (props: Props) => {
  return (
    <div>
      <Select>
        {models.map(({ label, value }) => (
          <SelectItem key={value} value={value}>
            {label}
          </SelectItem>
        ))}
      </Select>
    </div>
  );
};

export default ModelDropdown;
