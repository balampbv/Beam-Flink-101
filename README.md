# Beam x Flink Interactive 101

**Beam x Flink Interactive 101** is an educational web application designed to visually explain how **Apache Beam** pipelines execution translates to **Apache Flink** clusters. It bridges the gap between the logical "Beam Model" and the physical "Flink Runner" through interactive simulations and animations.

## Features

*   **Interactive Concepts**: Visual explanations of PCollections, ParDo, Windowing, Watermarks, and Checkpointing.
*   **Pipeline Playground**: A drag-and-drop simulator to build pipelines and watch data packets flow through transformations.
*   **Flink Cluster Simulator**: Visualize how TaskManagers, Slots, and Parallelism work together to execute a job.
*   **Debugging Lessons**: Hands-on interactive scenarios explaining common issues like Backpressure and Akka Frame Size limits.
*   **Comprehensive Glossary**: A detailed dictionary of terms with mini-visualizations for deep understanding.
*   **Dark Mode**: Fully supported dark UI for comfortable reading.

## Tech Stack

*   **Frontend**: React, TypeScript
*   **Styling**: TailwindCSS
*   **Animations**: Framer Motion
*   **Icons**: Lucide React
*   **Architecture**: Static Single Page Application (SPA), no backend required.

## Running the Project

Since this is a client-side only application using ES Modules, you can run it with any static file server.

1.  **Serve the directory**:
    You can use Python, Node.js `serve`, or any other static host.
    
    Using Python:
    ```bash
    python3 -m http.server 8000
    ```
    
    Using Node.js:
    ```bash
    npx serve
    ```

2.  **Open in Browser**:
    Navigate to `http://localhost:8000` (or the port provided by your server) in a modern web browser.

## Project Structure

*   `components/`: Reusable UI components and application sections.
    *   `sections/`: Major application views (Hero, Concepts, Simulator, Glossary, etc.).
    *   `ui/`: Generic UI elements like Buttons.
*   `types.ts`: Shared TypeScript interfaces and constants.
*   `App.tsx`: Main application layout and routing logic.
*   `index.html`: Entry point with Tailwind configuration and Import Maps.
