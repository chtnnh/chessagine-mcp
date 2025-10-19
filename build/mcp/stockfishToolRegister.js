import { fenSchema, } from "../runner/schema.js";
import { getChessDbNoteWord, } from "../utils/utils.js";
export function registerChessDBTools(server) {
    server.tool("get-chessdb-analysis", "Fetch position analysis and candidate moves from ChessDB", {
        fen: fenSchema,
    }, async ({ fen }) => {
        const encodedFen = encodeURIComponent(fen);
        const apiUrl = `https://www.chessdb.cn/cdb.php?action=queryall&board=${encodedFen}&json=1`;
        const response = await fetch(apiUrl);
        if (!response.ok) {
            return {
                content: [
                    {
                        type: "text", // 
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
            const scoreStr = isNaN(scoreNum) ? "N/A" : (scoreNum / 100).toFixed(2);
            return {
                uci: move.uci || "N/A",
                san: move.san || "N/A",
                score: scoreStr, // need to take a look at score 
                /**
                 * TODO fix this
                 * It just gets confused as black sometimes because ChessDB by default shows scores with negative being bad for the side to move rather than always from the perspective of white
                 */
                winrate: move.winrate || "N/A",
                rank: move.rank,
                note: getChessDbNoteWord(move.note?.split(" ")[0] || ""),
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
