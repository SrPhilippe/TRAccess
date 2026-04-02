
const getBit = (val, n) => (val >> n) & 1

const calculateF1F2_OLD = (macBytes) => {
    const [b5, b6, b7, b8, b9] = macBytes
    let F1 = 0
    let F2 = 0

    // Cálculo BIT a BIT de F1
    if ((getBit(b5, 1) ^ getBit(b5, 3) ^ getBit(b5, 5) ^ getBit(b6, 0) ^ getBit(b6, 1) ^ getBit(b7, 1)) === 1) F1 |= (1 << 0)
    if ((getBit(b5, 0) ^ getBit(b5, 1) ^ getBit(b5, 3) ^ getBit(b5, 6) ^ getBit(b5, 7) ^ getBit(b6, 2) ^ getBit(b6, 3) ^ getBit(b7, 0) ^ getBit(b7, 1)) === 1) F1 |= (1 << 1)
    if ((getBit(b5, 2) ^ getBit(b5, 3) ^ getBit(b5, 7) ^ getBit(b6, 0) ^ getBit(b6, 3) ^ getBit(b6, 6) ^ getBit(b7, 0) ^ getBit(b7, 1) ^ getBit(b8, 1)) === 1) F1 |= (1 << 2)
    if ((getBit(b5, 0) ^ getBit(b5, 2) ^ getBit(b5, 3) ^ getBit(b5, 4) ^ getBit(b6, 2) ^ getBit(b7, 0) ^ getBit(b7, 1) ^ getBit(b8, 1)) === 1) F1 |= (1 << 3)
    if ((getBit(b5, 0) ^ getBit(b5, 1) ^ getBit(b5, 2) ^ getBit(b5, 4) ^ getBit(b5, 6) ^ getBit(b6, 3) ^ getBit(b6, 6) ^ getBit(b7, 0)) === 1) F1 |= (1 << 4)
    if ((getBit(b5, 0) ^ getBit(b5, 1) ^ getBit(b5, 2) ^ getBit(b6, 1) ^ getBit(b6, 6) ^ getBit(b7, 0) ^ getBit(b8, 1)) === 1) F1 |= (1 << 5)
    if ((getBit(b5, 0) ^ getBit(b5, 3) ^ getBit(b5, 4) ^ getBit(b5, 6) ^ getBit(b6, 0) ^ getBit(b6, 1) ^ getBit(b6, 2) ^ getBit(b6, 6) ^ getBit(b7, 1)) === 1) F1 |= (1 << 6)
    if ((getBit(b5, 0) ^ getBit(b5, 1) ^ getBit(b5, 5) ^ getBit(b5, 6) ^ getBit(b6, 0) ^ getBit(b6, 1) ^ getBit(b6, 6) ^ getBit(b7, 0) ^ getBit(b7, 1) ^ getBit(b8, 1)) === 1) F1 |= (1 << 7)

    // Cálculo BIT a BIT de F2
    if ((getBit(b5, 2) ^ getBit(b5, 4) ^ getBit(b5, 7) ^ getBit(b6, 0) ^ getBit(b6, 1) ^ getBit(b7, 1) ^ getBit(b8, 1)) === 1) F2 |= (1 << 0)
    if ((getBit(b5, 0) ^ getBit(b5, 1) ^ getBit(b5, 2) ^ getBit(b5, 5) ^ getBit(b5, 6) ^ getBit(b6, 0) ^ getBit(b6, 1) ^ getBit(b6, 2) ^ getBit(b6, 3) ^ getBit(b7, 0) ^ getBit(b7, 1) ^ getBit(b8, 1)) === 1) F2 |= (1 << 1)
    if ((getBit(b5, 1) ^ getBit(b5, 3) ^ getBit(b5, 5) ^ getBit(b5, 6) ^ getBit(b6, 0) ^ getBit(b6, 3) ^ getBit(b6, 6) ^ getBit(b8, 1)) === 1) F2 |= (1 << 2)
    if ((getBit(b5, 0) ^ getBit(b5, 3) ^ getBit(b6, 1) ^ getBit(b6, 2) ^ getBit(b6, 6) ^ getBit(b7, 0) ^ getBit(b7, 1) ^ getBit(b8, 1)) === 1) F2 |= (1 << 3)
    if ((getBit(b5, 0) ^ getBit(b5, 1) ^ getBit(b5, 6) ^ getBit(b6, 0) ^ getBit(b6, 3) ^ getBit(b6, 6) ^ getBit(b8, 1)) === 1) F2 |= (1 << 4)
    if ((getBit(b5, 1) ^ getBit(b5, 2) ^ getBit(b5, 4) ^ getBit(b5, 6) ^ getBit(b6, 0) ^ getBit(b6, 1) ^ getBit(b6, 3) ^ getBit(b6, 6) ^ getBit(b7, 0) ^ getBit(b7, 1) ^ getBit(b8, 1)) === 1) F2 |= (1 << 5)
    if ((getBit(b5, 0) ^ getBit(b5, 1) ^ getBit(b5, 2) ^ getBit(b5, 3) ^ getBit(b5, 4) ^ getBit(b5, 7) ^ getBit(b6, 1) ^ getBit(b6, 3) ^ getBit(b6, 6)) === 1) F2 |= (1 << 6)
    if ((getBit(b5, 0) ^ getBit(b5, 5) ^ getBit(b5, 6) ^ getBit(b5, 7) ^ getBit(b7, 0) ^ getBit(b7, 1)) === 1) F2 |= (1 << 7)

    return { F1, F2 }
}

const mac = [0x08, 0xC9, 0x50, 0xB2, 0xBD]
const res = calculateF1F2_OLD(mac)
console.log("OLD CODE Result:", res)

const triaxx = 1001 // (0x3E9)
const tHigh = 3
const tLow = 233

const k3 = tHigh ^ res.F1
const k1 = tLow ^ res.F2

const bytes = [0x00, 0x15, 0x18, 0x71, 0x23, 0x08, 0xC9, 0x50, 0xB2, 0xBD]
const valHigh = bytes[3] // 0x71
const valLow = bytes[1] // 0x15

const passHigh = (valHigh ^ k3) & 0xFF
const passLow = (valLow ^ k1) & 0xFF
const final = (passHigh << 8) | passLow

console.log(`OLD Code Final Password: ${final} (0x${final.toString(16)})`)
