# Stage 7: AI log

## Tools
- Claude Code (Anthropic)

## Conversations
- Adapted the Stage 7 guide (form and validation) to LeuCuLeu: moving add/toggle/delete to the server, making the form controlled, validating it, and preparing the app for automated checking with `tw.json` and `data-testid` attributes.

## Key requests
### 1. API layer
- **Asked**: Extend `api.js` with the operations from the guide, for the `plati` resource.
- **Got**: A common `request` function (JSON header, `res.ok` check, 204 handling) and `fetchPlati`, `createPlata`, `updatePlata`, `deletePlata` on top of it.
- **Changed or rejected**: Accepted as is.

### 2. Controlled form with validation
- **Asked**: Rewrite `PlataForm` so it is controlled and validated, with errors shown in the page.
- **Got**: Every field in state with `value`/`onChange`; `valideaza()` checks the name (required, max 100), the amount (positive, max 1,000,000), the year (2020–2030) and that the day exists in the selected month. The button is disabled while saving and the form is cleared only after the server confirms. The id is no longer generated with `Date.now()`; it comes from json-server.
- **Changed or rejected**: Kept my custom date picker and the transaction type / frequency logic.

### 3. Status field and automated checking
- **Asked**: How to fill `tw.json` for my data model.
- **Got**: The status field was renamed from `activ` to `finalizat` (true = cancelled/paid), so that a checked checkbox means `done: true`, as the checker expects. Added `tw.json` and the `data-testid` attributes from table 7.3 (`form-tip`, `form-frecventa`, `form-suma` for the extra fields). `json-server` was also installed in `frontend/package.json`, since `npm ci` runs there.
- **Changed or rejected**: New items are appended at the end of the list, as in the guide.

## What I learned / what did not work
- A form is only reliable when it is controlled: with `value` + `onChange` on every field, the state is the single source of truth, so validating and clearing the form is just reading and resetting state.
- Updating the list only with what the server returned (instead of changing the state first) means the page never shows something that was not saved.
- Checking that the day exists in the month (no 30 February) needed its own rule; the basic required/positive checks were not enough.
- Did not work at first: my status field (`activ`) meant the opposite of the checker's `done` flag, so I had to rename it to `finalizat` before `tw.json` made sense.
