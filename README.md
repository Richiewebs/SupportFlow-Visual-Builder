# SupportFlow Visual Builder

A modern, highly interactive Visual Decision Tree Editor built for SupportFlow AI. This application allows non-technical managers to effortlessly design, visualize, edit, and test-drive automated "Help Chatbots" without ever touching a messy spreadsheet again.

## Features

- **Interactive Visual Editor**: View conversation flows as a connected directed graph, built entirely from scratch with React, CSS, and SVG Lines (no heavy third-party graphing libraries).
- **Real-time Editing**: Click on any conversational node to edit its text inline. The UI reacts instantly.
- **Chatbot Preview Runner**: Switch seamlessly to "Preview Mode" to test-drive your flow in a realistic chat interface, validating the user journey from start to finish.
- **Dark-Themed Aesthetics**: A premium, visually stunning UI utilizing deep neobrutalist colors, smooth transitions, and glassmorphic headers.

### The "Wildcard" Innovation: Drag-and-Drop Repositioning

**Why Drag-and-Drop?**
A flowchart where nodes are anchored in place is visually restrictive. As managers build out complex conversation trees, visual clutter is inevitable if you cannot reorganize the workspace. 

By implementing **Drag-and-Drop Repositioning**, we empower the user to grab nodes and freely organize them on the canvas. The engine dynamically recalculates SVG vector lines in real-time. This entirely transforms the tool from a static renderer into a _true WYSIWYG Editor_, offering massive business value by improving workflow efficiency and visual clarity for the support managers building the bots.

## Phase 1: Design System

> (https://www.figma.com/design/Ot572JCcKuKCDOCOBGBNe7/Untitled?node-id=0-1&t=Svm76WCwNJgfYfhT-1)
*Note: Ensure your design link allows "Anyone with the link can view". The design system includes mockups for the Canvas, Node Cards, Connectors, and Color Semantics.*

## Getting Started

### Prerequisites
- Node.js (v18+)

### Installation
1. Clone the repository.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Open the provided localhost URL in your browser.

## Technical Architecture

- **Framework**: Built with React (via Vite)
- **Styling**: Vanilla CSS with modern custom properties, flexbox, and CSS Gradients. Strict avoidance of UI framework constraints.
- **State Management**: React `useState` hooks manage the immutable flow structure and absolute coordinate system.
- **DOM & Canvas**: Nodes use `position: absolute` on an infinite canvas container. Connected paths are drawn mathematically using Bezier curves (`<path>`) inside an overlayed SVG layer that reacts locally to node positional state changes.
