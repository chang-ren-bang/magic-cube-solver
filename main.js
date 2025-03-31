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

        // Initial drawing (simple test)
        ctx.fillStyle = 'lightblue';
        ctx.fillRect(10, 10, 150, 100);
        ctx.font = '16px Arial';
        ctx.fillStyle = 'black';
        ctx.fillText('Canvas Ready!', 20, 50);

        // --- Event Listeners ---
        randomizeBtn.addEventListener('click', () => {
            console.log("Randomize button clicked");
            solutionStepsDiv.textContent = "隨機產生按鈕被點擊 (功能尚未實作)";
            // TODO: Implement randomize logic
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
