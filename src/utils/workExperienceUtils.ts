import type { WorkExperience } from "../services/workExperienceApi";

export const sortWorkExperiencesByDate = (workExperiences: WorkExperience[]): WorkExperience[] => {
  return [...workExperiences].sort((a, b) => {
    const getStartDateValue = (dateStr: string) => {
      const parts = dateStr.split(' - ');
      const startDate = parts[0]?.trim();

      if (!startDate) return 0;

      const dateMatch = startDate.match(/^(\d{1,2})\/(\d{1,2})\/(\d{2})$/);
      if (dateMatch) {
        const month = parseInt(dateMatch[1]);
        const day = parseInt(dateMatch[2]);
        let year = parseInt(dateMatch[3]);

        if (year <= 30) {
          year += 2000;
        } else {
          year += 1900;
        }

        return year * 365 + month * 30 + day;
      }

      const yearMatch = startDate.match(/\b(20\d{2})\b/);
      if (yearMatch) {
        return parseInt(yearMatch[1]) * 365;
      }

      return 0;
    };

    const dateA = getStartDateValue(a.date);
    const dateB = getStartDateValue(b.date);

    return dateB - dateA;
  });
};
