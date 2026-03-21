import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { fenSchema, tokenSchema } from "../runner/schema.js";
import z from "zod";
import { LichessService } from "../services/lichess.js";
import { toolAdapter, toolContentAdapter } from "@jalpp/mcp-adapter";


export function registerLichessTools(server: McpServer): void {
  const lichess = new LichessService();

  toolAdapter(server, {
    name: "get-lichess-master-games",
    config: {
      description: "Fetch master-level games and opening statistics from Lichess for a given position",
      inputSchema: { fen: fenSchema, token: tokenSchema },
      annotations: { openWorldHint: true },
    },
    cb: async ({ fen, token }) => {
      if(token && token?.length > 0){
        lichess.setAuthToken(token);
      }
      const output = await lichess.getLichessMasterGamesOpeningBook(fen);
      return toolContentAdapter(output ?? {}, undefined);
    },
  });

  toolAdapter(server, {
    name: "get-lichess-games",
    config: {
      description: "Fetch Lichess user games and opening statistics for a given position",
      inputSchema: { fen: fenSchema, token: tokenSchema },
      annotations: { openWorldHint: true },
    },
    cb: async ({ fen, token }) => {
      if(token && token?.length > 0){
        lichess.setAuthToken(token);
      }
      const output = await lichess.getLichessPublicGamesOpeningBook(fen);
      return toolContentAdapter(output ?? {}, undefined);
    },
  });

  toolAdapter(server, {
    name: "fetch-lichess-games",
    config: {
      description: "Fetch the 20 most recent games for a Lichess user. Returns game details including player information, ratings, speed format, and PGN notation. Useful for analyzing a player's recent performance, openings, and game history.",
      inputSchema: {
        username: z.string().describe("Lichess username to fetch games for"),
      },
      annotations: { openWorldHint: true },
    },
    cb: async ({ username }) => {
      try {
        const { games, gamesOutput } = await lichess.getLichessUserRecentGames(username);
        return toolContentAdapter({ games, gamesOutput }, undefined);
      } catch (error) {
        return toolContentAdapter({}, `Error fetching recent games: ${error instanceof Error ? error.message : String(error)}`);
      }
    },
  });

  toolAdapter(server, {
    name: "fetch-lichess-game",
    config: {
      description: "Fetch a specific Lichess game in PGN format. Accepts either a full Lichess URL or a game ID. Returns the complete PGN notation with headers and moves, ready for analysis or display.",
      inputSchema: {
        gameUrlOrId: z.string().describe("Lichess game URL (e.g., https://lichess.org/abc12345) or game ID (e.g., abc12345)"),
      },
      annotations: { openWorldHint: true },
    },
    cb: async ({ gameUrlOrId }) => {
      try {
        const outputPGN = await lichess.getLichessGamePgnById(gameUrlOrId);
        return toolContentAdapter({ pgn: outputPGN.pgn }, undefined);
      } catch (error) {
        return toolContentAdapter({}, `Error fetching Lichess game: ${error instanceof Error ? error.message : String(error)}`);
      }
    },
  });

  toolAdapter(server, {
    name: "fetch-chess-puzzle",
    config: {
      description: "Fetch a random chess puzzle from Lichess database. Can filter by themes and rating range. Use this to start a puzzle session with the user.",
      inputSchema: {
        themes: z.array(z.string()).optional().describe("Array of puzzle theme tags to filter by (e.g., ['fork', 'pin', 'mateIn2'])"),
        ratingFrom: z.number().min(1000).optional().describe("Minimum puzzle rating (e.g., 1000)"),
        ratingTo: z.number().max(2500).optional().describe("Maximum puzzle rating (e.g., 2000)"),
      },
    },
    cb: async ({ themes, ratingFrom, ratingTo }) => {
      try {
        const puzzleSessionOutput = await lichess.getLichessPuzzleSession(themes, ratingFrom, ratingTo);
        return toolContentAdapter(puzzleSessionOutput ?? {}, undefined);
      } catch (error) {
        return toolContentAdapter({}, `Error fetching puzzle: ${error}`);
      }
    },
  });

  toolAdapter(server, {
    name: "get-lichess-username",
    config: {
      description: "Get the lichess username of current mcp user",
    },
    cb: async () => {
      const usernameOutput = lichess.getLichessUsername();
      return toolContentAdapter({ username: usernameOutput }, undefined);
    },
  });

  toolAdapter(server, {
    name: "fetch-lichess-studies",
    config: {
      description: "Fetch all studies for a given Lichess user. Returns a list of studies with their IDs, names, and timestamps. Requires either LICHESS_STUDY_TOKEN environment variable or token parameter.",
      inputSchema: {
        username: z.string().describe("Lichess username to fetch studies for"),
        token: tokenSchema,
      },
    },
    cb: async ({ username, token }) => {
      try {
        if(token && token?.length > 0){
        lichess.setAuthToken(token);
      }
        const studies = await lichess.getLichessUserStudies(username);
        return toolContentAdapter(studies ?? {}, undefined);
      } catch (error) {
        return toolContentAdapter({}, `Error fetching studies: ${error instanceof Error ? error.message : String(error)}`);
      }
    },
  });

  toolAdapter(server, {
    name: "fetch-lichess-study-pgn",
    config: {
      description: "Fetch a specific Lichess study in PGN format. Returns all chapters of the study as PGN. Requires either LICHESS_STUDY_TOKEN environment variable or token parameter.",
      inputSchema: {
        studyId: z.string().describe("Lichess study ID (e.g., WTvnkWAL from https://lichess.org/study/WTvnkWAL)"),
        token: tokenSchema
      },
    },
    cb: async ({ studyId, token }) => {
      try {
        if(token && token?.length > 0){
        lichess.setAuthToken(token);
      }
        const studyPgnOutput = await lichess.getLichessStudyPgn(studyId);
        return toolContentAdapter(studyPgnOutput ?? {}, undefined);
      } catch (error) {
        return toolContentAdapter({}, `Error fetching study PGN: ${error instanceof Error ? error.message : String(error)}`);
      }
    },
  });
}