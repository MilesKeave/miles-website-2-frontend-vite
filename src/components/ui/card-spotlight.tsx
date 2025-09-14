"use client";

import { useMotionValue, motion, useMotionTemplate } from "motion/react";
import React, { MouseEvent as ReactMouseEvent, useState } from "react";
import { CanvasRevealEffect } from "@/components/ui/canvas-reveal-effect";
import { cn } from "@/lib/utils";

export const CardSpotlight = ({
  children,
  radius = 350,
  color = "#262626",
  className,
  ...props
}: {
  radius?: number;
  color?: string;
  children: React.ReactNode;
} & React.HTMLAttributes<HTMLDivElement>) => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const particleOpacity = useMotionValue(1);
  
  function handleMouseMove({
    currentTarget,
    clientX,
    clientY,
  }: ReactMouseEvent<HTMLDivElement>) {
    let { left, top, height } = currentTarget.getBoundingClientRect();

    const x = clientX - left;
    const y = clientY - top;
    
    // Calculate opacity based on vertical position (increase opacity as we go down)
    const verticalPosition = y / height;
    const opacityMultiplier = 1 + (verticalPosition * 0.8); // Increase opacity by 80% at bottom
    
    mouseX.set(x);
    mouseY.set(y);
    particleOpacity.set(opacityMultiplier);
  }

  const [isHovering, setIsHovering] = useState(false);
  const handleMouseEnter = () => setIsHovering(true);
  const handleMouseLeave = () => setIsHovering(false);
  return (
    <div
      className={cn(
        "group/spotlight p-10 rounded-md relative border border-neutral-800 bg-black dark:border-neutral-800",
        className
      )}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      {...props}
    >
      <motion.div
        className="pointer-events-none absolute z-0 inset-0 rounded-md opacity-0 transition duration-300 group-hover/spotlight:opacity-100"
        style={{
          backgroundColor: color,
          maskImage: useMotionTemplate`
            radial-gradient(
              ${radius}px circle at ${mouseX}px ${mouseY}px,
              white,
              transparent 80%
            )
          `,
        }}
      >
        {isHovering && (
          <motion.div
            style={{ opacity: particleOpacity }}
            className="absolute inset-0 pointer-events-none"
          >
            <CanvasRevealEffect
              animationSpeed={5}
              containerClassName="bg-transparent absolute inset-0 pointer-events-none"
              colors={[
                [59, 130, 246],
                [139, 92, 246],
              ]}
              dotSize={3}
              showGradient={false}
            />
          </motion.div>
        )}
      </motion.div>
      {children}
    </div>
  );
};
