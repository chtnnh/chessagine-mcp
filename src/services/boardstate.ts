import { getBoardState, calculateDeep } from "../protocol/state.js";
import { PositionPrompter } from "../protocol/positionPrompter.js";
import { LegalMoveResult, BoardStateResult } from "./types.js";

export class BoardStateService {

  
  checkLegalMove(fen: string, move: string, is960: boolean): LegalMoveResult {
    if (!fen) {
      return { error: "Missing required argument: fen" };
    }
    
    if (!move) {
      return { error: "Missing required argument: move" };
    }

    try {
      const boardState = getBoardState(fen, is960);
      
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
      const isLegal =
        legalMoves.includes(moveToCheck) ||
        legalMoves.map((m: string) => m.toLowerCase()).includes(moveToCheck.toLowerCase());

      return {
        data: {
          isLegal,
          message: isLegal
            ? "Move is legal."
            : "Move is not legal in this position.",
        }
      };
    } catch (error) {
      return {
        data: {
          isLegal: false,
          message: "Error checking move legality."
        }
      };
    }
  }

  getBoardStateForMove(fen: string, move: string, is960: boolean): BoardStateResult {
    if (!fen) {
      return { error: "Missing required argument: fen" };
    }
    
    if (!move) {
      return { error: "Missing required argument: move" };
    }

    try {
      const boardState = calculateDeep(fen, move, is960);
      
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
    } catch (error) {
      return {
        error: "Error generating board state prompt"
      };
    }
  }

  getBoardStateForFen(fen: string, is960: boolean): BoardStateResult {
    if (!fen) {
      return { error: "Missing required argument: fen" };
    }

    try {
      const boardState = getBoardState(fen, is960);
      
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
    } catch (error) {
      return {
        error: "Error generating board state prompt"
      };
    }
  }
}