import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { cbmGameIdSchema, cbmRepIdSchema, fenSchema } from "../runner/schema.js";
import { ChessBoardMagicService } from "../services/cbm.js";


export function registerCBM(mcpserver: McpServer) {
  const cbmService = new ChessBoardMagicService();

  mcpserver.registerTool(
    "get-chessboardmagic-repertoires",
    {
      description:
        "Fetch user's chess repertoires from the Chessboard Magic Repertoire Builder",
      inputSchema: {},
      annotations: {
        openWorldHint: true
      }
    },
    async () => {
      const { data, error } = await cbmService.getRepertoires();
      
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

  mcpserver.registerTool(
    "get-chessboardmagic-games",
    {
      description:
        "Fetch user's chess games from the Chessboard Magic Repertoire Builder",
      inputSchema: {},
      annotations: {
        openWorldHint: true
      }
    },
    async () => {
      const { data, error } = await cbmService.getGames();
      
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

  mcpserver.registerTool(
    "get-chessboardmagic-game-details",
    {
      description:
        "Fetch user's single game's metadata, moves, tags, variations and comment links",
      inputSchema: {
        gameId: cbmGameIdSchema,
      },
      annotations: {
        openWorldHint: true
      }
    },
    async ({ gameId }) => {
      const { data, error } = await cbmService.getGameDetails(gameId);
      
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

  mcpserver.registerTool(
    "get-chessboardmagic-repertoire-details",
    {
      description:
        "Fetch user's single repertoire metadata, moves, variations and comment links",
      inputSchema: {
        repertoireId: cbmRepIdSchema,
      },
      annotations: {
        openWorldHint: true
      }
    },
    async ({ repertoireId }: { repertoireId: string }) => {
      const { data, error } = await cbmService.getRepertoireDetails(repertoireId);
      
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

  mcpserver.registerTool(
    "get-chessboardmagic-tcec-stats",
    {
      description:
        "Fetch TCEC (Top Chess Engine Championship) statistics for a specific chess position",
      inputSchema: {
        fen: fenSchema
      },
      annotations: {
        openWorldHint: true,
      },
    },
    async ({ fen }: { fen: string }) => {
      const { data, error } = await cbmService.getTcecStats(fen);
      
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

  mcpserver.registerTool(
    "get-chessboardmagic-tcec-games",
    {
      description:
        "Fetch TCEC games that reached a specific chess position",
      inputSchema: {
        fen: fenSchema
      },
      annotations: {
        openWorldHint: true,
      },
    },
    async ({ fen }: { fen: string }) => {
      const { data, error } = await cbmService.getTcecGames(fen);
      
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

  mcpserver.registerTool(
    "get-chessboardmagic-corr-stats",
    {
      description:
        "Fetch correspondence chess statistics for a specific chess position",
      inputSchema: {
        fen: fenSchema
      },
      annotations: {
        openWorldHint: true,
      },
    },
    async ({ fen }: { fen: string }) => {
      const { data, error } = await cbmService.getCorrStats(fen);
      
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

  mcpserver.registerTool(
    "get-chessboardmagic-corr-games",
    {
      description:
        "Fetch correspondence chess games that reached a specific chess position",
      inputSchema: {
        fen: fenSchema
      },
      annotations: {
        openWorldHint: true,
      },
    },
    async ({ fen }: { fen: string }) => {
      const { data, error } = await cbmService.getCorrGames(fen);
      
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
}