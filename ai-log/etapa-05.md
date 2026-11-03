# Stage 5: AI log

## Tools
- Gemini (Google)

## Conversations
- Discussed making the application interactive by migrating data to `useState`, passing event handlers down the component tree, fixing CSS specificity issues for the Light/Dark mode toggle, and building a custom performance-friendly mini-game Easter egg.

## Key requests
### 1. Interactive list and local state
- **Asked**: How to implement checking and deleting items while keeping the header counter synchronized.
- **Got**: Refactored `App.jsx` to use `useState` for the initial array. Created immutable functions (`handleToggle` using `.map()` and `handleDelete` using `.filter()`) and passed them down as props to `PlataCard`.
- **Changed or rejected**: Accepted as provided. Implemented a controlled checkbox in the card component that reacts to the `activ` boolean state.

### 2. Light/Dark mode toggle and CSS fixes
- **Asked**: How to add a button that switches the theme and make the background pure white in Light mode.
- **Got**: Added a `useState` for the theme that updates `document.documentElement.dataset.theme`. Fixed severe CSS specificity conflicts by clearing Vite's default `index.css` and using `:root[data-theme="light"]` to override default system preferences.
- **Changed or rejected**: Had to iterate a few times on the CSS because the background wouldn't turn fully white. Solved it by forcing variable usage on the `body` and removing hardcoded colors from the inputs.

### 3. Custom Easter Egg mini-game
- **Asked**: Create a hidden "coin catching" game triggered by clicking the logo 5 times.
- **Got**: Created `SpiridusGame.jsx` with a 60 FPS game loop.
- **Changed or rejected**: Used `useRef` for the game physics instead of `useState` to prevent React from lagging out due to too many re-renders. Added `localStorage` to save the Highscore.

## What I learned / what did not work
I learned how to manage local state in React using `useState` and why state updates must always be immutable. I also discovered how tricky CSS specificity can be when overriding system themes (`prefers-color-scheme`), and why it's critical to clean up boilerplate code (like `index.css`). Furthermore, building the Easter egg taught me the difference between `useState` (for UI updates) and `useRef` (for fast, background variable tracking without re-rendering).