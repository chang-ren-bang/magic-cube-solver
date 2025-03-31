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

        // --- 3D Cube Data ---
        const CUBE_SIZE = 50; // Size of the cube (half-length)
        const vertices = [
            { x: -CUBE_SIZE, y: -CUBE_SIZE, z: -CUBE_SIZE }, // 0
            { x:  CUBE_SIZE, y: -CUBE_SIZE, z: -CUBE_SIZE }, // 1
            { x:  CUBE_SIZE, y:  CUBE_SIZE, z: -CUBE_SIZE }, // 2
            { x: -CUBE_SIZE, y:  CUBE_SIZE, z: -CUBE_SIZE }, // 3
            { x: -CUBE_SIZE, y: -CUBE_SIZE, z:  CUBE_SIZE }, // 4
            { x:  CUBE_SIZE, y: -CUBE_SIZE, z:  CUBE_SIZE }, // 5
            { x:  CUBE_SIZE, y:  CUBE_SIZE, z:  CUBE_SIZE }, // 6
            { x: -CUBE_SIZE, y:  CUBE_SIZE, z:  CUBE_SIZE }  // 7
        ];

        // Define faces using vertex indices and assign colors
        // Standard Rubik's Cube Colors: White(W), Yellow(Y), Blue(B), Green(G), Red(R), Orange(O)
        const faces = [
            { vertices: [0, 1, 2, 3], color: '#0000FF' }, // Back face (Blue) - Z negative
            { vertices: [1, 5, 6, 2], color: '#FF8C00' }, // Right face (Orange) - X positive
            { vertices: [5, 4, 7, 6], color: '#00FF00' }, // Front face (Green) - Z positive
            { vertices: [4, 0, 3, 7], color: '#FF0000' }, // Left face (Red) - X negative
            { vertices: [3, 2, 6, 7], color: '#FFFF00' }, // Top face (Yellow) - Y positive
            { vertices: [4, 5, 1, 0], color: '#FFFFFF' }  // Bottom face (White) - Y negative
        ];

        // --- 3D Transformation Functions ---
        function rotateY(point, angle) {
            const rad = angle * Math.PI / 180;
            const cos = Math.cos(rad);
            const sin = Math.sin(rad);
            return {
                x: point.x * cos - point.z * sin,
                y: point.y,
                z: point.x * sin + point.z * cos
            };
        }

        function rotateX(point, angle) {
            const rad = angle * Math.PI / 180;
            const cos = Math.cos(rad);
            const sin = Math.sin(rad);
            return {
                x: point.x,
                y: point.y * cos - point.z * sin,
                z: point.y * sin + point.z * cos
            };
        }

        function project(point) {
            // Simple perspective projection
            const distance = 300; // Distance from camera to projection plane
            const scale = distance / (distance + point.z);
            return {
                x: point.x * scale + canvas.width / 2,
                y: point.y * scale + canvas.height / 2,
                z: point.z // Keep z for depth sorting
            };
        }

        // --- Drawing ---
        let angleY = 0;
        let angleX = 0;

        function drawCube() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = '#f0f0f0'; // Background
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Rotate vertices
            const rotatedVertices = vertices.map(v => {
                let p = rotateY(v, angleY);
                p = rotateX(p, angleX);
                return p;
            });

            // Project vertices
            const projectedVertices = rotatedVertices.map(project);

            // Calculate face depths (average Z of vertices) and prepare faces for drawing
            const facesToDraw = faces.map((face, index) => {
                const faceVertices = face.vertices.map(i => projectedVertices[i]);
                let avgZ = faceVertices.reduce((sum, v) => sum + v.z, 0) / faceVertices.length;
                return { vertices: faceVertices, color: face.color, avgZ: avgZ };
            });

            // Sort faces by depth (draw back faces first)
            facesToDraw.sort((a, b) => a.avgZ - b.avgZ);

            // Draw faces
            facesToDraw.forEach(face => {
                ctx.beginPath();
                ctx.moveTo(face.vertices[0].x, face.vertices[0].y);
                for (let i = 1; i < face.vertices.length; i++) {
                    ctx.lineTo(face.vertices[i].x, face.vertices[i].y);
                }
                ctx.closePath();
                ctx.fillStyle = face.color;
                ctx.fill();
                ctx.strokeStyle = '#333'; // Edge color
                ctx.lineWidth = 1;
                ctx.stroke();
            });
        }

        // --- Animation Loop ---
        function animate() {
            angleY += 0.5; // Slow rotation speed
            angleX += 0.3; // Add a little X rotation too
            drawCube();
            requestAnimationFrame(animate);
        }

        // Start animation
        animate();


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
