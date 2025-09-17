import React from 'react';

export type PageId = 'home' | 'portfolio' | 'work';

export type TransitionMode = 'sequential' | 'direct';

export interface PageConfig {
  id: PageId;
  title: string;
  component: React.ComponentType;
  order: number;
}

export interface PageTransitionState {
  currentPage: PageId;
  isTransitioning: boolean;
  direction: 'up' | 'down' | null;
  mode: TransitionMode;
}
