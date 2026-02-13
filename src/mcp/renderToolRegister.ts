import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { fenSchema, gamePgnSchema } from "../runner/schema.js";
import { registerAppResource, registerAppTool } from "@modelcontextprotocol/ext-apps/server";
import path from "path";
import { fileURLToPath } from "url";
import { readFile } from "fs/promises";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function registerRenderingTools(server: McpServer): void {
  
  // Chess Board Resource
  const chessBoardResourceUri = "ui://chessagine/chess-board";
  
  registerAppResource(
    server,
    "Chess Board Viewer",
    chessBoardResourceUri,
    {
      description: "Interactive chess board visualization for single positions",
    },
    async () => {
      const htmlPath = path.join(__dirname, "../../dist/chess-board.html");
      const htmlContent = await readFile(htmlPath, "utf-8");
      
      return {
        contents: [
          {
            uri: chessBoardResourceUri,
            mimeType: "text/html;profile=mcp-app",
            text: htmlContent,
          },
        ],
      };
    }
  );

  // Chess Board Tool
  registerAppTool(
    server,
    "render_chess_board",
    {
      title: "Render Chess Board",
      description: "Render an interactive chess board with the given position. Shows the board visually for a single position. Use this for displaying a specific chess position from FEN notation.",
      inputSchema: {
        fen: fenSchema
      },
      _meta: {
        ui: {
          resourceUri: chessBoardResourceUri,
          visibility: ["model", "app"],
        },
      },
    },
    async (args) => {
      const { fen } = args;

      return {
        content: [
          {
            type: "text",
            text: `Rendering chess board for position: ${fen}`,
          },
        ],
        _meta: {
          ui: {
            data: {
              fen,
            },
          },
        },
      };
    }
  );

  // PGN Viewer Resource
  const pgnViewerResourceUri = "ui://chessagine/pgn-viewer";
  
  registerAppResource(
    server,
    "PGN Game Viewer",
    pgnViewerResourceUri,
    {
      description: "Interactive PGN game viewer with move navigation and analysis",
    },
    async () => {
      const htmlPath = path.join(__dirname, "../../dist/pgn-viewer.html");
      const htmlContent = await readFile(htmlPath, "utf-8");
      
      return {
        contents: [
          {
            uri: pgnViewerResourceUri,
            mimeType: "text/html;profile=mcp-app",
            text: htmlContent,
          },
        ],
      };
    }
  );

  // PGN Viewer Tool
  registerAppTool(
    server,
    "render_pgn_viewer",
    {
      title: "Render PGN Game Viewer",
      description: "Render an interactive PGN game viewer that allows navigating through chess game moves. Use this for displaying complete chess games with move history, annotations, and the ability to step through moves. Supports PGN format with headers like Event, Site, Date, White, Black, Result, and move notation.",
      inputSchema: {
        pgn: gamePgnSchema
      },
      _meta: {
        ui: {
          resourceUri: pgnViewerResourceUri,
          visibility: ["model", "app"],
        },
      },
    },
    async (args) => {
      const { pgn } = args;

      return {
        content: [
          {
            type: "text",
            text: `Rendering PGN game viewer for game`,
          },
        ],
        _meta: {
          ui: {
            data: {
              pgn,
            },
          },
        },
      };
    }
  );
}