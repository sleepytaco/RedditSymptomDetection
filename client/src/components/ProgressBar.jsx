import React from "react";
import {Progress} from "@nextui-org/react";

export default function ProgressBar({label, value, isLoading=true}) {  
  return (
      <div className="flex-1 p-2">
        <Progress
          label={label}
          isIndeterminate={isLoading}
          size="md"
          value={value*100}
          color="success"
          showValueLabel={true}
          classNames={{
            base: "max-w-md",
            track: "drop-shadow-md border border-default",
            indicator: "bg-gradient-to-r from-pink-500 to-yellow-500",
            label: "tracking-wider font-medium text-default-600",
            value: "text-foreground/60",
          }}
        />
      </div>
  );
}