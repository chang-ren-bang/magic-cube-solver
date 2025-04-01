// js/CubeRenderer.js
// Access THREE, OrbitControls, TWEEN from global scope (loaded via script tags)
const OrbitControls = window.THREE.OrbitControls || window.OrbitControls;
const TWEEN = window.TWEEN;

// --- Constants ---
const COLORS = { /* ... (Colors remain the same) ... */
    WHITE: 0xFFFFFF, YELLOW: 0xFFFF00, BLUE: 0x0000FF,
    GREEN: 0x00FF00, RED: 0xFF0000, ORANGE: 0xFF8C00,
    BLACK: 0x000000, GRAY: 0x808080,
};
const HEX_STRING_TO_THREE_COLOR = {}; /* ... (Mapping remains the same) ... */
Object.entries(COLORS).forEach(([_, hexNum]) => {
    const hexString = "#" + hexNum.toString(16).padStart(6, '0').toUpperCase();
    HEX_STRING_TO_THREE_COLOR[hexString] = hexNum;
    const hexStringLower = "#" + hexNum.toString(16).padStart(6, '0').toLowerCase();
    HEX_STRING_TO_THREE_COLOR[hexStringLower] = hexNum;
});

export class CubeRenderer {
    constructor(canvas) {
        if (!canvas) throw new Error("Canvas element is required.");
        if (!THREE) throw new Error("THREE is not loaded.");
        if (!TWEEN) console.warn("Tween.js (TWEEN) is not loaded. Animations will not work.");
        if (!OrbitControls) console.warn("OrbitControls not found.");

        this.canvas = canvas;
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0xeeeeee);

        // Camera
        const aspect = canvas.width / canvas.height;
        this.camera = new THREE.PerspectiveCamera(75, aspect, 0.1, 1000);
        this.camera.position.set(3, 3, 5);

        // Renderer
        this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas, antialias: true });
        this.renderer.setSize(canvas.width, canvas.height);
        this.renderer.setPixelRatio(window.devicePixelRatio);

        // Lighting
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
        this.scene.add(ambientLight);
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.9);
        directionalLight.position.set(5, 10, 7.5);
        this.scene.add(directionalLight);

        // Controls
        if (OrbitControls) {
            this.controls = new OrbitControls(this.camera, this.renderer.domElement);
            this.controls.enableDamping = true;
            this.controls.dampingFactor = 0.05;
            this.controls.screenSpacePanning = false;
            this.controls.minDistance = 3;
            this.controls.maxDistance = 20;
        } else {
            this.controls = null;
        }

        // Cube Creation
        this.cubeGroup = new THREE.Group();
        this.cubies = [];
        this.materials = {}; /* ... (Material creation remains the same) ... */
        Object.entries(COLORS).forEach(([name, color]) => {
            this.materials[name] = new THREE.MeshLambertMaterial({ color: color, side: THREE.DoubleSide });
        });
        if (!this.materials.GRAY) this.materials.GRAY = new THREE.MeshLambertMaterial({ color: COLORS.GRAY, side: THREE.DoubleSide });
        this.materials.INSIDE = new THREE.MeshLambertMaterial({ color: COLORS.BLACK, side: THREE.DoubleSide });

        const cubieSize = 1;
        const spacing = 0.05;
        const totalSize = cubieSize + spacing;
        const geometry = new THREE.BoxGeometry(cubieSize, cubieSize, cubieSize);

        for (let x = -1; x <= 1; x++) {
            for (let y = -1; y <= 1; y++) {
                for (let z = -1; z <= 1; z++) {
                    if (x === 0 && y === 0 && z === 0) continue;
                    const cubieMaterials = Array(6).fill(this.materials.INSIDE);
                    const cubie = new THREE.Mesh(geometry, cubieMaterials);
                    cubie.position.set(x * totalSize, y * totalSize, z * totalSize);
                    cubie.userData = { x, y, z, id: `cubie_${x}_${y}_${z}` };
                    this.cubies.push(cubie);
                    this.cubeGroup.add(cubie);
                }
            }
        }
        this.scene.add(this.cubeGroup);

        // Animation Loop
        this.animate = this.animate.bind(this);
        this.isAnimating = false;
    }

    updateColors(cubeStateData) { /* ... (updateColors logic remains the same) ... */
        console.log("Updating Three.js renderer colors...");
        if (!cubeStateData) {
            console.error("Cube state data is missing in updateColors.");
            return;
        }
        this.cubies.forEach(cubie => {
            if (!Array.isArray(cubie.material)) cubie.material = Array(6).fill(this.materials.INSIDE);
            else for (let i = 0; i < 6; i++) cubie.material[i] = this.materials.INSIDE;
        });
        const faceStickerIndices = { /* ... face mapping ... */
            'U': [{ y: 1 }, 2], 'D': [{ y: -1 }, 3], 'L': [{ x: -1 }, 1],
            'R': [{ x: 1 }, 0], 'F': [{ z: 1 }, 4], 'B': [{ z: -1 }, 5]
        };
        const stickerToCoordMap = (face, index) => { /* ... sticker mapping ... */
            const row = Math.floor(index / 3), col = index % 3, mapCoord = c => c - 1;
            switch (face) {
                case 'U': return { x: mapCoord(col), z: mapCoord(row) * -1 };
                case 'D': return { x: mapCoord(col), z: mapCoord(row) };
                case 'L': return { y: mapCoord(row) * -1, z: mapCoord(col) };
                case 'R': return { y: mapCoord(row) * -1, z: mapCoord(col) * -1 };
                case 'F': return { x: mapCoord(col), y: mapCoord(row) * -1 };
                case 'B': return { x: mapCoord(col) * -1, y: mapCoord(row) * -1 };
                default: return null;
            }
        };
        Object.entries(cubeStateData).forEach(([faceName, stickers]) => {
            const mapping = faceStickerIndices[faceName]; if (!mapping) return;
            const [coordFilter, faceIndex] = mapping;
            stickers.forEach((colorHexString, stickerIndex) => {
                const targetCoords = stickerToCoordMap(faceName, stickerIndex); if (!targetCoords) return;
                const targetCubie = this.cubies.find(cubie => {
                    const keys = Object.keys(targetCoords);
                    const stickerMatch = keys.every(key => cubie.userData[key] === targetCoords[key]);
                    if (!stickerMatch) return false;
                    const filterKey = Object.keys(coordFilter)[0];
                    return cubie.userData[filterKey] === coordFilter[filterKey];
                });
                if (targetCubie) {
                    const threeColorHex = HEX_STRING_TO_THREE_COLOR[colorHexString.toUpperCase()];
                    const material = Object.values(this.materials).find(m => m.color.getHex() === threeColorHex) || this.materials.GRAY;
                    if (Array.isArray(targetCubie.material)) targetCubie.material[faceIndex] = material;
                    else {
                        console.warn("Cubie material was not an array for", targetCubie.userData.id);
                        const newMaterials = Array(6).fill(this.materials.INSIDE);
                        newMaterials[faceIndex] = material; targetCubie.material = newMaterials;
                    }
                }
            });
        });
        console.log("Three.js color update finished.");
    }

    startAnimation() {
        if (this.animationFrameId) cancelAnimationFrame(this.animationFrameId);
        this.animate();
    }

    animate(time) {
        this.animationFrameId = requestAnimationFrame(this.animate);
        if (TWEEN) TWEEN.update(time);
        if (this.controls) this.controls.update();
        this.renderer.render(this.scene, this.camera);
    }

    // --- Rotation Animation (Direct Manipulation Method) ---
    async animateRotation(move, duration = 1000) {
        if (this.isAnimating) {
            console.warn("Animation already in progress."); return;
        }
        if (!TWEEN || !THREE) {
            console.error("TWEEN or THREE not loaded."); return;
        }

        this.isAnimating = true;
        console.log(`Animating move: ${move}`);

        // 1. Determine axis and angle
        const axisMap = { 'U': 'y', 'D': 'y', 'L': 'x', 'R': 'x', 'F': 'z', 'B': 'z' };
        const baseMove = move.charAt(0);
        const axisChar = axisMap[baseMove];
        if (!axisChar) {
            console.error(`Invalid move base: ${baseMove}`); this.isAnimating = false; return;
        }
        let angle = Math.PI / 2;
        if (move.endsWith("'")) angle = -angle;
        else if (move.endsWith("2")) angle = Math.PI;
        if (['D', 'L', 'B'].includes(baseMove)) angle = -angle;
        if (move.endsWith("'") && ['D', 'L', 'B'].includes(baseMove)) angle = -angle;
        if (move.endsWith("2") && ['D', 'L', 'B'].includes(baseMove)) angle = -angle;

        const rotationAxis = new THREE.Vector3();
        if (axisChar === 'x') rotationAxis.set(1, 0, 0);
        else if (axisChar === 'y') rotationAxis.set(0, 1, 0);
        else if (axisChar === 'z') rotationAxis.set(0, 0, 1);

        // 2. Find cubies and store initial states
        const coordFilterMap = { /* ... coord filters ... */
            'U': { y: 1 }, 'D': { y: -1 }, 'L': { x: -1 }, 'R': { x: 1 }, 'F': { z: 1 }, 'B': { z: -1 }
        };
        const filter = coordFilterMap[baseMove];
        const filterKey = Object.keys(filter)[0];
        const filterValue = filter[filterKey];
        const epsilon = 0.1; // Increased epsilon for float comparison after rotations
        const cubiesToRotate = this.cubies.filter(c =>
            Math.abs(c.position[filterKey] - filterValue * (1 + 0.05)) < epsilon // Check position relative to center, using spacing
        );

        const initialStates = new Map();
        cubiesToRotate.forEach(cubie => {
            initialStates.set(cubie, {
                position: cubie.position.clone(),
                quaternion: cubie.quaternion.clone()
            });
        });

        if (cubiesToRotate.length === 0) {
             console.error(`No cubies found for move ${move}. Check filter logic and epsilon.`); this.isAnimating = false; return;
        }
        if (cubiesToRotate.length !== 9) {
             console.warn(`Expected 9 cubies for move ${move}, found ${cubiesToRotate.length}`);
        }

        // 3. Create Tween animation
        const rotation = { value: 0 };
        const targetRotation = { value: angle };

        return new Promise((resolve) => {
            const tween = new TWEEN.Tween(rotation)
                .to(targetRotation, duration)
                .easing(TWEEN.Easing.Quadratic.InOut)
                .onUpdate(() => {
                    const currentAngle = rotation.value;
                    const currentQuaternion = new THREE.Quaternion().setFromAxisAngle(rotationAxis, currentAngle);
                    cubiesToRotate.forEach(cubie => {
                        const initialState = initialStates.get(cubie);
                        cubie.position.copy(initialState.position);
                        cubie.quaternion.copy(initialState.quaternion);
                        cubie.position.applyQuaternion(currentQuaternion);
                        cubie.quaternion.premultiply(currentQuaternion);
                    });
                })
                .onComplete(() => {
                    console.log(`Animation complete: ${move}`);
                    const finalQuaternion = new THREE.Quaternion().setFromAxisAngle(rotationAxis, angle);
                    cubiesToRotate.forEach(cubie => {
                        const initialState = initialStates.get(cubie);
                        cubie.position.copy(initialState.position);
                        cubie.quaternion.copy(initialState.quaternion);
                        cubie.position.applyQuaternion(finalQuaternion);
                        cubie.quaternion.premultiply(finalQuaternion);

                        // Snap positions to grid (adjust spacing if needed)
                        const step = 1 + 0.05;
                        cubie.position.x = Math.round(cubie.position.x / step) * step;
                        cubie.position.y = Math.round(cubie.position.y / step) * step;
                        cubie.position.z = Math.round(cubie.position.z / step) * step;
                        cubie.quaternion.normalize(); // Normalize quaternion
                    });
                    this.isAnimating = false;
                    resolve();
                })
                .start();
        });
    }

    setRotation(x, y) { /* ... (remains the same) ... */
         this.cubeGroup.rotation.x = x; this.cubeGroup.rotation.y = y;
    }
    resize(width, height) { /* ... (remains the same) ... */
        this.camera.aspect = width / height; this.camera.updateProjectionMatrix(); this.renderer.setSize(width, height);
    }
}
