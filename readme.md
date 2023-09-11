# Random logo Generator

Generate a random logo as an image or SVG file.

## Installation

```bash
npm install
```

## Usage

```bash
# call using bash from terminal
chmod +x logos.js
./logos.js [options]

# call using node from terminal
node logos.js [options]
```

## Logo Generator CLI Options

Options can be added to the CLI call to customize the logo. Order does not matter.

| Short Flag | Long Flag    | Description                          | Type    |
| ---------- | ------------ | ------------------------------------ | ------- |
| `-n`       | `--numlogos` | Number of logos to generate          | number  |
| `-w`       | `--width`    | Width of the canvas                  | number  |
| `-h`       | `--height`   | Height of the canvas                 | number  |
| `-s`       | `--shape`    | Shape of the logo                    | string  |
| `-b`       | `--border`   | Border width                         | number  |
| `-t`       | `--text`     | Text to display on the logo          | string  |
| `-f`       | `--format`   | Format of the logo (png/svg/jpg/gif) | string  |
| `-c`       | `--color`    | Color of the logo shape (hex)        | string  |
|            | `--help`     | Show help                            | boolean |
| `-v`       | `--version`  | Show version number                  | boolean |
