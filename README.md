# firefox-xpi

Firefox extension packer for node.js for both add-on sdk and web extensions.

Nothing big, just to complement [crx](https://www.npmjs.com/package/crx) and [safariextz](https://www.npmjs.com/package/safariextz)

## Usage

```
npm install -D firefox-xpi
```

```
var xpi = require('firefox-xpi');

xpi(packageName, extensionSrcDir);
```

Output:
* A xpi for add-on sdk extensions
* A ready-to-sign zip for web extensions
