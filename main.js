import { CubeRenderer } from './js/CubeRenderer.js';
import { CubeState } from './js/CubeState.js';
import { solve as solveCube, initialize as initializeSolver } from './js/lib/solver.js'; // Import the dummy solver

console.log("main.js loaded");

// --- DOM Elements ---
const canvas = document.getElementById('cubeCanvas');
const randomizeBtn = document.getElementById('randomizeBtn');
const solveBtn = document.getElementById('solveBtn');
const solutionStepsDiv = document.getElementById('solutionSteps');

// --- Canvas Setup ---
if (!canvas) {
    console.error("Canvas element not found!");
} else {
    const ctx = canvas.getContext('2d');

    if (!ctx) {
        console.error("Failed to get 2D context from canvas!");
        solutionStepsDiv.textContent = "無法取得 Canvas 2D context，繪圖功能可能無法使用。";
    } else {
        console.log("Canvas context obtained successfully.");

        // --- Initialize Solver, State and Renderer ---
        initializeSolver(); // Initialize the dummy solver
        const cubeState = new CubeState();
        const renderer = new CubeRenderer(canvas, ctx);

        // Initial draw with solved state colors
        renderer.updateColors(cubeState.getState());
        renderer.startAnimation(); // Start the drawing loop

        // --- Event Listeners ---
        randomizeBtn.addEventListener('click', () => {
            console.log("Randomize button clicked");

            // 1. Generate scramble
            const scrambleSequence = cubeState.generateScramble(20); // Generate a 20-move scramble
            console.log("Generated Scramble:", scrambleSequence);
            solutionStepsDiv.textContent = `打亂步驟: ${scrambleSequence}`;

            // 2. Apply the generated scramble sequence to the cube state
            console.log("Applying sequence to state...");
            cubeState.applySequence(scrambleSequence);
            console.log("Sequence applied.");

            // 3. Update renderer colors to reflect the new state
            renderer.updateColors(cubeState.getState());
            console.log("Renderer colors updated.");
        });

        solveBtn.addEventListener('click', () => {
            console.log("Solve button clicked");
            solutionStepsDiv.textContent = "計算解法中...";

            // 1. Get current state string
            const stateString = cubeState.toSolverString();
            console.log("Current state string:", stateString);

            // 2. Call the solver (dummy version for now)
            try {
                const solution = solveCube(stateString);
                console.log("Received solution:", solution);
                solutionStepsDiv.textContent = `解法步驟: ${solution}`;

                // TODO: Implement animation based on the solution sequence
            } catch (error) {
                 console.error("Error during solving:", error);
                 solutionStepsDiv.textContent = `解題時發生錯誤: ${error.message}`;
            }
        });

        // --- Core Logic (Placeholders) ---
        // TODO: Implement Cube State Manager
        // TODO: Implement 3D Renderer
        // TODO: Implement Animation Engine
        // TODO: Implement Solver Interface
    }
}
