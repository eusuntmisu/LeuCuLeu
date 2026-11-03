# LeuCuLeu
A recurring expense and subscription manager designed to provide visibility over annual costs.
It allows users to track active subscriptions, update pricing, and calculate savings from canceled services.

## Data model

| Field | Type | Notes |
| :--- | :--- | :--- |
| **Name** | text | required, max 100 chars (e.g., Spotify, Gym) |
| **Status (Active/Canceled)** | boolean | toggled from the list, default false. Acts as the `done` flag indicating savings. |
| **Frequency** | fixed values | `Lunar`, `Anual`, `Trimestrial` |
| **Category** | relation | `Divertisment`, `Health`, `Productivity`, etc. |
| **Price** | numeric | The recurring cost value. |
| **Owner** | relation | the owner of the item |

## Sample data used across all stages:
1. "Spotify Family", Active, Lunar, Divertisment, 20 RON
2. "Abonament Sală", Canceled (.done), Lunar, Sănătate, 180 RON
3. "Licență Cloud / GitHub Pro", Active, Anual, Productivitate, 450 RON

## AI usage
- **Gemini**: Used in Stage 1 to draft the initial semantic HTML/CSS structures, write the baseline README documentation, and ensure compliance with Grid/Flexbox UI layout requirements. Used in Stage 2 to implement the immutable JavaScript data logic and array methods. Used in Stage 3 for Vite project initialization, migrating the logic to `App.jsx`, and troubleshooting PowerShell execution policies.

## How to run
cd frontend
npm install
npm run dev
Then open the address printed in the terminal (http://localhost:5173).

## Status Checklist (Stage 1)

| ID | Requirement | Where (permalink) | How to check |
| :--- | :--- | :--- | :--- |
| S1-R1 | README: description, fields, sample data, how to run | [Link to README.md](#) | read |
| S1-R2 | AI usage section | [Link to README.md](#) | read |
| S1-R3 | AI log for stage 1 | [Link to ai-log/etapa-01.md](#) | read |
| S1-R4 | header, form (text + select), 3 cards with own data | [Link to index.html](#) | open the page |
| S1-R5 | finished card looks different | [Link to style.css](#) (.done) | look at the card |
| S1-R6 | 2 columns on desktop, 1 under 700px | [Link to style.css](#) (@media) | resize < 700px |
| S1-R7 | visible focus, readable dark theme | [Link to style.css](#) | Tab; dark mode |
| S1-R8 | commit "Stage 1" pushed | [Link to commit](#) | commit history |

## Stage 2: data logic
Plain JavaScript, no DOM. `plati.js` holds the array and the functions that read and change it. Results are printed in the browser console (F12). Also includes custom logic for filtering out total spending by specific months (`calculeazaTotalPeLuna`).

## Status Checklist (Stage 2)

| ID | Requirement | Where (permalink) | How to check |
| :--- | :--- | :--- | :--- |
| S2-R1 | JS file linked, logs on page load | [Link to index.html](#) (script) | open page, F12 |
| S2-R2 | 3+ items with id, name, state, tag | [Link to plati.js](#) | read |
| S2-R3 | list, count, search, add, toggle, delete | [Link to plati.js](#) | console output |
| S2-R4 | add rejects empty name and invalid tag | [Link to plati.js](#) | last console lines |
| S2-R5 | original array unchanged after add | [Link to plati.js](#) | console line |
| S2-R6 | README Stage 2 section + AI log | [Link to README.md](#) | read |
| S2-R7 | commit "Stage 2" pushed | [Link to commit](#) | commit history |

## Stage 3: Vite and React project
The app now lives in `frontend/`, built with Vite. The data from stage 2 moved into the main component; the list is still printed raw.

## Status Checklist (Stage 3)

| ID | Requirement | Where (permalink) | How to check |
| :--- | :--- | :--- | :--- |
| S3-R1 | npm run dev starts without errors | [Link to frontend/package.json](#) | npm install, npm run dev |
| S3-R2 | app name and counter computed from data | [Link to frontend/src/App.jsx](#) | edit data, save |
| S3-R3 | data from README, not from the example | [Link to frontend/src/App.jsx](#) | compare with README |
| S3-R4 | stage 1 styles reused | [Link to frontend/src/App.css](#) | look at the page |
| S3-R5 | node_modules ignored, build passes | [Link to frontend/.gitignore](#) | npm run build |
| S3-R6 | README Stage 3 section + AI log | [Link to README.md](#) | read |
| S3-R7 | commit "Stage 3" pushed | [Link to commit](#) | commit history |

## Stage 4: components
The list is rendered from the data, through two components:
PlataList receives the whole array and renders one card per item[cite: 48]
PlataCard receives a single item through props and displays it[cite: 48]

## Status
- [x] Stage 3: Vite and React project[cite: 48]
- [x] Stage 4: components rendered from data[cite: 48]
Stage 5: local state and events[cite: 48]

## Status Checklist (Stage 4)

| ID | Requirement | Where (permalink) | How to check |
| :--- | :--- | :--- | :--- |
| S4-R1 | 2+ components in src/components/ | [Link to frontend/src/components/](#) | open folder[cite: 49] |
| S4-R2 | card receives data through props | [Link to PlataCard.jsx](#) | read[cite: 49] |
| S4-R3 | map + key={id}, no console warnings | [Link to PlataList.jsx](#) | F12, Console[cite: 49] |
| S4-R4 | message for empty list | [Link to PlataList.jsx](#) | set array to [][cite: 49] |
| S4-R5 | state changes the card look | [Link to PlataCard.jsx](#) | toggle a done flag[cite: 49] |
| S4-R6 | README Stage 4 section + AI log | [Link to README.md](#) | read[cite: 49] |
| S4-R7 | commit "Stage 4" pushed | [Link to commit](#) | commit history[cite: 49] |

## Stage 5: local state and events
Interactivity added through React state (`useState`). Users can toggle subscription status (Active / Canceled), delete subscriptions, and add new ones through a validated form. Status updates immediately reflect in the financial counters.

## Status Checklist (Stage 5)

| ID | Requirement | Where (permalink) | How to check |
| :--- | :--- | :--- | :--- |
| S5-R1 | list kept in state, updates on user action | [Link to frontend/src/App.jsx](#) | toggle/delete/add items |
| S5-R2 | form adds new item with validation (non-empty name, valid frequency/category) | [Link to frontend/src/components/PlataForm.jsx](#) | submit empty form vs valid data |
| S5-R3 | toggle status updates card style and active/savings counter | [Link to frontend/src/App.jsx](#) | click status button on a card |
| S5-R4 | delete removes item from state and list | [Link to frontend/src/App.jsx](#) | click delete button on a card |
| S5-R5 | state updates are immutable (no direct mutations) | [Link to frontend/src/App.jsx](#) | inspect state handlers (`map`, `filter`, spread) |
| S5-R6 | README Stage 5 section + AI log | [Link to README.md](#) | read |
| S5-R7 | commit "Stage 5" pushed | [Link to commit](#) | commit history |

## Stage 6: external API / backend integration
Data is persisted through an external API/mock backend (e.g. `json-server`, Express, or Firebase). The app handles asynchronous data fetching with `useEffect`, loading spinners, error states, and persistent CRUD operations (GET, POST, PATCH/PUT, DELETE).

## Status Checklist (Stage 6)

| ID | Requirement | Where (permalink) | How to check |
| :--- | :--- | :--- | :--- |
| S6-R1 | data fetched asynchronously on mount (`useEffect`) | [Link to frontend/src/App.jsx](#) | reload page, inspect Network tab |
| S6-R2 | loading indicator displayed while fetching | [Link to frontend/src/App.jsx](#) | slow 3G throttling in DevTools |
| S6-R3 | user-friendly error message if API fails | [Link to frontend/src/App.jsx](#) | shut down server / block request |
| S6-R4 | add, toggle, and delete persist changes to backend | [Link to frontend/src/App.jsx](#) | inspect POST/PATCH/DELETE requests |
| S6-R5 | README Stage 6 section + AI log | [Link to README.md](#) | read |
| S6-R6 | commit "Stage 6" pushed | [Link to commit](#) | commit history |