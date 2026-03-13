import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import z from "zod";
import { fenSchema, is960Schema, moveSchema } from "../runner/schema.js";
import { BoardStateService } from "../services/boardstate.js";
import {toolAdapter, toolContentAdapter} from "@jalpp/mcp-adapter";
export function registerBoardStateTools(server: McpServer): void {
  const stateService = new BoardStateService();

  toolAdapter(server, {
    name: "is-legal-move",
    config: {
      description: "Check if a given move is legal for the provided FEN position",
      inputSchema: {
        fen: z.string().describe("FEN string representing the board position, the fen must be in full form containing which side to move"),
        move: z.string().describe("The move to be played (in SAN or UCI format)"),
        is960: is960Schema
      },
      annotations: {
        openWorldHint: false,
      },
    },
    cb: async ({ fen, move, is960 }) => {
      const { data, error } = stateService.checkLegalMove(fen, move, is960);
      return toolContentAdapter(data ?? {}, error);
    },
  });

  toolAdapter(server, {
    name: "get-boardstate-for-move",
    config: {
      description: "Given a FEN and a move, returns a string describing the resulting board state after the move",
      inputSchema: {
        fen: fenSchema,
        move: moveSchema,
        is960: is960Schema
      },
      annotations: {
        openWorldHint: false,
      },
    },
    cb: async ({ fen, move, is960 }) => {
      const { data, error } = stateService.getBoardStateForMove(fen, move, is960);
      return toolContentAdapter(data ?? {}, error);
    },
  });

  toolAdapter(server, {
    name: "get-boardstate-for-fen",
    config: {
      description: "Given a FEN, returns a string describing the resulting board state for that FEN",
      inputSchema: {
        fen: fenSchema,
        is960: is960Schema
      },
      annotations: {
        openWorldHint: false,
      },
    },
    cb: async ({ fen, is960 }) => {
      const { data, error } = stateService.getBoardStateForFen(fen, is960);
      return toolContentAdapter(data ?? {}, error);
    },
  });
}