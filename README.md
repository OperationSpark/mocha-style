# Custom mocha styles

This is a simple package that includes some additional style/functionality to the mocha test runner.

## Include in your project

To include this package in your project, simply add the following to the `<head>` of your html test file

### Styles

```html
<link
  rel="stylesheet"
  href="https://cdn.jsdelivr.net/gh/OperationSpark/mocha-style@main/mocha.css"
/>
```

### Syntax highlighting

```html
<script src="https://cdn.jsdelivr.net/gh/OperationSpark/mocha-style@main/injectStyles.js"></script>
```

### Example

```html
<!DOCTYPE html>
<html>
  <head>
    ...
    <link
      rel="stylesheet"
      href="https://cdn.jsdelivr.net/gh/OperationSpark/mocha-style@main/mocha.css"
    />

    <script
      src="https://cdn.jsdelivr.net/gh/OperationSpark/mocha-style@main/injectStyles.js"
      defer
    ></script>

    ...
  </head>
  ...
</html>
```

### Automatically run mocha tests

Make sure to add the `runMocha` attribute to the script tag to automatically run the mocha tests. It should be located below the mocha script and above the test scripts.

```hbs
...
<script
  src="https://cdn.jsdelivr.net/gh/OperationSpark/mocha-style@main/injectStyles.js"
  runMocha {{ '<- Add `runMocha` attribute to automatically run mocha tests' }}
  defer  {{ '<-Remove the `defer` attribute' }}
></script>
...
```

## Preview

### Light Mode

![Preview Light Mode](img/light-mode-preview.png)

### Dark Mode

![Preview Light Mode](img/dark-mode-preview.png)

## Update CDN

To update the CDN, simply push the changes to the main branch and the CDN will automatically update.

To update sooner, you can purge the CDN cache by visiting the following link: [jsdelivr.com/tools/purge](https://www.jsdelivr.com/tools/purge)

Enter the following URLs and click "Purge"

```
https://cdn.jsdelivr.net/gh/OperationSpark/mocha-style@main/mocha.css
https://cdn.jsdelivr.net/gh/OperationSpark/mocha-style@main/injectStyles.js
```
