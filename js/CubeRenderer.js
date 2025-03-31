// js/CubeRenderer.js

// Standard Rubik's Cube Colors
const COLORS = {
    WHITE: '#FFFFFF',
    YELLOW: '#FFFF00',
    BLUE: '#0000FF',
    GREEN: '#00FF00',
    RED: '#FF0000',
    ORANGE: '#FF8C00',
    BLACK: '#333333' // Inner color
};

// Face indices for mapping
const FACE_MAP = { BACK: 0, RIGHT: 1, FRONT: 2, LEFT: 3, TOP: 4, BOTTOM: 5 };

// Represents a single small cube (cubie)
class Cubie {
    constructor(x, y, z, size, ix, iy, iz) {
        this.x = x; // Center x coordinate in 3D space
        this.y = y; // Center y coordinate in 3D space
        this.z = z; // Center z coordinate in 3D space
        this.size = size; // half-size
        this.ix = ix; // Logical index (0, 1, 2)
        this.iy = iy; // Logical index (0, 1, 2)
        this.iz = iz; // Logical index (0, 1, 2)
        this.vertices = this.createVertices();
        // Face colors will be set by updateColors
        this.faces = this.createFaces(); // Create faces with default black
    }

    createVertices() {
        const s = this.size;
        return [
            { x: this.x - s, y: this.y - s, z: this.z - s }, // 0
            { x: this.x + s, y: this.y - s, z: this.z - s }, // 1
            { x: this.x + s, y: this.y + s, z: this.z - s }, // 2
            { x: this.x - s, y: this.y + s, z: this.z - s }, // 3
            { x: this.x - s, y: this.y - s, z: this.z + s }, // 4
            { x: this.x + s, y: this.y - s, z: this.z + s }, // 5
            { x: this.x + s, y: this.y + s, z: this.z + s }, // 6
            { x: this.x - s, y: this.y + s, z: this.z + s }  // 7
        ];
    }

    createFaces() {
        // Order: Back, Right, Front, Left, Top, Bottom
        // Initially set visible faces to standard colors, others to black
        const facesData = [
            { vertices: [0, 1, 2, 3], color: COLORS.BLACK, normal: { x: 0, y: 0, z: -1 } }, // Back
            { vertices: [1, 5, 6, 2], color: COLORS.BLACK, normal: { x: 1, y: 0, z: 0 } }, // Right
            { vertices: [5, 4, 7, 6], color: COLORS.BLACK, normal: { x: 0, y: 0, z: 1 } }, // Front
            { vertices: [4, 0, 3, 7], color: COLORS.BLACK, normal: { x: -1, y: 0, z: 0 } }, // Left
            { vertices: [3, 2, 6, 7], color: COLORS.BLACK, normal: { x: 0, y: 1, z: 0 } }, // Top
            { vertices: [4, 5, 1, 0], color: COLORS.BLACK, normal: { x: 0, y: -1, z: 0 } }  // Bottom (D)
        ];
        // Colors are now assigned via updateColors based on CubeState
        return facesData;
    }

    // Method to update face colors (will be used later)
    setFaceColor(faceIndex, color) {
        if (faceIndex >= 0 && faceIndex < this.faces.length) {
            this.faces[faceIndex].color = color;
        }
    }
}


export class CubeRenderer {
    constructor(canvas, ctx) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.angleX = 20; // Initial rotation
        this.angleY = -30; // Initial rotation
        this.cubies = [];
        this.CUBIE_SIZE = 25; // Half-size of a small cubie
        this.CUBIE_GAP = 3;   // Increased Gap between cubies for visibility

        this.createCube();
    }

    createCube() {
        this.cubies = [];
        const N = 3; // 3x3x3 cube
        const offset = (N - 1) / 2; // To center the cube around (0,0,0) -> offset = 1
        const step = this.CUBIE_SIZE * 2 + this.CUBIE_GAP; // Distance between centers

        // Loop through logical coordinates (ix, iy, iz) from 0 to 2
        for (let iy = 0; iy < N; iy++) { // y -> U/D axis
            for (let iz = 0; iz < N; iz++) { // z -> F/B axis
                for (let ix = 0; ix < N; ix++) { // x -> L/R axis
                    // Calculate 3D position based on logical indices
                    // We map logical coords (0,1,2) to 3D coords (-step, 0, step)
                    // Note: iy=0 is Bottom(D), iy=2 is Top(U)
                    //       iz=0 is Back(B),  iz=2 is Front(F)
                    //       ix=0 is Left(L),  ix=2 is Right(R)
                    const x = (ix - offset) * step;
                    const y = -(iy - offset) * step; // Invert Y for U=top, D=bottom mapping
                    const z = (iz - offset) * step;
                    this.cubies.push(new Cubie(x, y, z, this.CUBIE_SIZE, ix, iy, iz));
                }
            }
        }
        console.log(`Created ${this.cubies.length} cubies.`);
    }

    // --- 3D Transformation Functions --- (Keep as is)
    rotateY(point, angle) {
        const rad = angle * Math.PI / 180;
        const cos = Math.cos(rad);
        const sin = Math.sin(rad);
        return {
            x: point.x * cos - point.z * sin,
            y: point.y,
            z: point.x * sin + point.z * cos
        };
    }

    rotateX(point, angle) {
        const rad = angle * Math.PI / 180;
        const cos = Math.cos(rad);
        const sin = Math.sin(rad);
        return {
            x: point.x,
            y: point.y * cos - point.z * sin,
            z: point.y * sin + point.z * cos
        };
    }

    project(point) {
        const distance = 600; // Increased distance for smaller cubies
        const scale = distance / (distance + point.z);
        return {
            x: point.x * scale + this.canvas.width / 2,
            y: point.y * scale + this.canvas.height / 2,
            z: point.z // Keep z for depth sorting
        };
    }

    // --- Drawing ---
    draw() {
        this.ctx.fillStyle = '#f0f0f0'; // Background
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        const allFacesToDraw = [];

        this.cubies.forEach(cubie => {
            // Rotate vertices for the whole cube rotation
            const rotatedVertices = cubie.vertices.map(v => {
                let p = this.rotateY(v, this.angleY);
                p = this.rotateX(p, this.angleX);
                return p;
            });

            // Project vertices
            const projectedVertices = rotatedVertices.map(p => this.project(p));

            // Prepare faces for drawing
            cubie.faces.forEach((face, index) => {
                const faceVertices = face.vertices.map(i => projectedVertices[i]);
                // Simple back-face culling (optional but good for performance)
                // Calculate normal vector (simplified - assumes axis-aligned faces)
                // let v0 = faceVertices[0];
                // let v1 = faceVertices[1];
                // let v2 = faceVertices[2];
                // let crossProductZ = (v1.x - v0.x) * (v2.y - v1.y) - (v1.y - v0.y) * (v2.x - v1.x);
                // if (crossProductZ < 0) { // Only draw faces pointing towards the camera (roughly)
                    let avgZ = faceVertices.reduce((sum, v) => sum + v.z, 0) / faceVertices.length;
                    allFacesToDraw.push({ vertices: faceVertices, color: face.color, avgZ: avgZ });
                // }
            });
        });

        // Sort ALL faces from ALL cubies by depth
        allFacesToDraw.sort((a, b) => a.avgZ - b.avgZ);

        // Draw faces
        allFacesToDraw.forEach(face => {
            if (face.color === COLORS.BLACK) return; // Don't draw inner faces

            this.ctx.beginPath();
            this.ctx.moveTo(face.vertices[0].x, face.vertices[0].y);
            for (let i = 1; i < face.vertices.length; i++) {
                this.ctx.lineTo(face.vertices[i].x, face.vertices[i].y);
            }
            this.ctx.closePath();
            this.ctx.fillStyle = face.color;
            this.ctx.fill();
            this.ctx.strokeStyle = '#333'; // Edge color
            this.ctx.lineWidth = 1;
            this.ctx.stroke();
        });
    }

    // --- Animation Loop ---
    startAnimation() {
        const animate = () => {
            this.angleY += 0.4; // Adjust rotation speed if needed
            this.angleX += 0.2;
            this.draw();
            requestAnimationFrame(animate);
        }
        animate();
    }

    // Update cubie face colors based on the provided state object
    updateColors(state) {
        if (!state) {
            console.error("Cannot update colors: state is null or undefined.");
            return;
        }

        this.cubies.forEach(cubie => {
            const { ix, iy, iz } = cubie;

            // Determine which facelet index (0-8) this cubie corresponds to on each major face
            // This mapping depends on the chosen state representation (U/R/F/D/L/B faces, 0-8 index)

            // Top Face (U, iy === 2) - Yellow
            if (iy === 2) {
                // Map ix, iz to 0-8 index for U face: index = iz * 3 + ix
                const faceletIndex = iz * 3 + ix;
                cubie.setFaceColor(FACE_MAP.TOP, state.U[faceletIndex]);
            } else {
                 cubie.setFaceColor(FACE_MAP.TOP, COLORS.BLACK); // Inner face
            }

            // Bottom Face (D, iy === 0) - White
            if (iy === 0) {
                // Map ix, iz to 0-8 index for D face: index = (2-iz) * 3 + ix (inverted z)
                 const faceletIndex = (2 - iz) * 3 + ix;
                 cubie.setFaceColor(FACE_MAP.BOTTOM, state.D[faceletIndex]);
            } else {
                 cubie.setFaceColor(FACE_MAP.BOTTOM, COLORS.BLACK); // Inner face
            }

            // Front Face (F, iz === 2) - Green
            if (iz === 2) {
                // Map ix, iy to 0-8 index for F face: index = (2-iy) * 3 + ix (inverted y)
                const faceletIndex = (2 - iy) * 3 + ix;
                cubie.setFaceColor(FACE_MAP.FRONT, state.F[faceletIndex]);
            } else {
                 cubie.setFaceColor(FACE_MAP.FRONT, COLORS.BLACK); // Inner face
            }

             // Back Face (B, iz === 0) - Blue
            if (iz === 0) {
                // Map ix, iy to 0-8 index for B face: index = (2-iy) * 3 + (2-ix) (inverted y and x)
                const faceletIndex = (2 - iy) * 3 + (2 - ix);
                cubie.setFaceColor(FACE_MAP.BACK, state.B[faceletIndex]);
            } else {
                 cubie.setFaceColor(FACE_MAP.BACK, COLORS.BLACK); // Inner face
            }

            // Right Face (R, ix === 2) - Orange
            if (ix === 2) {
                // Map iy, iz to 0-8 index for R face: index = (2-iy) * 3 + iz (inverted y)
                const faceletIndex = (2 - iy) * 3 + iz;
                cubie.setFaceColor(FACE_MAP.RIGHT, state.R[faceletIndex]);
            } else {
                 cubie.setFaceColor(FACE_MAP.RIGHT, COLORS.BLACK); // Inner face
            }

            // Left Face (L, ix === 0) - Red
            if (ix === 0) {
                // Map iy, iz to 0-8 index for L face: index = (2-iy) * 3 + (2-iz) (inverted y and z)
                const faceletIndex = (2 - iy) * 3 + (2 - iz);
                cubie.setFaceColor(FACE_MAP.LEFT, state.L[faceletIndex]);
            } else {
                 cubie.setFaceColor(FACE_MAP.LEFT, COLORS.BLACK); // Inner face
            }
        });
        // Force redraw after updating colors
        this.draw();
    }
}
