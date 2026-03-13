import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { cbmGameIdSchema, cbmRepIdSchema, fenSchema } from "../runner/schema.js";
import { getToolAdapter } from "@jalpp/mcp-adapter";

const BASE_URL = "https://api.chessboardmagic.com";

const auth = {
  type: "bearer" as const,
  token: process.env.CHESSBOARD_MAGIC_PAT ?? "",
};

export function registerCBM(mcpserver: McpServer) {

  getToolAdapter(mcpserver, {
    name: "get-chessboardmagic-repertoires",
    description: "Fetch user's chess repertoires from the Chessboard Magic Repertoire Builder",
    endpoint: `${BASE_URL}/mcp/repertoires`,
    auth,
  });

  getToolAdapter(mcpserver, {
    name: "get-chessboardmagic-games",
    description: "Fetch user's chess games from the Chessboard Magic Repertoire Builder",
    endpoint: `${BASE_URL}/mcp/games`,
    auth,
  });

  getToolAdapter(mcpserver, {
    name: "get-chessboardmagic-tcec-stats",
    description: "Fetch TCEC (Top Chess Engine Championship) statistics for a specific chess position",
    endpoint: `${BASE_URL}/mcp/tcec/stats`,
    inputSchema: { fen: fenSchema },
    auth,
  });

  getToolAdapter(mcpserver, {
    name: "get-chessboardmagic-tcec-games",
    description: "Fetch TCEC games that reached a specific chess position",
    endpoint: `${BASE_URL}/mcp/tcec/games`,
    inputSchema: { fen: fenSchema },
    auth,
  });

  getToolAdapter(mcpserver, {
    name: "get-chessboardmagic-corr-stats",
    description: "Fetch correspondence chess statistics for a specific chess position",
    endpoint: `${BASE_URL}/mcp/corr/stats`,
    inputSchema: { fen: fenSchema },
    auth,
  });

  getToolAdapter(mcpserver, {
    name: "get-chessboardmagic-corr-games",
    description: "Fetch correspondence chess games that reached a specific chess position",
    endpoint: `${BASE_URL}/mcp/corr/games`,
    inputSchema: { fen: fenSchema },
    auth,
  });

  getToolAdapter(mcpserver, {
    name: "get-chessboardmagic-game-details",
    description: "Fetch user's single game's metadata, moves, tags, variations and comment links",
    endpoint: `${BASE_URL}/mcp/games/:gameId`,
    inputSchema: { gameId: cbmGameIdSchema },
    auth,
  });

  getToolAdapter(mcpserver, {
    name: "get-chessboardmagic-repertoire-details",
    description: "Fetch user's single repertoire metadata, moves, variations and comment links",
    endpoint: `${BASE_URL}/mcp/repertoires/:repertoireId`,
    inputSchema: { repertoireId: cbmRepIdSchema },
    auth,
  });
}