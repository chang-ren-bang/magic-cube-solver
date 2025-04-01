import { CubeRenderer } from './js/CubeRenderer.js';
import { solve as simpleSolve } from './js/SimpleSolver.js';

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
        let lastScrambleSequence = null;
        const renderer = new CubeRenderer(canvas);
        renderer.startAnimation();

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

            // 先重置方塊狀態
            renderer.reset();
            console.log("Reset cube to initial state");

            // 生成打亂序列
            const baseMoves = ['U', 'R', 'F', 'D', 'L', 'B'];
            const modifiers = ['', "'"];
            const moves = [];
            let lastMove = null;

            // 生成 20 步的打亂
            for (let i = 0; i < 20; i++) {
                let move;
                do {
                    const baseMove = baseMoves[Math.floor(Math.random() * baseMoves.length)];
                    const modifier = modifiers[Math.floor(Math.random() * modifiers.length)];
                    move = baseMove + modifier;
                } while (lastMove && move[0] === lastMove[0]); // 避免連續旋轉同一面
                moves.push(move);
                lastMove = move;
            }

            const currentScramble = moves.join(' ');
            lastScrambleSequence = currentScramble;
            console.log("Generated Scramble:", currentScramble);
            solutionStepsDiv.textContent = `打亂步驟: ${currentScramble}`;

            // 依序執行打亂動作
            for (const move of moves) {
                try {
                    await renderer.animateRotation(move, 500);
                    console.log(`Move ${move} applied.`);
                } catch (error) {
                    console.error(`Error animating move ${move}:`, error);
                    solutionStepsDiv.textContent = `動畫錯誤於步驟 ${move}: ${error.message}`;
                    break;
                }
            }

            console.log("Scramble animation finished.");
            solutionStepsDiv.textContent = `打亂完成: ${currentScramble}`;
            randomizeBtn.disabled = false;
            solveBtn.disabled = false;
        });

        solveBtn.addEventListener('click', async () => {
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

            randomizeBtn.disabled = true;
            solveBtn.disabled = true;
            solutionStepsDiv.textContent = "計算解法中 (反轉打亂序列)...";

            try {
                const solution = simpleSolve(lastScrambleSequence);
                console.log("Received solution:", solution);
                solutionStepsDiv.textContent = `解法步驟: ${solution}`;

                // 執行解法動作
                const solutionMoves = solution.trim().split(/\s+/);
                for (const move of solutionMoves) {
                    await renderer.animateRotation(move, 500);
                    console.log(`Solution move ${move} applied.`);
                }

                console.log("Solution animation finished.");
                solutionStepsDiv.textContent = `解法完成: ${solution}`;
            } catch (error) {
                console.error("Error during solving:", error);
                solutionStepsDiv.textContent = `解題時發生錯誤: ${error.message}`;
            }

            randomizeBtn.disabled = false;
            solveBtn.disabled = false;
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
