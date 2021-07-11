<p align='center'>
  <img src="media/logo.jpg" alt="Stitches Native logo"/>
<p/>

<div align="center" >
  <br/>
  <h1>
    Stitches Native
  </h1>
  &middot;
  <i>React Native implementation of the popular CSS-in-JS library Stitches</i>
  &middot;
  <br/>
  <br/>
  <br/>
</div>

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

TODO: add documentation...

### Theming with `theme`

TODO: add documentation...

### Missing features

- No locally scoped tokens
- No `global` function
- No `keyframes` function
- No `getCssString` function
