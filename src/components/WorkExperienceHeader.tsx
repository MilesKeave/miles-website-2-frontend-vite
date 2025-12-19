interface WorkExperienceHeaderProps {
  isMobile?: boolean;
}

export const WorkExperienceHeader = ({ isMobile = false }: WorkExperienceHeaderProps): React.JSX.Element => {
  const titleClass = isMobile 
    ? "text-2xl font-bold text-slate-900 dark:text-slate-100 text-center"
    : "text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 dark:text-slate-100 text-left";
    
  const containerClass = isMobile 
    ? "mb-4" 
    : "mb-4 sm:mb-6";

  return (
    <div className={containerClass}>
      <h1 className={titleClass}>
        Work Experience
      </h1>
    </div>
  );
};
