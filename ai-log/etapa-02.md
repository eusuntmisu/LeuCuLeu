# Stage 2: AI log

## Tools
- Gemini (Google)

## Conversations
- Added the core JavaScript logic following the immutable pattern, setting up the `plati` array and utilizing pure array methods (`map`, `filter`, `find`, `reduce`).

## Key requests
### 1. Generating data functions with numeric validation and custom features
- **Asked**: Build the JS data logic, ensuring expenses can have float values (> 0) and we can toggle "One-time" expenses to unpaid. Also requested a custom function to calculate the total spent for a specific month (e.g. Sept 2026).
- **Got**: A `plati.js` file featuring `adaugaPlata` which prevents 0 or negative values, an immutable `comutaStare` function, and a custom `calculeazaTotalPeLuna` method utilizing `reduce`. 
- **Changed or rejected**: Accepted the code entirely. Decided to map the requirement of "Activ / Gata" into `activ: true / false` to smoothly cover both active subscriptions and pending one-time payments.

## What I learned / what did not work
I learned how to manipulate lists without altering the original array by using the spread operator (`[...lista, nou]`) and object destructuring (`{...p, activ: !p.activ}`). I also learned how to read validation errors directly from the DevTools Console.