import { CubeRenderer } from './js/CubeRenderer.js';
import { CubeState } from './js/CubeState.js';
import { solve as simpleSolve } from './js/SimpleSolver.js'; // Import our simple solver

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
    // No longer need async, removed Cube.asyncInit()
    function initializeApp() {
        let lastScrambleSequence = null; // Variable to store the last scramble
        // const ctx = canvas.getContext('2d'); // No longer needed for Three.js

        // --- Initialize State and Renderer ---
        // Removed cubejs initialization logic
        const cubeState = new CubeState();
        // Pass only the canvas element to the new Three.js renderer
        const renderer = new CubeRenderer(canvas);

        // Initial color update and start animation loop
        renderer.updateColors(cubeState.getState());
        renderer.startAnimation(); // Start the drawing loop

        // --- Event Listeners ---
        randomizeBtn.addEventListener('click', () => {
            console.log("Randomize button clicked");

            // 1. Generate scramble
            const currentScramble = cubeState.generateScramble(20); // Generate a 20-move scramble
            lastScrambleSequence = currentScramble; // Store the generated scramble
            console.log("Generated Scramble:", currentScramble);
            solutionStepsDiv.textContent = `打亂步驟: ${currentScramble}`;

            // 2. Apply the generated scramble sequence to the cube state
            console.log("Applying sequence to state...");
            cubeState.applySequence(currentScramble); // Apply the current scramble
            console.log("Sequence applied.");
            // Removed duplicate log and incorrect applySequence call

            // 3. Update renderer colors to reflect the new state
            renderer.updateColors(cubeState.getState());
            console.log("Renderer colors updated.");
        });

        solveBtn.addEventListener('click', () => {
            console.log("Solve button clicked");

            if (!lastScrambleSequence) {
                solutionStepsDiv.textContent = "請先產生一個隨機序列。";
                console.warn("Solve clicked before scrambling.");
                return;
            }

            solutionStepsDiv.textContent = "計算解法中 (反轉打亂序列)...";

            // 1. No need to get state string anymore

            // 2. Call our simple solver with the last scramble sequence
            try {
                const solution = simpleSolve(lastScrambleSequence); // Pass the stored scramble
                console.log("Received reversed scramble:", solution);
                solutionStepsDiv.textContent = `簡易解法 (反轉打亂): ${solution}`;

                // TODO: Implement animation based on the solution sequence
            } catch (error) {
                 console.error("Error during simple solving:", error);
                 solutionStepsDiv.textContent = `簡易解題時發生錯誤: ${error.message}`;
            }
        });

        // --- Core Logic (Placeholders) ---
        // TODO: Implement Cube State Manager (partially done)
        // TODO: Implement 3D Renderer (partially done)
        // TODO: Implement Animation Engine
        // TODO: Implement Solver Interface (partially done)

        console.log("Application initialized.");
    }

    // Call the initialization function
    initializeApp(); // No longer needs .catch for async errors here
}
