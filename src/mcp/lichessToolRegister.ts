import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { fenSchema } from "../runner/schema.js";
import z from "zod";

import { LichessService } from "../services/lichess.js";

export function registerLichessTools(server: McpServer): void {
  const lichess = new LichessService();

  server.registerTool(
    "get-lichess-master-games",
    {
      description:
        "Fetch master-level games and opening statistics from Lichess for a given position",
      inputSchema: {
        fen: fenSchema,
      },
      annotations: {
        openWorldHint: true,
      },
    },
    async ({ fen }) => {
      const output = await lichess.getLichessMasterGamesOpeningBook(fen);

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(output, null, 2),
          },
        ],
        structuredContent: output,
      };
    }
  );

  server.registerTool(
    "get-lichess-games",
    {
      description:
        "Fetch Lichess user games and opening statistics for a given position",
      inputSchema: {
        fen: fenSchema,
      },
      annotations: {
        openWorldHint: true,
      },
    },
    async ({ fen }) => {
      const output = await lichess.getLichessPublicGamesOpeningBook(fen);

      return {
        structuredContent: output,
        content: [
          {
            type: "text",
            text: JSON.stringify(output, null, 2),
          },
        ],
      };
    }
  );

  server.registerTool(
    "fetch-lichess-games",
    {
      description:
        "Fetch the 20 most recent games for a Lichess user. Returns game details including player information, ratings, speed format, and PGN notation. Useful for analyzing a player's recent performance, openings, and game history.",
      inputSchema: {
        username: z.string().describe("Lichess username to fetch games for"),
      },
      annotations: {
        openWorldHint: true,
      },
    },
    async ({ username }) => {
      try {
        const { games, gamesOutput } = await lichess.getLichessUserRecentGames(
          username
        );

        return {
          content: [
            {
              type: "text",
              text: gamesOutput,
            },
            {
              type: "text",
              text: JSON.stringify(games, null, 2),
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `Error fetching recent games: ${
                error instanceof Error ? error.message : String(error)
              }`,
            },
          ],
        };
      }
    }
  );

  server.registerTool(
    "fetch-lichess-game",
    {
      description:
        "Fetch a specific Lichess game in PGN format. Accepts either a full Lichess URL or a game ID. Returns the complete PGN notation with headers and moves, ready for analysis or display.",
      inputSchema: {
        gameUrlOrId: z
          .string()
          .describe(
            "Lichess game URL (e.g., https://lichess.org/abc12345) or game ID (e.g., abc12345)"
          ),
      },
      annotations: {
        openWorldHint: true,
      },
    },
    async ({ gameUrlOrId }) => {
      try {
        const outputPGN = await lichess.getLichessGamePgnById(gameUrlOrId);

        return {
          content: [
            {
              type: "text",
              text: outputPGN.pgn,
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `Error fetching Lichess game: ${
                error instanceof Error ? error.message : String(error)
              }`,
            },
          ],
        };
      }
    }
  );

  server.registerTool(
    "fetch-chess-puzzle",
    {
      description:
        "Fetch a random chess puzzle from Lichess database. Can filter by themes and rating range. Use this to start a puzzle session with the user.",
      inputSchema: {
        themes: z
          .array(z.string())
          .optional()
          .describe(
            "Array of puzzle theme tags to filter by (e.g., ['fork', 'pin', 'mateIn2'])"
          ),
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
    },
    async ({ themes, ratingFrom, ratingTo }) => {
      try {
        const puzzleSessionOutput = await lichess.getLichessPuzzleSession(
          themes,
          ratingFrom,
          ratingTo
        );

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(puzzleSessionOutput, null, 2),
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `Error fetching puzzle: ${error}`,
            },
          ],
        };
      }
    }
  );

  server.registerTool(
    "get-lichess-username",
    {
      description: "Get the lichess username of current mcp user",
      inputSchema: {},
    },
    async () => {
      const usernameOutput = lichess.getLichessUsername();

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(usernameOutput, null, 2),
          },
        ],
      };
    }
  );

  server.registerTool(
    "fetch-lichess-studies",
    {
      description:
        "Fetch all studies for a given Lichess user. Returns a list of studies with their IDs, names, and timestamps. Requires either LICHESS_STUDY_TOKEN environment variable or token parameter.",
      inputSchema: {
        username: z.string().describe("Lichess username to fetch studies for"),
      },
    },
    async ({ username }) => {
      try {
        const studies = await lichess.getLichessUserStudies(username);

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(studies, null, 2),
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `Error fetching studies: ${
                error instanceof Error ? error.message : String(error)
              }`,
            },
          ],
        };
      }
    }
  );

  server.registerTool(
    "fetch-lichess-study-pgn",
    {
      description:
        "Fetch a specific Lichess study in PGN format. Returns all chapters of the study as PGN. Requires either LICHESS_STUDY_TOKEN environment variable or token parameter.",
      inputSchema: {
        studyId: z
          .string()
          .describe(
            "Lichess study ID (e.g., WTvnkWAL from https://lichess.org/study/WTvnkWAL)"
          ),
      },
    },
    async ({ studyId }) => {
      try {
        const studyPgnOutput = await lichess.getLichessStudyPgn(studyId);

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(studyPgnOutput, null, 2),
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `Error fetching study PGN: ${
                error instanceof Error ? error.message : String(error)
              }`,
            },
          ],
        };
      }
    }
  );
}
