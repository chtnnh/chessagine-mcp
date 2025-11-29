import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { fenSchema, gamePgnSchema } from "../runner/schema.js";
import z from "zod";
import {
  agineSystemPrompt,
  agineDesigner,
  chessAgineAnnoPrompt,
  agineSelfEval,
} from "../prompts/prompt.js";

export function registerAgineSystemPrompt(server: McpServer): void {
  
  // Core System Prompts
  server.registerPrompt(
    "chessagine-mode",
    {
      title: "ChessAgine Mode",
      description: "Activate ChessAgine: Advanced chess analysis with engine integration",
      argsSchema: {}
    },
    () => ({
      messages: [
        {
          role: "user",
          content: {
            type: "text",
            text: agineSystemPrompt,
          },
        },
      ],
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
      messages: [
        {
          role: "assistant",
          content: {
            type: "text",
            text: agineSelfEval,
          },
        },
      ],
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
      messages: [
        {
          role: "assistant",
          content: {
            type: "text",
            text: agineSystemPrompt,
          },
        },
      ],
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
      messages: [
        {
          role: "user",
          content: {
            type: "text",
            text: chessAgineAnnoPrompt,
          },
        },
      ],
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
      messages: [
        {
          role: "user",
          content: {
            type: "text",
            text: agineDesigner,
          },
        },
      ],
    })
  );

  // Position Analysis Prompts
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
      messages: [
        {
          role: "user",
          content: {
            type: "text",
            text: `You are a chess master analyzing this position from ${side}'s perspective.

FEN: ${fen}

Please provide a comprehensive analysis covering:

1. **Material Count**: Compare material for both sides
2. **King Safety**: Evaluate king positions and potential threats
3. **Piece Activity**: Assess how well pieces are placed
4. **Pawn Structure**: Analyze pawn chains, weaknesses, and strengths
5. **Control of Key Squares**: Important central and strategic squares
6. **Tactical Opportunities**: Look for pins, forks, skewers, discovered attacks
7. **Strategic Plans**: Suggest concrete plans for both sides

Use chess notation and be specific about piece placements and tactical motifs. Conclude with an evaluation (advantage to white/black/equal) and recommend the best continuation.`,
          },
        },
      ],
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
      messages: [
        {
          role: "user",
          content: {
            type: "text",
            text: `Find all tactical opportunities for ${side} in this position.

FEN: ${fen}

Look for:
- Pins (absolute and relative)
- Forks (knight forks, queen forks, etc.)
- Skewers
- Discovered attacks
- Deflection and decoy tactics
- Removal of defender
- Zwischenzug (in-between moves)
- Back rank weaknesses
- Mating patterns

For each tactic found, explain:
1. The tactical motif
2. The key moves
3. Why it works
4. The resulting advantage`,
          },
        },
      ],
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
      messages: [
        {
          role: "user",
          content: {
            type: "text",
            text: `Analyze this opening position:

FEN: ${fen}

Please provide:
1. **Opening Identification**: Name the opening/variation if recognizable
2. **Key Ideas**: Main plans and themes for both sides
3. **Typical Pawn Structures**: Expected pawn formations
4. **Piece Placement**: Ideal squares for pieces
5. **Critical Moves**: Important moves to know in this line
6. **Common Mistakes**: Pitfalls to avoid
7. **Recommended Continuations**: Suggest next moves with explanations

Use opening theory and explain strategic concepts clearly.`,
          },
        },
      ],
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
      messages: [
        {
          role: "user",
          content: {
            type: "text",
            text: `Analyze this endgame position:

FEN: ${fen}

Please cover:
1. **Endgame Type**: Identify the type (K+P vs K, R+P vs R, etc.)
2. **Evaluation**: Is this won, drawn, or unclear?
3. **Key Concepts**: Relevant endgame principles (opposition, triangulation, etc.)
4. **Critical Squares**: Important squares to control
5. **Winning Technique**: If winning, show the plan step-by-step
6. **Drawing Technique**: If defending, explain how to hold
7. **Common Patterns**: Reference similar theoretical positions

Be precise with move sequences and explain the underlying theory.`,
          },
        },
      ],
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
      messages: [
        {
          role: "user",
          content: {
            type: "text",
            text: `Please annotate this chess game with detailed commentary:

${pgn}

Provide:
1. **Opening Analysis**: Identify the opening and evaluate the choices
2. **Critical Moments**: Highlight turning points in the game
3. **Tactical Analysis**: Point out tactical opportunities (missed or played)
4. **Strategic Themes**: Explain strategic plans and ideas
5. **Move Alternatives**: Suggest improvements at key moments
6. **Evaluation**: Assess positions throughout the game
7. **Conclusion**: Summarize the game and key lessons

Use standard chess notation and make annotations instructive.`,
          },
        },
      ],
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
      messages: [
        {
          role: "user",
          content: {
            type: "text",
            text: `Compare these two chess games:

Game 1:
${pgn1}

Game 2:
${pgn2}

Analyze:
1. **Opening Similarities/Differences**: Compare opening choices
2. **Strategic Themes**: Common or contrasting plans
3. **Tactical Patterns**: Similar tactical motifs
4. **Critical Decisions**: Compare key moments
5. **Style Comparison**: Different approaches to similar positions
6. **Lessons**: What can be learned from comparing these games?`,
          },
        },
      ],
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
      messages: [
        {
          role: "user",
          content: {
            type: "text",
            text: `Explain why this move was a mistake:

Position (FEN): ${fen}
Move played: ${move}
${bestMove ? `Best move: ${bestMove}` : ''}

Please explain:
1. **What the move tried to accomplish**: The intent behind it
2. **Why it fails**: Concrete refutation or problems created
3. **Better alternatives**: What should have been played and why
4. **Key principle violated**: Which chess principles were ignored
5. **How to avoid similar mistakes**: General advice for improvement

Be educational and help understand the concept, not just memorize.`,
          },
        },
      ],
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
    ({ level, weakness, timePerDay = 30 }) => ({
      messages: [
        {
          role: "user",
          content: {
            type: "text",
            text: `Create a chess training plan for:
- Level: ${level}
${weakness ? `- Weakness to address: ${weakness}` : ''}
- Available time: ${timePerDay} minutes per day

Include:
1. **Daily Routine**: Structured schedule
2. **Study Materials**: What to study and in what order
3. **Tactical Training**: Puzzle recommendations
4. **Game Analysis**: How to review games
5. **Opening Preparation**: Repertoire suggestions
6. **Endgame Practice**: Key positions to master
7. **Progress Tracking**: How to measure improvement
8. **Weekly Goals**: Specific achievable targets

Make it practical and actionable.`,
          },
        },
      ],
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
      messages: [
        {
          role: "user",
          content: {
            type: "text",
            text: `Build an opening repertoire for ${color} with ${style} style for ${timeControl} games.

Please provide:
1. **Main Lines**: Core openings to play
2. **Against Each Response**: How to meet different opponent choices
3. **Key Ideas**: Strategic themes in each line
4. **Move Orders**: Critical move sequences
5. **Study Resources**: Books, videos, or courses
6. **Practice Plan**: How to learn and maintain the repertoire
7. **Backup Options**: Alternative lines for variety

Make recommendations practical and achievable, not too broad.`,
          },
        },
      ],
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
      messages: [
        {
          role: "user",
          content: {
            type: "text",
            text: `Identify all chess patterns in this position:

FEN: ${fen}

Look for:
1. **Tactical Patterns**: Forks, pins, skewers, etc.
2. **Positional Patterns**: Weak squares, bad pieces, pawn structures
3. **Mating Patterns**: Back rank, smothered mate, etc.
4. **Endgame Patterns**: Lucena, Philidor, key squares
5. **Strategic Patterns**: Minority attack, piece sacrifice themes
6. **Pawn Structure Patterns**: Isolated pawns, hanging pawns, pawn chains

For each pattern found, explain its significance and how to exploit or defend against it.`,
          },
        },
      ],
    })
  );


}