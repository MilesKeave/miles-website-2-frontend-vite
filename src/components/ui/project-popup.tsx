"use client";

import React, { useEffect, useState } from "react";
import { IconX, IconBrandGithub, IconBrandYoutube, IconExternalLink, IconCode } from "@tabler/icons-react";

interface ProjectPopupProps {
  project: {
    id: string;
    projectName: string;
    projectImageUrl: string;
    onClickValue: string;
    paragraph: string;
    githubLink: string;
    youtubeLink: string;
    createdAt: string;
    updatedAt: string;
  };
  onClose: () => void;
}

export function ProjectPopup({ project, onClose }: ProjectPopupProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger grow-in animation on mount
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 10);
    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    // Wait for animation to complete before calling onClose
    setTimeout(() => {
      onClose();
    }, 300);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className={`absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${
          isVisible ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={handleClose}
      />
      
      {/* Modal */}
      <div 
        className={`relative bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-[900px] h-[600px] overflow-hidden transition-all duration-300 ease-out ${
          isVisible ? 'scale-100 opacity-100' : 'scale-50 opacity-0'
        }`}
      >
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/80 hover:bg-white dark:bg-slate-800 dark:hover:bg-slate-700 transition-colors"
        >
          <IconX className="h-5 w-5 text-slate-600 dark:text-slate-300" />
        </button>

        {/* Content */}
        <div className="flex h-full">
          {/* Image section */}
          <div className="w-1/2">
            <div className="relative h-full">
              {project.projectImageUrl ? (
                <img
                  src={project.projectImageUrl}
                  alt={project.projectName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-800">
                  <div className="text-6xl text-slate-500 dark:text-slate-400">
                    <IconCode className="h-16 w-16" />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Details section */}
          <div className="w-1/2 p-8 flex flex-col justify-between">
            <div>
              {/* Title */}
              <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 dark:text-slate-100 mb-4">
                {project.projectName}
              </h2>

              {/* Description */}
              <p className="text-slate-600 dark:text-slate-300 text-lg leading-relaxed mb-6">
                {project.paragraph}
              </p>

              {/* Links */}
              <div className="flex flex-wrap gap-3 mb-6">
                {project.githubLink && (
                  <a
                    href={project.githubLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors"
                  >
                    <IconBrandGithub className="h-4 w-4" />
                    GitHub
                  </a>
                )}
                {project.youtubeLink && (
                  <a
                    href={project.youtubeLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    <IconBrandYoutube className="h-4 w-4" />
                    YouTube
                  </a>
                )}
                {project.onClickValue && (
                  <a
                    href={project.onClickValue}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <IconExternalLink className="h-4 w-4" />
                    Live Demo
                  </a>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
              <div className="flex justify-between items-center text-sm text-slate-500 dark:text-slate-400">
                <span>Created: {new Date(project.createdAt).toLocaleDateString()}</span>
                <span>Updated: {new Date(project.updatedAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
