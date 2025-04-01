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
        // Make the listener async to use await for animations
        randomizeBtn.addEventListener('click', async () => {
            if (renderer.isAnimating) {
                console.log("Animation in progress, ignoring randomize click.");
                return;
            }
            console.log("Randomize button clicked");
            randomizeBtn.disabled = true; // Disable button during animation
            solveBtn.disabled = true; // Disable solve button too

            // 1. Generate scramble
            const currentScramble = cubeState.generateScramble(20); // Generate a 20-move scramble
            lastScrambleSequence = currentScramble; // Store the generated scramble
            console.log("Generated Scramble:", currentScramble);
            solutionStepsDiv.textContent = `打亂步驟: ${currentScramble}`;

            // 2. Animate the scramble sequence step-by-step
            const moves = currentScramble.trim().split(/\s+/);
            console.log("Animating scramble sequence...");
            solutionStepsDiv.textContent = `打亂動畫中: ${currentScramble}`; // Show full sequence initially

            for (const move of moves) {
                if (!move) continue; // Skip empty strings if any
                console.log(`Animating move: ${move}`);
                try {
                    // Animate the move visually
                    await renderer.animateRotation(move, 1000); // Wait for 1s animation

                    // Update the internal state AFTER the visual animation completes
                    cubeState.applyMove(move);

                    // Optional: Update colors based on state (might be redundant if animation handles visuals)
                    // renderer.updateColors(cubeState.getState());

                    console.log(`Move ${move} applied to state.`);

                } catch (error) {
                    console.error(`Error animating move ${move}:`, error);
                    solutionStepsDiv.textContent = `動畫錯誤於步驟 ${move}: ${error.message}`;
                    // Decide how to handle error - break, continue? For now, break.
                    break;
                }
            }

            // 3. Final color update after all animations (ensures consistency)
            renderer.updateColors(cubeState.getState());
            console.log("Scramble animation finished. Renderer colors updated.");
            solutionStepsDiv.textContent = `打亂完成: ${currentScramble}`;

            randomizeBtn.disabled = false; // Re-enable button
            solveBtn.disabled = false;
        });

        // TODO: Update solveBtn listener similarly to animate the solution sequence
        solveBtn.addEventListener('click', () => {
             if (renderer.isAnimating) {
                console.log("Animation in progress, ignoring solve click.");
                return;
            }
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
