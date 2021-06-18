<div align="center" >
  <br/>
  <br/>
  <h1>
  <svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" viewBox="0 0 35 35" fill="none" style="vertical-align:middle"><circle cx="17.5" cy="17.5" r="14.5" stroke="currentColor" stroke-width="2"></circle><path d="M12.8184 31.3218L31.8709 20.3218" stroke="currentColor"></path><path d="M3.31836 14.8674L22.3709 3.86743" stroke="currentColor"></path><path d="M8.65332 29.1077L25.9738 19.1077" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"></path><path d="M9.21582 16.0815L26.5363 6.08154" stroke="currentColor" stroke-linecap="round"></path><path d="M13.2334 14.2297L22.5099 21.1077" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"></path><path d="M16.6973 12.2302L25.9736 19.1078" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"></path><path d="M9.21582 16.0815L19.0459 23.1078" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"></path></svg>
  &nbsp;Stitches Native
  </h1>
  &middot;
  <i>React Native implementation of the popular CSS-in-JS library Stitches</i>
  &middot;
  <br/>
  <br/>
</div>

---

## Installation

> ⚠️ NOTE: This library is still under development and not yet published in npm.

```sh
npm install stitches-native
```

or if you use `yarn`:

```sh
yarn add stitches-native
```

## Documentation

For the most part Stitches Native behaves exactly as Stitches so you should follow the [Stitches documentation](https://stitches.dev/) to learn the basic principles and how to setup everything.

## Differences

Due to the inherit differences between the Web and native platforms the Stitches Native implementation differs slightly from the Web version of Stitches.

### Using `createCss` function

The `createCss` function doesn't need `prefix` or `insertionMethod` since they are not used in the native implementation.

```js
import { createCss } from 'stitches-native';

createCss({
  theme: object,
  media: object,
  utils: object,
  themeMap: object,
});
```

The return value of `createCss` doesn't include `global`, `keyframes`, `getCssString`, or `config` since they are not needed in native platforms.

```js
const { styled, css, theme } = createCss();
```

### Using `css` function

Unlike on the Web there is no concept of `className` in React Native so the `css` function is basically an identity function providing only TS types for the style object and returning exactly the same object back. The returned object can be spread to a styled component or into the css prop of a component.

```jsx
const styles = css({
  backgroundColor: '$background', // <- get autocomplete for theme values
});

const SomeComp = styled('View', {
  // ...other styles...
  ...styles,
});

<AnotherComp css={styles} />;
```

### Responsive `media` styles

TODO

### Theming with `theme`

TODO

### Missing features

- No locally scoped tokens
- No `global` function
- No `keyframes` function
- No `getCssString` function
