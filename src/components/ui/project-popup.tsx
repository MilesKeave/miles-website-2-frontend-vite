"use client";

import React, { useEffect, useState } from "react";
import { IconX, IconBrandGithub, IconBrandYoutube, IconExternalLink, IconCode } from "@tabler/icons-react";

interface ProjectPopupProps {
  project: {
    id: string;
    projectName: string;
    projectImageUrl: string;
    projectImageUrl2?: string;
    liveDemoLink: string;
    paragraph: string;
    githubLink: string;
    githubLink2?: string;
    youtubeLink: string;
    websiteLink: string;
    createdAt: string;
    updatedAt: string;
  };
  onClose: () => void;
}

export function ProjectPopup({ project, onClose }: ProjectPopupProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [showFullImage, setShowFullImage] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 10);
    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  const handleImageClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowFullImage(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className={`absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${
          isVisible ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={handleClose}
      />
      
      <div 
        className={`relative bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-[900px] h-auto max-h-[90vh] md:h-[600px] overflow-hidden transition-all duration-300 ease-out ${
          isVisible ? 'scale-100 opacity-100' : 'scale-50 opacity-0'
        }`}
      >
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/80 hover:bg-white dark:bg-slate-800 dark:hover:bg-slate-700 transition-colors"
        >
          <IconX className="h-5 w-5 text-slate-300" />
        </button>

        <div className="flex flex-col md:flex-row h-full">
          <div className="w-full md:w-1/2 h-64 md:h-full">
            <div className="relative h-full">
              {project.projectImageUrl2 || project.projectImageUrl ? (
                <img
                  src={project.projectImageUrl2 || project.projectImageUrl}
                  alt={project.projectName}
                  className="w-full h-full object-cover cursor-pointer hover:opacity-90 transition-opacity"
                  onClick={handleImageClick}
                  decoding="async"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              ) : (
                <div className="flex h-full items-center justify-center bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-800">
                  <div className="text-6xl text-slate-300">
                    <IconCode className="h-16 w-16" />
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="w-full md:w-1/2 p-4 md:p-8 flex flex-col justify-between overflow-y-auto">
            <div>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-3 md:mb-4">
                {project.projectName}
              </h2>

              <p className="text-slate-300 text-base md:text-lg leading-relaxed mb-4 md:mb-6">
                {project.paragraph}
              </p>

              <div className="flex flex-col sm:flex-row flex-wrap gap-2 md:gap-3 mb-4 md:mb-6">
                {project.githubLink && project.githubLink.trim() !== "" && (
                  <a
                    href={project.githubLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors text-sm md:text-base"
                  >
                    <IconBrandGithub className="h-4 w-4" />
                    GitHub
                  </a>
                )}
                {project.githubLink2 && project.githubLink2.trim() !== "" && (
                  <a
                    href={project.githubLink2}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors text-sm md:text-base"
                  >
                    <IconBrandGithub className="h-4 w-4" />
                    GitHub 2
                  </a>
                )}
                {project.youtubeLink && project.youtubeLink.trim() !== "" && (
                  <a
                    href={project.youtubeLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm md:text-base"
                  >
                    <IconBrandYoutube className="h-4 w-4" />
                    YouTube
                  </a>
                )}
                {project.websiteLink && project.websiteLink.trim() !== "" && (
                  <a
                    href={project.websiteLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm md:text-base"
                  >
                    <IconExternalLink className="h-4 w-4" />
                    Website
                  </a>
                )}
                {project.liveDemoLink && project.liveDemoLink.trim() !== "" && (
                  <a
                    href={project.liveDemoLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm md:text-base"
                  >
                    <IconExternalLink className="h-4 w-4" />
                    Live Demo
                  </a>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>

      {showFullImage && (project.projectImageUrl2 || project.projectImageUrl) && (
        <div 
          className="fixed inset-0 bg-black/90 z-[200] flex items-center justify-center p-4"
          onClick={() => setShowFullImage(false)}
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowFullImage(false);
            }}
            className="absolute top-4 right-4 text-white hover:text-gray-300 text-4xl font-bold z-[201] bg-black/50 rounded-full w-12 h-12 flex items-center justify-center transition-colors"
            aria-label="Close image"
          >
            ×
          </button>

          <img
            src={project.projectImageUrl2 || project.projectImageUrl}
            alt={project.projectName}
            className="max-w-full max-h-full object-contain"
            onClick={(e) => e.stopPropagation()}
            decoding="async"
          />
        </div>
      )}
    </div>
  );
}
