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

    // 反轉序列順序並反轉每一步的操作
    const invertedSequence = reversedMoves.map(move => {
        // 處理不同類型的動作
        if (move.endsWith("'")) {
            // 如果是逆時針操作（如 R'），移除撇號變成順時針
            return move.slice(0, -1);
        } else if (move.endsWith('2')) {
            // 如果是雙倍旋轉（如 U2），保持不變
            return move;
        } else {
            // 如果是順時針操作（如 F），加上撇號變成逆時針
            return move + "'";
        }
    }).join(' ');

    console.log("SimpleSolver returning inverted sequence:", invertedSequence);
    return invertedSequence;
}
