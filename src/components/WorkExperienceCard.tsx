import { IconBriefcase, IconCalendar, IconMapPin, IconBuilding } from "@tabler/icons-react";
import { GlowingEffect } from "./ui/glowing-effect";
import type { WorkExperience } from "../services/workExperienceApi";

interface WorkExperienceCardProps {
  experience: WorkExperience;
  isActive: boolean;
  isPrevious: boolean;
  isNext: boolean;
  isVisible: boolean;
  isTransitioning: boolean;
  positionClass: string;
  opacityClass: string;
  scaleClass: string;
  zIndexClass: string;
  onCardClick: () => void;
  isMobile?: boolean;
  hasTransparentBackground?: boolean;
  backgroundClass?: string;
  isClickable?: boolean;
}

export const WorkExperienceCard = ({
  experience,
  isActive,
  isPrevious,
  isNext,
  isVisible,
  isTransitioning,
  positionClass,
  opacityClass,
  scaleClass,
  zIndexClass,
  onCardClick,
  isMobile = false,
  hasTransparentBackground = false,
  backgroundClass = ''
}: WorkExperienceCardProps): React.JSX.Element => {
  const cardHeight = isMobile ? "h-[17.1rem]" : "h-[20.41rem] sm:h-[23.81rem] md:h-[27.22rem] lg:h-[30.62rem]";
  const cardPadding = isMobile ? "p-3" : "p-3 sm:p-4 lg:p-6";
  const cardGap = isMobile ? "gap-1" : "gap-1 sm:gap-1.5 lg:gap-2";
  const cardRounded = isMobile ? "rounded-lg" : "rounded-lg sm:rounded-xl";
  
  return (
    <div
      className={`w-full transition-all duration-500 ${positionClass} ${opacityClass} ${zIndexClass} ${
        isVisible ? 'block' : 'hidden'
      }`}
      onClick={onCardClick}
    >
      <div 
        className={`relative ${cardHeight} w-full max-w-full ${cardRounded} border-2 border-slate-600/40 transition-all duration-500 ease-out transform-gpu origin-center ${backgroundClass} shadow-2xl`}
        style={{
          transform: scaleClass === 'scale-90' ? 'scale(0.9)' : 'scale(1)',
        }}
      >
        <GlowingEffect
          spread={80}
          glow={true}
          disabled={false}
          proximity={100}
          inactiveZone={0.01}
          borderWidth={2}
        />
        <div className={`relative flex h-full flex-col justify-between ${cardGap} overflow-hidden ${cardRounded} ${cardPadding}`}>
          {/* Header */}
          <div className={`flex items-start justify-between ${isMobile ? 'mb-2' : 'mb-3 sm:mb-4 lg:mb-6'}`}>
            <div className={`flex items-center ${isMobile ? 'gap-2' : 'gap-2 sm:gap-3 lg:gap-4'}`}>
              <div className={`${isMobile ? 'p-1.5' : 'p-2 sm:p-2.5 lg:p-3'} bg-white/10 ${cardRounded}`}>
                <IconBriefcase className={`${isMobile ? 'h-3 w-3' : 'h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6'} text-white`} />
              </div>
              <div>
                <h3 className={`${isMobile ? 'text-sm' : 'text-lg sm:text-xl lg:text-2xl'} font-bold text-white mb-1 text-left`}>
                  {experience.jobTitle}
                </h3>
                <div className={`flex items-center ${isMobile ? 'gap-1' : 'gap-1 sm:gap-2'} text-slate-300`}>
                  <IconBuilding className={`${isMobile ? 'h-2.5 w-2.5' : 'h-3 w-3 sm:h-4 sm:w-4'}`} />
                  <span className={`font-medium ${isMobile ? 'text-xs' : 'text-sm sm:text-base'}`}>{experience.companyName}</span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className={`flex items-center gap-1 text-slate-400 ${isMobile ? 'mb-1' : 'mb-1'}`}>
                <IconCalendar className={`${isMobile ? 'h-2.5 w-2.5' : 'h-3 w-3 sm:h-4 sm:w-4'}`} />
                <span className={`${isMobile ? 'text-xs' : 'text-xs sm:text-sm'}`}>{experience.date}</span>
              </div>
              <div className="flex items-center gap-1 text-slate-400">
                <IconMapPin className={`${isMobile ? 'h-2.5 w-2.5' : 'h-3 w-3 sm:h-4 sm:w-4'}`} />
                <span className={`${isMobile ? 'text-xs' : 'text-xs sm:text-sm'}`}>{experience.location}</span>
              </div>
            </div>
          </div>

          {/* Bullet Points or Description */}
          <div className={`${isMobile ? 'mb-2' : 'mb-3 sm:mb-4 lg:mb-6'} text-left flex-1 ${isMobile ? '' : 'overflow-y-auto'}`}>
            <h4 className={`${isMobile ? 'text-xs' : 'text-xs sm:text-sm'} font-semibold text-slate-400 ${isMobile ? 'mb-1' : 'mb-2 sm:mb-3'} uppercase tracking-wide text-left`}>
              Key Responsibilities & Achievements
            </h4>
            {experience.bulletPoints && Array.isArray(experience.bulletPoints) && experience.bulletPoints.length > 0 ? (
              <ul className={`${isMobile ? 'space-y-1' : 'space-y-2 sm:space-y-3'} text-left`}>
                {experience.bulletPoints.map((bulletPoint, bulletIndex) => (
                  <li key={bulletIndex} className="text-slate-300 text-left">
                    <div className={`flex items-start ${isMobile ? 'gap-1' : 'gap-1 sm:gap-2'} text-left`}>
                      <span className={`text-blue-400 ${isMobile ? 'mt-0.5' : 'mt-1 sm:mt-1.5'} ${isMobile ? 'text-xs' : 'text-xs sm:text-sm'} flex-shrink-0`}>•</span>
                      <div className="flex-1 text-left">
                        <span className={`leading-relaxed text-left block ${isMobile ? 'text-xs' : 'text-xs sm:text-sm lg:text-base'}`}>{bulletPoint.text}</span>
                        {bulletPoint.subPoints && Array.isArray(bulletPoint.subPoints) && bulletPoint.subPoints.length > 0 && (
                          <ul className={`${isMobile ? 'mt-1 ml-2 space-y-0.5' : 'mt-1 sm:mt-2 ml-2 sm:ml-4 space-y-1'} text-left`}>
                            {bulletPoint.subPoints.map((subPoint, subIndex) => (
                              <li key={subIndex} className={`flex items-start ${isMobile ? 'gap-1' : 'gap-1 sm:gap-2'} text-slate-400 text-left`}>
                                <span className={`text-blue-300 ${isMobile ? 'mt-0.5' : 'mt-1 sm:mt-1.5'} text-xs flex-shrink-0`}>◦</span>
                                <span className={`${isMobile ? 'text-xs' : 'text-xs sm:text-sm'} leading-relaxed text-left block`}>{subPoint}</span>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            ) : experience.description ? (
              <p className={`text-slate-300 leading-relaxed text-left ${isMobile ? 'text-xs' : 'text-xs sm:text-sm lg:text-base'}`}>
                {experience.description}
              </p>
            ) : (
              <p className={`text-slate-400 ${isMobile ? 'text-xs' : 'text-xs sm:text-sm'} italic text-left`}>No information available</p>
            )}
          </div>

          {/* Technologies */}
          <div>
            <h4 className={`${isMobile ? 'text-xs' : 'text-xs sm:text-sm'} font-semibold text-slate-400 ${isMobile ? 'mb-1' : 'mb-2 sm:mb-3'} uppercase tracking-wide`}>
              Technologies Used
            </h4>
            <div className={`flex flex-wrap ${isMobile ? 'gap-1' : 'gap-1 sm:gap-2'}`}>
              {experience.technologiesUsed.map((tech, techIndex) => (
                <span
                  key={techIndex}
                  className={`${isMobile ? 'px-2 py-0.5' : 'px-2 sm:px-3 py-1'} bg-white/10 text-white ${isMobile ? 'text-xs' : 'text-xs sm:text-sm'} rounded-full border border-white/20`}
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
