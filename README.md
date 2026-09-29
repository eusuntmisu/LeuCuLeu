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
| **Owner** | relation | the owner of the item  |

## Sample data used across all stages:
1. "Spotify Family", Active, Lunar, Divertisment, 20 RON
2. "Abonament Sală", Canceled (.done), Lunar, Sănătate, 180 RON
3. "Licență Cloud / GitHub Pro", Active, Anual, Productivitate, 450 RON

## AI usage
- **Gemini**: Used in Stage 1 to draft the initial semantic HTML/CSS structures, write the baseline README documentation, and ensure compliance with Grid/Flexbox UI layout requirements.

## How to run
Open `index.html` in a modern browser. No build step, no server required for Stage 1.

## Status Checklist

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