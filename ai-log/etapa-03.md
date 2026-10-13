# Stage 3: AI log

## Tools
- Gemini (Google)

## Conversations
- Step-by-step instructions for initializing the Vite + React project, removing Vite boilerplate files, migrating Stage 1 UI and Stage 2 data to `App.jsx`, and troubleshooting PowerShell execution policy errors.

## Key requests
### 1. Step-by-step guide for Stage 3
- **Asked**: Provide a clear, step-by-step guide to migrate the project to Vite & React according to the Stage 3 PDF guidelines.
- **Got**: A structured plan including moving old files to a `mockup` folder, creating the Vite app, cleaning up `assets/` and `index.css`, and structuring `App.jsx`.
- **Changed or rejected**: Accepted the guide. Successfully updated `App.css` to use a 1-column grid since the form is temporarily hidden in this stage.

### 2. PowerShell npm execution error
- **Asked**: How to fix the `UnauthorizedAccess` (PSSecurityException) error when trying to run `npm create vite@latest` in VS Code.
- **Got**: Explanation that Windows PowerShell blocks external scripts by default, and a fix using `Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned` or switching to Git Bash.
- **Changed or rejected**: Applied the PowerShell execution policy fix and successfully initialized the Vite project.

### 3. Cleaning up index.html
- **Asked**: What code to put inside the new `frontend/index.html` after removing the Vite boilerplate.
- **Got**: The cleaned-up HTML structure with `lang="ro"`, updated `<title>LeuCuLeu</title>`, and the Vite icon link removed.
- **Changed or rejected**: Used exactly as provided.

## What I learned / what did not work
I learned how to set up a modern React environment using Vite and npm. I experienced and resolved a common Windows PowerShell security policy issue regarding script execution. I also learned the basic syntax differences between standard HTML and JSX, such as using `className` instead of `class` and rendering JavaScript variables directly into the UI using curly braces.