"use client";
import React, { useRef, useEffect, useState } from "react";
import { motion } from "motion/react";
import { cn } from "../../lib/utils";

// Font configuration - easy to change and experiment with
const FONT_CONFIG = {
  // Simple, clean fonts with minimal overlapping paths
  primary: 'Arial, Helvetica, sans-serif',
  
  // Alternative options - uncomment to try different fonts
  // serif: 'Georgia, "Times New Roman", serif',
  // display: '"Playfair Display", serif',
  // modern: '"SF Pro Display", -apple-system, BlinkMacSystemFont, sans-serif',
  // geometric: '"Montserrat", sans-serif',
  // tech: '"JetBrains Mono", "Fira Code", monospace',
  // simple: 'Arial, Helvetica, sans-serif',
  // clean: 'Verdana, Geneva, sans-serif',
  
  // Font weight options
  weight: '700', // 400, 500, 600, 700, 800, 900
  
  // Letter spacing options
  letterSpacing: '-0.02em', // '-0.05em', '0em', '0.02em', '0.05em'
};

export const TextHoverEffect = ({
  text,
  duration,
  className,
  fontFamily = FONT_CONFIG.primary,
  fontWeight = FONT_CONFIG.weight,
  letterSpacing = FONT_CONFIG.letterSpacing,
}: {
  text: string;
  duration?: number;
  className?: string;
  fontFamily?: string;
  fontWeight?: string;
  letterSpacing?: string;
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [cursor, setCursor] = useState({ x: 0, y: 0 });
  const [hovered, setHovered] = useState(false);
  const [maskPosition, setMaskPosition] = useState({ cx: "50%", cy: "50%" });

  useEffect(() => {
    if (svgRef.current && cursor.x !== null && cursor.y !== null) {
      const svgRect = svgRef.current.getBoundingClientRect();
      const cxPercentage = ((cursor.x - svgRect.left) / svgRect.width) * 100;
      const cyPercentage = ((cursor.y - svgRect.top) / svgRect.height) * 100;
      setMaskPosition({
        cx: `${cxPercentage}%`,
        cy: `${cyPercentage}%`,
      });
    }
  }, [cursor]);

  const textStyle = {
    fontFamily,
    fontWeight,
    letterSpacing,
  };

  return (
    <svg
      ref={svgRef}
      width="100%"
      height="100%"
      viewBox="0 0 1200 300"
      xmlns=" canhttp://www.w3.org/2000/svg"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onMouseMove={(e) => setCursor({ x: e.clientX, y: e.clientY })}
      className={cn("select-none", className)}
    >
      <defs>
        <linearGradient
          id="textGradient"
          gradientUnits="userSpaceOnUse"
          cx="50%"
          cy="50%"
          r="25%"
        >
          <stop offset="0%" stopColor="#eab308" />
          <stop offset="25%" stopColor="#ef4444" />
          <stop offset="50%" stopColor="#3b82f6" />
          <stop offset="75%" stopColor="#06b6d4" />
          <stop offset="100%" stopColor="#8b5cf6" />
        </linearGradient>

        <motion.radialGradient
          id="revealMask"
          gradientUnits="userSpaceOnUse"
          r="20%"
          initial={{ cx: "50%", cy: "50%" }}
          animate={maskPosition}
          transition={{ duration: duration ?? 0, ease: "easeOut" }}
        >
          <stop offset="0%" stopColor="white" />
          <stop offset="100%" stopColor="black" />
        </motion.radialGradient>
        <mask id="textMask">
          <rect
            x="0"
            y="0"
            width="100%"
            height="100%"
            fill="url(#revealMask)"
          />
        </mask>
      </defs>
      
      {/* Single clean white outlined text */}
      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dominantBaseline="middle"
        strokeWidth="3"
        className="fill-transparent stroke-white font-bold text-7xl md:text-9xl lg:text-[10rem]"
        style={textStyle}
      >
        {text}
      </text>
      
      {/* Gradient outlined text - only visible through the mask (spotlight effect) */}
      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dominantBaseline="middle"
        stroke="url(#textGradient)"
        strokeWidth="3"
        mask="url(#textMask)"
        className="fill-transparent font-bold text-7xl md:text-9xl lg:text-[10rem]"
        style={{ 
          ...textStyle,
          opacity: hovered ? 1 : 0,
        }}
      >
        {text}
      </text>
    </svg>
  );
}; 