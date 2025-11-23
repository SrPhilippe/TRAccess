const getBit = (val, n) => (val >> n) & 1

const calculateHardwareKeys = (b5, b6, b7, b8) => {
    const f1_bits = Array(8).fill(0)
    f1_bits[0] = getBit(b5, 1) ^ getBit(b5, 3) ^ getBit(b5, 5) ^ getBit(b5, 6) ^ getBit(b6, 0) ^ getBit(b6, 1) ^ getBit(b7, 0)
    f1_bits[1] = getBit(b5, 0) ^ getBit(b5, 1) ^ getBit(b5, 3) ^ getBit(b5, 7) ^ getBit(b6, 2) ^ getBit(b6, 3)
    f1_bits[2] = getBit(b5, 2) ^ getBit(b5, 3) ^ getBit(b5, 6) ^ getBit(b5, 7) ^ getBit(b6, 0) ^ getBit(b6, 3) ^ getBit(b6, 6) ^ getBit(b8, 1)
    f1_bits[3] = getBit(b5, 0) ^ getBit(b5, 2) ^ getBit(b5, 3) ^ getBit(b5, 4) ^ getBit(b5, 6) ^ getBit(b6, 2) ^ getBit(b8, 1)
    f1_bits[4] = getBit(b5, 0) ^ getBit(b5, 1) ^ getBit(b5, 2) ^ getBit(b5, 4) ^ getBit(b5, 6) ^ getBit(b6, 3) ^ getBit(b6, 6) ^ getBit(b7, 0)
    f1_bits[5] = getBit(b5, 0) ^ getBit(b5, 1) ^ getBit(b5, 2) ^ getBit(b6, 1) ^ getBit(b6, 6) ^ getBit(b7, 0) ^ getBit(b8, 1)
    f1_bits[6] = getBit(b5, 0) ^ getBit(b5, 3) ^ getBit(b5, 4) ^ getBit(b6, 0) ^ getBit(b6, 1) ^ getBit(b6, 2) ^ getBit(b6, 6) ^ getBit(b7, 0)
    f1_bits[7] = getBit(b5, 0) ^ getBit(b5, 1) ^ getBit(b5, 5) ^ getBit(b6, 0) ^ getBit(b6, 1) ^ getBit(b6, 6) ^ getBit(b8, 1)

    let F1 = 0
    for (let i = 0; i < 8; i++) F1 |= (f1_bits[i] << i)

    const f2_bits = Array(8).fill(0)
    f2_bits[0] = getBit(b5, 2) ^ getBit(b5, 4) ^ getBit(b5, 6) ^ getBit(b5, 7) ^ getBit(b6, 0) ^ getBit(b6, 1) ^ getBit(b7, 0) ^ getBit(b8, 1)
    f2_bits[1] = getBit(b5, 0) ^ getBit(b5, 1) ^ getBit(b5, 2) ^ getBit(b5, 5) ^ getBit(b6, 0) ^ getBit(b6, 1) ^ getBit(b6, 2) ^ getBit(b6, 3) ^ getBit(b8, 1)
    f2_bits[2] = getBit(b5, 1) ^ getBit(b5, 3) ^ getBit(b5, 5) ^ getBit(b5, 6) ^ getBit(b6, 0) ^ getBit(b6, 3) ^ getBit(b6, 6) ^ getBit(b8, 1)
    f2_bits[3] = getBit(b5, 0) ^ getBit(b5, 3) ^ getBit(b5, 6) ^ getBit(b6, 1) ^ getBit(b6, 2) ^ getBit(b6, 6) ^ getBit(b8, 1)
    f2_bits[4] = getBit(b5, 0) ^ getBit(b5, 1) ^ getBit(b5, 6) ^ getBit(b6, 0) ^ getBit(b6, 3) ^ getBit(b6, 6) ^ getBit(b8, 1)
    f2_bits[5] = getBit(b5, 1) ^ getBit(b5, 2) ^ getBit(b5, 4) ^ getBit(b6, 0) ^ getBit(b6, 1) ^ getBit(b6, 3) ^ getBit(b6, 6) ^ getBit(b8, 1)
    f2_bits[6] = getBit(b5, 0) ^ getBit(b5, 1) ^ getBit(b5, 2) ^ getBit(b5, 3) ^ getBit(b5, 4) ^ getBit(b5, 7) ^ getBit(b6, 1) ^ getBit(b6, 3) ^ getBit(b6, 6)
    f2_bits[7] = getBit(b5, 0) ^ getBit(b5, 5) ^ getBit(b5, 7)

    let F2 = 0
    for (let i = 0; i < 8; i++) F2 |= (f2_bits[i] << i)

    return { F1, F2 }
}

const calculateTriaxx = (day, month) => (169 * day) - (13 * month) + 351

const generate = (hex, day, month) => {
    const bytes = hex.split('-').map(b => parseInt(b, 16))
    const b1 = bytes[1]
    const b3 = bytes[3]
    const b5 = bytes[5]
    const b6 = bytes[6]
    const b7 = bytes[7]
    const b8 = bytes[8]

    const triaxx = calculateTriaxx(day, month)
    const tHigh = Math.floor(triaxx / 256)
    const tLow = triaxx % 256

    const { F1, F2 } = calculateHardwareKeys(b5, b6, b7, b8)

    const k3 = tHigh ^ F1
    const k1 = tLow ^ F2

    const senhaHigh = b3 ^ k3
    const senhaLow = b1 ^ k1

    return (senhaHigh * 256) + senhaLow
}

// Test for 23/11
console.log("Result:", generate("00-F1-18-94-23-04-D8-4F-1D-2E", 23, 11))
