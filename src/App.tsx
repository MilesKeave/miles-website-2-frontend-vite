import { useState } from 'react';
import { LandingPage } from './components/LandingPage';
import { HomePage } from './components/HomePage';
import { PortfolioPage } from './components/PortfolioPage';
import { FloatingDocNav } from './components/ui/floating-doc-nav';
import './App.css';

function App(): React.JSX.Element {
  const [currentPage, setCurrentPage] = useState<'landing' | 'home' | 'portfolio'>('landing');

  const handleNavigate = (page: string) => {
    if (page === 'home') {
      setCurrentPage('home');
    } else if (page === 'portfolio') {
      setCurrentPage('portfolio');
    }
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'landing':
        return <LandingPage />;
      case 'home':
        return <HomePage />;
      case 'portfolio':
        return <PortfolioPage />;
      default:
        return <LandingPage />;
    }
  };

  return (
    <div className="min-h-screen w-full bg-black p-8">
      {renderPage()}
      <FloatingDocNav onNavigate={handleNavigate} />
    </div>
  );
}

export default App;
