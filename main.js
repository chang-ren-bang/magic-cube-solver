import { CubeRenderer } from './js/CubeRenderer.js';
import { CubeState } from './js/CubeState.js';

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

        // --- Initialize State and Renderer ---
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
            solutionStepsDiv.textContent = "自動解題按鈕被點擊 (功能尚未實作)";
            // TODO: Implement solve logic and animation
        });

        // --- Core Logic (Placeholders) ---
        // TODO: Implement Cube State Manager
        // TODO: Implement 3D Renderer
        // TODO: Implement Animation Engine
        // TODO: Implement Solver Interface
    }
}
