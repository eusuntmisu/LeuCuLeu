# Stage 8: AI log

## Tools
- Claude Code (Anthropic)

## Conversations
- Adapted the Stage 8 guide (routing and component styles) to LeuCuLeu: React Router with a shared layout, a detail page for each transaction, an about page and a 404 page, and moving the global stylesheet into CSS Modules.

## Key requests
### 1. Routes and shared layout
- **Asked**: Split the app into pages with React Router, using the resource from `tw.json`.
- **Got**: `BrowserRouter` in `main.jsx`; `App.jsx` holds only the route map (`/`, `/plati/:id`, `/despre`, `*`). `Layout.jsx` holds the header (logo, theme toggle, `NavLink` navigation with `data-testid="nav"`), the footer and the `<Outlet />`. The state and handlers from Stage 7 moved unchanged into `pages/PlatiPage.jsx`.
- **Changed or rejected**: Kept the theme toggle and the logo easter egg (Spiridus game) in the layout, so they work on every page. The transaction counter moved from the header to the list panel.

### 2. Detail page
- **Asked**: A detail page that shows more than the card.
- **Got**: `PlataDetaliuPage.jsx` reads the id with `useParams`, calls `fetchPlata(id)` and shows the type, frequency, due date, status, id and, for subscriptions, the estimated yearly cost (amount × payments per year), marked as saved when the subscription is cancelled. A missing id shows the 404 error from the server and a link back.
- **Changed or rejected**: The effect has `[id]` as dependency and does not call `setLoading(true)` directly, to avoid the `set-state-in-effect` lint rule.

### 3. CSS Modules
- **Asked**: Move the styles from `App.css` next to their components.
- **Got**: `App.css` became `index.css` (variables and shared classes only); each component and page has its `.module.css`, including the Spiridus game. Fixed values moved to `constants.js`. The card title became a `Link` with `data-testid="item-link"`.
- **Changed or rejected**: While splitting the stylesheet, fixed older bugs: a stray `}.list-header` selector, badge colours that only existed in dark mode, and a theme toggle that only recoloured the error box.

## What I learned / what did not work
<!-- complete with your own words -->
