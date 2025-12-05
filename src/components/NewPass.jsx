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

  // Função auxiliar para pegar bits individuais
  const getBit = (val, n) => (val >> n) & 1;

  // FÓRMULA UNIVERSAL V3.0 (Recalibrada para B0110-140P e demais modelos)
  const calculateF1F2 = (macBytes) => {
    const [b5, b6, b7, b8, b9] = macBytes;
    let F1 = 0;
    let F2 = 0;

    // Cálculo BIT a BIT de F1
    if ((getBit(b5, 1) ^ getBit(b5, 3) ^ getBit(b5, 5) ^ getBit(b6, 0) ^ getBit(b6, 1) ^ getBit(b7, 1)) === 1) F1 |= (1 << 0);
    if ((getBit(b5, 0) ^ getBit(b5, 1) ^ getBit(b5, 3) ^ getBit(b5, 6) ^ getBit(b5, 7) ^ getBit(b6, 2) ^ getBit(b6, 3) ^ getBit(b7, 0) ^ getBit(b7, 1)) === 1) F1 |= (1 << 1);
    if ((getBit(b5, 2) ^ getBit(b5, 3) ^ getBit(b5, 7) ^ getBit(b6, 0) ^ getBit(b6, 3) ^ getBit(b6, 6) ^ getBit(b7, 0) ^ getBit(b7, 1) ^ getBit(b8, 1)) === 1) F1 |= (1 << 2);
    if ((getBit(b5, 0) ^ getBit(b5, 2) ^ getBit(b5, 3) ^ getBit(b5, 4) ^ getBit(b6, 2) ^ getBit(b7, 0) ^ getBit(b7, 1) ^ getBit(b8, 1)) === 1) F1 |= (1 << 3);
    if ((getBit(b5, 0) ^ getBit(b5, 1) ^ getBit(b5, 2) ^ getBit(b5, 4) ^ getBit(b5, 6) ^ getBit(b6, 3) ^ getBit(b6, 6) ^ getBit(b7, 0)) === 1) F1 |= (1 << 4);
    if ((getBit(b5, 0) ^ getBit(b5, 1) ^ getBit(b5, 2) ^ getBit(b6, 1) ^ getBit(b6, 6) ^ getBit(b7, 0) ^ getBit(b8, 1)) === 1) F1 |= (1 << 5);
    if ((getBit(b5, 0) ^ getBit(b5, 3) ^ getBit(b5, 4) ^ getBit(b5, 6) ^ getBit(b6, 0) ^ getBit(b6, 1) ^ getBit(b6, 2) ^ getBit(b6, 6) ^ getBit(b7, 1)) === 1) F1 |= (1 << 6);
    if ((getBit(b5, 0) ^ getBit(b5, 1) ^ getBit(b5, 5) ^ getBit(b5, 6) ^ getBit(b6, 0) ^ getBit(b6, 1) ^ getBit(b6, 6) ^ getBit(b7, 0) ^ getBit(b7, 1) ^ getBit(b8, 1)) === 1) F1 |= (1 << 7);

    // Cálculo BIT a BIT de F2
    if ((getBit(b5, 2) ^ getBit(b5, 4) ^ getBit(b5, 7) ^ getBit(b6, 0) ^ getBit(b6, 1) ^ getBit(b7, 1) ^ getBit(b8, 1)) === 1) F2 |= (1 << 0);
    if ((getBit(b5, 0) ^ getBit(b5, 1) ^ getBit(b5, 2) ^ getBit(b5, 5) ^ getBit(b5, 6) ^ getBit(b6, 0) ^ getBit(b6, 1) ^ getBit(b6, 2) ^ getBit(b6, 3) ^ getBit(b7, 0) ^ getBit(b7, 1) ^ getBit(b8, 1)) === 1) F2 |= (1 << 1);
    if ((getBit(b5, 1) ^ getBit(b5, 3) ^ getBit(b5, 5) ^ getBit(b5, 6) ^ getBit(b6, 0) ^ getBit(b6, 3) ^ getBit(b6, 6) ^ getBit(b8, 1)) === 1) F2 |= (1 << 2);
    if ((getBit(b5, 0) ^ getBit(b5, 3) ^ getBit(b6, 1) ^ getBit(b6, 2) ^ getBit(b6, 6) ^ getBit(b7, 0) ^ getBit(b7, 1) ^ getBit(b8, 1)) === 1) F2 |= (1 << 3);
    if ((getBit(b5, 0) ^ getBit(b5, 1) ^ getBit(b5, 6) ^ getBit(b6, 0) ^ getBit(b6, 3) ^ getBit(b6, 6) ^ getBit(b8, 1)) === 1) F2 |= (1 << 4);
    if ((getBit(b5, 1) ^ getBit(b5, 2) ^ getBit(b5, 4) ^ getBit(b5, 6) ^ getBit(b6, 0) ^ getBit(b6, 1) ^ getBit(b6, 3) ^ getBit(b6, 6) ^ getBit(b7, 0) ^ getBit(b7, 1) ^ getBit(b8, 1)) === 1) F2 |= (1 << 5);
    if ((getBit(b5, 0) ^ getBit(b5, 1) ^ getBit(b5, 2) ^ getBit(b5, 3) ^ getBit(b5, 4) ^ getBit(b5, 7) ^ getBit(b6, 1) ^ getBit(b6, 3) ^ getBit(b6, 6)) === 1) F2 |= (1 << 6);
    if ((getBit(b5, 0) ^ getBit(b5, 5) ^ getBit(b5, 6) ^ getBit(b5, 7) ^ getBit(b7, 0) ^ getBit(b7, 1)) === 1) F2 |= (1 << 7);

    return { F1, F2 };
  };

  const calculateTriaxxPassword = (hexString, day, month) => {
    try {
      // 1. Parse do Hex Input
      const parts = hexString.split('-').map(x => parseInt(x, 16));
      if (parts.some(isNaN)) return { error: true };

      const b1 = parts[1];
      const b3 = parts[3];
      // MAC Address Bytes (5 a 9)
      const macBytes = parts.slice(5, 10); 

      // 2. Calcular F1 e F2 com a Fórmula V3.0
      const { F1, F2 } = calculateF1F2(macBytes);

      // 3. Triaxx (Fator Temporal)
      const triaxx = (169 * day) - (13 * month) + 351;
      const t_high = Math.floor(triaxx / 256);
      const t_low = triaxx % 256;

      // 4. Chaves Dinâmicas
      const k3 = t_high ^ F1;
      const k1 = t_low ^ F2;

      // 5. Senha Final
      const pass_high = b3 ^ k3;
      const pass_low = b1 ^ k1;
      const finalPassword = (pass_high * 256) + pass_low;

      return { Senha: finalPassword, error: false };

    } catch (e) {
      console.error("Erro no cálculo:", e);
      return { error: true };
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
