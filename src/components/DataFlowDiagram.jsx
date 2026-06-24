import './DataFlowDiagram.css'

const DataFlowDiagram = ({ hexInputs, resultData }) => {
  const bytes = hexInputs || Array(10).fill('')

  const { j1, j6, val1, val2, Senha } = resultData || {}

  // Format hex helper
  const hex = val =>
    val !== undefined && val !== null && !isNaN(val) ? `0x${val.toString(16).toUpperCase().padStart(2, '0')}` : '??'
  const byteStr = val => (val && val.trim() !== '' ? val.toUpperCase().padStart(2, '0') : '00')

  const drawCurve = (x1, y1, x2, y2, color, dashed = false) => {
    const cx1 = x1 + (x2 - x1) / 2
    const cy1 = y1
    const cx2 = x1 + (x2 - x1) / 2
    const cy2 = y2
    return (
      <path
        d={`M ${x1} ${y1} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${x2} ${y2}`}
        fill='none'
        stroke={color}
        strokeWidth='2'
        strokeDasharray={dashed ? '5,5' : 'none'}
      />
    )
  }

  const drawDot = (x, y, color) => <circle cx={x} cy={y} r='4' fill={color} />

  return (
    <div className='dfd-container glass-panel'>
      <h3 className='dfd-title'>Diagrama de Fluxo de Dados</h3>
      <div className='dfd-svg-wrapper'>
        <svg viewBox='0 0 850 500' className='dfd-svg'>
          {/* Paths */}
          {/* Input to J1 */}
          {drawCurve(120, 160, 220, 220, '#34d399', true)} {/* b2 to J1 */}
          {drawCurve(120, 200, 220, 220, '#34d399', true)} {/* b3 to J1 */}
          {drawCurve(120, 280, 220, 220, '#34d399', true)} {/* b5 to J1 */}
          {/* Input to J6 */}
          {drawCurve(120, 320, 220, 380, '#34d399', true)} {/* b6 to J6 */}
          {drawCurve(120, 400, 220, 380, '#34d399', true)} {/* b8 to J6 */}
          {/* Input to XOR */}
          {drawCurve(120, 80, 450, 140, '#fbbf24')} {/* b0 to val1 */}
          {drawCurve(120, 440, 450, 300, '#fbbf24')} {/* b9 to val2 */}
          {/* J1, J6 to XOR */}
          {drawCurve(380, 220, 450, 140, '#34d399')}
          {drawCurve(380, 380, 450, 300, '#34d399')}
          {/* XOR to Combine */}
          {drawCurve(610, 140, 680, 220, '#fbbf24')}
          {drawCurve(610, 300, 680, 220, '#fbbf24')}
          {/* Dots */}
          {drawDot(120, 80, '#fbbf24')}
          {drawDot(120, 160, '#34d399')}
          {drawDot(120, 200, '#34d399')}
          {drawDot(120, 280, '#34d399')}
          {drawDot(120, 320, '#34d399')}
          {drawDot(120, 400, '#34d399')}
          {drawDot(120, 440, '#fbbf24')}
          {drawDot(450, 140, '#fbbf24')}
          {drawDot(450, 300, '#fbbf24')}
          {drawDot(680, 220, '#fbbf24')}
          {/* Foreign Objects for Nodes */}
          {/* Inputs Column */}
          {Array.from({ length: 10 }).map((_, i) => (
            <foreignObject x='0' y={40 * i + 64} width='120' height='32' key={i}>
              <div
                className={`dfd-node input-node ${[0, 9].includes(i) ? 'challenge' : ''} ${[2, 3, 5, 6, 8].includes(i) ? 'key' : ''}`}
              >
                <span className='byte-index'>{i}</span>
                <span className='byte-val'>{byteStr(bytes[i])}</span>
              </div>
            </foreignObject>
          ))}
          {/* Key Derivation Column */}
          <foreignObject x='220' y='180' width='160' height='80'>
            <div className='dfd-node key-node'>
              <span className='formula'>J1 = b2 ⊕ b3 ⊕ b5 ⊕ 0x4F</span>
              <span className='result'>{hex(j1)}</span>
            </div>
          </foreignObject>
          <foreignObject x='220' y='340' width='160' height='80'>
            <div className='dfd-node key-node'>
              <span className='formula'>J6 = b6 ⊕ b8 ⊕ 0x9A</span>
              <span className='result'>{hex(j6)}</span>
            </div>
          </foreignObject>
          {/* XOR Stage Column */}
          <foreignObject x='450' y='100' width='160' height='80'>
            <div className='dfd-node xor-node'>
              <span className='formula'>b0 ⊕ J1</span>
              <span className='result'>{hex(val1)}</span>
            </div>
          </foreignObject>
          <foreignObject x='450' y='260' width='160' height='80'>
            <div className='dfd-node xor-node'>
              <span className='formula'>b9 ⊕ J6</span>
              <span className='result'>{hex(val2)}</span>
            </div>
          </foreignObject>
          {/* Combine Column */}
          <foreignObject x='680' y='170' width='160' height='100'>
            <div className='dfd-node combine-node'>
              <span className='formula'>(val1 ≪ 8) | val2</span>
              <span className='result'>{Senha !== undefined && Senha !== null && !isNaN(Senha) ? Senha : '-----'}</span>
              <span className='label'>SENHA</span>
            </div>
          </foreignObject>
          {/* Column Headers */}
          <foreignObject x='0' y='20' width='120' height='30'>
            <div className='dfd-header'>INPUT BYTES</div>
          </foreignObject>
          <foreignObject x='220' y='20' width='160' height='30'>
            <div className='dfd-header'>KEY DERIVATION</div>
          </foreignObject>
          <foreignObject x='450' y='20' width='160' height='30'>
            <div className='dfd-header'>XOR STAGE</div>
          </foreignObject>
          <foreignObject x='680' y='20' width='160' height='30'>
            <div className='dfd-header'>COMBINE</div>
          </foreignObject>
        </svg>
      </div>
    </div>
  )
}

export default DataFlowDiagram
