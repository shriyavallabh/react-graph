# Knowledge Graph Visualization

A React-based knowledge graph visualization tool that displays extracted entities and relationships from codebase analysis.

## Features

- **Entity Visualization**: Display code entities (classes, functions, variables, modules, endpoints, models)
- **Relationship Mapping**: Show relationships between entities with directional arrows
- **Quality Analysis**: Color-coded nodes based on confidence scores
  - 🔴 Red: Critical issues (confidence < 0.5)
  - 🟡 Orange: Warnings (0.5-0.8 confidence)
  - 🟢 Green: Good quality code (≥ 0.8 confidence)
- **Interactive Tooltips**: Hover to see detailed information about each entity
- **3D Visualization**: Interactive 3D graph with zoom and pan controls

## Prerequisites

Before you begin, ensure you have the following installed on your system:

- **Node.js** (version 18 or higher) - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js) or **yarn**
- **Git** - [Download here](https://git-scm.com/)

## Installation & Setup

### 1. Clone the Repository

```bash
# Clone the project to your local machine
git clone https://github.com/shriyavallabh/react-graph.git

# Navigate to the project directory
cd react-graph
```

### 2. Install Dependencies

```bash
# Install all required packages
npm install

# Alternative: if you prefer yarn
yarn install
```

### 3. Start Development Server

```bash
# Start the development server
npm run dev

# Alternative: if you prefer yarn
yarn dev
```

The application will start and be available at: **http://localhost:5173/**

### 4. Build for Production

```bash
# Create production build
npm run build

# Preview production build locally
npm run preview
```

## Project Structure

```
react-graph/
├── public/
│   └── demo-kg.json          # Sample graph data
├── src/
│   ├── components/
│   │   └── SimpleGraph.tsx   # Main graph component
│   ├── App.tsx              # Main application component
│   ├── main.tsx             # Application entry point
│   └── types.ts             # TypeScript type definitions
├── package.json             # Project dependencies
└── README.md               # This file
```

## Using Your Own Data

Replace the content in `public/demo-kg.json` with your own graph data following the format below:

## Data Format

The graph expects JSON data with the following structure:

```json
{
  "nodes": [
    {
      "id": "n1",
      "name": "UserService",
      "type": "Class",
      "confidence": 0.9,
      "description": "...",
      "recommendation": "...",
      "reasoning": "..."
    }
  ],
  "links": [
    {
      "source": "n1",
      "target": "n2",
      "label": "uses"
    }
  ]
}
```

## Troubleshooting

### Common Issues

**Port already in use:**
```bash
# If port 5173 is busy, try a different port
npm run dev -- --port 3000
```

**Node.js version issues:**
```bash
# Check your Node.js version
node --version

# Should be 18 or higher
```

**Dependencies not installing:**
```bash
# Clear npm cache and reinstall
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

### Browser Compatibility

- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

## Tech Stack

- **React 19** + TypeScript
- **Vite** (build tool)
- **react-force-graph-3d** (3D visualization)
- **Three.js** (3D graphics)

## Support

If you encounter any issues:

1. Check the browser console for error messages
2. Ensure all prerequisites are installed
3. Try clearing browser cache
4. Restart the development server

## License

This project is available for educational and commercial use.