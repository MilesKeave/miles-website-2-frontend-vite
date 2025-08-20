"use client";
import { motion } from "framer-motion";
import { cn } from "../../lib/utils";
import { Home, FolderOpen, Github, Linkedin } from "lucide-react";

interface FloatingDocNavProps {
  className?: string;
  onNavigate: (page: string) => void;
}

export const FloatingDocNav = ({ className, onNavigate }: FloatingDocNavProps) => {
  return (
    <div className={cn("fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50", className)}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-3 shadow-2xl"
      >
        <div className="flex space-x-4">
          {/* Home */}
          <motion.div
            className="relative group"
            whileHover={{ scale: 1.10 }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.button
              onClick={() => onNavigate('home')}
              className="p-3 text-white hover:bg-white/10 rounded-lg transition-colors"
            >
              <Home size={24} />
            </motion.button>
            {/* Hover label */}
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-black/80 text-white text-sm rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
              Home
            </div>
          </motion.div>
          
          {/* Portfolio */}
          <motion.div
            className="relative group"
            whileHover={{ scale: 1.10 }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.button
              onClick={() => onNavigate('portfolio')}
              className="p-3 text-white hover:bg-white/10 rounded-lg transition-colors"
            >
              <FolderOpen size={24} />
            </motion.button>
            {/* Hover label */}
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-black/80 text-white text-sm rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
              Portfolio
            </div>
          </motion.div>
          
          {/* GitHub */}
          <motion.div
            className="relative group"
            whileHover={{ scale: 1.10 }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.a
              href="https://github.com" // Placeholder URL
              target="_blank"
              rel="noopener noreferrer"
              className="block p-3 text-white hover:bg-white/10 rounded-lg transition-colors"
            >
              <Github size={24} />
            </motion.a>
            {/* Hover label */}
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-black/80 text-white text-sm rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
              GitHub
            </div>
          </motion.div>
          
          {/* LinkedIn */}
          <motion.div
            className="relative group"
            whileHover={{ scale: 1.10 }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.a
              href="https://linkedin.com" // Placeholder URL
              target="_blank"
              rel="noopener noreferrer"
              className="block p-3 text-white hover:bg-white/10 rounded-lg transition-colors"
            >
              <Linkedin size={24} />
            </motion.a>
            {/* Hover label */}
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-black/80 text-white text-sm rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
              LinkedIn
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}; 