// js/SimpleSolver.js

/**
 * A "naive" solver that simply reverses a given scramble sequence.
 * It takes the scramble sequence, reverses the order of moves,
 * and inverts each move (R -> R', U' -> U).
 *
 * @param {string} scrambleSequence - The scramble sequence string (e.g., "R U F'").
 * @returns {string} The reversed and inverted sequence.
 */
export function solve(scrambleSequence) {
    console.log("Using SimpleSolver (naive reverse) for scramble:", scrambleSequence);

    if (!scrambleSequence || typeof scrambleSequence !== 'string' || scrambleSequence.trim().length === 0) {
        console.warn("SimpleSolver received an empty or invalid scramble sequence.");
        return ""; // Return empty if no valid scramble provided
    }

    const moves = scrambleSequence.trim().split(/\s+/);
    const reversedMoves = moves.reverse(); // Reverse the order of moves

    const invertedSequence = reversedMoves.map(move => {
        if (move.endsWith("'")) {
            // If it's a prime move (e.g., R'), remove the prime
            return move.slice(0, -1);
        } else if (move.endsWith('2')) {
             // If it's a double move (e.g., U2), it stays the same when inverted
             // (Assuming CubeState handles double moves, which it currently might not fully)
             return move;
        } else {
            // If it's a standard move (e.g., F), add a prime
            return move + "'";
        }
    }).join(' '); // Join the inverted moves back into a string

    console.log("SimpleSolver returning inverted sequence:", invertedSequence);
    return invertedSequence;
}
