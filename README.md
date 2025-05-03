# entain-test

Single page application that displays 'Next to go’ races using Neds API.

A user should see 5 races at all times, and they should be sorted by time ascending. Race
should disappear from the list after 1 min past the start time (`advertised_start`).
User should see meeting name (`meeting_name`), race number (`race_number`) and
countdown timer that indicates the start of the race.
User should be able to toggle race categories to view races belonging to only the selected
category.

## Recommended IDE Setup

VSCode or IntelliJ IDEA

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Type-Check, Compile and Minify for Production

```sh
npm run build
```

### Run Unit Tests with [Vitest](https://vitest.dev/)

```sh
npm run test:unit
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```

### Local URL access

http://localhost:5173/
