# Token Buddy

## Overview

This is a React-based web application that allows users to create custom color palettes and generate corresponding CSS variables. It supports features like contrast generation, color inversion, and edge inclusion for more flexible and comprehensive palette creation.

## Features

- **Dynamic Color Sections**: Add, update, and remove color sections with ease.
- **Contrast Generation**: Automatically generate contrasting color variants.
- **Color Inversion**: Invert colors for different themes.
- **Edge Inclusion**: Include edge colors for extreme light and dark shades.
- **CSS Variable Generation**: Generate CSS variables for the defined color palettes.
- **Local Storage**: Save and load palettes from local storage.
- **Export/Import**: Export palettes to JSON and import them back.

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/markwylde/token-buddy.git
   cd token-buddy
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

## Usage

1. **Add a Section**: Click the "Add Section" button to create a new color section.
2. **Update Section**: Enter a name and choose a base color for the section. Use checkboxes to toggle features like contrast generation, color inversion, and edge inclusion.
3. **Reorder Sections**: Use the up and down arrows to move sections.
4. **Remove Section**: Click the "Remove" button to delete a section.
5. **Generate CSS**: Click the "Copy" button to copy the generated CSS variables to the clipboard.
6. **Export/Import Palettes**: Use the "Export" button to download the current palette as a JSON file. Use the file input to import a previously saved palette.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Contact

For questions, please open an issue in the [GitHub repository](https://github.com/markwylde/token-buddy/issues).

Enjoy creating beautiful color palettes!
