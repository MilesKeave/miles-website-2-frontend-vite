import { useState } from 'react';
import { LandingPage } from './components/LandingPage';
import { FloatingDocNav } from './components/ui/floating-doc-nav';
import type { PageId } from './types/pages';
import './App.css';

function App(): React.JSX.Element {
  const [currentPage, setCurrentPage] = useState<PageId>('home');
  const [isDirectNavigation, setIsDirectNavigation] = useState(false);

  const handleNavigate = (page: string) => {
    // Type-safe navigation - only allow valid page IDs
    if (['home', 'portfolio', 'work'].includes(page)) {
      setIsDirectNavigation(true); // Flag for direct navigation
      setCurrentPage(page as PageId);
    }
  };

  return (
    <div className="min-h-screen w-full bg-black">
      <LandingPage 
        currentPage={currentPage} 
        onPageChange={(page) => {
          setIsDirectNavigation(false); // Reset flag for swipe navigation
          setCurrentPage(page);
        }}
        isDirectNavigation={isDirectNavigation}
      />
      <FloatingDocNav onNavigate={handleNavigate} currentPage={currentPage} />
    </div>
  );
}

export default App;
