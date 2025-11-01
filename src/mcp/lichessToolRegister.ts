import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { fenSchema } from "../runner/schema.js";
import z from "zod";
import axios from "axios";
import {
  getOpeningStats,
  getOpeningStatSpeech,
  getLichessOpeningStats,
} from "../tools/opening.js";
import {
  fetchPuzzle,
  getDifficultyLevel,
  getThemeDescriptions,
} from "../tools/puzzle.js";
import { MasterGamesSchema } from "../types/schema.js";

// Get token from environment variable
const LICHESS_STUDY_TOKEN = process.env.LICHESS_API_TOKEN || "";
const LICHESS_USERNAME = process.env.LICHESS_USERNAME || "";

export function registerLichessTools(server: McpServer): void {
  server.registerTool(
    "get-lichess-master-games",
    {
      description: "Fetch master-level games and opening statistics from Lichess for a given position",
      inputSchema: {
        fen: fenSchema
      },
      annotations: {
        openWorldHint: true
      }  
    },
    async ({ fen }) => {
      const masterData = await getOpeningStats(fen);
      if (!masterData) {
        return {
          content: [
            {
              type: "text",
              text: "No master game data available for this position.",
            },
          ],
        };
      }

      const speech = getOpeningStatSpeech(masterData);
      const output = {
        data: masterData,
        analysis: speech
      }
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(output, null, 2),
          },   
        ],
        structuredContent: output
      };
    }
  );

  server.registerTool(
    "get-lichess-games",
    {
      description: "Fetch Lichess user games and opening statistics for a given position",
      inputSchema: {
        fen: fenSchema
      },
      annotations: {
        openWorldHint: true
      }
    },
    async ({ fen }) => {
      const lichessData = await getLichessOpeningStats(fen);
      if (!lichessData) {
        return {
          content: [
            {
              type: "text",
              text: "No Lichess game data available for this position.",
            },
          ],
        };
      }

      const speech = getOpeningStatSpeech(lichessData);

      const output = {
        data: lichessData,
        analysis: speech
      }
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
      description: "Fetch the 20 most recent games for a Lichess user. Returns game details including player information, ratings, speed format, and PGN notation. Useful for analyzing a player's recent performance, openings, and game history.",
      inputSchema: {
        username: z.string().describe("Lichess username to fetch games for"),
      },
      annotations: {
        openWorldHint: true,
      }
    },
    async ({ username }) => {
      try {
        const response = await fetch(
          `https://lichess.org/api/games/user/${username}?until=${Date.now()}&max=20&pgnInJson=true&sort=dateDesc`,
          {
            method: "GET",
            headers: { accept: "application/x-ndjson" },
          }
        );

        if (!response.ok) {
          if (response.status === 404) {
            return {
              content: [
                {
                  type: "text",
                  text: `User "${username}" not found on Lichess.`,
                },
              ],
            };
          }
          throw new Error(`Failed to fetch games: ${response.statusText}`);
        }

        const rawData = await response.text();
        const games = rawData
          .split("\n")
          .filter(Boolean)
          .map((game) => JSON.parse(game));

        if (games.length === 0) {
          return {
            content: [
              {
                type: "text",
                text: `No games found for user "${username}".`,
              },
            ],
          };
        }

        const formattedGames = games
          .map((game, index) => {
            const white = game.players.white;
            const black = game.players.black;
            const date = new Date(game.lastMoveAt).toLocaleString();

            return `Game ${index + 1}:
- ID: ${game.id}
- Speed: ${game.speed}
- Date: ${date}
- White: ${white.user?.name || "Anonymous"} (${white.rating || "?"})
- Black: ${black.user?.name || "Anonymous"} (${black.rating || "?"})
- PGN available: Yes`;
          })
          .join("\n\n");

        return {
          content: [
            {
              type: "text",
              text: `Found ${games.length} recent games for "${username}":\n\n${formattedGames}\n\nRaw game data:`,
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
      description: "Fetch a specific Lichess game in PGN format. Accepts either a full Lichess URL or a game ID. Returns the complete PGN notation with headers and moves, ready for analysis or display.",
      inputSchema: {
        gameUrlOrId: z
          .string()
          .describe(
            "Lichess game URL (e.g., https://lichess.org/abc12345) or game ID (e.g., abc12345)"
          ),
      },
      annotations: {
        openWorldHint: true
      }
    },
    async ({ gameUrlOrId }) => {
      try {
        let gameId = gameUrlOrId;

        if (gameUrlOrId.includes("lichess.org") || gameUrlOrId.includes("/")) {
          try {
            const urlObj = new URL(gameUrlOrId);
            const pathname = urlObj.pathname;
            const gameIdMatch = pathname.match(
              /^\/([a-zA-Z0-9]{8,12})(?:\/|$)/
            );

            if (gameIdMatch) {
              gameId = gameIdMatch[1];
              if (gameId.length > 8) {
                gameId = gameId.substring(0, 8);
              }
            } else {
              throw new Error("Could not extract game ID from URL");
            }
          } catch (urlError) {
            const parts = gameUrlOrId.split("/");
            if (parts.length >= 4) {
              gameId = parts[3];
              const cleanGameId = gameId.split(/[?#]/)[0];
              gameId = cleanGameId.substring(0, 8);
            } else {
              throw new Error("Invalid URL format");
            }
          }
        }

        if (!gameId || gameId.length < 8) {
          return {
            content: [
              {
                type: "text",
                text: `Invalid game ID extracted: "${gameId}". Please provide a valid Lichess game URL or 8-character game ID.`,
              },
            ],
          };
        }

        const response = await fetch(
          `https://lichess.org/game/export/${gameId}`,
          {
            headers: {
              Accept: "application/x-chess-pgn",
            },
          }
        );

        if (!response.ok) {
          throw new Error(
            `Failed to fetch game: ${response.status} ${response.statusText}`
          );
        }

        const pgnText = await response.text();

        if (!pgnText || pgnText.trim() === "") {
          throw new Error("Empty PGN received from Lichess");
        }

        return {
          content: [
            {
              type: "text",
              text: `Successfully fetched game ${gameId}:\n\n${pgnText}`,
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
      description: "Fetch a random chess puzzle from Lichess database. Can filter by themes and rating range. Use this to start a puzzle session with the user.",
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
      }
    },
    async ({ themes, ratingFrom, ratingTo }) => {
      try {
        const puzzle = await fetchPuzzle({
          themes,
          ratingFrom,
          ratingTo,
        });

        if (!puzzle) {
          return {
            content: [
              {
                type: "text",
                text: "Failed to fetch puzzle. Please try again.",
              },
            ],
          };
        }

        const solutionMoves = puzzle.moves.split(" ");
        const firstMove = puzzle.preMove;

        const turnToMove = puzzle.FEN.split(" ")[1] === "w" ? "White" : "Black";

        const themeDescriptions = getThemeDescriptions(puzzle.themes);
        const difficultyLevel = getDifficultyLevel(puzzle.rating);

        const puzzleSession = {
          lichessId: puzzle.lichessId,
          rating: puzzle.rating,
          difficulty: difficultyLevel,
          themes: puzzle.themes,
          themeDescriptions: themeDescriptions,
          gameURL: puzzle.gameURL,

          previousFEN: puzzle.previousFEN,
          currentFEN: puzzle.FEN,
          turnToMove: turnToMove,

          opponentLastMove: firstMove,
          solution: solutionMoves,
          firstSolutionMove: solutionMoves[0],
          totalMoves: solutionMoves.length,

          instructions: `A puzzle session has been started. The opponent just played ${firstMove}. It's ${turnToMove} to move. Guide the user through finding the best move without immediately revealing the answer. If they need help, provide hints about the tactical theme (${themeDescriptions.join(
            ", "
          )}). The first move of the solution is ${solutionMoves[0]}.
        DO not show the themes to the user right away, hide the themes information from the start of the sesison, ONLY SHOW the themes when requested by user.`,
        };

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(puzzleSession, null, 2),
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
      inputSchema: {}
    },
    async () => {
      let username = LICHESS_USERNAME;

      if(!username || username === ""){
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                {
                  username: "Not Found",
                },
                null,
                2
              ),
            },
          ],
        }
      }
      
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(
              {
                username: username,
              },
              null,
              2
            ),
          },
        ],
      };
    }
  );

  server.registerTool(
    "fetch-lichess-studies",
    {
      description: "Fetch all studies for a given Lichess user. Returns a list of studies with their IDs, names, and timestamps. Requires either LICHESS_STUDY_TOKEN environment variable or token parameter.",
      inputSchema: {
        username: z
          .string()
          .describe("Lichess username to fetch studies for"),
        token: z
          .string()
          .optional()
          .describe("Lichess API token (optional if LICHESS_STUDY_TOKEN env var is set)"),
      }
    },
    async ({ username, token }) => {
      try {
        const authToken = token || LICHESS_STUDY_TOKEN;
        if (!authToken) {
          return {
            content: [
              {
                type: "text",
                text: "Error: LICHESS_STUDY_TOKEN environment variable is not set. Please configure it to access Lichess studies.",
              },
            ],
          };
        }

        const response = await fetch(
          `https://lichess.org/api/study/by/${username}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${authToken}`,
              Accept: "application/x-ndjson",
            },
          }
        );

        if (!response.ok) {
          if (response.status === 401) {
            return {
              content: [
                {
                  type: "text",
                  text: "Error: Invalid or expired LICHESS_STUDY_TOKEN. Please check your authentication token.",
                },
              ],
            };
          }
          if (response.status === 404) {
            return {
              content: [
                {
                  type: "text",
                  text: `User "${username}" not found on Lichess.`,
                },
              ],
            };
          }
          throw new Error(`Failed to fetch studies: ${response.statusText}`);
        }

        const rawData = await response.text();
        const studies = rawData
          .split("\n")
          .filter(Boolean)
          .map((line) => JSON.parse(line));

        if (studies.length === 0) {
          return {
            content: [
              {
                type: "text",
                text: `No studies found for user "${username}".`,
              },
            ],
          };
        }

        const formattedStudies = studies
          .map((study, index) => {
            const created = new Date(study.createdAt).toLocaleString();
            const updated = new Date(study.updatedAt).toLocaleString();

            return `Study ${index + 1}:
- ID: ${study.id}
- Name: ${study.name}
- Created: ${created}
- Updated: ${updated}`;
          })
          .join("\n\n");

        return {
          content: [
            {
              type: "text",
              text: `Found ${studies.length} studies for "${username}":\n\n${formattedStudies}`,
            },
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
      description: "Fetch a specific Lichess study in PGN format. Returns all chapters of the study as PGN. Requires either LICHESS_STUDY_TOKEN environment variable or token parameter.",
      inputSchema: {
        studyId: z
          .string()
          .describe(
            "Lichess study ID (e.g., WTvnkWAL from https://lichess.org/study/WTvnkWAL)"
          ),
      }
    },
    async ({ studyId }) => {
      try {
        const authToken = LICHESS_STUDY_TOKEN;
        if (!authToken) {
          return {
            content: [
              {
                type: "text",
                text: "Error: LICHESS_STUDY_TOKEN environment variable is not set. Please configure it to access Lichess studies.",
              },
            ],
          };
        }

        const response = await axios.get(
          `https://lichess.org/api/study/${studyId}.pgn`,
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
        );

        const pgnText = response.data;

        if (!pgnText || typeof pgnText !== "string" || pgnText.trim() === "") {
          throw new Error("Empty PGN received from Lichess");
        }

        return {
          content: [
            {
              type: "text",
              text: `Successfully fetched study ${studyId}:\n\n${pgnText}`,
            },
          ],
        };
      } catch (error) {
        if (axios.isAxiosError(error)) {
          if (error.response?.status === 401) {
            return {
              content: [
                {
                  type: "text",
                  text: "Error: Invalid or expired LICHESS_STUDY_TOKEN. Please check your authentication token.",
                },
              ],
            };
          }
          if (error.response?.status === 404) {
            return {
              content: [
                {
                  type: "text",
                  text: `Study "${studyId}" not found on Lichess. Please verify the study ID.`,
                },
              ],
            };
          }
          return {
            content: [
              {
                type: "text",
                text: `Error fetching study PGN: ${error.response?.status} ${error.response?.statusText}`,
              },
            ],
          };
        }
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