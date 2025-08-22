"use client";
import React from "react";
import { FlipWords } from './ui/flip-words';

export const WelcomeText = (): React.JSX.Element => {
  const rotatingWords = [
    "adventurer",
    "designer", 
    "engineer",
    "developer",
    "photographer",
    "soccer player"
  ];

  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ textAlign: 'left', marginBottom: '10px' }}>
        Hi, I'm Miles Keaveny, <FlipWords words={rotatingWords} duration={2500} />
      </div>
      <div>
        welcome to my webpage
      </div>
    </div>
  );
}; 