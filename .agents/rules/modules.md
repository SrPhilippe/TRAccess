---
trigger: always_on
---

# TRAccess - Application Modules and Business Rules

This document explains the functionality and business logic of the core modules in the application.

## 1. App (`src/App.jsx`)

- **Purpose**: The main entry point of the React application.
- **Functionality**: It serves as a simple wrapper that renders the `Layout` component, delegating all UI rendering and state management to it.

## 2. Layout (`src/components/Layout.jsx`)

- **Purpose**: The main container and navigation wrapper for the application.
- **Functionality**:
  - **Theme Management**: Handles switching between Dark and Light themes. It checks `localStorage` for a saved user preference. If none exists, it falls back to the system preference (`prefers-color-scheme`). It dynamically updates the document's `data-theme` attribute and the `<meta name="theme-color">` tag to ensure proper browser styling.
  - **Tab Navigation**: Manages state for the currently active tab (`activeTab`), allowing the user to switch between "Senha" (`DailyPassword`), "Periódica" (`RemoveAlarm`), and "NewPass" (`NewPass`).
  - **Rendering**: Displays a top navigation bar containing a theme toggle button and tab selection buttons, followed by a content area where the selected component is rendered.

## 3. DailyPassword (`src/components/DailyPassword.jsx`)

- **Tab Name**: "Senha"
- **Purpose**: Generates a daily password based on a specific day and month.
- **Functionality**:
  - **Initialization**: On component mount, the input fields are automatically initialized to the current date (day and month).
  - **User Inputs**: Allows manual override of the `day` (1-31) and `month` (1-12) via numerical inputs.
  - **Password Calculation Formula**: Uses the input values to calculate a 4-digit numeric password.
    - **Formula**: `(169 * day) - (13 * month) + 351`
  - **Formatting**: The mathematical result is converted to a string and padded with leading zeros (e.g., `padStart(4, '0')`) to ensure it always displays exactly 4 digits.

## 4. RemoveAlarm (`src/components/RemoveAlarm.jsx`)

- **Tab Name**: "Periódica" (or "Remover alarme")
- **Purpose**: Generates a specific code used to remove an alarm, based on the last 5 digits of a Serial Number (S/N) and the current system date.
- **Functionality**:
  - **User Input**: Expects a string of exactly 5 numeric digits.
  - **Password Calculation Logic**:
    1. **Truncation**: Takes the 5-digit input and discards the last (5th) digit, leaving a 4-digit code.
    2. **Splitting**: Splits the remaining 4 digits into two 2-digit groups: `Group1` (first two digits) and `Group2` (last two digits).
    3. **Date Integration**: Adds the current system day, month, and 2-digit year to `Group2`.
       - `Total = Group2 + Current Day + Current Month + Current Year (YY format)`
    4. **Overflow Handling**: If the calculated `Total` exceeds 99 (i.e., it overflows 2 digits), it adds `1` to `Group1` and keeps the remainder (`Total % 100`) as the new `Group2`.
  - **Formatting**: The final output is formed by concatenating the modified `Group1` and the zero-padded `Group2`, yielding the final password.

## 5. Maintenance (`src/components/Maintenance.jsx`)

- **Purpose**: A placeholder UI component for features that are currently under development.
- **Functionality**: Displays an aesthetic, centered "Em Manutenção" (Under Maintenance) screen with a wrench icon, indicating that the feature is coming soon.

## 6. NewPass (`src/components/NewPass.jsx`)

- **Tab Name**: "NewPass"
- **Purpose**: Generates a Triaxx password (Senha) from a 10-byte HEX code.
- **Functionality**:
  - **User Input**: Expects a 10-byte hex string (entered via 10 two-character input fields).
  - **Password Calculation Logic**:
    1. **Parsing**: Splits the hex string into 10 individual bytes (b0 to b9).
    2. **Key Derivation**: 
       - `K1 = b5 ⊕ b8 ⊕ 0x23`
       - `K3 = b6 ⊕ b7 ⊕ b9 ⊕ 0x18`
    3. **Challenge XOR**: 
       - `low = b1 ⊕ K1`
       - `high = b3 ⊕ K3`
    4. **Final Combination**: 
       - `Senha = low + 256 * high`
  - **Formatting**: Output is displayed as an integer value representing the decoded Senha.
