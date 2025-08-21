"use client";
import React from "react";
import { motion } from "motion/react";
import { cn } from "../../lib/utils";

export const BackgroundBeams = React.memo(
  ({ className }: { className?: string }) => {
    // Screen dimensions
    const screenWidth = 1200;
    const screenHeight = 800;
    
    // Content area to avoid (centered)
    const contentWidth = 450;
    const contentHeight = 200;
    const contentLeft = (screenWidth - contentWidth) / 2;
    const contentRight = contentLeft + contentWidth;
    const contentTop = (screenHeight - contentHeight) / 2;
    const contentBottom = contentTop + contentHeight;
    const contentCenterX = screenWidth / 2;
    const contentCenterY = screenHeight / 2;

    // Generate organic flowing paths
    const generateFlowingPaths = () => {
      const paths = [];
      const numPaths = 25;
      
      for (let i = 0; i < numPaths; i++) {
        // Start from off-screen with slight variations
        const startX = -150 - i * 8;
        const startY = -100 - i * 6;
        
        // Create a flowing path that curves around the content
        const path = createFlowingPath(startX, startY, i);
        paths.push(path);
      }
      
      return paths;
    };

    const createFlowingPath = (startX: number, startY: number, index: number) => {
      const points = [];
      
      // Add starting point
      points.push(`M${startX} ${startY}`);
      
      // Generate control points that create organic curves
      const numSegments = 8;
      let currentX = startX;
      let currentY = startY;
      
      for (let segment = 0; segment < numSegments; segment++) {
        const progress = segment / (numSegments - 1);
        
        // Calculate target position (flowing around content)
        let targetX, targetY;
        
        if (progress < 0.3) {
          // First third: flow towards content area
          targetX = contentLeft - 100 + segment * 50;
          targetY = contentTop - 80 + segment * 30;
        } else if (progress < 0.7) {
          // Middle: flow around content
          const angle = (progress - 0.3) / 0.4 * Math.PI * 2;
          const radius = 120 + index * 3; // Varying radius for different paths
          targetX = contentCenterX + Math.cos(angle) * radius;
          targetY = contentCenterY + Math.sin(angle) * radius;
        } else {
          // Last third: flow away from content
          targetX = contentRight + 100 + (segment - 5) * 60;
          targetY = contentBottom + 80 + (segment - 5) * 40;
        }
        
        // Add some organic variation
        const variation = Math.sin(segment * 0.8 + index * 0.3) * 20;
        targetX += variation;
        targetY += Math.cos(segment * 0.6 + index * 0.2) * 15;
        
        // Create control points for smooth curves
        const control1X = currentX + (targetX - currentX) * 0.3 + Math.sin(segment + index) * 30;
        const control1Y = currentY + (targetY - currentY) * 0.3 + Math.cos(segment + index) * 25;
        const control2X = currentX + (targetX - currentX) * 0.7 + Math.sin(segment + index + 1) * 30;
        const control2Y = currentY + (targetY - currentY) * 0.7 + Math.cos(segment + index + 1) * 25;
        
        // Add curve segment
        points.push(`C${control1X} ${control1Y} ${control2X} ${control2Y} ${targetX} ${targetY}`);
        
        currentX = targetX;
        currentY = targetY;
      }
      
      // Continue path off-screen
      const endX = screenWidth + 150 + index * 10;
      const endY = screenHeight + 100 + index * 8;
      const finalControl1X = currentX + (endX - currentX) * 0.3;
      const finalControl1Y = currentY + (endY - currentY) * 0.3;
      const finalControl2X = currentX + (endX - currentX) * 0.7;
      const finalControl2Y = currentY + (endY - currentY) * 0.7;
      
      points.push(`C${finalControl1X} ${finalControl1Y} ${finalControl2X} ${finalControl2Y} ${endX} ${endY}`);
      
      return points.join(' ');
    };

    const paths = generateFlowingPaths();
    
    return (
      <div
        className={cn(
          "absolute inset-0 flex h-full w-full items-center justify-center [mask-repeat:no-repeat] [mask-size:40px]",
          className,
        )}
      >
        <svg
          className="pointer-events-none absolute z-0 h-full w-full"
          width="100%"
          height="100%"
          viewBox={`0 0 ${screenWidth} ${screenHeight}`}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {paths.map((path, index) => (
            <motion.path
              key={`path-${index}`}
              d={path}
              stroke={`url(#linearGradient-${index})`}
              strokeOpacity="0.4"
              strokeWidth="1.5"
              fill="none"
            />
          ))}
          
          <defs>
            {paths.map((path, index) => (
              <motion.linearGradient
                id={`linearGradient-${index}`}
                key={`gradient-${index}`}
                initial={{
                  x1: "0%",
                  x2: "100%",
                  y1: "0%",
                  y2: "0%",
                }}
                animate={{
                  x1: ["0%", "100%", "0%"],
                  x2: ["100%", "0%", "100%"],
                  y1: ["0%", "50%", "0%"],
                  y2: ["0%", "50%", "0%"],
                }}
                transition={{
                  duration: Math.random() * 6 + 15,
                  ease: "easeInOut",
                  repeat: Infinity,
                  delay: Math.random() * 8,
                }}
              >
                <stop stopColor="#18CCFC" stopOpacity="0"></stop>
                <stop stopColor="#18CCFC"></stop>
                <stop offset="40%" stopColor="#6344F5"></stop>
                <stop offset="70%" stopColor="#AE48FF"></stop>
                <stop offset="100%" stopColor="#AE48FF" stopOpacity="0"></stop>
              </motion.linearGradient>
            ))}

            <radialGradient
              id="paint0_radial_242_278"
              cx="0"
              cy="0"
              r="1"
              gradientUnits="userSpaceOnUse"
              gradientTransform="translate(600 400) rotate(90) scale(400 800)"
            >
              <stop offset="0.0666667" stopColor="#d4d4d4"></stop>
              <stop offset="0.243243" stopColor="#d4d4d4"></stop>
              <stop offset="0.43594" stopColor="white" stopOpacity="0"></stop>
            </radialGradient>
          </defs>
        </svg>
      </div>
    );
  },
);

BackgroundBeams.displayName = "BackgroundBeams"; 