import { useState } from 'react';
import { LandingPage } from './components/LandingPage';
import { FloatingDocNav } from './components/ui/floating-doc-nav';
import './App.css';

function App(): React.JSX.Element {
  const [currentPage, setCurrentPage] = useState<'home' | 'portfolio'>('home');

  const handleNavigate = (page: string) => {
    if (page === 'home') {
      setCurrentPage('home');
    } else if (page === 'portfolio') {
      setCurrentPage('portfolio');
    }
  };

  return (
    <div className="min-h-screen w-full bg-black">
      <LandingPage 
        currentPage={currentPage} 
        onPageChange={setCurrentPage}
      />
      <FloatingDocNav onNavigate={handleNavigate} currentPage={currentPage} />
    </div>
  );
}

export default App;
