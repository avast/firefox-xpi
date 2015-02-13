# firefox-xpi

Firefox extension packer for node.js

Nothing big, just to complement https://www.npmjs.com/package/crx and https://www.npmjs.com/package/safariextz

## Environment Setup

* Install [Firefox Add-on SDK](https://developer.mozilla.org/en-US/Add-ons/SDK/Tutorials/Installation)

## Usage

```
npm install -D firefox-xpi
```

```
var xpi = require('firefox-xpi');

xpi(packageName, extensionSrcDir, { sdkPath: firefox_addon_dir });
```

