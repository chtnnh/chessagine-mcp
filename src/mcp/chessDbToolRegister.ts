import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { fenSchema } from "../runner/schema.js";
import { ChessDBService } from "../services/chessdb.js";
import { toolAdapter, toolContentAdapter } from "@jalpp/mcp-adapter";

export function registerChessDBTools(server: McpServer): void {
  const chessDBService = new ChessDBService();

  toolAdapter(server, {
    name: "get-chessdb-analysis",
    config: {
      description: "Fetch position analysis and candidate moves from ChessDB",
      inputSchema: { fen: fenSchema },
      annotations: { openWorldHint: true },
    },
    cb: async ({ fen }) => {
      const { data, error } = await chessDBService.getAnalysis(fen);
      return toolContentAdapter(data ?? {}, error);
    },
  });

  toolAdapter(server, {
    name: "get-chessdb-pv",
    config: {
      description: "Fetch the principal variation (best line) for a position from ChessDB",
      inputSchema: { fen: fenSchema },
      annotations: { openWorldHint: true },
    },
    cb: async ({ fen }) => {
      const { data, error } = await chessDBService.getPv(fen);
      return toolContentAdapter(data ?? {}, error);
    },
  });

  toolAdapter(server, {
    name: "queue-chessdb-analysis",
    config: {
      description: "Queue a single chess position for background analysis on ChessDB",
      inputSchema: { fen: fenSchema },
      annotations: { openWorldHint: true },
    },
    cb: async ({ fen }) => {
      const { success, error } = await chessDBService.queueAnalysis(fen);
      return toolContentAdapter(
        { success: success ?? false },
        error ?? (!success ? "Failed to queue position." : undefined),
      );
    },
  });

  toolAdapter(server, {
    name: "get-chessdb-expand-queue",
    config: {
      description:
        "Expand a ChessDB position tree using breadth-first search and queue up to 20 positions via tree search",
      inputSchema: {
        fen: fenSchema,
        expansionDepth: z
          .number()
          .min(1)
          .max(10)
          .describe("BFS plies from root (max 10, default 4)"),
        expansionWidth: z
          .number()
          .min(1)
          .max(5)
          .describe("Branches followed per interior node (max 5, default 2)"),
        maxPositionsQueued: z
          .number()
          .min(1)
          .max(20)
          .describe("Hard cap on ChessDB queue calls (max 20, default 20)"),
      },
      annotations: { openWorldHint: true },
    },
    cb: async ({ fen, expansionDepth, expansionWidth, maxPositionsQueued }) => {
      const { data, error } = await chessDBService.expandQueueStream(fen, {
        expansionDepth,
        expansionWidth,
        maxPositionsQueued,
      });
      return toolContentAdapter(data ?? {}, error);
    },
  });
}