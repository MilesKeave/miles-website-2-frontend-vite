"use client";
import React from "react";
import { TextHoverEffect } from './ui/text-hover-effect';

export const NameTitle = (): React.JSX.Element => {
  return (
    <div className="flex-shrink-0 w-full h-full">
      <TextHoverEffect 
        text="Miles Keaveny"
        duration={0}
        className="w-full h-full"
      />
    </div>
  );
}; 