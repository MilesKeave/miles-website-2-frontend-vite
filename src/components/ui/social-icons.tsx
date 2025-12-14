"use client";
import { Github, Linkedin } from "lucide-react";
import { cn } from "../../lib/utils";
import { useEffect, useState } from "react";

export const SocialIcons = ({ className }: { className?: string }) => {
  const [isPhotoPreviewOpen, setIsPhotoPreviewOpen] = useState(false);

  useEffect(() => {
    // Check if photo preview modal is open by looking for elements with high z-index
    const checkPreviewModal = () => {
      // Look for any fixed overlay with high z-index (photo preview modal uses z-[100])
      const allElements = document.querySelectorAll('*');
      let hasModal = false;
      
      for (const el of allElements) {
        const htmlEl = el as HTMLElement;
        const zIndex = window.getComputedStyle(htmlEl).zIndex;
        const position = window.getComputedStyle(htmlEl).position;
        
        // Check if element is fixed/absolute with z-index >= 100 and covers the screen
        if ((position === 'fixed' || position === 'absolute') && 
            zIndex && parseInt(zIndex) >= 100 &&
            htmlEl.classList.contains('inset-0')) {
          hasModal = true;
          break;
        }
      }
      
      setIsPhotoPreviewOpen(hasModal);
    };

    // Check initially
    checkPreviewModal();

    // Use MutationObserver to watch for modal appearance/disappearance
    const observer = new MutationObserver(checkPreviewModal);
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['class', 'style']
    });

    // Also check on a small interval as backup
    const interval = setInterval(checkPreviewModal, 200);

    return () => {
      observer.disconnect();
      clearInterval(interval);
    };
  }, []);

  if (isPhotoPreviewOpen) {
    return null;
  }

  return (
    <div className={cn("fixed top-6 right-6 z-50 flex gap-3", className)}>
      <a
        href="https://github.com/MilesKeave?tab=overview&from=2025-12-01&to=2025-12-14"
        target="_blank"
        rel="noopener noreferrer"
        className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-colors duration-200"
        aria-label="GitHub"
      >
        <Github className="h-5 w-5" />
      </a>
      <a
        href="https://linkedin.com"
        target="_blank"
        rel="noopener noreferrer"
        className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-colors duration-200"
        aria-label="LinkedIn"
      >
        <Linkedin className="h-5 w-5" />
      </a>
    </div>
  );
};

