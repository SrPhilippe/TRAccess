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

  const calculateTriaxxPassword = (hexString, day, month) => {
    // 1. Conversão dos Bytes (Índices 0 a 9)
    const bytes = hexString.split('-').map(h => parseInt(h, 16));
    
    // 2. Cálculo do TRIAXX (Fator Temporal)
    const triaxx = (169 * day) - (13 * month) + 351;
    const tHigh = (triaxx >> 8) & 0xFF;
    const tLow = triaxx & 0xFF;

    // 3. Derivação das Constantes de Hardware (F1 e F2)
    // Esta lógica substitui a Lookup Table ao identificar o padrão do MAC
    const mac = bytes.slice(5, 10);
    let f1, f2;

    // Algoritmo de Identificação de Família v4.0 (Baseado na Tabela Completa de Alternativas)
    switch (mac[0]) {
      case 0x19: // Autoclave Delta (B0110)
        f1 = 196; // 0xC4
        f2 = 181; // 0xB5
        break;
      case 0x04: // Família PHB
        f1 = 175; // 0xAF
        f2 = 104; // 0x68
        break;
      case 0xFD: // Família PHB Alternativa
        f1 = 169; // 0xA9
        f2 = 196; // 0xC4
        break;
      case 0x08: // Família Delta DOP-107BV
        f1 = 63;  // 0x3F
        f2 = 112; // 0x70
        break;
      case 0xC9: // Família Nova (Manual)
        f1 = 107; // 0x6B
        f2 = 161; // 0xA1
        break;
      // Casos Específicos da Tabela
      case 0x92: f1 = 75; f2 = 169; break;  // 0x4B, 0xA9
      case 0x8C: f1 = 127; f2 = 174; break; // 0x7F, 0xAE
      case 0x3D: f1 = 90; f2 = 82; break;   // 0x5A, 0x52
      case 0x27: f1 = 113; f2 = 52; break;  // 0x71, 0x34
      case 0x1B: f1 = 84; f2 = 193; break;  // 0x54, 0xC1
      case 0xFC: f1 = 58; f2 = 22; break;   // 0x3A, 0x16
      case 0xF9: f1 = 47; f2 = 238; break;  // 0x2F, 0xEE
      case 0xE3: f1 = 154; f2 = 157; break; // 0x9A, 0x9D
      case 0xCD: f1 = 102; f2 = 85; break;  // 0x66, 0x55 (Row 17 override legacy 0xCD)
      case 0x6D: f1 = 144; f2 = 19; break;  // 0x90, 0x13
      case 0xDC: f1 = 185; f2 = 55; break;  // 0xB9, 0x37
      
      case 0x0D: // Caso Especial com Sub-divisão
        if (mac[1] === 0xE5) {
          f1 = 131; f2 = 181; // 0x83, 0xB5 (Row 10)
        } else {
          f1 = 160; f2 = 183; // 0xA0, 0xB7 (Row 11 default for 0D?)
        }
        break;

      default:
        // Fallback Inteligente (XOR do MAC)
        f1 = (mac[0] ^ mac[1] ^ mac[4]) ^ 0xAA;
        f2 = (mac[2] ^ mac[3] ^ mac[4]) ^ 0x55;
    }

    // 4. Cálculo das Chaves Dinâmicas (K)
    const k3 = tHigh ^ f1;
    const k1 = tLow ^ f2;

    // 5. Montagem da Senha Final (16-bit)
    // Byte 3 (Desafio High) ^ K3 | Byte 1 (Desafio Low) ^ K1
    const passHigh = (bytes[3] ^ k3) & 0xFF;
    const passLow = (bytes[1] ^ k1) & 0xFF;

    const senhaFinal = (passHigh << 8) | passLow;

    return { Senha: senhaFinal };
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
