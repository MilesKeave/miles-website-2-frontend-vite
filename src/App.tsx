import { useState } from 'react';
import { LandingPage } from './components/LandingPage';
import { FloatingDocNav } from './components/ui/floating-doc-nav';
import { SocialIcons } from './components/ui/social-icons';
import type { PageId } from './types/pages';
import './App.css';

function App(): React.JSX.Element {
  const [currentPage, setCurrentPage] = useState<PageId>('home');
  const [isDirectNavigation, setIsDirectNavigation] = useState(false);

  const handleNavigate = (page: string) => {
    if (['home', 'portfolio', 'work', 'photography'].includes(page)) {
      setIsDirectNavigation(true);
      setCurrentPage(page as PageId);
    }
  };

  return (
    <div className="min-h-screen w-full bg-black">
      <LandingPage
        currentPage={currentPage}
        onPageChange={(page) => {
          setIsDirectNavigation(false);
          setCurrentPage(page);
        }}
        isDirectNavigation={isDirectNavigation}
      />
      <FloatingDocNav onNavigate={handleNavigate} currentPage={currentPage} />
      <SocialIcons />
    </div>
  );
}

export default App;
