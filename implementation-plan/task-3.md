# Task 3: Sidebar, Navigation & Header Improvements

- [x] **Notion-Style Sidebar Toggle**
  - [x] Move the sidebar toggle button from the middle-right edge of the sidebar into the sidebar header as a clean, hoverable collapse button (`.sidebar-collapse-btn` with `fa-solid fa-angles-left`).
  - [x] Add a corresponding expand button (`.sidebar-expand-btn` with `fa-solid fa-angles-right`) in the main header (hidden by default).
  - [x] Change the collapse behavior in CSS: collapse the sidebar to `0px` width (completely hidden) instead of `72px`, ensuring the main content area smoothly expands to fill the screen.
  - [x] Update the toggle event listener in `app.js` to support the new collapse/expand buttons and classes.

- [x] **Sidebar Title Update**
  - [x] Remove the generic "DSA Course" title from the sidebar header.
  - [x] Replace it with a dynamic/specific title: **Week 1** with the subtitle **Python & Recursion** (matching the content of `week1.html`).

- [x] **"Back to Home" Button Redesign**
  - [x] Redesign the back button next to "Python Programming Guide" in the header to clearly indicate it returns to the home dashboard.
  - [x] Change it from a simple circular left-arrow button to a pill button containing a house icon and the text "Dashboard" (e.g., `<i class="fa-solid fa-house"></i> Dashboard`).
  - [x] Add smooth hover transitions and styling to make it look premium.

- [x] **Section Navigation (Next / Previous Buttons)**
  - [x] Implement a dynamic section navigation footer at the bottom of each section in `week1.html` using JavaScript in `app.js`.
  - [x] Dynamically read the sidebar navigation items to generate the correct "Previous" and "Next" buttons for each section, displaying the target section's title (e.g., `← Previous: Course Introduction` and `Next: Module 1: Python Basics →`).
  - [x] Style the navigation buttons as premium, card-like blocks at the bottom of the content area with smooth hover animations.

- [x] **Follow-up Adjustments**
  - [x] Adjust collapsed sidebar width to `68px` and keep it visible (with vertical divider line).
  - [x] Hide text in nav items when collapsed, showing only the centered icons.
  - [x] Use a single toggle button in the sidebar header that rotates 180 degrees when collapsed (replacing the graduation cap icon's position).
  - [x] Enable navigation by clicking icons in the collapsed sidebar without expanding it.
  - [x] Change the "Next Section" button style to a high-contrast primary blue button.
  - [x] Update the subtitle in the sidebar header to **Introduction & Basic Python**.

- [x] **Header Buttons Redesign**
  - [x] Move the "Back to Home" button from the left side of the header to the right side (next to the theme toggle).
  - [x] Remove the text-reveal hover effect from all three header-right buttons (Dashboard, Theme Toggle, Terminal Console).
  - [x] Make them static-sized (e.g., `38px` height) where the Dashboard button has static text "Back to Dashboard" and the others are icon-only to prevent layout shifting and make them easy to click.
  - [x] Use native browser tooltips (`title` attribute) to display the button names on hover.
