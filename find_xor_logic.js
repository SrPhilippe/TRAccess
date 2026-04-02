
const macA = [0xC9, 0xE5, 0x4F, 0xF5, 0xDB]
const targetF1 = 0x6B // 107
const targetF2 = 0xA1 // 161

// Search for F1 logic
const combinations = []
for (let i = 0; i < 5; i++) {
    for (let j = 0; j < 5; j++) {
        for (let k = 0; k < 5; k++) {
            const xorSum = macA[i] ^ macA[j] ^ macA[k]
            const mask = xorSum ^ targetF1
            // We are looking for a mask close to 0xAA (170) or F1=0xAA (170)
            if (Math.abs(mask - 0xAA) <= 20) {
                // console.log(`F1: mac[${i}] ^ mac[${j}] ^ mac[${k}] ^ 0x${mask.toString(16)} = target`);
            }
            combinations.push({ i, j, k, mask })
        }
    }
}

// Search for F2 logic
const combinationsF2 = []
for (let i = 0; i < 5; i++) {
    for (let j = 0; j < 5; j++) {
        for (let k = 0; k < 5; k++) {
            const xorSum = macA[i] ^ macA[j] ^ macA[k]
            const mask = xorSum ^ targetF2
            // We are looking for a mask close to 0x55 (85) or F2=0x55 (85)
            combinationsF2.push({ i, j, k, mask })
        }
    }
}


console.log("Analyzing potential mask changes from 0xAA (170) for F1:")
const f1Candidates = combinations.filter(c => c.mask === 0xAA || c.mask === (0xAA ^ 0xFF) || c.mask === 107)
if (f1Candidates.length > 0) console.log(f1Candidates)
else console.log("No exact 0xAA match found even with different indices.")

console.log("Analyzing potential mask changes from 0x55 (85) for F2:")
const f2Candidates = combinationsF2.filter(c => c.mask === 0x55 || c.mask === (0x55 ^ 0xFF) || c.mask === 161)
if (f2Candidates.length > 0) console.log(f2Candidates)
else console.log("No exact 0x55 match found even with different indices.")

// Check if F1/F2 are constant
console.log(`\nIs F1 constant 0x6B (107)?`)
console.log(`Is F2 constant 0xA1 (161)?`)

// Check Case B with proposed constants
const macB = [0xFD, 0xD8, 0x4E, 0x1D, 0x2E]
const propF1_B = 169 // 0xA9
const propF2_B = 196 // 0xC4
// Check if 0xFD can be derived via XOR
// F1 target 0xA9. XOR base: FD ^ D8 ^ 2E = 0x0B. Diff = 162 (0xA2). (Original 0xAA is 170).
// F2 target 0xC4. XOR base: 4E ^ 1D ^ 2E = 0x7D. Diff = 185 (0xB9). (Original 0x55 is 85).

// Conclusion: The XOR logic seems unlikely unless the mask is dynamic or indices are very different.
// More likely: 0xFD and 0xC9 are specific cases with fixed constants OR a new family.

console.log("\nChecking if 0xC9 and 0xFD fit into existing families if we change logic:")
// Autoclave Delta: F1=196, F2=181
// PHB: F1=175, F2=104
// Delta DOP: F1=63, F2=112
// Target A: F1=107, F2=161
// Target B: F1=169, F2=196

// Notice Target B F2 (196) is Autoclave Delta F1 (196).
// Notice Target B F1 (169) is '169' from date formula.
// Notice Target A F1 (107) is close to PHB F2 (104)? No.

console.log("Done.")
