# Stage 4: AI log

## Tools
- Gemini (Google)

## Conversations
- Discussed splitting the monolithic UI into reusable React components (`PlataCard`, `PlataList`), passing data via props, and implementing dynamic CSS classes based on transaction types and statuses.

## Key requests
### 1. Generating React Components from data
- **Asked**: How to replace the raw JSON list with actual UI cards rendered from the data array, making the app slightly more complex but manageable.
- **Got**: Created `PlataList.jsx` to map over the array using the `key` prop, and `PlataCard.jsx` to receive individual items via props. Added conditional rendering for an empty list state.
- **Changed or rejected**: Accepted the implementation. Kept the custom `activ` boolean logic from Stage 2 to dynamically set the "done" CSS class and text status ("Anulat" / "Plătit").

### 2. Dynamic styling and formatting
- **Asked**: Make the page a bit more complex without overdoing it.
- **Got**: Implemented a mapping object (`ETICHETE_FRECVENTA`) to translate raw data values (like 'none' or 'lunar') into user-friendly labels ("One-time", "Abonament Lunar") and dynamically generated badge classes.
- **Changed or rejected**: Used as provided. It perfectly ties the CSS variables defined in Stage 1 to the React logic in Stage 4.

## What I learned / what did not work
I learned how to break down a UI into independent components and pass data downwards using props. I also learned how to use the `map()` method in JSX to render lists, the critical importance of the `key` attribute to avoid React warnings, and how to use conditional rendering for empty states and dynamic CSS classes.