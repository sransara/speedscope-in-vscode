# Speedscope in VScode

VSCode extension for viewing speedscope flamegraphs.

[Speedscope](https://www.speedscope.app/) is:

> A fast, interactive web-based viewer for performance profiles.
> An alternative viewer for FlameGraphs.
> Will happily display multi-megabyte profiles without crashing your browser.
>
> from https://github.com/jlfwong/speedscope

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

- Use "Open with..." from VSCode File Explorer like a local file

### Open a Speedscope view with command: `speedscope-in-vscode.openSpeedscope`

### Directly open files

(if relative path assume it is relative to the file being viewed)

- Ctrl + click on a colored block to open the associated file
- Or click link to a file in the stack detail view

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
