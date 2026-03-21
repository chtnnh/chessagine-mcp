import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { gamePgnSchema, is960Schema } from "../runner/schema.js";
import z from "zod";
import { ChessUtilsService } from "../services/util.js";
import { toolAdapter, toolContentAdapter, staticResourceAdapter } from "@jalpp/mcp-adapter";

export function registerUtilsTools(server: McpServer) {
  const utilsService = new ChessUtilsService();


  staticResourceAdapter(server, {
    name: "chess-knowledgebase",
    uri: "chess://knowledgebase",
    title: "Chess Knowledge Base",
    description: "Comprehensive chess knowledgebase including Silman Imbalances, Fine's 30 chess principles, endgame principles, and practical checklists",
    mimeType: "text/plain",
    load: () => {
      const { data, error } = utilsService.getKnowledgeBase();
      return error ?? data ?? "";
    },
  });

  staticResourceAdapter(server, {
    name: "chess-starter-prompts",
    uri: "chess://starter-prompts",
    title: "Chess Starter Prompts",
    description: "All available chess analysis prompt categories with their example prompts",
    mimeType: "application/json",
    load: () => {
      const { data, error } = utilsService.getStarterPrompts();
      return error ?? JSON.stringify(data, null, 2);
    },
  });

  toolAdapter(server, {
    name: "get-puzzle-themes",
    config: {
      description: "Get a list of all available puzzle themes that can be used to filter puzzles",
    },
    cb: async () => {
      const { data, error } = utilsService.getPuzzleThemes();
      return toolContentAdapter(data ?? {}, error);
    },
  });

  toolAdapter(server, {
    name: "parse-pgn-into-move-histories",
    config: {
      description: "Collect a move data list of given game pgn",
      inputSchema: { pgn: gamePgnSchema, is960: is960Schema },
    },
    cb: async ({ pgn, is960 }) => {
      const { data, error } = utilsService.parsePgnIntoFens(pgn, is960);
      return toolContentAdapter(data ?? {}, error);
    },
  });

  toolAdapter(server, {
    name: "get-fen-map-lookup",
    config: {
      description: "Lookup fens for mapped SAN move, for given game PGN",
      inputSchema: {
        pgn: gamePgnSchema,
        isAfter: z.boolean().describe("If true, maps moves to FEN after the move; if false, maps to FEN before the move"),
        is960: is960Schema
      },
    },
    cb: async ({ pgn, isAfter, is960 }) => {
      const { data, error } = utilsService.getFenMapLookup(pgn, isAfter, is960);
      return toolContentAdapter(data ?? {}, error);
    },
  });
}