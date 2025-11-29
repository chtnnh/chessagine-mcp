import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { fenSchema, is3dSchema } from "../runner/schema.js";
import { sideSchema } from "../runner/schema.js";
import { viewBoardArtifact } from "../render/chessBoardRender.js";
import { gameRenderHtml } from "../render/gameRender.js";

export function registerRenderingTools(server: McpServer): void {
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
      try {
        const fullFen = fen.includes(' ') ? fen : `${fen} ${side} KQkq - 0 1`;
        
        const artifactHtml = viewBoardArtifact(fullFen, side, is3d);
  
        return {
          content: [
            {
              type: "text",
              text: `Chess position rendered. FEN: ${fullFen}\n\nUse the artifact above to view the interactive chess board.`,
            },
            {
              type: "resource",
              resource: {
                uri: `data:text/html;base64,${Buffer.from(artifactHtml).toString('base64')}`,
                mimeType: "text/html",
                text: artifactHtml
              }
            }
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `Error rendering chess board: ${error}`,
            },
          ],
        };
      }
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
      try {
        const artifactHtml = gameRenderHtml;
  
        return {
          content: [
            {
              type: "text",
              text: `Chess positions rendered. Use the artifact above to view the interactive chess board.`,
            },
            {
              type: "resource",
              resource: {
                uri: `data:text/html;base64,${Buffer.from(artifactHtml).toString('base64')}`,
                mimeType: "text/html",
                text: artifactHtml
              }
            }
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `Error rendering chess board: ${error}`,
            },
          ],
        };
      }
    }
  );
}