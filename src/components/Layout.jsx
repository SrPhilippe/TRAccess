import { useState, useEffect } from 'react';
import DailyPassword from './DailyPassword';
import RemoveAlarm from './RemoveAlarm';
import NewPass from './NewPass';
import { Sun, Moon } from 'lucide-react'; // Assuming lucide-react for icons
import './Layout.css';

const Layout = () => {
  const [activeTab, setActiveTab] = useState('TMBR');
  const [theme, setTheme] = useState('dark');

  useEffect(() => {
    // Check localStorage or system preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.setAttribute('data-theme', savedTheme);
      document.body.setAttribute('data-theme', savedTheme);
    } else if (window.matchMedia('(prefers-color-scheme: light)').matches) {
      setTheme('light');
      document.documentElement.setAttribute('data-theme', 'light');
      document.body.setAttribute('data-theme', 'light');
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    document.body.setAttribute('data-theme', newTheme);
  };

  return (
    <div className="layout-container">
      <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle theme">
        {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
      </button>

      <div className="tabs">
        <button 
          className={`tab ${activeTab === 'TMBR' ? 'active' : ''}`}
          onClick={() => setActiveTab('TMBR')}
        >
          TMBR
        </button>
        <button 
          className={`tab ${activeTab === 'Periódica' ? 'active' : ''}`}
          onClick={() => setActiveTab('Periódica')}
        >
          Periódica
        </button>
        <button 
          className={`tab ${activeTab === 'NewPass' ? 'active' : ''}`}
          onClick={() => setActiveTab('NewPass')}
        >
          NewPass
        </button>
      </div>
      
      <div className="content-area">
        {activeTab === 'TMBR' && <DailyPassword />}
        {activeTab === 'Periódica' && <RemoveAlarm />}
        {activeTab === 'NewPass' && <NewPass />}
      </div>
    </div>
  );
};

export default Layout;
