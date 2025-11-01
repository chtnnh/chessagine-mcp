import { getKnowledgeBase } from "../tools/knowlegebase.js";
import { moveToFenMap, PROMPT_CATEGORIES } from "../utils/utils.js";
import { PUZZLE_THEMES } from "../tools/puzzle.js";
import { gamePgnSchema } from "../runner/schema.js";
import { collectFensFromGame } from "../utils/utils.js";
import z from "zod";
export function registerUtilsTools(server) {
    server.registerTool("get-chess-knowledgebase", {
        description: "Returns a comprehensive chess knowledgebase including Silman Imbalances, Fine's 30 chess principles, endgame principles, and practical checklists",
        inputSchema: {}
    }, async () => {
        try {
            const knowledge = getKnowledgeBase();
            return {
                content: [
                    {
                        type: "text",
                        text: knowledge,
                    },
                ],
            };
        }
        catch (error) {
            return {
                content: [
                    {
                        type: "text",
                        text: `Error getting chess knowledge base:`,
                    },
                ],
            };
        }
    });
    server.registerTool("get-chessagine-stater-prompts", {
        description: "List all available chess analysis prompt categories with their example prompts",
        inputSchema: {}
    }, async () => {
        const categories = Object.entries(PROMPT_CATEGORIES).map(([key, value]) => ({
            id: key,
            name: value.name,
            promptCount: value.prompts.length
        }));
        return {
            content: [
                {
                    type: "text",
                    text: JSON.stringify(categories, null, 2)
                }
            ],
        };
    });
    server.registerTool("get-puzzle-themes", {
        description: "Get a list of all available puzzle themes that can be used to filter puzzles",
        inputSchema: {}
    }, async () => {
        try {
            const themes = PUZZLE_THEMES.map(theme => ({
                tag: theme.tag,
                description: theme.description,
            }));
            return {
                content: [
                    {
                        type: "text",
                        text: JSON.stringify({
                            totalThemes: themes.length,
                            themes: themes,
                            popularThemes: [
                                "fork", "pin", "skewer", "discoveredAttack",
                                "mateIn1", "mateIn2", "mateIn3",
                                "hangingPiece", "sacrifice", "deflection"
                            ],
                            difficultyThemes: [
                                "mateIn1", "mateIn2", "mateIn3", "mateIn4", "mateIn5",
                                "short", "long", "veryLong"
                            ],
                        }, null, 2),
                    },
                ],
            };
        }
        catch (error) {
            return {
                content: [
                    {
                        type: "text",
                        text: `Error getting puzzle themes: ${error}`,
                    },
                ],
            };
        }
    });
    server.registerTool("parse-pgn-into-fens", {
        description: "Collect a fen list of given game pgn",
        inputSchema: {
            pgn: gamePgnSchema,
        }
    }, async ({ pgn }) => {
        try {
            const fens = collectFensFromGame(pgn);
            return {
                content: [
                    {
                        type: "text",
                        text: JSON.stringify({
                            fens: fens
                        }, null, 2),
                    },
                ],
            };
        }
        catch (error) {
            return {
                content: [
                    {
                        type: "text",
                        text: `invalid PGN`,
                    },
                ],
            };
        }
    });
    server.registerTool("get-fen-map-lookup", {
        description: "Lookup fens for mapped SAN move, for given game PGN",
        inputSchema: {
            pgn: gamePgnSchema,
            isAfter: z.boolean().describe("If true, maps moves to FEN after the move; if false, maps to FEN before the move")
        }
    }, async ({ pgn, isAfter }) => {
        try {
            const fenMap = moveToFenMap(pgn, isAfter);
            return {
                content: [
                    {
                        type: "text",
                        text: JSON.stringify({
                            fenMap: fenMap,
                            moveCount: Object.keys(fenMap).length,
                            mappingType: isAfter ? "after move" : "before move"
                        }, null, 2),
                    },
                ],
            };
        }
        catch (error) {
            return {
                content: [
                    {
                        type: "text",
                        text: `Error generating move-to-FEN map: ${error}`,
                    },
                ],
            };
        }
    });
}
