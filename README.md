# AAR Transform
Extract and copy the contents from Android Archive (.aar) files.

## Installation
`npm install appc-aar-transform`

## Usage
This module is used to extract the contents of an Android Archive (.aar) to a desired location and optionally copy any bundled assets and libraries to a new location.

```js
var AarTransformer = require('appc-aar-transform');
var transformer = new AarTransformer(logger) // logger needs to be an instance of appc-logger
transformer.transform(options, function(err, result) {
  console.log(result.packageName); // package key from AndroidManifest.xml
  console.log(result.jars); // array of JAR files found in the Android Archive
});
```

### Options

| Option | Type | Description |
|--------|------| ------------|
| `aarPathAndFilename` | String | The path and filename pointing to the .aar file to process. |
| `outputPath` | String | Base directory where the .aar file will be extracted to. The actual content will be extracted into a sub-directory (basename of the AAR file). |
| `assetsDestinationPath` | String | (Optional) Copy all assets contained in the .aar to this path. |
| `libraryDestinationPath` | String | (Optional) Copy all libraries (.jar) contained in the .aar will to this path. |
| `sharedlibraryDestinationPath` | String | (Optional) Copy all shared libraries (.so) contained in the .aar to this path. |
