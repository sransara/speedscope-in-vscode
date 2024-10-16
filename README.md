# Speedscope in VSCode

VSCode extension for viewing [Speedscope](https://github.com/jlfwong/speedscope) flamegraphs.

## Why not just use the [Speedscope app](https://www.speedscope.app/)?

With this extension you can open Speedscope compatible files directly from VSCode and jump to the source code locations of the profiled functions.

## Installation

[Install from VSCode marketplace](https://marketplace.visualstudio.com/items?itemName=sransara.speedscope-in-vscode)

## Screenshot

![screenshot.jpg](./media/screenshot.jpg)

## Features

This extension extends [speedscope](https://github.com/jlfwong/speedscope) to be viewable from VSCode.

### Open [speedscope compatible files](https://github.com/jlfwong/speedscope/wiki)

- Right click particular file in VSCode File Explorer
- Select "Open with..."
- Select "Speedscope"

### Support opening remote files

- Use "Open with..." from VSCode File Explorer just like a local file

### Open a Speedscope view with command: `speedscope-in-vscode.openSpeedscope`

### From a Speedscope view jump to profiled source file locations

- Ctrl + click (Command + click on MacOS) on a colored block to open the associated file
- Or click link to a file in the stack detail view

(if relative path assume it is relative to the file being viewed)

## TODO

- Only files can be opened at the moment.
  Allow directories as inputs to support opening [Instruments traces](https://help.apple.com/instruments/mac/10.0/).

## Build from source

```
# Build deps
npm install
npm run build-external-deps
# Build extension
npx vsce package
```

## Development

See [DEVELOPMENT.md](DEVELOPMENT.md) for development and implementation details.

## Usage tips

- An example usage: Profile .NET MAUI Applications to Find Performance Issues: [Video](https://www.youtube.com/watch?v=-4VWRt_-PKw) and [Blogpost](https://community.devexpress.com/blogs/mobile/archive/2024/04/01/How-to-Profile-NET-MAUI-Applications-and-Isolate-Performance-Related-Issues.aspx) (Thanks to [@Alexgoon](https://github.com/sransara/speedscope-in-vscode/issues/5))
- To specify files with certain file extensions to be opened by default with this viewer within VSCode:

  Add the following in your workspace `settings.json`.

  ```
  {
    "workbench.editorAssociations": {
        "*.speedscope.json": "speedscope-in-vscode.speedscope"
    }
  }
  ```