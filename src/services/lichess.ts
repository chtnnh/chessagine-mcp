import axios from "axios";
import {
  getLichessMasterOpeningStats,
  getLichessOpeningStats,
  getLLMTranslator,
} from "../tools/opening.js";
import {
  fetchPuzzle,
  getDifficultyLevel,
  getThemeDescriptions,
} from "../tools/puzzle.js";

export class LichessService {
  private LICHESS_STUDY_TOKEN;
  private LICHESS_USERNAME;

  constructor() {
    this.LICHESS_STUDY_TOKEN = process.env.LICHESS_API_TOKEN || "";
    this.LICHESS_USERNAME = process.env.LICHESS_USERNAME || "";
  }

  public async getLichessMasterGamesOpeningBook(fen: string) {
    const masterData = await getLichessMasterOpeningStats(fen);

    if (masterData) {
      const analysis = getLLMTranslator(masterData);
      return {
        data: masterData,
        analysis: analysis,
      };
    }

    return {
      data: null,
      analysis: "No games present from Lichess Master Database",
    };
  }

  public async getLichessPublicGamesOpeningBook(fen: string) {
    const publicGames = await getLichessOpeningStats(fen);

    if (publicGames) {
      const analysis = getLLMTranslator(publicGames);
      return {
        data: publicGames,
        analysis: analysis,
      };
    }

    return {
      data: null,
      analysis: "No public games present in Lichess Opening Database",
    };
  }

  public async getLichessUserRecentGames(username: string) {
    const response = await fetch(
      `https://lichess.org/api/games/user/${username}?until=${Date.now()}&max=20&pgnInJson=true&sort=dateDesc`,
      {
        method: "GET",
        headers: { accept: "application/x-ndjson" },
      }
    );

    if (!response.ok) {
      return {
        games: [],
        gamesOutput: `No games found for user "${username}".`,
      };
    }

    const rawData = await response.text();

    const games = rawData
      .split("\n")
      .filter(Boolean)
      .map((game) => JSON.parse(game));

    if (games.length === 0) {
      return {
        games: [],
        gamesOutput: `No games found for user "${username}".`,
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

    const gamesOutput = `Found ${games.length} recent games for "${username}":\n\n${formattedGames}\n\nRaw game data:`;

    return {
      games,
      gamesOutput,
    };
  }

  private lichessGameIdValidator(gameUrlOrId: string) {
    let gameId = gameUrlOrId;
    let isValid = true;

    if (gameUrlOrId.includes("lichess.org") || gameUrlOrId.includes("/")) {
      try {
        const urlObj = new URL(gameUrlOrId);
        const pathname = urlObj.pathname;
        const gameIdMatch = pathname.match(/^\/([a-zA-Z0-9]{8,12})(?:\/|$)/);

        if (gameIdMatch) {
          gameId = gameIdMatch[1];
          if (gameId.length > 8) {
            gameId = gameId.substring(0, 8);
          }
        } else {
          isValid = false;
        }
      } catch (urlError) {
        const parts = gameUrlOrId.split("/");
        if (parts.length >= 4) {
          gameId = parts[3];
          const cleanGameId = gameId.split(/[?#]/)[0];
          gameId = cleanGameId.substring(0, 8);
        } else {
          isValid = false;
        }
      }
    }

    if (!gameId || gameId.length < 8) {
      isValid = false;
    }

    return {
      isValid: isValid,
      gameId: gameId,
    };
  }

  public async getLichessGamePgnById(gameUrlOrId: string) {
    const validator = this.lichessGameIdValidator(gameUrlOrId);
    const gameId = validator.gameId;

    if (!validator.isValid) {
      return {
        pgn: "Invalid game URL or ID",
      };
    }

    const response = await fetch(`https://lichess.org/game/export/${gameId}`, {
      headers: {
        Accept: "application/x-chess-pgn",
      },
    });

    if (!response.ok) {
      return {
        pgn: "Error occured on Lichess side, please try again later",
      };
    }

    const pgn = await response.text();

    if (pgn.length === 0) {
      return {
        pgn: "Empty PGN found",
      };
    }

    return {
      pgn: pgn,
    };
  }

  public async getLichessPuzzleSession(
    themes: string[] | undefined,
    ratingFrom: number | undefined,
    ratingTo: number | undefined
  ) {
    const puzzle = await fetchPuzzle({
      themes,
      ratingFrom,
      ratingTo,
    });

    if (!puzzle) {
      return {
        text: "Failed to fetch puzzle. Please try again.",
      };
    }

    const solutionMoves = puzzle.moves.split(" ");
    const firstMove = puzzle.preMove;

    const turnToMove = puzzle.FEN.split(" ")[1] === "w" ? "White" : "Black";

    const themeDescriptions = getThemeDescriptions(puzzle.themes);
    const difficultyLevel = getDifficultyLevel(puzzle.rating);

    const instructions = `A puzzle session has been started. The opponent just played ${firstMove}. It's ${turnToMove} to move. Guide the user through finding the best move without immediately revealing the answer. If they need help, provide hints about the tactical theme (${themeDescriptions.join(
      ", "
    )}). The first move of the solution is ${solutionMoves[0]}.
        DO not show the themes to the user right away, hide the themes information from the start of the sesison, ONLY SHOW the themes when requested by user.`;

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

      instructions: instructions,
    };

    return puzzleSession;
  }

  public getLichessUsername() {
    return {
      username:
        this.LICHESS_USERNAME.length === 0
          ? "No Username Found"
          : this.LICHESS_USERNAME,
    };
  }

  public async getLichessUserStudies(username: string) {
    const authToken = this.LICHESS_STUDY_TOKEN;

    if (!authToken || authToken.length === 0) {
      return {
        studies: "No Lichess_Study_TOKEN PAT found, please set it.",
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
      return {
        studies: "Error occured on Lichess side, please try again later",
      };
    }

    const rawData = await response.text();
    const studies = rawData
      .split("\n")
      .filter(Boolean)
      .map((line) => JSON.parse(line));

    if (studies.length === 0) {
      return {
        studies: "No Lichess study for this user",
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
      studies: formattedStudies,
    };
  }


  public async getLichessStudyPgn(studyId: string) {

    const authToken = this.LICHESS_STUDY_TOKEN;

    if (!authToken || authToken.length === 0) {
      return {
        studyPgn: "No Lichess_Study_TOKEN PAT found, please set it.",
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

        if(!pgnText || typeof pgnText !== "string" || pgnText.trim() === ""){
            return {
                studyPgn: "Empty PGN found from Lichess"
            }
        }

        return {
            studyPgn: pgnText
        }

  }

}
