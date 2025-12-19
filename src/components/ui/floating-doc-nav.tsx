"use client";
import { cn } from "../../lib/utils";
import { Home, FolderOpen, Briefcase, Camera } from "lucide-react";
import {
  AnimatePresence,
  MotionValue,
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "motion/react";
import { useRef, useState, useEffect } from "react";
import type { PageId } from "../../types/pages";
import { PAGE_CONFIG } from "../../config/pages";

interface FloatingDocNavProps {
  className?: string;
  onNavigate: (page: string) => void;
  currentPage: PageId;
}

export const FloatingDocNav = ({ className, onNavigate, currentPage }: FloatingDocNavProps) => {
  // Dynamic icon mapping
  const getIconForPage = (pageId: PageId) => {
    switch (pageId) {
      case 'home':
        return <Home className="h-5 w-5" />;
      case 'portfolio':
        return <FolderOpen className="h-5 w-5" />;
      case 'work':
        return <Briefcase className="h-5 w-5" />;
      case 'photography':
        return <Camera className="h-5 w-5" />;
      default:
        return <Home className="h-5 w-5" />;
    }
  };

  // Generate navigation items dynamically from page configuration
  const navigationItems = PAGE_CONFIG.map(pageConfig => ({
    title: pageConfig.title,
    icon: getIconForPage(pageConfig.id as PageId),
    action: () => onNavigate(pageConfig.id as PageId),
    isLink: false,
    isActive: currentPage === pageConfig.id
  }));

  // Only use navigation items (removed external links)
  const items = navigationItems;

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
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  
  useEffect(() => {
    // Detect if device is mobile/iPad (not just touch-capable)
    // Many laptops have touchscreens, so we need to check screen size too
    const checkTouchDevice = () => {
      // Check if it's a small screen (mobile/iPad) OR if it's a touch-only device
      const isSmallScreen = window.innerWidth < 1024; // iPad and below
      const hasCoarsePointer = window.matchMedia('(pointer: coarse)').matches;
      const hasFinePointer = window.matchMedia('(pointer: fine)').matches;
      
      // If it's a small screen with touch, or a touch-only device (no fine pointer), it's mobile/iPad
      return (isSmallScreen && (hasCoarsePointer || 'ontouchstart' in window)) || 
             (hasCoarsePointer && !hasFinePointer);
    };
    
    setIsTouchDevice(checkTouchDevice());
    
    // Re-check on resize
    const handleResize = () => {
      setIsTouchDevice(checkTouchDevice());
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  let mouseX = useMotionValue(Infinity);
  
  return (
    <motion.div
      onMouseMove={isTouchDevice ? undefined : (e) => mouseX.set(e.pageX)}
      onMouseLeave={isTouchDevice ? undefined : () => mouseX.set(Infinity)}
      className={cn(
        "mx-auto h-16 items-end gap-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 px-4 pb-3 flex",
        className,
      )}
    >
      {items.map((item) => (
        <IconContainer 
          mouseX={mouseX} 
          key={item.title} 
          title={item.title}
          icon={item.icon}
          action={item.action}
          href={item.href}
          isLink={item.isLink}
          isActive={item.isActive}
          isTouchDevice={isTouchDevice}
        />
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
  isTouchDevice,
}: {
  mouseX: MotionValue;
  title: string;
  icon: React.ReactNode;
  action?: () => void;
  href?: string;
  isLink: boolean;
  isActive: boolean;
  isTouchDevice: boolean;
}) {
  let ref = useRef<HTMLDivElement>(null);

  // Only calculate transforms on desktop (non-touch devices)
  let distance = useTransform(mouseX, (val) => {
    if (isTouchDevice) return Infinity;
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

  // Fixed sizes for touch devices, dynamic for desktop
  const containerStyle = isTouchDevice 
    ? { width: 40, height: 40 }
    : { width, height };
  
  const iconStyle = isTouchDevice
    ? { width: 20, height: 20 }
    : { width: widthIcon, height: heightIcon };

  return (
    <div onClick={handleClick}>
      <motion.div
        ref={ref}
        style={containerStyle}
        onMouseEnter={isTouchDevice ? undefined : () => setHovered(true)}
        onMouseLeave={isTouchDevice ? undefined : () => setHovered(false)}
        className={cn(
          "relative flex aspect-square items-center justify-center rounded-full cursor-pointer",
          isActive 
            ? "bg-white/30" // Lighter background for active page
            : "bg-white/10",
          // Only apply hover background on desktop
          !isTouchDevice && !isActive && "hover:bg-white/20"
        )}
      >
        <AnimatePresence>
          {!isTouchDevice && hovered && (
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
          style={iconStyle}
          className="flex items-center justify-center text-white"
        >
          {icon}
        </motion.div>
      </motion.div>
    </div>
  );
} 