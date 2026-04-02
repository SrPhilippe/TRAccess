
const calculateTriaxxPassword = (hexString, day, month) => {
    // 1. Conversão dos Bytes (Índices 0 a 9)
    const bytes = hexString.split('-').map(h => parseInt(h, 16))

    // 2. Cálculo do TRIAXX (Fator Temporal)
    // Formula: (169 * day) - (13 * month) + 351
    const triaxx = (169 * day) - (13 * month) + 351
    const tHigh = (triaxx >> 8) & 0xFF
    const tLow = triaxx & 0xFF

    console.log(`Debug - Date: ${day}/${month}`)
    console.log(`Debug - Triaxx: ${triaxx} (0x${triaxx.toString(16)})`)
    console.log(`Debug - tHigh: ${tHigh}, tLow: ${tLow}`)

    // 3. Derivação das Constantes de Hardware (F1 e F2)
    const mac = bytes.slice(5, 10)
    console.log(`Debug - MAC Bytes: ${mac.map(b => b.toString(16).padStart(2, '0')).join('-')}`)

    let f1, f2

    // Algoritmo de Identificação de Família
    if (mac[0] === 0x19 || mac[0] === 0xCD) {
        console.log("Debug - Branch: Autoclave Delta")
        f1 = 196 // 0xC4
        f2 = 181 // 0xB5
    } else if (mac[0] === 0x04 || mac[0] === 0xFD) {
        console.log("Debug - Branch: PHB")
        f1 = 175 // 0xAF
        f2 = 104 // 0x68
    } else if (mac[0] === 0x08) {
        console.log("Debug - Branch: Delta DOP-107BV")
        f1 = 63  // 0x3F
        f2 = 112 // 0x70
    } else {
        console.log("Debug - Branch: Fallback XOR")
        f1 = (mac[0] ^ mac[1] ^ mac[4]) ^ 0xAA
        f2 = (mac[2] ^ mac[3] ^ mac[4]) ^ 0x55
    }

    console.log(`Debug - F1: ${f1} (0x${f1.toString(16)}), F2: ${f2} (0x${f2.toString(16)})`)

    // 4. Cálculo das Chaves Dinâmicas (K)
    const k3 = tHigh ^ f1
    const k1 = tLow ^ f2
    console.log(`Debug - K3: ${k3} (0x${k3.toString(16)}), K1: ${k1} (0x${k1.toString(16)})`)

    // 5. Montagem da Senha Final (16-bit)
    const valHigh = bytes[3]
    const valLow = bytes[1]

    const passHigh = (valHigh ^ k3) & 0xFF
    const passLow = (valLow ^ k1) & 0xFF

    const senhaFinal = (passHigh << 8) | passLow

    return { Senha: senhaFinal }
}

console.log("--- Test Case A ---")
// hex: 00-B9-18-F4-23-C9-E5-4F-F5-DB
// dia: 3/12
// returned currently: 43827
// expected: 40358
const hexA = "00-B9-18-F4-23-C9-E5-4F-F5-DB"
const resA = calculateTriaxxPassword(hexA, 3, 12)
console.log(`Result A: ${resA.Senha} (Expected: 40358) \n`)


console.log("--- Test Case B ---")
// hex: 00-34-18-71-23-FD-D8-4E-1D-2E
// dia: 13/05
// returned currently: 55279
// expected: 53571
const hexB = "00-34-18-71-23-FD-D8-4E-1D-2E"
const resB = calculateTriaxxPassword(hexB, 13, 5)
console.log(`Result B: ${resB.Senha} (Expected: 53571) \n`)
