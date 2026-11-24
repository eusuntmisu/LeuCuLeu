# Stage 9: AI log

## Tools
- Claude Code (Anthropic)

## Conversations
- Adapted the Stage 9 guide (own backend with Node.js and Express) to LeuCuLeu: replacing json-server with an Express API for `/plati`, validating on the server, and removing json-server from the repository.
- In the same session, before the backend: a redesign of the monthly page, the sun/moon theme icon, a cancel/delete pair on the detail page, and subscriptions that repeat on their own.

## Key requests
### 1. Express project and routes
- **Asked**: Build the backend from the guide, for the `plati` resource from `tw.json`.
- **Got**: `backend/` with `package.json` (`type: module`, `start` and `dev` with `node --watch`), `.env.example`, `.gitignore`, and `src/app.js` (cors, `express.json()`, `/health`, the router, the 404 route and the error handler) separate from `src/server.js`. `src/routes/plati.js` holds the in-memory array (the README sample data) and the five routes, with `gasesteIndex` returning 400 for a bad id and 404 with "Plata nu există".
- **Changed or rejected**: The error handler also turns broken JSON in the request body into a 400 with a clear message, not a generic 500.

### 2. Server-side validation
- **Asked**: The validation from the guide, adapted to my fields.
- **Got**: `valideazaPlata` with a whitelist of fields: `nume`, `tip`, `frecventa`, `suma`, `data`, `finalizat`, `anulat`. The fixed values match `constants.js`. For PATCH, the rules between fields (a one-time expense has frequency `none`, only subscriptions can be canceled) are checked on the merged result, not just on what was sent. `data` defaults to today, because the checker's sample has no date.
- **Changed or rejected**: All error messages are joined into one `{ error }` string, as in the guide.

### 3. Paid flag and the Stage 7 checks
- **Asked**: Earlier in the session the paid checkbox had been replaced by a status computed from the date. The checker for S9-R4 reruns the Stage 7 toggle test on `item-toggle` and the `done` field.
- **Got**: The checkbox is back on the card, with a visible "Plătit" label, and toggles `finalizat` (`tw.json` unchanged). Canceling is a separate `anulat` field with its own button.
- **Changed or rejected**: I chose the manual paid checkbox over making the checkbox mean "canceled".

### 4. Repeating subscriptions without duplicates
- **Asked**: Subscriptions should show up next month on their own, but the automated test adds, deletes and reloads an item, and a saved copy for next month would break it.
- **Got**: The next payment is a forecast (`proiectii` in `recurente.js`), shown on the card and on the monthly page, and saved only when its date arrives (`platiDeGenerat`).

### 5. Removing json-server
- **Got**: Deleted `frontend/db.json`, the `api` script and the `json-server` dependency, then ran `npm install`. The root `package.json`, `package-lock.json` and the committed root `node_modules` (only json-server) were removed too, and a root `.gitignore` was added. `api.js` now reads `body.error` from failed responses.

## What I learned / what did not work
- Because every request was already in `api.js`, replacing json-server with my own Express server changed almost nothing in React: only reading the `{ error }` message.
- The form validation is not enough on its own: with curl anyone can send any data, so the server has to check everything again and keep only known fields.
- CORS is enforced by the browser, not by the server: curl worked, but the page opened on another port (5174) was blocked until the origin matched.
- Did not work at first: the page stayed white after the changes. The cause was not the code but a stale Vite dev server cache; restarting it with `npx vite --force` fixed it.
- I also had to rethink some features I added earlier in the stage, because the automated Stage 7 tests need the paid checkbox and must not find duplicate payments after adding one.
