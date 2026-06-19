import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { fenSchema, tokenSchema } from "../runner/schema.js";
import z from "zod";
import {
  getToolAdapter,
  toolAdapter,
  toolContentAdapter,
} from "@jalpp/mcp-adapter";


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

  // toolAdapter(server, {
  //   name: "fetch-chess-puzzle",
  //   config: {
  //     description:
  //       "Fetch a random chess puzzle from the Lichess-backed puzzle service. Can filter by themes and rating range. Use this to start a puzzle session with the user.",
  //     inputSchema: {
  //       themes: z
  //         .array(z.string())
  //         .optional()
  //         .describe("Array of puzzle theme tags to filter by (e.g., ['fork', 'pin', 'mateIn2'])"),
  //       ratingFrom: z
  //         .number()
  //         .min(1000)
  //         .optional()
  //         .describe("Minimum puzzle rating (e.g., 1000)"),
  //       ratingTo: z
  //         .number()
  //         .max(2500)
  //         .optional()
  //         .describe("Maximum puzzle rating (e.g., 2000)"),
  //     },
  //   },
  //   cb: async ({ themes, ratingFrom, ratingTo }) => {
  //     try {
  //       const puzzle = await fetchPuzzle({ themes, ratingFrom, ratingTo });

  //       if (!puzzle) {
  //         return toolContentAdapter({}, "Failed to fetch puzzle. Please try again.");
  //       }

  //       const solutionMoves = puzzle.moves.split(" ");
  //       const firstMove = puzzle.preMove;
  //       const turnToMove = puzzle.FEN.split(" ")[1] === "w" ? "White" : "Black";
  //       const themeDescriptions = getThemeDescriptions(puzzle.themes);
  //       const difficultyLevel = getDifficultyLevel(puzzle.rating);

  //       const instructions = `A puzzle session has been started. The opponent just played ${firstMove}. It's ${turnToMove} to move. Guide the user through finding the best move without immediately revealing the answer. If they need help, provide hints about the tactical theme (${themeDescriptions.join(", ")}). The first move of the solution is ${solutionMoves[0]}.
  //       DO not show the themes to the user right away, hide the themes information from the start of the session, ONLY SHOW the themes when requested by the user.`;

  //       return toolContentAdapter(
  //         {
  //           lichessId: puzzle.lichessId,
  //           rating: puzzle.rating,
  //           difficulty: difficultyLevel,
  //           themes: puzzle.themes,
  //           themeDescriptions,
  //           gameURL: puzzle.gameURL,
  //           previousFEN: puzzle.previousFEN,
  //           currentFEN: puzzle.FEN,
  //           turnToMove,
  //           opponentLastMove: firstMove,
  //           solution: solutionMoves,
  //           firstSolutionMove: solutionMoves[0],
  //           totalMoves: solutionMoves.length,
  //           instructions,
  //         },
  //         undefined,
  //       );
  //     } catch (error) {
  //       return toolContentAdapter({}, `Error fetching puzzle: ${error instanceof Error ? error.message : String(error)}`);
  //     }
  //   },
  // });

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