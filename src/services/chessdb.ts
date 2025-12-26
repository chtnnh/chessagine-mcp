import { Chess } from "chess.js";
import { getChessDbNoteWord, normalizeChessDBScore } from "../utils/utils.js";

export class ChessDBService {
  private baseUrl: string;

  constructor(baseUrl: string = "https://www.chessdb.cn/cdb.php") {
    this.baseUrl = baseUrl;
  }

  async getAnalysis(fen: string): Promise<{ data?: any; error?: string }> {
    if (!fen) {
      return { error: "Missing required argument: fen" };
    }

    const encodedFen = encodeURIComponent(fen);
    const apiUrl = `${this.baseUrl}?action=queryall&board=${encodedFen}&json=1`;

    try {
      const response = await fetch(apiUrl);
      
      if (!response.ok) {
        return { error: `HTTP ${response.status}: Failed to fetch ChessDB data` };
      }

      const responseData = await response.json();
      
      if (responseData.status !== "ok") {
        return { error: `Position evaluation not available: ${responseData.status}` };
      }

      const moves = responseData.moves;
      
      if (!Array.isArray(moves) || moves.length === 0) {
        return { error: "No candidate moves found for this position." };
      }

      const processedMoves = this.processMoves(moves, fen);

      return {
        data: {
          moves: processedMoves,
          totalMoves: processedMoves.length
        }
      };
    } catch (error) {
      return { error: `Request failed: ${error}` };
    }
  }

  private processMoves(moves: any[], fen: string): any[] {
    const turn = new Chess(fen).turn();

    return moves.map((move: any) => {
      const scoreNum = Number(move.score);
      const fixedNote = getChessDbNoteWord(move.note?.split(" ")[0] || "");
      const normalizedScore = normalizeChessDBScore(scoreNum, turn);
      const scoreStr = isNaN(normalizedScore) ? "N/A" : (normalizedScore / 100).toFixed(2);

      return {
        uci: move.uci || "N/A",
        san: move.san || "N/A",
        score: scoreStr,
        winrate: move.winrate || "N/A",
        rank: move.rank,
        note: fixedNote,
      };
    });
  }
}