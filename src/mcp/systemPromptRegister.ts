import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { fenSchema, gamePgnSchema } from "../runner/schema.js";
import z from "zod";
import { ChessPromptService } from "../services/prompt.js";

export function registerAgineSystemPrompt(server: McpServer): void {
  const promptService = new ChessPromptService();

  // Core System Prompts
  server.registerPrompt(
    "chessagine-mode",
    {
      title: "ChessAgine Mode",
      description: "Activate ChessAgine: Advanced chess analysis with engine integration",
      argsSchema: {}
    },
    () => ({
      messages: promptService.getChessAgineMode(),
    })
  );

  server.registerPrompt(
    "self-eval-framework",
    {
      title: "Self Eval Framework",
      description: "Evaulate self's previous response to ensure there are no hullucination present",
      argsSchema: {}
    },
    () => ({
      messages: promptService.getSelfEvalFramework(),
    })
  );

  server.registerPrompt(
    "chessdb-commentator-mode",
    {
      title: "ChessDB commentary mode",
      description: "Provide comments on chess position using chessDB, Stockfish, themes analysis.",
      argsSchema: {}
    },
    () => ({
      messages: promptService.getChessDBCommentatorMode(),
    })
  );

  server.registerPrompt(
    "question-answer-mode",
    {
      title: "ChessAgine Question Answer Mode",
      description: "Activate ChessAgine Question answer mode: Act as an interactive chess buddy who asks questions to improve understanding",
      argsSchema: {}
    },
    () => ({
      messages: promptService.getQuestionAnswerMode(),
    })
  );

  server.registerPrompt(
    "annotation-expert",
    {
      title: "Chess Annotation Expert",
      description: "Become a chess annotation expert for game commentary",
      argsSchema: {}
    },
    () => ({
      messages: promptService.getAnnotationExpert(),
    })
  );

  server.registerPrompt(
    "dashboard-designer",
    {
      title: "Chess Dashboard Designer",
      description: "Create beautiful chess dashboards and visualizations",
      argsSchema: {}
    },
    () => ({
      messages: promptService.getDashboardDesigner(),
    })
  );

  server.registerPrompt(
    "analyze-position",
    {
      title: "Analyze Chess Position",
      description: "Comprehensive position analysis using chess principles",
      argsSchema: {
        fen: fenSchema,
        side: z.string().describe("Side to analyze from"),
      },
    },
    ({ fen, side = "white" }) => ({
      messages: promptService.getAnalyzePosition(fen, side),
    })
  );

  server.registerPrompt(
    "find-tactics",
    {
      title: "Find Tactical Opportunities",
      description: "Search for tactical motifs in a position",
      argsSchema: {
        fen: fenSchema,
        side: z.string().describe("Side looking for tactics"),
      },
    },
    ({ fen, side = "white" }) => ({
      messages: promptService.getFindTactics(fen, side),
    })
  );

  server.registerPrompt(
    "opening-analysis",
    {
      title: "Opening Analysis",
      description: "Analyze opening position and suggest plans",
      argsSchema: {
        fen: fenSchema,
      },
    },
    ({ fen }) => ({
      messages: promptService.getOpeningAnalysis(fen),
    })
  );

  server.registerPrompt(
    "endgame-analysis",
    {
      title: "Endgame Analysis",
      description: "Analyze endgame position with technique guidance",
      argsSchema: {
        fen: fenSchema,
      },
    },
    ({ fen }) => ({
      messages: promptService.getEndgameAnalysis(fen),
    })
  );

  // Game Analysis Prompts
  server.registerPrompt(
    "annotate-game",
    {
      title: "Annotate Chess Game",
      description: "Create detailed annotations for a chess game",
      argsSchema: {
        pgn: gamePgnSchema,
      },
    },
    ({ pgn }) => ({
      messages: promptService.getAnnotateGame(pgn),
    })
  );

  server.registerPrompt(
    "compare-games",
    {
      title: "Compare Chess Games",
      description: "Compare multiple games to find patterns",
      argsSchema: {
        pgn1: gamePgnSchema.describe("First game PGN"),
        pgn2: gamePgnSchema.describe("Second game PGN"),
      },
    },
    ({ pgn1, pgn2 }) => ({
      messages: promptService.getCompareGames(pgn1, pgn2),
    })
  );

  // Training Prompts
  server.registerPrompt(
    "explain-mistake",
    {
      title: "Explain Chess Mistake",
      description: "Deep dive into why a move was a mistake",
      argsSchema: {
        fen: fenSchema.describe("Position before the mistake"),
        move: z.string().describe("The move that was a mistake"),
        bestMove: z.string().optional().describe("The best move instead"),
      },
    },
    ({ fen, move, bestMove }) => ({
      messages: promptService.getExplainMistake(fen, move, bestMove),
    })
  );

  server.registerPrompt(
    "create-training-plan",
    {
      title: "Create Chess Training Plan",
      description: "Generate a personalized chess improvement plan",
      argsSchema: {
        level: z.enum(["beginner", "intermediate", "advanced"]).describe("Current skill level"),
        weakness: z.string().optional().describe("Specific area to improve"),
        timePerDay: z.string().optional().describe("Minutes available per day"),
      },
    },
    ({ level, weakness, timePerDay = "30" }) => ({
      messages: promptService.getCreateTrainingPlan(level, weakness, timePerDay),
    })
  );

  // Repertoire Building
  server.registerPrompt(
    "build-repertoire",
    {
      title: "Build Opening Repertoire",
      description: "Create an opening repertoire recommendation",
      argsSchema: {
        color: z.enum(["white", "black"]).describe("Color to build repertoire for"),
        style: z.enum(["aggressive", "positional", "solid", "tactical"]).optional().describe("Playing style"),
        timeControl: z.enum(["bullet", "blitz", "rapid", "classical"]).optional().describe("Preferred time control"),
      },
    },
    ({ color, style = "positional", timeControl = "rapid" }) => ({
      messages: promptService.getBuildRepertoire(color, style, timeControl),
    })
  );

  // Pattern Recognition
  server.registerPrompt(
    "identify-patterns",
    {
      title: "Identify Chess Patterns",
      description: "Find recurring patterns in a position",
      argsSchema: {
        fen: fenSchema,
      },
    },
    ({ fen }) => ({
      messages: promptService.getIdentifyPatterns(fen),
    })
  );
}