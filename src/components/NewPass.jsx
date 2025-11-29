import { useState, useEffect } from 'react';
import './NewPass.css';

const NewPass = () => {
  const [hexInputs, setHexInputs] = useState(Array(10).fill(''));
  const [password, setPassword] = useState(null);
  const [date, setDate] = useState({ day: '', month: '' });

  // Initialize with current date on mount
  useEffect(() => {
    const now = new Date();
    setDate({ 
      day: now.getDate(), 
      month: now.getMonth() + 1 
    });
  }, []);

  // Auto-generate password when inputs change
  useEffect(() => {
    // Check if all hex inputs are filled (length 2)
    const allHexFilled = hexInputs.every(input => input.length === 2);
    const dateValid = date.day && date.month;

    if (allHexFilled && dateValid) {
      const hexString = hexInputs.join('-');
      const result = calculateTriaxxPassword(hexString, parseInt(date.day), parseInt(date.month));
      
      if (!result.error) {
        setPassword(result.Senha);
      } else {
        setPassword(null);
      }
    } else {
      setPassword(null);
    }
  }, [hexInputs, date]);

  const handleDateChange = (field, value) => {
    if (value.length > 2) return;

    const numVal = parseInt(value);
    if (!isNaN(numVal)) {
      if (field === 'day' && (numVal < 1 || numVal > 31)) return;
      if (field === 'month' && (numVal < 1 || numVal > 12)) return;
      setDate(prev => ({ ...prev, [field]: numVal }));
    } else if (value === '') {
      setDate(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleInputChange = (index, value) => {
    // Allow only hex characters
    if (value && !/^[0-9A-Fa-f]*$/.test(value)) return;
    
    const newInputs = [...hexInputs];
    newInputs[index] = value.toUpperCase();
    setHexInputs(newInputs);

    // Auto-focus next input if 2 chars are entered
    if (value.length === 2 && index < 9) {
      const nextInput = document.getElementById(`hex-input-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/[^0-9A-Fa-f]/g, '');
    
    // Split into chunks of 2
    const chunks = [];
    for (let i = 0; i < pastedData.length && i < 20; i += 2) {
      chunks.push(pastedData.slice(i, i + 2).toUpperCase());
    }

    const newInputs = [...hexInputs];
    chunks.forEach((chunk, i) => {
      if (i < 10) newInputs[i] = chunk;
    });
    setHexInputs(newInputs);
  };

  // Helper function to get the nth bit
  const getBit = (val, n) => {
    return (val >> n) & 1;
  };

  const calculateTriaxxPassword = (hexCodeStr, day, month) => {
    try {
      // 1. Parse Hex Code
      const parts = hexCodeStr.split('-').map(x => parseInt(x, 16));

      // Security check
      if (parts.length < 9) {
        return { error: "Código Hex incompleto. O formato deve ter pelo menos 9 bytes separados por traço." };
      }

      // Relevant Bytes
      const b1 = parts[1];   // Challenge Low
      const b3 = parts[3];   // Challenge High
      const b5 = parts[5];   // MAC Byte 0
      const b6 = parts[6];   // MAC Byte 1
      const b7 = parts[7];   // MAC Byte 2
      const b8 = parts[8];   // MAC Byte 3

      // 2. Universal Formula for F1 and F2 (Reverse Engineering GF2)
      
      // Calculate F1 bits
      const f1_bits = new Array(8).fill(0);
      f1_bits[0] = getBit(b5,1)^getBit(b5,3)^getBit(b5,5)^getBit(b5,6)^getBit(b6,0)^getBit(b6,1)^getBit(b7,0);
      f1_bits[1] = getBit(b5,0)^getBit(b5,1)^getBit(b5,3)^getBit(b5,7)^getBit(b6,2)^getBit(b6,3);
      f1_bits[2] = getBit(b5,2)^getBit(b5,3)^getBit(b5,6)^getBit(b5,7)^getBit(b6,0)^getBit(b6,3)^getBit(b6,6)^getBit(b8,1);
      f1_bits[3] = getBit(b5,0)^getBit(b5,2)^getBit(b5,3)^getBit(b5,4)^getBit(b5,6)^getBit(b6,2)^getBit(b8,1);
      f1_bits[4] = getBit(b5,0)^getBit(b5,1)^getBit(b5,2)^getBit(b5,4)^getBit(b5,6)^getBit(b6,3)^getBit(b6,6)^getBit(b7,0);
      f1_bits[5] = getBit(b5,0)^getBit(b5,1)^getBit(b5,2)^getBit(b6,1)^getBit(b6,6)^getBit(b7,0)^getBit(b8,1);
      f1_bits[6] = getBit(b5,0)^getBit(b5,3)^getBit(b5,4)^getBit(b6,0)^getBit(b6,1)^getBit(b6,2)^getBit(b6,6)^getBit(b7,0);
      f1_bits[7] = getBit(b5,0)^getBit(b5,1)^getBit(b5,5)^getBit(b6,0)^getBit(b6,1)^getBit(b6,6)^getBit(b8,1);

      // Reconstruct Byte F1
      let F1 = 0;
      for (let i = 0; i < 8; i++) F1 |= (f1_bits[i] << i);

      // Calculate F2 bits
      const f2_bits = new Array(8).fill(0);
      f2_bits[0] = getBit(b5,2)^getBit(b5,4)^getBit(b5,6)^getBit(b5,7)^getBit(b6,0)^getBit(b6,1)^getBit(b7,0)^getBit(b8,1);
      f2_bits[1] = getBit(b5,0)^getBit(b5,1)^getBit(b5,2)^getBit(b5,5)^getBit(b6,0)^getBit(b6,1)^getBit(b6,2)^getBit(b6,3)^getBit(b8,1);
      f2_bits[2] = getBit(b5,1)^getBit(b5,3)^getBit(b5,5)^getBit(b5,6)^getBit(b6,0)^getBit(b6,3)^getBit(b6,6)^getBit(b8,1);
      f2_bits[3] = getBit(b5,0)^getBit(b5,3)^getBit(b5,6)^getBit(b6,1)^getBit(b6,2)^getBit(b6,6)^getBit(b8,1);
      f2_bits[4] = getBit(b5,0)^getBit(b5,1)^getBit(b5,6)^getBit(b6,0)^getBit(b6,3)^getBit(b6,6)^getBit(b8,1);
      f2_bits[5] = getBit(b5,1)^getBit(b5,2)^getBit(b5,4)^getBit(b6,0)^getBit(b6,1)^getBit(b6,3)^getBit(b6,6)^getBit(b8,1);
      f2_bits[6] = getBit(b5,0)^getBit(b5,1)^getBit(b5,2)^getBit(b5,3)^getBit(b5,4)^getBit(b5,7)^getBit(b6,1)^getBit(b6,3)^getBit(b6,6);
      f2_bits[7] = getBit(b5,0)^getBit(b5,5)^getBit(b5,7);

      // Reconstruct Byte F2
      let F2 = 0;
      for (let i = 0; i < 8; i++) F2 |= (f2_bits[i] << i);

      // 3. Calculate TRIAXX (Temporal)
      const triaxx_val = (169 * day) - (13 * month) + 351;
      const t_high = Math.floor(triaxx_val / 256);
      const t_low = triaxx_val % 256;

      // 4. Calculate Final Keys (K)
      const k3 = t_high ^ F1;
      const k1 = t_low ^ F2;

      // 5. Decode Password
      const pass_high = b3 ^ k3;
      const pass_low = b1 ^ k1;

      const final_password = (pass_high * 256) + pass_low;

      return {
        F1_Calculado: F1,
        F2_Calculado: F2,
        Senha: final_password
      };

    } catch (error) {
      return { error: error.message };
    }
  };

  return (
    <div className="newpass-container glass-panel">
      <h2 className="newpass-title">Gerador de Senha</h2>
      
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

      <div className="hex-input-grid" onPaste={handlePaste}>
        {hexInputs.map((value, index) => (
          <div key={index} className="hex-input-wrapper">
            <input
              id={`hex-input-${index}`}
              type="text"
              className="hex-input"
              value={value}
              onChange={(e) => handleInputChange(index, e.target.value)}
              placeholder="00"
              maxLength={2}
            />
          </div>
        ))}
      </div>

      <div className="result-display">
        <span>Senha:</span>
        <span className="result-value">{password !== null ? password : '. . . . .'}</span>
      </div>
    </div>
  );
};

export default NewPass;
