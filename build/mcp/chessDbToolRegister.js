import { fenSchema, } from "../runner/schema.js";
import { getChessDbNoteWord, normalizeChessDBScore, } from "../utils/utils.js";
import { Chess } from "chess.js";
export function registerChessDBTools(server) {
    server.registerTool("get-chessdb-analysis", {
        description: "Fetch position analysis and candidate moves from ChessDB",
        inputSchema: {
            fen: fenSchema
        }
    }, async ({ fen }) => {
        const encodedFen = encodeURIComponent(fen);
        const apiUrl = `https://www.chessdb.cn/cdb.php?action=queryall&board=${encodedFen}&json=1`;
        const response = await fetch(apiUrl);
        if (!response.ok) {
            return {
                content: [
                    {
                        type: "text",
                        text: `HTTP ${response.status}: Failed to fetch ChessDB data`,
                    },
                ],
            };
        }
        const responseData = await response.json();
        if (responseData.status !== "ok") {
            return {
                content: [
                    {
                        type: "text",
                        text: `Position evaluation not available: ${responseData.status}`,
                    },
                ],
            };
        }
        const moves = responseData.moves;
        if (!Array.isArray(moves) || moves.length === 0) {
            return {
                content: [
                    {
                        type: "text",
                        text: "No candidate moves found for this position.",
                    },
                ],
            };
        }
        const processedMoves = moves.map((move) => {
            const scoreNum = Number(move.score);
            const fixedNote = getChessDbNoteWord(move.note?.split(" ")[0] || "");
            const turn = new Chess(fen).turn();
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
        return {
            content: [
                {
                    type: "text",
                    text: JSON.stringify({
                        moves: processedMoves,
                        totalMoves: processedMoves.length
                    }, null, 2),
                },
            ],
        };
    });
}
