// js/CubeState.js

// Face names and their order often used in state representations
const FACES = ['U', 'R', 'F', 'D', 'L', 'B']; // Up, Right, Front, Down, Left, Back

// Standard Rubik's Cube Colors (matching CubeRenderer)
const COLORS = {
    WHITE: '#FFFFFF',
    YELLOW: '#FFFF00',
    BLUE: '#0000FF',
    GREEN: '#00FF00',
    RED: '#FF0000',
    ORANGE: '#FF8C00',
};

// Map face names to colors for a solved state
const SOLVED_STATE_COLORS = {
    U: COLORS.YELLOW, // Top
    R: COLORS.ORANGE, // Right
    F: COLORS.GREEN,  // Front
    D: COLORS.WHITE,  // Down
    L: COLORS.RED,    // Left
    B: COLORS.BLUE,   // Back
};

export class CubeState {
    constructor() {
        this.state = this.createSolvedState();
    }

    // Creates the state representation for a solved cube.
    // We'll use a simple object mapping face names (U, R, F, D, L, B)
    // to a 1D array of 9 colors representing the facelets (0-8, row by row).
    createSolvedState() {
        const state = {};
        FACES.forEach(face => {
            state[face] = Array(9).fill(SOLVED_STATE_COLORS[face]);
        });
        return state;
        /* Facelet indexing (example for U face):
           0 1 2
           3 4 5
           6 7 8
        */
    }

    // Gets the current state
    getState() {
        return this.state;
    }

    // --- Rotation Logic ---
    // Helper function to rotate elements in an array (cycle)
    cycle(arr, indices) {
        const temp = arr[indices[indices.length - 1]];
        for (let i = indices.length - 1; i > 0; i--) {
            arr[indices[i]] = arr[indices[i - 1]];
        }
        arr[indices[0]] = temp;
    }

    // Example: Rotate the U face clockwise
    rotateU() {
        const U = this.state.U;
        const F = this.state.F;
        const R = this.state.R;
        const B = this.state.B;
        const L = this.state.L;

        // Rotate facelets on the U face itself
        this.cycle(U, [0, 2, 8, 6]); // Corners
        this.cycle(U, [1, 5, 7, 3]); // Edges

        // Rotate adjacent facelets on side faces
        const temp = [F[0], F[1], F[2]];
        F[0] = R[0]; F[1] = R[1]; F[2] = R[2];
        R[0] = B[0]; R[1] = B[1]; R[2] = B[2];
        B[0] = L[0]; B[1] = L[1]; B[2] = L[2];
        L[0] = temp[0]; L[1] = temp[1]; L[2] = temp[2];

        console.log("Performed U rotation");
    }

    // Placeholder for other rotations (R, F, D, L, B, inverses, doubles)
    // TODO: Implement other rotation functions (R, F, D, L, B, U', R', F', D', L', B', U2, R2, etc.)

    // --- Scramble Logic ---
    applySequence(sequence) {
        const moves = sequence.trim().split(/\s+/);
        moves.forEach(move => {
            this.applyMove(move);
        });
    }

    applyMove(move) {
        // Basic implementation, needs expansion for inverse and double moves
        switch (move) {
            case 'U': this.rotateU(); break;
            // case 'R': this.rotateR(); break;
            // case 'F': this.rotateF(); break;
            // case 'D': this.rotateD(); break;
            // case 'L': this.rotateL(); break;
            // case 'B': this.rotateB(); break;
            // case "U'": this.rotateUPrime(); break;
            // ... and so on for all moves
            default:
                console.warn(`Move ${move} not implemented yet.`);
        }
    }

    // Generates a random scramble sequence (simple version)
    generateScramble(length = 20) {
        const allMoves = ['U', 'R', 'F', 'D', 'L', 'B'];
        // TODO: Add inverse and double moves ('U\'', 'U2', etc.)
        // TODO: Prevent redundant moves (e.g., U U', R L R')

        let scramble = [];
        let lastAxis = -1; // 0: U/D, 1: R/L, 2: F/B

        for (let i = 0; i < length; i++) {
            let availableMoves = [];
            let currentAxis = -1;

            // Filter moves to avoid turning the same face twice or immediately reversing
            if (lastAxis === 0) availableMoves = allMoves.filter(m => m !== 'U' && m !== 'D');
            else if (lastAxis === 1) availableMoves = allMoves.filter(m => m !== 'R' && m !== 'L');
            else if (lastAxis === 2) availableMoves = allMoves.filter(m => m !== 'F' && m !== 'B');
            else availableMoves = [...allMoves]; // First move

            if (availableMoves.length === 0) availableMoves = [...allMoves]; // Should not happen with basic moves

            const move = availableMoves[Math.floor(Math.random() * availableMoves.length)];
            scramble.push(move);

            // Update lastAxis
            if (move === 'U' || move === 'D') currentAxis = 0;
            else if (move === 'R' || move === 'L') currentAxis = 1;
            else if (move === 'F' || move === 'B') currentAxis = 2;
            lastAxis = currentAxis;
        }
        return scramble.join(' ');
    }
}
