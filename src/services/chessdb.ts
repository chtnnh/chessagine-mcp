import { Chess } from "chess.js";
import { getChessDbNoteWord, normalizeChessDBScore } from "../utils/utils.js";
import { SERVICE_CONFIG_BASE_URL_MAP } from "./config.js";

interface ChessDbMove {
  uci: string;
  san: string;
  score: string;
  winrate: string;
  rank: number;
  note: string;
}

interface ChessDbPv {
  score: number;
  depth: number;
  pv: string[];
  pvSAN: string[];
}

interface ChessDbResponse {
  status: string;
  moves: any[];
}

interface ChessDbPvResponse {
  status: string;
  score: number;
  depth: number;
  pv: string[];
  pvSAN: string[];
}

export interface ExpandQueueStreamResult {
  success:                   boolean;
  estimatedNodesVisited:     number;  // geometric series: sum of width^d for d=0..depth
  estimatedPositionsQueued:  number;  // width^depth * width, capped by maxPositionsQueued
  queuedFens:                string[];
  errors:                    string[];
}
 

export class ChessDBService {
  private baseUrl: string;
  private streamUrl: string;

  constructor(baseUrl: string = SERVICE_CONFIG_BASE_URL_MAP.CHESSDB_BASE_URL) {
    this.baseUrl = baseUrl;
    this.streamUrl = SERVICE_CONFIG_BASE_URL_MAP.SF_BASE_URL;
  }

  async getAnalysis(
    fen: string,
  ): Promise<{
    data?: { moves: ChessDbMove[]; totalMoves: number };
    error?: string;
  }> {
    if (!fen) return { error: "Missing required argument: fen" };

    const encodedFen = encodeURIComponent(fen);
    const apiUrl = `${this.baseUrl}?action=queryall&board=${encodedFen}&json=1`;

    try {
      const response = await fetch(apiUrl);
      if (!response.ok)
        return {
          error: `HTTP ${response.status}: Failed to fetch ChessDB data`,
        };

      const responseData = (await response.json()) as ChessDbResponse;
      if (responseData.status !== "ok") {
        await this.queueAnalysis(fen);
        return {
          error: `Position evaluation not available: ${responseData.status}`,
        };
      }

      const moves = responseData.moves;
      if (!Array.isArray(moves) || moves.length === 0)
        return { error: "No candidate moves found for this position." };

      const processedMoves = this.processMoves(moves, fen);
      return {
        data: { moves: processedMoves, totalMoves: processedMoves.length },
      };
    } catch (error) {
      return { error: `Request failed: ${error}` };
    }
  }

  async getPv(fen: string): Promise<{ data?: ChessDbPv; error?: string }> {
    if (!fen) return { error: "Missing required argument: fen" };

    const encodedFen = encodeURIComponent(fen);
    const pvUrl = `${this.baseUrl}?action=querypv&board=${encodedFen}&stable=1&json=1`;

    try {
      const response = await fetch(pvUrl);
      if (!response.ok) {
        await this.queueAnalysis(fen);
        return { error: `HTTP ${response.status}: Failed to fetch PV` };
      }

      const responseData = (await response.json()) as ChessDbPvResponse;
      if (responseData.status !== "ok")
        return { error: `PV not available: ${responseData.status}` };

      return {
        data: {
          score: responseData.score,
          depth: responseData.depth,
          pv: responseData.pv ?? [],
          pvSAN: responseData.pvSAN ?? [],
        },
      };
    } catch (error) {
      return { error: `Request failed: ${error}` };
    }
  }

  async queueAnalysis(
    fen: string,
  ): Promise<{ success?: boolean; error?: string }> {
    if (!fen) return { error: "Missing required argument: fen" };

    const encodedFen = encodeURIComponent(fen);
    const queueUrl = `${this.baseUrl}?action=queue&board=${encodedFen}&json=1`;

    try {
      const response = await fetch(queueUrl);
      if (!response.ok)
        return { error: `HTTP ${response.status}: Failed to queue analysis` };

      const responseData = (await response.json()) as { status: string };
      if (responseData.status !== "ok")
        return { error: `Failed to queue position: ${responseData.status}` };

      return { success: true };
    } catch (error) {
      return { error: `Request failed: ${error}` };
    }
  }

 async expandQueueStream(
  fen: string,
  options: {
    expansionDepth?:     number;
    expansionWidth?:     number;
    maxPositionsQueued?: number;
  } = {},
): Promise<{ data?: ExpandQueueStreamResult; error?: string }> {
  if (!fen) return { error: "Missing required argument: fen" };
 
  const url = `${this.streamUrl}/expandqueue`;
 
  const expansionDepth     = options.expansionDepth     ?? 4;
  const expansionWidth     = options.expansionWidth     ?? 2;
  const maxPositionsQueued = options.maxPositionsQueued ?? 20;
 
  // Estimated nodes visited = sum of width^d for d=0..depth (geometric series)
  // Estimated positions queued = width^depth leaf nodes * width candidates each,
  // capped by maxPositionsQueued
  const estimatedNodesVisited = expansionWidth === 1
    ? expansionDepth + 1
    : Math.round((Math.pow(expansionWidth, expansionDepth + 1) - 1) / (expansionWidth - 1));
  const estimatedQueued = Math.min(
    Math.pow(expansionWidth, expansionDepth) * expansionWidth,
    maxPositionsQueued,
  );
 
  try {
    const response = await fetch(url, {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fen,
        ...(options.expansionDepth     != null && { expansionDepth }),
        ...(options.expansionWidth     != null && { expansionWidth }),
        ...(options.maxPositionsQueued != null && { maxPositionsQueued }),
      }),
    });
 
    if (!response.ok) {
      const text = await response.text().catch(() => "");
      return { error: `HTTP ${response.status}: ${text || "expandqueue request failed"}` };
    }
 
    const json = (await response.json()) as {
      success:    boolean;
      queuedFens: string[];
      errors?:    string[];
    };
 
    if (!json.success || (json.errors && json.errors.length > 0)) {
      return { error: json.errors?.join(", ") ?? "expandqueue reported failure" };
    }
 
    return {
      data: {
        success:                true,
        estimatedNodesVisited,
        estimatedPositionsQueued: estimatedQueued,
        queuedFens:             json.queuedFens ?? [],
        errors:                 [],
      },
    };
  } catch (error) {
    return { error: `Request failed: ${error}` };
  }
}
 

  private processMoves(moves: any[], fen: string): ChessDbMove[] {
    const turn = new Chess(fen).turn();

    return moves.map((move: any) => {
      const scoreNum = Number(move.score);
      const fixedNote = getChessDbNoteWord(move.note?.split(" ")[0] || "");
      const normalizedScore = normalizeChessDBScore(scoreNum, turn);
      const scoreStr = isNaN(normalizedScore)
        ? "N/A"
        : (normalizedScore / 100).toFixed(2);

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
