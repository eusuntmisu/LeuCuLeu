# Stage 1: AI log

## Tools
- Gemini (Google)

## Conversations
- Initial planning and boilerplate setup for the HTML/CSS mockup (Grid, Flexbox, UI requirements). 

## Key requests
### 1. Generating semantic markup and CSS variables
- **Asked**: Create the initial static mockup for "LeuCuLeu" subscription manager, adhering to a 1fr 2fr Grid layout on desktop, dark mode support via CSS variables, and implementing the 3 specific test items (one being canceled).
- **Got**: A fully structured `index.html` using `<header>`, `<main class="container">`, `<section>`, and `<form>`, alongside a complete `style.css` matching all aesthetic and responsive layout requirements.
- **Changed or rejected**: Accepted as generated, but ensured that the specific numeric fields for "Price" (Preț) were clearly visible next to the item titles to reflect the financial tracking nature of the app.

## What I learned / what did not work
I learned how to efficiently utilize CSS `:root` variables to toggle between light and dark themes strictly via `@media (prefers-color-scheme: dark)` without duplicating property declarations. Additionally, utilizing Flexbox inside Grid cells provided a clean separation of layout versus component alignment.