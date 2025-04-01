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
        // 初始化方塊顏色
        const cubieMaterials = [];
        // 右面 (x = 1) -> 橙色
        cubieMaterials[0] = x === 1 ? this.materials.ORANGE : this.materials.INSIDE;
        // 左面 (x = -1) -> 紅色
        cubieMaterials[1] = x === -1 ? this.materials.RED : this.materials.INSIDE;
        // 上面 (y = 1) -> 黃色
        cubieMaterials[2] = y === 1 ? this.materials.YELLOW : this.materials.INSIDE;
        // 下面 (y = -1) -> 白色
        cubieMaterials[3] = y === -1 ? this.materials.WHITE : this.materials.INSIDE;
        // 前面 (z = 1) -> 綠色
        cubieMaterials[4] = z === 1 ? this.materials.GREEN : this.materials.INSIDE;
        // 後面 (z = -1) -> 藍色
        cubieMaterials[5] = z === -1 ? this.materials.BLUE : this.materials.INSIDE;

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
        // 計算旋轉角度
        let angle = Math.PI / 2;
        
        // 處理基本角度方向
        // D、L、B 面的基本旋轉方向與 U、R、F 相反
        if (['D', 'L', 'B'].includes(baseMove)) {
            angle = -angle;
        }
        
        // 處理修飾符
        if (move.endsWith("'")) {
            angle = -angle; // 反向旋轉
        } else if (move.endsWith("2")) {
            angle = angle * 2; // 雙倍旋轉，保持原方向
        }

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

    // 重置方塊到初始狀態
    reset() {
        this.isAnimating = true;
        const totalSize = 1 + 0.05; // cubieSize + spacing

        // 重置每個方塊的位置和旋轉
        this.cubies.forEach(cubie => {
            const { x, y, z } = cubie.userData;
            cubie.position.set(x * totalSize, y * totalSize, z * totalSize);
            cubie.quaternion.identity(); // 重置旋轉
        });

        this.isAnimating = false;
    }
}
