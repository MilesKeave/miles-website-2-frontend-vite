import React from 'react';
import { HomePage } from '../components/HomePage';
import { ProjectsPage } from '../components/ProjectsPage';
import { WorkExperiencePage } from '../components/WorkExperiencePage';

export interface PageConfig {
  id: string;
  title: string;
  component: React.ComponentType;
  order: number;
}

export const PAGE_CONFIG: PageConfig[] = [
  {
    id: 'home',
    title: 'Home',
    component: HomePage,
    order: 0
  },
  {
    id: 'portfolio',
    title: 'Portfolio',
    component: ProjectsPage,
    order: 1
  },
  {
    id: 'work',
    title: 'Work Experience',
    component: WorkExperiencePage,
    order: 2
  }
];

// Helper functions for page navigation
export const getPageById = (id: string): PageConfig | undefined => {
  return PAGE_CONFIG.find(page => page.id === id);
};

export const getPageByOrder = (order: number): PageConfig | undefined => {
  return PAGE_CONFIG.find(page => page.order === order);
};

export const getNextPage = (currentPageId: string): PageConfig | null => {
  const currentPage = getPageById(currentPageId);
  if (!currentPage) return null;
  
  const nextOrder = currentPage.order + 1;
  return getPageByOrder(nextOrder) || null;
};

export const getPreviousPage = (currentPageId: string): PageConfig | null => {
  const currentPage = getPageById(currentPageId);
  if (!currentPage) return null;
  
  const prevOrder = currentPage.order - 1;
  return getPageByOrder(prevOrder) || null;
};

export const getPageOrder = (pageId: string): number => {
  const page = getPageById(pageId);
  return page ? page.order : -1;
};

export const getTotalPages = (): number => {
  return PAGE_CONFIG.length;
};
