"use client";
import { cn } from "../../lib/utils";
import { motion } from "framer-motion";

export const BackgroundGradient = ({
  children,
  className,
  containerClassName,
  animate = true,
}: {
  children?: React.ReactNode;
  className?: string;
  containerClassName?: string;
  animate?: boolean;
}) => {
  const mouseX = 0;
  const mouseY = 0;

  return (
    <div
      className={cn(
        "relative h-full w-full bg-slate-900 dark:bg-slate-900 flex items-center justify-center",
        containerClassName
      )}
    >
      <div className="absolute inset-0 w-full h-full bg-slate-900 dark:bg-slate-900" />
      <motion.div
        className="pointer-events-none absolute inset-0 z-30 transition duration-300 ease-linear"
        animate={
          animate
            ? {
                background:
                  "radial-gradient(600px circle at var(--mouse-x) var(--mouse-y), rgba(29, 78, 216, 0.15), transparent 40%)",
              }
            : {}
        }
        style={{
          background:
            "radial-gradient(600px circle at var(--mouse-x) var(--mouse-y), rgba(29, 78, 216, 0.15), transparent 40%)",
        }}
      />
      <div className={cn("relative z-10", className)}>{children}</div>
    </div>
  );
}; 