# replace-inline-css


This library allows you to replace all inline-css (`<div style="...">`) of a given html file with a single css class


- Deletes all `style` properties from all the html elements
- Adds a `<style>{ ... }</style>` with new css classes, containing all inline styles
- Reuses classes when styles share the same properties and values
- ✨Magic ✨

## Installation

inline-css-replacer requires [Node.js](https://nodejs.org/) v10+ to run.

`yarn`:

```sh
$ yarn add replace-inline-css
```
`npm`:
```sh
$ npm install replace-inline-css
```

## Usage

Simply `require` the module and use it as a function.
```js
const replaceInlineCss = require('replace-inline-css');

replaceInlineCss({
    inputHtmlPath: './input.html',
    outputHtmlPath: './output.html',
});
```

##### input.html:
`style` attributes all over:

![Image of input.html](https://raw.githubusercontent.com/SaharAvr/replace-inline-css/assets/before.png)

##### output.html:
Removed all `style` attributes & added references to new css classes:

![Image of output.html](https://raw.githubusercontent.com/SaharAvr/replace-inline-css/assets/after.png)

New `<style>` section added to the `head`:

![Image of output.html](https://raw.githubusercontent.com/SaharAvr/replace-inline-css/assets/style.png)



## License

MIT

**Free Software, Hell Yeah!**
