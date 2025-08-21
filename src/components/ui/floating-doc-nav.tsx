"use client";
import { cn } from "../../lib/utils";
import { Home, FolderOpen, Github, Linkedin } from "lucide-react";
import {
  AnimatePresence,
  MotionValue,
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "motion/react";
import { useRef, useState } from "react";

interface FloatingDocNavProps {
  className?: string;
  onNavigate: (page: string) => void;
  currentPage: 'home' | 'portfolio';
}

export const FloatingDocNav = ({ className, onNavigate, currentPage }: FloatingDocNavProps) => {
  const items = [
    {
      title: "Home",
      icon: <Home className="h-5 w-5" />,
      action: () => onNavigate('home'),
      isLink: false,
      isActive: currentPage === 'home'
    },
    {
      title: "Portfolio",
      icon: <FolderOpen className="h-5 w-5" />,
      action: () => onNavigate('portfolio'),
      isLink: false,
      isActive: currentPage === 'portfolio'
    },
    {
      title: "GitHub",
      icon: <Github className="h-5 w-5" />,
      href: "https://github.com",
      isLink: true,
      isActive: false
    },
    {
      title: "LinkedIn",
      icon: <Linkedin className="h-5 w-5" />,
      href: "https://linkedin.com",
      isLink: true,
      isActive: false
    }
  ];

  return (
    <div className={cn("fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50", className)}>
      <FloatingDockDesktop items={items} />
    </div>
  );
};

const FloatingDockDesktop = ({
  items,
  className,
}: {
  items: { title: string; icon: React.ReactNode; action?: () => void; href?: string; isLink: boolean; isActive: boolean }[];
  className?: string;
}) => {
  let mouseX = useMotionValue(Infinity);
  return (
    <motion.div
      onMouseMove={(e) => mouseX.set(e.pageX)}
      onMouseLeave={() => mouseX.set(Infinity)}
      className={cn(
        "mx-auto h-16 items-end gap-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 px-4 pb-3 flex",
        className,
      )}
    >
      {items.map((item) => (
        <IconContainer mouseX={mouseX} key={item.title} {...item} />
      ))}
    </motion.div>
  );
};

function IconContainer({
  mouseX,
  title,
  icon,
  action,
  href,
  isLink,
  isActive,
}: {
  mouseX: MotionValue;
  title: string;
  icon: React.ReactNode;
  action?: () => void;
  href?: string;
  isLink: boolean;
  isActive: boolean;
}) {
  let ref = useRef<HTMLDivElement>(null);

  let distance = useTransform(mouseX, (val) => {
    let bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };

    return val - bounds.x - bounds.width / 2;
  });

  let widthTransform = useTransform(distance, [-150, 0, 150], [40, 80, 40]);
  let heightTransform = useTransform(distance, [-150, 0, 150], [40, 80, 40]);

  let widthTransformIcon = useTransform(distance, [-150, 0, 150], [20, 40, 20]);
  let heightTransformIcon = useTransform(
    distance,
    [-150, 0, 150],
    [20, 40, 20],
  );

  let width = useSpring(widthTransform, {
    mass: 0.1,
    stiffness: 150,
    damping: 12,
  });
  let height = useSpring(heightTransform, {
    mass: 0.1,
    stiffness: 150,
    damping: 12,
  });

  let widthIcon = useSpring(widthTransformIcon, {
    mass: 0.1,
    stiffness: 150,
    damping: 12,
  });
  let heightIcon = useSpring(heightTransformIcon, {
    mass: 0.1,
    stiffness: 150,
    damping: 12,
  });

  const [hovered, setHovered] = useState(false);

  const handleClick = () => {
    if (isLink && href) {
      window.open(href, '_blank', 'noopener,noreferrer');
    } else if (action) {
      action();
    }
  };

  return (
    <div onClick={handleClick}>
      <motion.div
        ref={ref}
        style={{ width, height }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className={cn(
          "relative flex aspect-square items-center justify-center rounded-full cursor-pointer",
          isActive 
            ? "bg-white/30" // Lighter background for active page
            : "bg-white/10 hover:bg-white/20"
        )}
      >
        <AnimatePresence>
          {hovered && (
            <motion.div
              initial={{ opacity: 0, y: 10, x: "-50%" }}
              animate={{ opacity: 1, y: 0, x: "-50%" }}
              exit={{ opacity: 0, y: 2, x: "-50%" }}
              className="absolute -top-8 left-1/2 w-fit rounded-md border border-white/20 bg-black/80 px-2 py-0.5 text-xs whitespace-pre text-white backdrop-blur-md"
            >
              {title}
            </motion.div>
          )}
        </AnimatePresence>
        <motion.div
          style={{ width: widthIcon, height: heightIcon }}
          className="flex items-center justify-center text-white"
        >
          {icon}
        </motion.div>
      </motion.div>
    </div>
  );
} 