import { useProfile } from '../hooks/useProfile';
import { TechDiffPage } from './TechDiffPage';
import { BackgroundBeams } from './ui/background-beams';
import { HomePage } from './HomePage';
import { ProjectsPage } from './ProjectsPage';
import { useState, useRef } from 'react';
import './LandingPage.css';

interface LandingPageProps {
  currentPage: 'home' | 'portfolio';
  onPageChange: (page: 'home' | 'portfolio') => void;
}

export const LandingPage = ({ currentPage, onPageChange }: LandingPageProps): React.JSX.Element => {
  const { loading, showTechDiff } = useProfile();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Simple functions that work like the buttons
  const goToPortfolio = () => {
    if (isTransitioning) return;
    console.log('Going to portfolio page');
    setIsTransitioning(true);
    onPageChange('portfolio');
    setTimeout(() => setIsTransitioning(false), 600);
  };

  const goToHome = () => {
    if (isTransitioning) return;
    console.log('Going to home page');
    setIsTransitioning(true);
    onPageChange('home');
    setTimeout(() => setIsTransitioning(false), 600);
  };

  // Alternative approach: Use wheel events for trackpad gestures
  const handleWheel = (e: React.WheelEvent) => {
    // Check if it's a trackpad gesture (deltaY will be larger for trackpad)
    if (Math.abs(e.deltaY) > 50) {
      e.preventDefault();
      
      if (e.deltaY > 0 && currentPage === 'home') {
        // Scroll down (wheel down) - go to portfolio
        console.log('Wheel down detected - going to portfolio');
        goToPortfolio();
      } else if (e.deltaY < 0 && currentPage === 'portfolio') {
        // Scroll up (wheel up) - go to home
        console.log('Wheel up detected - going to home');
        goToHome();
      }
    }
  };

  // Simple click/tap detection for mobile
  const handleClick = (e: React.MouseEvent) => {
    // Only trigger on the main container, not on buttons
    if (e.target === e.currentTarget) {
      console.log('Container clicked - toggling page');
      if (currentPage === 'home') {
        goToPortfolio();
      } else {
        goToHome();
      }
    }
  };

  // Show tech diff page if loading for more than 4 seconds
  if (showTechDiff) {
    return <TechDiffPage />;
  }

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-content">
          <div className="loading-spinner"></div>
          <p className="loading-text">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="landing-page"
      ref={containerRef}
      onWheel={handleWheel}
      onClick={handleClick}
      style={{ touchAction: 'none' }}
    >
      {/* Fixed Background - Always visible */}
      <BackgroundBeams />
      
      {/* Page Container with Transition Effects */}
      <div className="page-container">
        {/* Home Page */}
        <div 
          className={`page-wrapper home-page-wrapper ${currentPage === 'home' ? 'active' : currentPage === 'portfolio' ? 'slide-up' : ''}`}
        >
          <HomePage />
        </div>

        {/* Portfolio Page */}
        <div 
          className={`page-wrapper projects-page-wrapper ${currentPage === 'portfolio' ? 'active' : currentPage === 'home' ? 'slide-down' : ''}`}
        >
          <ProjectsPage />
        </div>
      </div>

      {/* Swipe Indicators */}
      {currentPage === 'home' && (
        <div className="swipe-indicator">
          <div className="swipe-hint">
            <svg className="swipe-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
            </svg>
            <span>Scroll down or click to continue</span>
          </div>
        </div>
      )}

      {currentPage === 'portfolio' && (
        <div className="swipe-indicator">
          <div className="swipe-hint">
            <svg className="swipe-icon swipe-down" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
            <span>Scroll up or click to go back</span>
          </div>
        </div>
      )}
    </div>
  );
}; 