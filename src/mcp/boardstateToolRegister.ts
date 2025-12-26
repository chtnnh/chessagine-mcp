import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import z from "zod";
import { fenSchema, moveSchema } from "../runner/schema.js";
import { BoardStateService } from "../services/boardstate.js";

export function registerBoardStateTools(server: McpServer): void {
  const stateService = new BoardStateService();

  server.registerTool(
    "is-legal-move",
    {
      description: "Check if a given move is legal for the provided FEN position",
      inputSchema: {
        fen: z.string().describe("FEN string representing the board position, the fen must be in full form containing which side to move"),
        move: z.string().describe("The move to be played (in SAN or UCI format)")
      },
      annotations: {
        openWorldHint: false
      }
    },
    async ({ fen, move }) => {
      const { data, error } = stateService.checkLegalMove(fen, move);

      return {
        content: [
          {
            type: "text",
            text: error || JSON.stringify(data, null, 2),
          },
        ],
      };
    }
  );

  server.registerTool(
    "get-boardstate-for-move",
    {
      description: "Given a FEN and a move, returns a string describing the resulting board state after the move",
      inputSchema: {
        fen: fenSchema,
        move: moveSchema,
      },
      annotations: {
        openWorldHint: false,
      }
    },
    async ({ fen, move }) => {
      const { data, error } = stateService.getBoardStateForMove(fen, move);

      if (error) {
        return {
          content: [
            {
              type: "text",
              text: error,
            },
          ],
        };
      }

      return {
        structuredContent: {
          state: data!.state,
          description: data!.description
        },
        content: [
          {
            type: "text",
            text: data!.description,
          },
        ],
      };
    }
  );

  server.registerTool(
    "get-boardstate-for-fen",
    {
      description: "Given a FEN, returns a string describing the resulting board state for that FEN",
      inputSchema: {
        fen: fenSchema,
      },
      annotations: {
        openWorldHint: false,
      }
    },
    async ({ fen }) => {
      const { data, error } = stateService.getBoardStateForFen(fen);

      if (error) {
        return {
          content: [
            {
              type: "text",
              text: error,
            },
          ],
        };
      }

      return {
        structuredContent: {
          state: data!.state,
          description: data!.description
        },
        content: [
          {
            type: "text",
            text: data!.description,
          },
        ],
      };
    }
  );
}