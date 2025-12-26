import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { fenSchema, is3dSchema, sideSchema } from "../runner/schema.js";
import { ChessRenderingService } from "../services/render.js";

export function registerRenderingTools(server: McpServer): void {
  const renderingService = new ChessRenderingService();

  server.registerTool(
    "generate-chess-board-view-artificat-html",
    {
      description: "get HTML code to render chess board artifact for given FEN and side to move in 2d or 3d view",
      inputSchema: {
        fen: fenSchema,
        side: sideSchema,
        is3d: is3dSchema,
      },
      annotations: {
        openWorldHint: false,
      }
    },
    async ({ fen, side, is3d }) => {
      const { data, error } = renderingService.generateBoardView(fen, side, is3d);

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
        content: renderingService.createResourceContent(data!.html, data!.message),
      };
    }
  );

  server.registerTool(
    "generate-dynamic-gameview-html",
    {
      description: "get HTML code to render chess board for a game with multiple fens to render game view mode",
      inputSchema: {},
      annotations: {
        openWorldHint: false,
      }
    },
    async () => {
      const { data, error } = renderingService.generateGameView();

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
        content: renderingService.createResourceContent(data!.html, data!.message),
      };
    }
  );
}