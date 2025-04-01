// js/CubeRenderer.js
// Removed: import * as THREE from 'three';
// Access THREE and OrbitControls from global scope (loaded via script tags in index.html)
const OrbitControls = window.THREE.OrbitControls || window.OrbitControls; // Access OrbitControls from THREE namespace or global


// Map face names to colors (consistent with CubeState)
const COLORS = {
    WHITE: 0xFFFFFF, // Using hex numbers for Three.js colors
    YELLOW: 0xFFFF00,
    BLUE: 0x0000FF,
    GREEN: 0x00FF00,
    RED: 0xFF0000,
    ORANGE: 0xFF8C00,
    BLACK: 0x000000, // For inside faces
    GRAY: 0x808080,  // Default/unassigned faces
};

// Map face names from CubeState to Three.js colors
const SOLVED_STATE_COLORS_THREE = {
    U: COLORS.YELLOW, // Top
    R: COLORS.ORANGE, // Right
    F: COLORS.GREEN,  // Front
    D: COLORS.WHITE,  // Down
    L: COLORS.RED,    // Left
    B: COLORS.BLUE,   // Back
};

// Map CubeState color hex strings back to Three.js color hex numbers
const HEX_STRING_TO_THREE_COLOR = {};
Object.entries(COLORS).forEach(([_, hexNum]) => {
    // Convert hex number to zero-padded hex string (e.g., 0xFFFFFF -> "#ffffff")
    const hexString = "#" + hexNum.toString(16).padStart(6, '0').toUpperCase();
    HEX_STRING_TO_THREE_COLOR[hexString] = hexNum;
});
// Add lowercase versions just in case
Object.entries(COLORS).forEach(([_, hexNum]) => {
    const hexString = "#" + hexNum.toString(16).padStart(6, '0').toLowerCase();
    HEX_STRING_TO_THREE_COLOR[hexString] = hexNum;
});


// Define the order of materials for BoxGeometry faces: +X, -X, +Y, -Y, +Z, -Z
// Corresponds to: Right, Left, Top, Bottom, Front, Back
const FACE_MATERIAL_ORDER = ['R', 'L', 'U', 'D', 'F', 'B'];

export class CubeRenderer {
    constructor(canvas) { // Removed ctx parameter
        if (!canvas) {
            throw new Error("Canvas element is required for CubeRenderer.");
        }
         if (!THREE) {
            throw new Error("THREE is not loaded. Check script tags in index.html.");
        }
        if (!OrbitControls) {
             console.warn("OrbitControls not found. Camera interaction might be limited.");
             // Proceed without controls if necessary, or throw error
             // throw new Error("OrbitControls is not loaded. Check script tags in index.html.");
        }
        this.canvas = canvas;

        // --- Three.js Setup ---
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0xeeeeee); // Light gray background

        // Camera
        const aspect = canvas.width / canvas.height;
        this.camera = new THREE.PerspectiveCamera(75, aspect, 0.1, 1000);
        this.camera.position.set(3, 3, 5); // Position camera to view the cube

        // Renderer
        this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas, antialias: true });
        this.renderer.setSize(canvas.width, canvas.height);
        this.renderer.setPixelRatio(window.devicePixelRatio); // Adjust for high-DPI displays

        // Lighting
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.7); // Soft white light
        this.scene.add(ambientLight);
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.9); // White directional light
        directionalLight.position.set(5, 10, 7.5);
        this.scene.add(directionalLight);

        // Controls
        if (OrbitControls) {
            this.controls = new OrbitControls(this.camera, this.renderer.domElement);
            this.controls.enableDamping = true; // Optional damping effect
            this.controls.dampingFactor = 0.05;
            this.controls.screenSpacePanning = false;
            this.controls.minDistance = 3;
            this.controls.maxDistance = 20;
        } else {
            this.controls = null;
        }


        // --- Cube Creation ---
        this.cubeGroup = new THREE.Group(); // Group to hold all cubies
        this.cubies = []; // Array to store individual cubie meshes

        // Materials (Create one material per color for efficiency)
        this.materials = {};
        Object.entries(COLORS).forEach(([name, color]) => {
            // Use MeshLambertMaterial for less shine, maybe better for cube colors
            this.materials[name] = new THREE.MeshLambertMaterial({ color: color, side: THREE.DoubleSide });
        });
        // Ensure GRAY exists if not in COLORS
        if (!this.materials.GRAY) {
             this.materials.GRAY = new THREE.MeshLambertMaterial({ color: COLORS.GRAY, side: THREE.DoubleSide });
        }
         // Material for the inside faces
        this.materials.INSIDE = new THREE.MeshLambertMaterial({ color: COLORS.BLACK, side: THREE.DoubleSide });


        const cubieSize = 1; // Size of each small cube
        const spacing = 0.05; // Spacing between cubies
        const totalSize = cubieSize + spacing;
        const offset = 1; // Offset to center the 3x3x3 cube (position from -1 to 1)

        // Use a single geometry instance for performance
        const geometry = new THREE.BoxGeometry(cubieSize, cubieSize, cubieSize);

        for (let x = -1; x <= 1; x++) {
            for (let y = -1; y <= 1; y++) {
                for (let z = -1; z <= 1; z++) {
                    // Skip the center cubie (it's not visible)
                    if (x === 0 && y === 0 && z === 0) continue;

                    // Create an array of 6 materials for this specific cubie
                    // Start with the inside material
                    const cubieMaterials = Array(6).fill(this.materials.INSIDE);

                    const cubie = new THREE.Mesh(geometry, cubieMaterials); // Use shared geometry
                    cubie.position.set(x * totalSize, y * totalSize, z * totalSize);

                    // Store coordinate info for easy lookup during color update
                    cubie.userData = { x, y, z, id: `cubie_${x}_${y}_${z}` };

                    this.cubies.push(cubie);
                    this.cubeGroup.add(cubie);
                }
            }
        }
        this.scene.add(this.cubeGroup);

        // --- Animation Loop ---
        this.animate = this.animate.bind(this); // Bind animate to the class instance
    }

    // --- Color Update Logic ---
    updateColors(cubeStateData) {
        console.log("Updating Three.js renderer colors...");
        if (!cubeStateData) {
            console.error("Cube state data is missing in updateColors.");
            return;
        }

        // Reset all faces to INSIDE material first
        this.cubies.forEach(cubie => {
            // Ensure the material is an array
            if (!Array.isArray(cubie.material)) {
                cubie.material = Array(6).fill(this.materials.INSIDE);
            } else {
                for (let i = 0; i < 6; i++) {
                    cubie.material[i] = this.materials.INSIDE;
                }
            }
             // No need for cubie.material.needsUpdate = true; here, will be set below
        });


        // --- Complex Mapping Logic ---
        const faceStickerIndices = {
            // Map CubeState face name to [cubie coordinate filter, three.js face index]
            // three.js face indices: 0: +X (R), 1: -X (L), 2: +Y (U), 3: -Y (D), 4: +Z (F), 5: -Z (B)
            'U': [{ y: 1 }, 2], // Cubies with y=1, update their +Y face (index 2)
            'D': [{ y: -1 }, 3], // Cubies with y=-1, update their -Y face (index 3)
            'L': [{ x: -1 }, 1], // Cubies with x=-1, update their -X face (index 1)
            'R': [{ x: 1 }, 0], // Cubies with x=1, update their +X face (index 0)
            'F': [{ z: 1 }, 4], // Cubies with z=1, update their +Z face (index 4)
            'B': [{ z: -1 }, 5], // Cubies with z=-1, update their -Z face (index 5)
        };

        // Map sticker index (0-8) on a CubeState face to cubie coordinates (x, z for U/D; y, z for L/R; x, y for F/B)
        const stickerToCoordMap = (face, index) => {
            const row = Math.floor(index / 3); // 0, 1, 2
            const col = index % 3;          // 0, 1, 2
            const mapCoord = (c) => c - 1; // Map 0,1,2 -> -1, 0, 1

            switch (face) {
                // These mappings need to be precise. Let's re-verify.
                // Assume U face: index 0 is back-left (-1, 1, -1), index 2 is back-right (1, 1, -1)
                // index 6 is front-left (-1, 1, 1), index 8 is front-right (1, 1, 1)
                case 'U': return { x: mapCoord(col), z: -mapCoord(row) }; // Looks correct: row 0 -> z=1, row 2 -> z=-1. col 0 -> x=-1, col 2 -> x=1. NO, row 0 should be z=-1. Let's fix.
                // case 'U': return { x: mapCoord(col), z: mapCoord(row) * -1 }; // row 0 -> z=-1, row 1 -> z=0, row 2 -> z=1. Correct.
                // case 'D': return { x: mapCoord(col), z: mapCoord(row) };     // row 0 -> z=-1, row 1 -> z=0, row 2 -> z=1. Correct.
                // case 'L': return { y: mapCoord(row) * -1, z: mapCoord(col) }; // row 0 -> y=1, row 2 -> y=-1. col 0 -> z=-1, col 2 -> z=1. Correct.
                // case 'R': return { y: mapCoord(row) * -1, z: mapCoord(col) * -1 };// row 0 -> y=1, row 2 -> y=-1. col 0 -> z=1, col 2 -> z=-1. Correct.
                // case 'F': return { x: mapCoord(col), y: mapCoord(row) * -1 }; // row 0 -> y=1, row 2 -> y=-1. col 0 -> x=-1, col 2 -> x=1. Correct.
                // case 'B': return { x: mapCoord(col) * -1, y: mapCoord(row) * -1 };// row 0 -> y=1, row 2 -> y=-1. col 0 -> x=1, col 2 -> x=-1. Correct.

                 // Let's try again, visualizing the unfolded cube and coordinates
                 // U: row 0 = back row (z=-1), row 2 = front row (z=1)
                 //    col 0 = left col (x=-1), col 2 = right col (x=1)
                 case 'U': return { x: mapCoord(col), z: mapCoord(row) * -1 }; // Corrected
                 // D: row 0 = back row (z=-1), row 2 = front row (z=1)
                 //    col 0 = left col (x=-1), col 2 = right col (x=1)
                 case 'D': return { x: mapCoord(col), z: mapCoord(row) }; // Corrected
                 // L: row 0 = top row (y=1), row 2 = bottom row (y=-1)
                 //    col 0 = back col (z=-1), col 2 = front col (z=1)
                 case 'L': return { y: mapCoord(row) * -1, z: mapCoord(col) }; // Corrected
                 // R: row 0 = top row (y=1), row 2 = bottom row (y=-1)
                 //    col 0 = back col (z=-1), col 2 = front col (z=1) -> NO, R face col 0 is FRONT (z=1), col 2 is BACK (z=-1)
                 case 'R': return { y: mapCoord(row) * -1, z: mapCoord(col) * -1 }; // Corrected
                 // F: row 0 = top row (y=1), row 2 = bottom row (y=-1)
                 //    col 0 = left col (x=-1), col 2 = right col (x=1)
                 case 'F': return { x: mapCoord(col), y: mapCoord(row) * -1 }; // Corrected
                 // B: row 0 = top row (y=1), row 2 = bottom row (y=-1)
                 //    col 0 = right col (x=1), col 2 = left col (x=-1)
                 case 'B': return { x: mapCoord(col) * -1, y: mapCoord(row) * -1 }; // Corrected


                default: return null; // Should not happen
            }
        };


        Object.entries(cubeStateData).forEach(([faceName, stickers]) => {
            const mapping = faceStickerIndices[faceName];
            if (!mapping) return;

            const [coordFilter, faceIndex] = mapping;

            stickers.forEach((colorHexString, stickerIndex) => {
                // Find the cubie based on the sticker's position on the unfolded net
                const targetCoords = stickerToCoordMap(faceName, stickerIndex);
                if (!targetCoords) return;

                // Find the specific cubie using its userData coordinates
                const targetCubie = this.cubies.find(cubie => {
                    const keys = Object.keys(targetCoords);
                    // Check if this cubie matches the coordinates derived from the sticker index
                    const stickerMatch = keys.every(key => cubie.userData[key] === targetCoords[key]);
                    if (!stickerMatch) return false;

                    // Also check if this cubie lies on the correct face (using the coordFilter)
                    const filterKey = Object.keys(coordFilter)[0];
                    return cubie.userData[filterKey] === coordFilter[filterKey];
                });


                if (targetCubie) {
                    // Find the correct material based on the color hex string
                    const threeColorHex = HEX_STRING_TO_THREE_COLOR[colorHexString.toUpperCase()];
                    const material = Object.values(this.materials).find(m => m.color.getHex() === threeColorHex) || this.materials.GRAY;

                    // Assign the material to the correct face index of the cubie
                    if (Array.isArray(targetCubie.material)) {
                        targetCubie.material[faceIndex] = material;
                        // No need for needsUpdate on individual materials in the array
                    } else {
                         // This case shouldn't happen if we initialize correctly
                         console.warn("Cubie material was not an array for", targetCubie.userData.id);
                         const newMaterials = Array(6).fill(this.materials.INSIDE);
                         newMaterials[faceIndex] = material;
                         targetCubie.material = newMaterials;
                    }
                } else {
                     // This indicates an error in the mapping logic
                     // console.warn(`Mapping error: Could not find cubie for face ${faceName}, sticker ${stickerIndex}`);
                }
            });
        });

        // After updating all materials, flag the geometry groups for update if necessary
        // For individual material changes in an array, this might not be needed,
        // but if you were changing the material *property* of the mesh, it would be.
        // Let's check Three.js docs - changing elements of the material array should work directly.

         console.log("Three.js color update finished.");
    }

    // --- Animation Loop ---
    startAnimation() {
        // Ensure animate is called only once initially
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
        }
        this.animate();
    }

    animate() {
        this.animationFrameId = requestAnimationFrame(this.animate);

        if (this.controls) {
            this.controls.update(); // Update controls if they exist
        }

        // TODO: Add cube rotation animations here later

        this.renderer.render(this.scene, this.camera);
    }

    // --- Rotation (Placeholder - Needs Implementation) ---
    rotateFace(face, clockwise = true) {
        console.warn(`rotateFace(${face}, ${clockwise}) not implemented in Three.js renderer yet.`);
        // ... (previous placeholder comments remain valid) ...
    }

    // --- Utility ---
    setRotation(x, y) {
         // Rotate the whole cube group
         this.cubeGroup.rotation.x = x;
         this.cubeGroup.rotation.y = y;
    }

    // Handle window resize
    resize(width, height) {
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(width, height);
    }
}
