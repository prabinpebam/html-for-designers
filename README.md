# Code for Designers

A Figma-inspired HTML/CSS visualizer with a three-pane layout that helps designers and developers visualize and edit HTML and CSS in real-time.

![Code for Designers Screenshot](https://via.placeholder.com/800x400?text=Code+for+Designers+Screenshot)

## Features

- **Three-Pane Layout**: DOM tree view/HTML editor, live render preview, and CSS/properties inspector
- **Tree/Code Toggle**: Switch between visual DOM tree and raw HTML code
- **Monaco Editor Integration**: Powerful code editing with syntax highlighting
- **Real-time Editing**: See changes instantly reflected in the live preview
- **CSS Inspector**: Examine and modify CSS properties with a Figma-inspired interface
- **Dark/Light Mode**: Full theme support for comfortable viewing in any environment
- **Text Content Editing**: Direct editing of text content for selected elements
- **Figma-style UI**: Clean, modern interface inspired by the Figma design tool

## Getting Started

### Prerequisites

- Node.js (v14.0.0 or higher)
- npm (v6.0.0 or higher)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/code-for-designers.git
   cd code-for-designers
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to:
   ```
   http://localhost:5173
   ```

## Development

### Project Structure

```
├── src/
│   ├── App.tsx              # Main application component
│   ├── TreeView.tsx         # HTML tree view & code editor component
│   ├── LiveRender.tsx       # Live preview component
│   ├── CssInspector.tsx     # CSS and properties inspector
│   ├── DraggableGutter.tsx  # Resizable panel dividers
│   ├── DomCssSync.tsx       # DOM and CSS synchronization logic
│   ├── store.ts             # State management using Zustand
│   ├── types.ts             # TypeScript type definitions
│   ├── index.css            # Global styles and design tokens
│   └── ...
├── documentations/
│   ├── prd.md               # Product Requirements Document
│   └── figma-design-UI.md   # UI Design Documentation
└── ...
```

### Technologies Used

- **React**: UI library
- **TypeScript**: Type-safe JavaScript
- **Zustand**: State management
- **Monaco Editor**: Code editing
- **Tailwind CSS**: Utility-first CSS framework
- **Vite**: Fast development server and build tool

## Usage

### Working with the HTML Tree

1. Use the tree view to select and inspect elements
2. Toggle between tree and code view using the buttons in the left pane
3. Add new elements through the interface or by editing the HTML code

### CSS Inspection and Editing

1. Select an element to view its CSS properties
2. Switch between Properties, Text, and CSS tabs in the right pane
3. Edit text content directly in the Text tab
4. Use the Monaco editor in the CSS tab for advanced styling

### Real-time Preview

The center pane shows a live rendering of your HTML and CSS, with highlighting for selected elements and hover states.

## Deployment

This project is set up to deploy to GitHub Pages. Visit the live demo at [https://PrabinPebam.github.io/html-for-designers](https://PrabinPebam.github.io/html-for-designers)

To deploy your own version:

1. Update the `homepage` field in `package.json` with your GitHub username
2. Make sure the repository name in `vite.config.js` matches your repository name
3. Run `npm run deploy` to build and publish to GitHub Pages
4. In your GitHub repository settings, ensure GitHub Pages is enabled and pointing to the `gh-pages` branch

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Inspired by Figma's intuitive design interface
- Built with modern web technologies
- Created for designers and developers to bridge the gap between design and code
