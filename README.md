# Multiple Select Filter

This project takes an array of product groups and displays them in a multi-select component.

## Used stack

- Next.js
- React Query
- Typescript
- SASS
- Jest

## Project setup

```
yarn install
```

### Compiles and hot-reloads for development

```
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Compiles and minifies for production

```
yarn build
```

### Lints files

```
yarn lint
```

### Runs unit tests

```
yarn test
```

### To do next

This project is in its infancy and there are many possibilities for fast follow up features (the below is not a comprehensive list, and not necessarily in order of priority):

- Telemetry (error logging, event logging, performance monitoring etc. to help us understand how users are interacting with the feature and how the feature is performing from a technical perspective).
- Improve loading and error states - for now the component displays only placeholders for both, but we can imagine a more engaging loading state and more helpful / user friendly errors.
- An initial attempt was made to utilise a design system (through some styling variables) but this can be improved with more information. More information about the design system would enable us to make the variables more semantic, and we could extend the variables to include semantic spaces / fonts and more.
- Implement I18n - for now the project has some hard coded text, but could be updated to support multiple languages.
