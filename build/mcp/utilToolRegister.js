import { gamePgnSchema } from "../runner/schema.js";
import z from "zod";
import { ChessUtilsService } from "../services/util.js";
export function registerUtilsTools(server) {
    const utilsService = new ChessUtilsService();
    server.registerTool("get-chess-knowledgebase", {
        description: "Returns a comprehensive chess knowledgebase including Silman Imbalances, Fine's 30 chess principles, endgame principles, and practical checklists",
        inputSchema: {}
    }, async () => {
        const { data, error } = utilsService.getKnowledgeBase();
        return {
            content: [
                {
                    type: "text",
                    text: error || data,
                },
            ],
        };
    });
    server.registerTool("get-chessagine-stater-prompts", {
        description: "List all available chess analysis prompt categories with their example prompts",
        inputSchema: {}
    }, async () => {
        const { data, error } = utilsService.getStarterPrompts();
        return {
            content: [
                {
                    type: "text",
                    text: error || JSON.stringify(data, null, 2)
                }
            ],
        };
    });
    server.registerTool("get-puzzle-themes", {
        description: "Get a list of all available puzzle themes that can be used to filter puzzles",
        inputSchema: {}
    }, async () => {
        const { data, error } = utilsService.getPuzzleThemes();
        return {
            content: [
                {
                    type: "text",
                    text: error || JSON.stringify(data, null, 2),
                },
            ],
        };
    });
    server.registerTool("parse-pgn-into-fens", {
        description: "Collect a fen list of given game pgn",
        inputSchema: {
            pgn: gamePgnSchema,
        }
    }, async ({ pgn }) => {
        const { data, error } = utilsService.parsePgnIntoFens(pgn);
        return {
            content: [
                {
                    type: "text",
                    text: error || JSON.stringify(data, null, 2),
                },
            ],
        };
    });
    server.registerTool("get-fen-map-lookup", {
        description: "Lookup fens for mapped SAN move, for given game PGN",
        inputSchema: {
            pgn: gamePgnSchema,
            isAfter: z.boolean().describe("If true, maps moves to FEN after the move; if false, maps to FEN before the move")
        }
    }, async ({ pgn, isAfter }) => {
        const { data, error } = utilsService.getFenMapLookup(pgn, isAfter);
        return {
            content: [
                {
                    type: "text",
                    text: error || JSON.stringify(data, null, 2),
                },
            ],
        };
    });
}
