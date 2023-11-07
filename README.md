# Polygon Scaffold Tool

## Contributing

### Building

To build the CLI tool, run:

```
npm run build
```

This will generate `cli.js` inside `bin` directory, which can they be installed globally with:

```
npm run install-global
```

After this, `poly-scaffold` will be available as a global binary.

### Dev environment

To modify this tool, a dev environment can be started by running:

```
npm run dev
```

This watches the source files, and bundles up the CLI app on every change, and installs it globally. In other words, the global `poly-scaffold` is always updated with your changes in the code.
