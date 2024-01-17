import React from "react";
import {Progress} from "@nextui-org/react";

export default function ProgressBars() {
  const [value, ] = React.useState(0);
  
  return (
    <div className="flex-container">
      <div className="flex-1 m-2 p-4">
        {/* Content for the first column */}
        <Progress
          label="Downloading..."
          size="md"
          value={value}
          color="success"
          showValueLabel={true}
          className="max-w-md"
        />
        <Progress
          label="Downloading..."
          size="md"
          value={value}
          color="success"
          showValueLabel={true}
          className="max-w-md"
        />
      </div>
    </div>
  );
}