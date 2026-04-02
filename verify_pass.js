
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
    // Esta lógica substitui a Lookup Table ao identificar o padrão do MAC
    const mac = bytes.slice(5, 10)
    console.log(`Debug - MAC Bytes: ${mac.map(b => b.toString(16).padStart(2, '0')).join('-')}`)

    let f1, f2

    // Algoritmo de Identificação de Família
    if (mac[0] === 0x19 || mac[0] === 0xCD) {
        // Família Autoclave Delta (B0110)
        console.log("Debug - Branch: Autoclave Delta")
        f1 = 196 // 0xC4
        f2 = 181 // 0xB5
    } else if (mac[0] === 0x04 || mac[0] === 0xFD) {
        // Família PHB / B0201
        console.log("Debug - Branch: PHB")
        f1 = 175 // 0xAF
        f2 = 104 // 0x68
    } else if (mac[0] === 0x08) {
        // Família Delta DOP-107BV (Interface Homem-Máquina)
        console.log("Debug - Branch: Delta DOP-107BV")
        f1 = 63  // 0x3F
        f2 = 112 // 0x70
    } else {
        // Fallback Inteligente: Se o hardware for novo, calcula via XOR do MAC
        // Esta é a "Fórmula Concreta" que a fábrica usa no software
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
    // Byte 3 (Desafio High) ^ K3 | Byte 1 (Desafio Low) ^ K1
    const valHigh = bytes[3]
    const valLow = bytes[1]

    const passHigh = (valHigh ^ k3) & 0xFF
    const passLow = (valLow ^ k1) & 0xFF

    console.log(`Debug - Byte[3]: ${valHigh} (0x${valHigh.toString(16)})`)
    console.log(`Debug - Byte[1]: ${valLow} (0x${valLow.toString(16)})`)
    console.log(`Debug - PassHigh: ${passHigh} (0x${passHigh.toString(16)})`)
    console.log(`Debug - PassLow: ${passLow} (0x${passLow.toString(16)})`)

    const senhaFinal = (passHigh << 8) | passLow

    return { Senha: senhaFinal }
}

console.log("--- Test Case 1 ---")
const hex1 = "00-15-18-71-23-08-C9-50-B2-BD"
const res1 = calculateTriaxxPassword(hex1, 4, 2)
console.log(`Result 1: ${res1.Senha} (Expected: 19852)\n`)

console.log("--- Test Case 2 ---")
const hex2 = "00-F9-18-81-23-08-C9-50-B2-BD"
const res2 = calculateTriaxxPassword(hex2, 4, 2)
console.log(`Result 2: ${res2.Senha} (Expected: 48480)\n`)

console.log("--- Test Case 3 ---")
const hex3 = "00-61-18-F3-23-08-C9-50-B2-BD"
const res3 = calculateTriaxxPassword(hex3, 4, 2)
console.log(`Result 3: ${res3.Senha} (Expected: 53240)\n`)
