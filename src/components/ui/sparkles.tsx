"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { cn } from "../../lib/utils";

export const Sparkles = ({
  children,
  className,
  background,
  minSize,
  maxSize,
  speed,
  particleDensity,
  particleColor,
}: {
  children: React.ReactNode;
  className?: string;
  background?: string;
  minSize?: number;
  maxSize?: number;
  speed?: number;
  particleDensity?: number;
  particleColor?: string;
}) => {
  const [particles, setParticles] = useState<Array<{
    id: number;
    x: number;
    y: number;
    size: number;
    duration: number;
    delay: number;
  }>>([]);

  useEffect(() => {
    const generateParticles = () => {
      const newParticles = [];
      const density = particleDensity || 50;
      const min = minSize || 0.5;
      const max = maxSize || 1.5;

      for (let i = 0; i < density; i++) {
        newParticles.push({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * (max - min) + min,
          duration: Math.random() * 2 + 1,
          delay: Math.random() * 2,
        });
      }
      setParticles(newParticles);
    };

    generateParticles();
  }, [minSize, maxSize, particleDensity]);

  return (
    <div className={cn("relative inline-block", className)}>
      <div
        className="absolute inset-0"
        style={{
          background: background || "transparent",
        }}
      >
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute rounded-full"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              background: particleColor || "#ffffff",
            }}
            animate={{
              opacity: [0, 1, 0],
              scale: [0, 1, 0],
            }}
            transition={{
              duration: particle.duration,
              delay: particle.delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>
      <div className="relative z-10">{children}</div>
    </div>
  );
}; 