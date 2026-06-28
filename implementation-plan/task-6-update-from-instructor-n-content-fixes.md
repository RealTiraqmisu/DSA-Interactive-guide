# task-6-update-from-instructor-n-content-fixes

## Purpose

Use this plan to finish the instructor-requested content fixes in week 1 and the two late task-4 cleanup items.

## What Must Change

1. Add a dedicated Python functions accordion to [week1.html](../week1.html).
2. Add a standalone recursion teaching card that explains how a function calls itself.
3. Fix unreadable code text inside compare blocks in [styles.css](../styles.css).
4. Keep the week 1 header on the new `3 Reasons Why Python for DSA` wording.

## Implementation Plan

### 1. Add the Functions accordion in Module 1

- [x] Insert a new accordion between Control Flow & Loops and Try-Except in [week1.html](../week1.html).
- [x] Title it `Functions: Defining & Calling`.
- [x] Teach the following in order:
  - `def` syntax compared with typed C functions
  - parameters and multiple return values
  - default arguments
  - keyword arguments
  - `*args` and `**kwargs`
- [x] End the section with a Python live editor that students can edit and run.
- [x] Keep the examples aligned with the existing compare-block style already used on the page.

### 2. Add a recursion self-call card in Module 2

- [x] Insert a new card after `C vs Python Recursion Syntax` and before the interactive recursion visualizer in [week1.html](../week1.html).
- [x] Title the card `How a Recursive Function Calls Itself`.
- [x] Explain in plain English that recursion happens when a function calls its own name from inside its body.
- [x] Show an annotated `factorial(n)` example that marks the function definition, base case, and recursive call.
- [x] Add three runnable live-editor examples:
  - `factorial(5)` -> `120`
  - `sum_list([1,2,3,4])` -> `10`
  - `power(2, 8)` -> `256`
- [x] Use the existing `runLiveCode()` approach so the new examples behave like the rest of the Python editors.

### 3. Fix code-compare-block readability

- [x] Update `.code-compare-block pre` in [styles.css](../styles.css) so code text is always visible.
- [x] Add `color: #e2e8f0 !important;` there so the text stays readable on the dark red and dark blue compare blocks.
- [x] Confirm the light-mode styling still overrides correctly where needed.

### 4. Keep the section copy aligned

- [x] Keep the heading text as `3 Reasons Why Python for DSA`.
- [x] Keep the subtitle consistent with the three-reason structure.
- [x] Do not change the surrounding course-introduction copy.

## Acceptance Criteria

- The Functions accordion is visible in Module 1 and contains a working live editor.
- The recursion section now teaches recursive self-calls explicitly, not just syntax.
- All three recursion examples run and produce the expected results.
- Code in compare blocks is readable in both dark and light mode.
- The top section still reads `3 Reasons Why Python for DSA`.

## Verification Steps

1. Open `http://localhost:8000/week1.html`.
2. Expand the Functions accordion and confirm each compare block is readable.
3. Run the Functions live editor and confirm it executes.
4. Scroll to the recursion section and confirm the new self-call card appears before the visualizer.
5. Run the three recursion examples and confirm outputs `120`, `10`, and `256`.
6. Toggle light mode and confirm no compare block text disappears.
7. Confirm the heading and subtitle still use the new `3 Reasons Why Python for DSA` wording.

## Notes For The Next Editor

- Use the existing page structure instead of introducing a new layout pattern.
- Keep the new content short and instruction-focused, because this page is meant to help students move from C to Python quickly.
- If you change any live-editor ids, keep them consistent with the current `runLiveCode()` wiring.
