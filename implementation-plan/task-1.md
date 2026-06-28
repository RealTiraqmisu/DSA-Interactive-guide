# Task 1: Color Contrast & Semantic Styling Checklist (Completed)

- [x] **Adjust Design Variables in [styles.css](file:///c:/Users/noey/Desktop/DSA-Interactive-guide/styles.css)**
  - [x] Increase dark-mode text contrast: Set `--text-secondary` to `#cbd5e1` (slate-300) and brighten `--text-muted` for better readability.
  - [x] Retain original neon colors (`--accent-blue`, `--accent-purple`, etc.) but ensure their light-mode overrides are dark and saturated enough for high legibility.
  - [x] Set neutral borders (`--border-color`) as the default for structural elements (cards, accordions) to reduce visual clutter.

- [x] **Implement Semantic Callout Classes in [styles.css](file:///c:/Users/noey/Desktop/DSA-Interactive-guide/styles.css)**
  - [x] Create clean, high-contrast semantic helper classes:
    - `.alert-info` / `.alert-concept` (Blue/Cyan) - Explanations & Interactivity.
    - `.alert-warning` / `.alert-tip` (Amber/Orange) - Pro-tips & Important notes.
    - `.alert-success` (Green) - Correct answers & Passed tests.
    - `.alert-danger` (Red) - Errors & C pitfalls.
    - `.alert-advanced` (Purple) - Advanced deep-dives.
  - [x] Remove excessive text-shadow and box-shadow glows from static headers, icons, and borders.

- [x] **Clean Up and Refactor [week1.html](file:///c:/Users/noey/Desktop/DSA-Interactive-guide/week1.html)**
  - [x] Remove inline styling attributes that hardcode backgrounds or borders.
  - [x] Apply the new semantic callout classes to all tips, warnings, and info boxes.
  - [x] Style C-code blocks with a subtle red border/accent, and Python-code blocks with a blue/cyan border/accent to clearly denote the comparison.
  - [x] Ensure syntax highlighting contrast is excellent in both Light and Dark modes.

- [x] **Verify and Review**
  - [x] Review the page in both Light and Dark modes to ensure it is clean, structured, and easy on the eyes.
