# Development

## Setup

1. Clone this repository with submodules to include `external/speedscope`
   to include necessary patches from https://github.com/sransara/speedscope.

```
git clone --recurse-submodules https://github.com/sransara/speedscope-in-vscode
```

2. Get dependencies

```
npm install
npm run build-external-deps
```

3. We are ready to roll

```
# Build the extension
npx vsce package

# Run tests
npm run test
```

## How it works

We are using VSCode [Custom Editor](https://code.visualstudio.com/api/extension-guides/custom-editors)
and [WebView](https://code.visualstudio.com/api/extension-guides/webview)
functionality to embed the Speedscope UI within a VSCode window.

The `./external/speedscope/scripts/build-for-vscode.sh` bundles a single entrypoint HTML file
with assets linked using a specific string ("vscode-webview-url") for the `base-url`.

`src/editor-provider.ts` implements the `CustomEditorProvider` interface that
reads the entrypoint HTML file and replaces the `vscode-webview-url` string with
VSCodes `asWebviewUri` function.

WebViews are essentially iframes and we use messaging to communicate.

## Patches to speedscope

We have a few patches to speedscope to make it work with VSCode: https://github.com/sransara/speedscope

`external/speedscope/src/vscode.js` is inluded in the entry point HTML file and
sets up the messaging between VSCode and Speedscope.

Also override `console.log` to send the messages to CustomEditorProvider to get logged in a VSCode output channel.

`external/speedscope/src/views/application.tsx` has the hooks to loading files.

## RPC

We use a simple RPC mechanism to communicate between VSCode and Speedscope.

### TODO:

- Improve RPC with request IDs to help chain messages.
- Use a common typed interface to define the RPC messages.

```
Speedscope -> VSCode
{
   clientEvent: 'ready'
}

VSCode -> Speedscope
{
   serverCommand: 'openFile',
   filename: 'simple.prof',
   docbytes: Uint8Array(...)
}

Speedscope -> VSCode
{
   clientEvent: 'opennedFile',
}
or
{
   clientEvent: 'error',
}

Speedscope -> VSCode
{
   clientCommand: 'openFile',
   args: {
      file: string,
      line: number,
      col: number,
   }
}
```
