import { useState } from 'react';
import './RemoveAlarm.css';

const RemoveAlarm = () => {
  const [value, setValue] = useState('');
  const [password, setPassword] = useState('');

  const handleChange = (e) => {
    // Allow only numbers and limit to 5 digits
    let v = e.target.value.replace(/\D/g, '').slice(0, 5);
    setValue(v);

    if (v.length === 5) {
      const now = new Date();
      const day = now.getDate();
      const month = now.getMonth() + 1;
      const year = now.getFullYear() % 100; // 2 digits

      // New Logic:
      // 1. Discard last digit
      const code = v.slice(0, 4);
      
      // 2. Split remaining 4 digits into 2 groups
      const group1 = parseInt(code.slice(0, 2), 10);
      const group2 = parseInt(code.slice(2), 10);
      
      // 3. Calculate total for second group
      const total = group2 + day + month + year;
      
      let finalGroup1 = group1;
      let finalGroup2 = total;

      // 4. Handle overflow if total > 99
      if (total > 99) {
        finalGroup1 += 1; // Add 1 to first group
        finalGroup2 = total % 100; // Keep remainder as second group
      }
      
      // Format output: Group1 + Group2 (padded)
      setPassword(`${finalGroup1}${finalGroup2.toString().padStart(2, '0')}`);
    } else {
      setPassword('');
    }
  };

  return (
    <div className="feature-container glass-panel">
      <h2 className="feature-title">Remover alarme</h2>
      
      <div className="input-group">
        <label className="input-label">Últimos 5 dígitos do S/N</label>
        <input 
          type="text" 
          className="sn-input"
          value={value}
          onChange={handleChange}
          placeholder="00000"
          maxLength={5}
        />
      </div>

      <div className="password-display">
        <span className="password-label">Senha:</span>
        <span className="password-value">{password || '....'}</span>
      </div>
    </div>
  );
};

export default RemoveAlarm;
