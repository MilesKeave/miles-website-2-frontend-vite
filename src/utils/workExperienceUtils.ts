import type { WorkExperience } from "../services/workExperienceApi";

export const sortWorkExperiencesByDate = (workExperiences: WorkExperience[]): WorkExperience[] => {
  return [...workExperiences].sort((a, b) => {
    // Parse start dates from work experience date strings
    const getStartDateValue = (dateStr: string) => {
      // Handle MM/DD/YY format: "08/17/23 - present"
      // Split by " - " to get start and end dates
      const parts = dateStr.split(' - ');
      const startDate = parts[0]?.trim();
      
      if (!startDate) return 0;
      
      // Parse MM/DD/YY format
      const dateMatch = startDate.match(/^(\d{1,2})\/(\d{1,2})\/(\d{2})$/);
      if (dateMatch) {
        const month = parseInt(dateMatch[1]);
        const day = parseInt(dateMatch[2]);
        let year = parseInt(dateMatch[3]);
        
        // Convert 2-digit year to 4-digit year
        // Assume years 00-30 are 2000-2030, years 31-99 are 1931-1999
        if (year <= 30) {
          year += 2000;
        } else {
          year += 1900;
        }
        
        // Return year * 365 + month * 30 + day for precise sorting
        // This gives us a sortable number where higher values are more recent
        return year * 365 + month * 30 + day;
      }
      
      // Fallback: try to extract year from other formats
      const yearMatch = startDate.match(/\b(20\d{2})\b/);
      if (yearMatch) {
        return parseInt(yearMatch[1]) * 365;
      }
      
      return 0;
    };
    
    const dateA = getStartDateValue(a.date);
    const dateB = getStartDateValue(b.date);
    
    // Sort in descending order (most recent start date first)
    return dateB - dateA;
  });
};
