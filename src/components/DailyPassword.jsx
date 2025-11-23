import { useEffect, useState } from 'react';
import './DailyPassword.css';

const DailyPassword = () => {
  const [password, setPassword] = useState('');
  const [date, setDate] = useState({ day: 0, month: 0 });

  // Initialize with current date on mount
  useEffect(() => {
    const now = new Date();
    setDate({ 
      day: now.getDate(), 
      month: now.getMonth() + 1 
    });
  }, []);

  // Recalculate password whenever date changes
  useEffect(() => {
    const { day, month } = date;
    if (day && month) {
      // Formula: 169 * d - 13 * m + 351
      const pass = 169 * parseInt(day) - 13 * parseInt(month) + 351;
      setPassword(pass.toString());
    } else {
      setPassword('...');
    }
  }, [date]);

  const handleDateChange = (field, value) => {
    const numVal = parseInt(value);
    if (!isNaN(numVal)) {
      setDate(prev => ({ ...prev, [field]: numVal }));
    } else if (value === '') {
      setDate(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <div className="feature-container glass-panel">
      <h2 className="feature-title">Gerador de senha</h2>
      
      <div className="date-display">
        <div className="date-item">
          <label className="date-label">Dia</label>
          <input 
            type="number" 
            className="date-input"
            value={date.day}
            onChange={(e) => handleDateChange('day', e.target.value)}
            min="1"
            max="31"
          />
        </div>
        <div className="date-item">
          <label className="date-label">Mês</label>
          <input 
            type="number" 
            className="date-input"
            value={date.month}
            onChange={(e) => handleDateChange('month', e.target.value)}
            min="1"
            max="12"
          />
        </div>
      </div>

      <div className="password-display">
        <span className="password-label">Senha:</span>
        <span className="password-value">{password}</span>
      </div>
    </div>
  );
};

export default DailyPassword;
