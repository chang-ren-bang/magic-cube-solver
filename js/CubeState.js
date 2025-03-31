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

        // console.log("Performed U rotation"); // Keep console logs minimal for production
    }

    rotateUPrime() { this.rotateU(); this.rotateU(); this.rotateU(); } // U' = U U U

    rotateD() {
        const D = this.state.D;
        const F = this.state.F;
        const R = this.state.R;
        const B = this.state.B;
        const L = this.state.L;

        this.cycle(D, [0, 2, 8, 6]); // Corners
        this.cycle(D, [1, 5, 7, 3]); // Edges

        const temp = [F[6], F[7], F[8]];
        F[6] = L[6]; F[7] = L[7]; F[8] = L[8];
        L[6] = B[6]; L[7] = B[7]; L[8] = B[8];
        B[6] = R[6]; B[7] = R[7]; B[8] = R[8];
        R[6] = temp[0]; R[7] = temp[1]; R[8] = temp[2];
    }
    rotateDPrime() { this.rotateD(); this.rotateD(); this.rotateD(); }

    rotateR() {
        const R = this.state.R;
        const U = this.state.U;
        const F = this.state.F;
        const D = this.state.D;
        const B = this.state.B;

        this.cycle(R, [0, 2, 8, 6]); // Corners
        this.cycle(R, [1, 5, 7, 3]); // Edges

        const temp = [U[2], U[5], U[8]];
        U[2] = F[2]; U[5] = F[5]; U[8] = F[8];
        F[2] = D[2]; F[5] = D[5]; F[8] = D[8];
        D[2] = B[6]; D[5] = B[3]; D[8] = B[0]; // Note B face indices are reversed (0,3,6 -> 6,3,0)
        B[6] = temp[0]; B[3] = temp[1]; B[0] = temp[2];
    }
    rotateRPrime() { this.rotateR(); this.rotateR(); this.rotateR(); }

    rotateL() {
        const L = this.state.L;
        const U = this.state.U;
        const F = this.state.F;
        const D = this.state.D;
        const B = this.state.B;

        this.cycle(L, [0, 2, 8, 6]); // Corners
        this.cycle(L, [1, 5, 7, 3]); // Edges

        const temp = [U[0], U[3], U[6]];
        U[0] = B[8]; U[3] = B[5]; U[6] = B[2]; // Note B face indices are reversed (8,5,2 -> 0,3,6)
        B[8] = D[0]; B[5] = D[3]; B[2] = D[6];
        D[0] = F[0]; D[3] = F[3]; D[6] = F[6];
        F[0] = temp[0]; F[3] = temp[1]; F[6] = temp[2];
    }
    rotateLPrime() { this.rotateL(); this.rotateL(); this.rotateL(); }

    rotateF() {
        const F = this.state.F;
        const U = this.state.U;
        const R = this.state.R;
        const D = this.state.D;
        const L = this.state.L;

        this.cycle(F, [0, 2, 8, 6]); // Corners
        this.cycle(F, [1, 5, 7, 3]); // Edges

        const temp = [U[6], U[7], U[8]];
        U[6] = L[8]; U[7] = L[5]; U[8] = L[2]; // Note L face indices (top row 2,5,8 -> right col 8,5,2)
        L[8] = D[2]; L[5] = D[1]; L[2] = D[0]; // Note D face indices (bottom row 0,1,2 -> left col 2,5,8)
        D[2] = R[6]; D[1] = R[3]; D[0] = R[0]; // Note R face indices (left col 0,3,6 -> top row 6,7,8)
        R[6] = temp[0]; R[3] = temp[1]; R[0] = temp[2];
    }
    rotateFPrime() { this.rotateF(); this.rotateF(); this.rotateF(); }

    rotateB() {
        const B = this.state.B;
        const U = this.state.U;
        const R = this.state.R;
        const D = this.state.D;
        const L = this.state.L;

        this.cycle(B, [0, 2, 8, 6]); // Corners
        this.cycle(B, [1, 5, 7, 3]); // Edges

        const temp = [U[0], U[1], U[2]];
        U[0] = R[2]; U[1] = R[5]; U[2] = R[8]; // Note R face indices (right col 2,5,8 -> top row 0,1,2)
        R[2] = D[8]; R[5] = D[7]; R[8] = D[6]; // Note D face indices (top row 6,7,8 -> left col 8,5,2)
        D[8] = L[6]; D[7] = L[3]; D[6] = L[0]; // Note L face indices (left col 0,3,6 -> bottom row 8,7,6)
        L[6] = temp[0]; L[3] = temp[1]; L[0] = temp[2];
    }
    rotateBPrime() { this.rotateB(); this.rotateB(); this.rotateB(); }


    // --- Scramble Logic ---
    applySequence(sequence) {
        const moves = sequence.trim().split(/\s+/);
        moves.forEach(move => {
            this.applyMove(move);
        });
    }

    applyMove(move) {
        // Expanded to handle prime moves
        switch (move) {
            case 'U': this.rotateU(); break;
            case 'R': this.rotateR(); break;
            case 'F': this.rotateF(); break;
            case 'D': this.rotateD(); break;
            case 'L': this.rotateL(); break;
            case 'B': this.rotateB(); break;
            case "U'": this.rotateUPrime(); break;
            case "R'": this.rotateRPrime(); break;
            case "F'": this.rotateFPrime(); break;
            case "D'": this.rotateDPrime(); break;
            case "L'": this.rotateLPrime(); break;
            case "B'": this.rotateBPrime(); break;
            // TODO: Add double moves (U2, R2, etc.) if needed
            // case 'U2': this.rotateU(); this.rotateU(); break;
            default:
                // Allow empty strings or whitespace in sequence without warning
                if (move && move.trim().length > 0) {
                    console.warn(`Move "${move}" not recognized or implemented yet.`);
                }
        }
    }

    // Generates a random scramble sequence, now including prime moves and better logic
    generateScramble(length = 20) {
        const baseMoves = ['U', 'R', 'F', 'D', 'L', 'B'];
        const modifiers = ['', "'"]; // Add '2' for double moves if desired
        const allPossibleMoves = [];
        baseMoves.forEach(base => {
            modifiers.forEach(mod => {
                allPossibleMoves.push(base + mod);
            });
        });

        let scramble = [];
        let lastMove = null;
        let secondLastMove = null; // Keep track of the move before the last one

        const getAxis = (move) => {
            if (!move) return -1;
            const base = move.charAt(0);
            if (base === 'U' || base === 'D') return 0; // Y axis
            if (base === 'R' || base === 'L') return 1; // X axis
            if (base === 'F' || base === 'B') return 2; // Z axis
            return -1;
        };

        const getOppositeAxisMoveBase = (move) => {
             if (!move) return null;
             const base = move.charAt(0);
             if (base === 'U') return 'D';
             if (base === 'D') return 'U';
             if (base === 'R') return 'L';
             if (base === 'L') return 'R';
             if (base === 'F') return 'B';
             if (base === 'B') return 'F';
             return null;
        }

        while (scramble.length < length) {
            let possibleNextMoves = [...allPossibleMoves];
            const lastAxis = getAxis(lastMove);

            if (lastMove) {
                // 1. Filter out moves on the same axis as the last move
                possibleNextMoves = possibleNextMoves.filter(m => getAxis(m) !== lastAxis);

                // 2. If the previous two moves were on the same axis (e.g., R L ...),
                //    prevent the next move from being on the first axis again (e.g., prevent R L R')
                const secondLastAxis = getAxis(secondLastMove);
                if (secondLastMove && secondLastAxis !== lastAxis) { // Check if axes are different
                    const oppositeBase = getOppositeAxisMoveBase(lastMove);
                    if (oppositeBase === secondLastMove.charAt(0)) { // Check if last move is opposite of second last
                         possibleNextMoves = possibleNextMoves.filter(m => getAxis(m) !== secondLastAxis);
                    }
                }
            }


            if (possibleNextMoves.length === 0) {
                 // Fallback if filtering is too strict (shouldn't happen often with this logic)
                 console.warn("Scramble generation fallback triggered. Filtering might be too strict.");
                 possibleNextMoves = [...allPossibleMoves];
                 // Still try to avoid repeating the last move's axis if possible
                 if(lastMove) {
                     const filteredFallback = possibleNextMoves.filter(m => getAxis(m) !== lastAxis);
                     if (filteredFallback.length > 0) possibleNextMoves = filteredFallback;
                 }
            }

            const nextMove = possibleNextMoves[Math.floor(Math.random() * possibleNextMoves.length)];
            scramble.push(nextMove);
            secondLastMove = lastMove;
            lastMove = nextMove;
        }

        return scramble.join(' ');
    }
}
