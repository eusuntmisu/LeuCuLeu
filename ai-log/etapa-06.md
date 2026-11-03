# Stage 6: AI log

## Tools
- Gemini (Google)

## Conversations
- Discussed moving the hardcoded React data to a simulated REST API using `json-server`, configuring environment variables, making HTTP requests, and handling component lifecycles to display loading and error states.

## Key requests
### 1. Setting up the mock API
- **Asked**: How to configure `json-server` and migrate my data.
- **Got**: Created `db.json` with 5 varied transactions. Installed `json-server@0.17.4` specifically and added the `"api"` script to `package.json` to run it on port 3001.
- **Changed or rejected**: Accepted the strict version requirement for `json-server` to avoid unexpected bugs with ID generation in newer versions.

### 2. Fetching data and using environment variables
- **Asked**: How to load the data from the server into the app when the page opens.
- **Got**: Created `api.js` to handle `fetch` requests using `async/await` and checking `res.ok`. Added an `.env.example` file to document the `VITE_API_URL`.
- **Changed or rejected**: Accepted the setup. Used `useEffect` in `App.jsx` to call the fetch function strictly on component mount (empty dependency array).

### 3. Handling network states
- **Asked**: How to handle scenarios where the data takes time to load or the server is off.
- **Got**: Implemented conditional rendering in `App.jsx` using `loading` and `error` states. Added specific CSS classes to make the error message stand out.
- **Changed or rejected**: Implemented the `ignore` boolean flag (cleanup function) inside `useEffect` to prevent state updates on unmounted components and to handle React Strict Mode's double-mounting behavior properly.

## What I learned / what did not work
I learned how to simulate a backend environment using `json-server` and how to run multiple terminal processes concurrently. I learned how to use the `useEffect` hook to fetch data asynchronously when a component mounts, and the critical importance of the cleanup function (`ignore = true`) to prevent race conditions. Most importantly, I learned that network requests always have three states (loading, success, error) and that a modern UI must handle and display all of them gracefully rather than showing a blank page.