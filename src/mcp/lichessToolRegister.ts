import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { fenSchema, tokenSchema } from "../runner/schema.js";
import z from "zod";
import {
  getToolAdapter,
  postToolAdapter,
  toolAdapter,
  toolContentAdapter,
} from "@jalpp/mcp-adapter";
import { SERVICE_CONFIG_BASE_URL_MAP } from "../services/config.js";


export function registerLichessTools(server: McpServer): void {
  
  getToolAdapter(server, {
    name: "get-lichess-master-games",
    description:
      "Fetch master-level games and opening statistics from Lichess for a given position",
    endpoint: "https://explorer.lichess.org/masters?fen=:fen&moves=12&topGames=15",
    inputSchema: { fen: fenSchema, token: tokenSchema },
    tokenParam: "token",
  });

  getToolAdapter(server, {
    name: "get-lichess-games",
    description:
      "Fetch Lichess user games and opening statistics for a given position",
    endpoint: "https://explorer.lichess.org/lichess?fen=:fen&moves=12&topGames=4",
    inputSchema: { fen: fenSchema, token: tokenSchema },
    tokenParam: "token",
  });

  getToolAdapter(server, {
    name: "fetch-lichess-games",
    description:
      "Fetch recent games for a Lichess user in a simple text-friendly format.",
    endpoint: "https://lichess.org/api/games/user/:username?max=20&pgnInJson=true&sort=dateDesc",
    inputSchema: {
      username: z.string().describe("Lichess username to fetch games for"),
      token: tokenSchema,
    },
    tokenParam: "token",
  });

  getToolAdapter(server, {
    name: "fetch-lichess-game",
    description:
      "Fetch a specific Lichess game in PGN format by game ID.",
    endpoint: "https://lichess.org/game/export/:gameId",
    inputSchema: {
      gameId: z.string().describe("Lichess game ID (for example abc12345)"),
    },
  });

  postToolAdapter(server, {
    name: "fetch-chess-puzzle",
    description:
      "Fetch a random chess puzzle from the Lichess-backed puzzle service. Can filter by themes and rating range. Use this to start a puzzle session with the user.",
    endpoint: `${SERVICE_CONFIG_BASE_URL_MAP.SF_BASE_URL}/puzzle/builder`,
    inputSchema: {
      themes: z
        .array(z.string())
        .optional()
        .describe("Array of puzzle theme tags to filter by (e.g., ['fork', 'pin', 'mateIn2'])"),
      ratingFrom: z
        .number()
        .min(1000)
        .optional()
        .describe("Minimum puzzle rating (e.g., 1000)"),
      ratingTo: z
        .number()
        .max(2500)
        .optional()
        .describe("Maximum puzzle rating (e.g., 2000)"),
    },
  });

  toolAdapter(server, {
    name: "get-lichess-username",
    config: {
      description: "Get the Lichess username of the current MCP user",
    },
    cb: async () => {
      const username = process.env.LICHESS_USERNAME || "No Username Found";
      return toolContentAdapter({ username }, undefined);
    },
  });

  getToolAdapter(server, {
    name: "fetch-lichess-studies",
    description:
      "Fetch all studies for a given Lichess user. Returns a list of studies with their IDs, names, and timestamps.",
    endpoint: "https://lichess.org/api/study/by/:username",
    inputSchema: {
      username: z.string().describe("Lichess username to fetch studies for"),
      token: tokenSchema,
    },
    tokenParam: "token",
  });

  getToolAdapter(server, {
    name: "fetch-lichess-study-pgn",
    description:
      "Fetch a specific Lichess study in PGN format. Returns all chapters of the study as PGN.",
    endpoint: "https://lichess.org/api/study/:studyId.pgn",
    inputSchema: {
      studyId: z.string().describe("Lichess study ID (for example WTvnkWAL)"),
      token: tokenSchema,
    },
    tokenParam: "token",
  });
}