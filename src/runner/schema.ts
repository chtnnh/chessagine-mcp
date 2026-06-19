import z from "zod";

export const fenSchema = z
  .string()
  .regex(
    /^([rnbqkpRNBQKP1-8]+\/){7}[rnbqkpRNBQKP1-8]+ [bw] [KQkq-]+ [a-h][1-8]|[a-h][1-8]|[a-h][1-8]|[a-h][1-8]|- \d+ \d+$/,
    "Invalid FEN format",
  )
  .describe("FEN string representing the board position");

export const sideSchema = z.enum(["w", "b"]).describe("Side to evaluate from");

export const engineDepthSchema = z
  .number()
  .min(12)
  .max(30)
  .describe("Search depth for Stockfish engine");

export const moveSchema = z
  .string()
  .describe("The move to be played (in SAN or UCI format)");

export const movesListSchema = z.array(moveSchema);

export const moveAlgSchema = z
  .array(z.string())
  .describe("Array of moves in algebraic notation");

export const variationSchema = z
  .array(
    z.object({
      name: z.string(),
      moves: z.array(z.string()),
    }),
  )
  .describe("Array of variations to compare");

export const themesTypeSchema = z
  .enum([
    "material",
    "mobility",
    "space",
    "positional",
    "kingSafety",
    "tactical",
    "lightsqaureControl",
    "darksqaureControl",
  ])
  .describe("Theme to track");

export const gamePgnSchema = z.string().describe("Game PGN");

export const cbmGameIdSchema = z
  .string()
  .describe("game ID to fetch chessboardmagic game");

export const cbmRepIdSchema = z
  .string()
  .describe("repertoire ID to fetch a repertoire from chessboardmagic");

export const is3dSchema = z
  .boolean()
  .describe("3D view of the board")
  .optional();

export const is960Schema = z
  .boolean()
  .describe("Is this a chess960 variant user query");

export const tokenSchema = z
  .string()
  .optional()
  .describe(
    "Bearer token to authenticate the request, falls back to server configured token if not provided",
  );


export const puzzleThemeSchema = z.enum([
  "advancedPawn",
  "advantage",
  "anastasiaMate",
  "arabianMate",
  "attackingF2F7",
  "attraction",
  "backRankMate",
  "bishopEndgame",
  "bodenMate",
  "capturingDefender",
  "castling",
  "clearance",
  "crushing",
  "defensiveMove",
  "deflection",
  "discoveredAttack",
  "doubleBishopMate",
  "doubleCheck",
  "dovetailMate",
  "endgame",
  "enPassant",
  "equality",
  "exposedKing",
  "fork",
  "hangingPiece",
  "hookMate",
  "interference",
  "intermezzo",
  "killBoxMate",
  "kingsideAttack",
  "knightEndgame",
  "long",
  "master",
  "masterVsMaster",
  "mate",
  "mateIn1",
  "mateIn2",
  "mateIn3",
  "mateIn4",
  "mateIn5",
  "middlegame",
  "oneMove",
  "opening",
  "pawnEndgame",
  "pin",
  "promotion",
  "queenEndgame",
  "queenRookEndgame",
  "queensideAttack",
  "quietMove",
  "rookEndgame",
  "sacrifice",
  "short",
  "skewer",
  "smotheredMate",
  "superGM",
  "trappedPiece",
  "underPromotion",
  "veryLong",
  "vukovicMate",
  "xRayAttack",
  "zugzwang",
]).describe("Puzzle theme tag");

export const puzzleThemesArraySchema = z
  .array(puzzleThemeSchema)
  .describe("Array of puzzle theme tags to filter by (e.g., ['fork', 'pin', 'mateIn2'])");