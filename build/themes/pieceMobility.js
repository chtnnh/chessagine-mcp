import { Chess, WHITE, BLACK, QUEEN, ROOK, BISHOP, KNIGHT } from "chess.js";
import { getPiecePlacement } from "./piecePlacement.js";
function getSidePieces(chess, side) {
    const pieces = getPiecePlacement(chess, side);
    return [
        ...pieces.kingplacement,
        ...pieces.queenplacement,
        ...pieces.bishopplacement,
        ...pieces.knightplacement,
        ...pieces.rookplacement,
        ...pieces.pawnplacement,
    ];
}
export function getPieceMobility(fen, side) {
    const chess = new Chess(fen);
    // Calculate mobility for the requested side
    const ourMobility = calculateMobilityForSide(chess, fen, side);
    // Calculate mobility for opponent side
    const enemySide = side === WHITE ? BLACK : WHITE;
    const enemyMobility = calculateMobilityForSide(chess, fen, enemySide);
    // Mobility advantage: positive = we have more mobility, negative = opponent has more
    const mobilityAdvantage = ourMobility.totalmobility - enemyMobility.totalmobility;
    return {
        queenmobility: ourMobility.queenmobility,
        rookmobility: ourMobility.rookmobility,
        bishopmobility: ourMobility.bishopmobility,
        knightmobility: ourMobility.knightmobility,
        totalmobility: ourMobility.totalmobility,
        mobilityadvantage: mobilityAdvantage // Add this new field
    };
}
function calculateMobilityForSide(chess, fen, side) {
    const originalTurn = chess.turn();
    // If the turn is not the side we're analyzing, temporarily set it
    if (originalTurn !== side) {
        const fenParts = fen.split(' ');
        fenParts[1] = side; // set turn to the desired side
        chess.load(fenParts.join(' '));
    }
    const pieces = getSidePieces(chess, side);
    let queenMobility = 0, rookMobility = 0, bishopMobility = 0, knightMobility = 0;
    for (const square of pieces) {
        const piece = chess.get(square);
        if (!piece)
            continue;
        const moves = chess.moves({ square: square, verbose: true });
        const mobility = moves.length;
        switch (piece.type) {
            case QUEEN:
                queenMobility += mobility;
                break;
            case ROOK:
                rookMobility += mobility;
                break;
            case BISHOP:
                bishopMobility += mobility;
                break;
            case KNIGHT:
                knightMobility += mobility;
                break;
        }
    }
    // Restore original turn if we changed it
    if (originalTurn !== side) {
        const fenParts = fen.split(' ');
        fenParts[1] = originalTurn;
        chess.load(fenParts.join(' '));
    }
    return {
        queenmobility: queenMobility,
        rookmobility: rookMobility,
        bishopmobility: bishopMobility,
        knightmobility: knightMobility,
        totalmobility: queenMobility + rookMobility + bishopMobility + knightMobility
    };
}
