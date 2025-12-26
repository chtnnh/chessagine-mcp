import { getBoardState, calculateDeep } from "../protocol/state.js";
import { PositionPrompter } from "../protocol/positionPrompter.js";
export class BoardStateService {
    checkLegalMove(fen, move) {
        if (!fen) {
            return { error: "Missing required argument: fen" };
        }
        if (!move) {
            return { error: "Missing required argument: move" };
        }
        try {
            const boardState = getBoardState(fen);
            if (!boardState) {
                return {
                    data: {
                        isLegal: false,
                        message: "Invalid FEN string"
                    }
                };
            }
            const legalMoves = boardState.legalMoves || [];
            const moveToCheck = move.trim();
            const isLegal = legalMoves.includes(moveToCheck) ||
                legalMoves.map((m) => m.toLowerCase()).includes(moveToCheck.toLowerCase());
            return {
                data: {
                    isLegal,
                    message: isLegal
                        ? "Move is legal."
                        : "Move is not legal in this position.",
                }
            };
        }
        catch (error) {
            return {
                data: {
                    isLegal: false,
                    message: "Error checking move legality."
                }
            };
        }
    }
    getBoardStateForMove(fen, move) {
        if (!fen) {
            return { error: "Missing required argument: fen" };
        }
        if (!move) {
            return { error: "Missing required argument: move" };
        }
        try {
            const boardState = calculateDeep(fen, move);
            if (!boardState || !boardState.validfen) {
                return {
                    error: "Invalid move or FEN. Cannot generate board state prompt."
                };
            }
            const prompt = new PositionPrompter(boardState).generatePrompt();
            return {
                data: {
                    state: boardState,
                    description: prompt
                }
            };
        }
        catch (error) {
            return {
                error: "Error generating board state prompt"
            };
        }
    }
    getBoardStateForFen(fen) {
        if (!fen) {
            return { error: "Missing required argument: fen" };
        }
        try {
            const boardState = getBoardState(fen);
            if (!boardState || !boardState.validfen) {
                return {
                    error: "Invalid FEN. Cannot generate board state prompt."
                };
            }
            const prompt = new PositionPrompter(boardState).generatePrompt();
            return {
                data: {
                    state: boardState,
                    description: prompt
                }
            };
        }
        catch (error) {
            return {
                error: "Error generating board state prompt"
            };
        }
    }
}
