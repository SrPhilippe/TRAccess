import { useState, useEffect } from 'react'
import DataFlowDiagram from './DataFlowDiagram'
import './NewPass.css'

const NewPass = () => {
  const [hexInputs, setHexInputs] = useState(Array(10).fill(''))
  const [password, setPassword] = useState(null)
  const [resultData, setResultData] = useState(null)

  // Auto-generate password when inputs change
  useEffect(() => {
    // Check if all hex inputs are filled (length 2)
    const allHexFilled = hexInputs.every(input => input.length === 2)

    if (allHexFilled) {
      const hexString = hexInputs.join('-')
      const result = calculateTriaxxPassword(hexString)

      if (!result.error) {
        setPassword(result.Senha)
        setResultData(result)
      } else {
        setPassword(null)
        setResultData(null)
      }
    } else {
      setPassword(null)
      setResultData(null)
    }
  }, [hexInputs])

  const handleInputChange = (index, value) => {
    // Allow only hex characters
    if (value && !/^[0-9A-Fa-f]*$/.test(value)) return

    const newInputs = [...hexInputs]
    newInputs[index] = value.toUpperCase()
    setHexInputs(newInputs)

    // Auto-focus next input if 2 chars are entered
    if (value.length === 2 && index < 9) {
      const nextInput = document.getElementById(`hex-input-${index + 1}`)
      if (nextInput) nextInput.focus()
    }
  }

  const handlePaste = e => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData('text').replace(/[^0-9A-Fa-f]/g, '')

    // Split into chunks of 2
    const chunks = []
    for (let i = 0; i < pastedData.length && i < 20; i += 2) {
      chunks.push(pastedData.slice(i, i + 2).toUpperCase())
    }

    const newInputs = [...hexInputs]
    chunks.forEach((chunk, i) => {
      if (i < 10) newInputs[i] = chunk
    })
    setHexInputs(newInputs)
  }

  const calculateTriaxxPassword = hexString => {
    const bytes = hexString.split('-').map(h => parseInt(h, 16))

    if (bytes.length !== 10) return { error: true }

    const b0 = bytes[0]
    const b2 = bytes[2]
    const b3 = bytes[3]
    const b5 = bytes[5]
    const b6 = bytes[6]
    const b8 = bytes[8]
    const b9 = bytes[9]

    // Cálculo das Chaves Dinâmicas (K)
    const J1 = b2 ^ b3 ^ b5 ^ 0x4F
    const J6 = b6 ^ b8 ^ 0x9A

    // XOR challenge bytes
    const val1 = b0 ^ J1
    const val2 = b9 ^ J6

    // Combine into Senha
    const combined = (val1 << 8) | val2
    const senhaFinal = combined.toString().padStart(5, '0')

    return { 
      Senha: senhaFinal,
      j1: J1,
      j6: J6,
      val1: val1,
      val2: val2
    }
  }

  return (
    <div className='newpass-container glass-panel'>
      <h2 className='newpass-title'>Gerador de Senha</h2>

      <div className='hex-input-grid' onPaste={handlePaste}>
        {hexInputs.map((value, index) => (
          <div key={index} className='hex-input-wrapper'>
            <input
              id={`hex-input-${index}`}
              type='text'
              className='hex-input'
              value={value}
              onChange={e => handleInputChange(index, e.target.value)}
              placeholder='00'
              maxLength={2}
            />
          </div>
        ))}
      </div>

      <div className='result-display'>
        <span>Senha:</span>
        <span className='result-value'>{password !== null ? password : '. . . . .'}</span>
      </div>

      <DataFlowDiagram hexInputs={hexInputs} resultData={resultData} />
    </div>
  )
}

export default NewPass
