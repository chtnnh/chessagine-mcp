import { fenSchema, } from "../runner/schema.js";
import { getChessDbNoteWord, normalizeChessDBScore, } from "../utils/utils.js";
import { Chess } from "chess.js";
export function registerChessDBTools(server) {
    server.registerTool("get-chessdb-analysis", {
        description: "Fetch position analysis and candidate moves from ChessDB",
        inputSchema: {
            fen: fenSchema
        },
        annotations: {
            openWorldHint: true
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
    server.registerTool("get-chessdb-llm-analysis", {
        description: "Get LLM-powered position analysis from ChessDB. The position must exist in the ChessDB database.",
        inputSchema: {
            fen: fenSchema
        },
        annotations: {
            openWorldHint: true
        }
    }, async ({ fen }) => {
        const encodedFen = encodeURIComponent(fen);
        const apiUrl = `https://www.chessdb.cn/llm.php?lang=1&action=cllm&board=${encodedFen}`;
        try {
            const response = await fetch(apiUrl, {
                headers: {
                    'Referer': 'https://www.chessdb.cn/',
                }
            });
            if (!response.ok) {
                return {
                    content: [
                        {
                            type: "text",
                            text: `HTTP ${response.status}: Failed to fetch ChessDB LLM analysis`,
                        },
                    ],
                };
            }
            if (!response.body) {
                return {
                    content: [
                        {
                            type: "text",
                            text: "No response body received from ChessDB LLM API",
                        },
                    ],
                };
            }
            // Read SSE stream
            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let analysis = "";
            while (true) {
                const { done, value } = await reader.read();
                if (done)
                    break;
                const chunk = decoder.decode(value, { stream: true });
                const lines = chunk.split('\n');
                for (const line of lines) {
                    if (line.startsWith('data: ')) {
                        const data = line.slice(6).trim();
                        if (data && data !== '[DONE]') {
                            analysis += data;
                        }
                    }
                }
            }
            if (!analysis) {
                return {
                    content: [
                        {
                            type: "text",
                            text: "Position not found in ChessDB database or no analysis available.",
                        },
                    ],
                };
            }
            return {
                content: [
                    {
                        type: "text",
                        text: analysis,
                    },
                ],
            };
        }
        catch (error) {
            return {
                content: [
                    {
                        type: "text",
                        text: `Error fetching ChessDB LLM analysis: ${error instanceof Error ? error.message : String(error)}`,
                    },
                ],
            };
        }
    });
}
