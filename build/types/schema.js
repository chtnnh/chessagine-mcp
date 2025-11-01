import z from "zod";
export const CastleRightsSchema = z.object({
    queenside: z.boolean(),
    kingside: z.boolean(),
});
export const PositionalPawnSchema = z.object({
    doublepawncount: z.number(),
    isolatedpawncount: z.number(),
    backwardpawncount: z.number(),
    passedpawncount: z.number(),
    positionalAdvatange: z.number(),
});
export const SpaceControlSchema = z.object({
    centerspacecontrolscore: z.number(),
    flankspacecontrolscore: z.number(),
    totalspacecontrolscore: z.number(),
    spaceadvantage: z.number(),
});
export const SidePiecePlacementSchema = z.object({
    kingplacement: z.array(z.string()),
    queenplacement: z.array(z.string()),
    bishopplacement: z.array(z.string()),
    knightplacement: z.array(z.string()),
    rookplacement: z.array(z.string()),
    pawnplacement: z.array(z.string()),
});
export const PieceAttackDefendInfoSchema = z.object({
    attackerscount: z.number(),
    defenderscount: z.number(),
    attackers: z.array(z.string()),
    defenders: z.array(z.string()),
});
export const KingSafetySchema = z.object({
    kingsquare: z.string(),
    attackerscount: z.number(),
    defenderscount: z.number(),
    pawnshield: z.number(),
    kingsafetysadvantage: z.number(),
    cancastle: z.boolean(),
    hascastled: z.boolean(),
});
export const SideAttackerDefendersSchema = z.object({
    pawnInfo: PieceAttackDefendInfoSchema,
    knightInfo: PieceAttackDefendInfoSchema,
    bishopInfo: PieceAttackDefendInfoSchema,
    rookInfo: PieceAttackDefendInfoSchema,
    queenInfo: PieceAttackDefendInfoSchema,
    kingInfo: z.undefined(),
});
export const PieceMobilitySchema = z.object({
    queenmobility: z.number(),
    rookmobility: z.number(),
    bishopmobility: z.number(),
    knightmobility: z.number(),
    totalmobility: z.number(),
    mobilityadvantage: z.number(),
});
export const SideSquareControlSchema = z.object({
    lightSquares: z.array(z.string()),
    darkSquares: z.array(z.string()),
    lightSquareControl: z.number(),
    darkSqaureControl: z.number(),
    lightSquareAdvantage: z.number(),
    darkSqaureAdvantage: z.number(),
    totalSqaureAdvantage: z.number(),
});
export const MaterialInfoSchema = z.object({
    materialcount: z.number(),
    materialvalue: z.number(),
    piececount: z.object({
        pawns: z.number(),
        knights: z.number(),
        bishops: z.number(),
        rooks: z.number(),
        queens: z.number(),
    }),
    bishoppair: z.boolean(),
    materialadvantage: z.number(),
});
export const SideStateScoresSchema = z.object({
    castlingScore: CastleRightsSchema,
    materialScore: MaterialInfoSchema,
    spaceScore: SpaceControlSchema,
    pieceplacementScore: SidePiecePlacementSchema,
    positionalScore: PositionalPawnSchema,
    squareControlScore: SideSquareControlSchema,
    kingSafetyScore: KingSafetySchema,
    pieceMobilityScore: PieceMobilitySchema,
});
export const BoardStateSchema = z.object({
    fen: z.string(),
    validfen: z.boolean(),
    legalMoves: z.array(z.string()),
    white: SideStateScoresSchema,
    black: SideStateScoresSchema,
    whitepieceattackerdefenderinfo: SideAttackerDefendersSchema,
    blackpieceattackerdefenderinfo: SideAttackerDefendersSchema,
    isCheckmate: z.boolean(),
    isStalemate: z.boolean(),
    isGameOver: z.boolean(),
    moveNumber: z.number(),
    sidetomove: z.string(),
    gamePhase: z.enum(['opening', 'middlegame', 'endgame']),
});
export const MovesSchema = z.object({
    uci: z.string(),
    san: z.string(),
    averageRating: z.number(),
    white: z.number(),
    draws: z.number(),
    black: z.number(),
    game: z.object({
        uci: z.string(),
        id: z.string(),
        black: z.object({
            name: z.string(),
            rating: z.number(),
        }),
        white: z.object({
            name: z.string(),
            rating: z.number(),
        }),
        year: z.number(),
        month: z.string(),
    }),
    opening: z.object({
        eco: z.string(),
        name: z.string(),
    }),
});
export const MasterGamesSchema = z.object({
    opening: z.object({
        eco: z.string(),
        name: z.string(),
    }),
    white: z.number(),
    draws: z.number(),
    black: z.number(),
    moves: z.array(MovesSchema),
    topGames: z.array(z.object({
        uci: z.string(),
        id: z.string(),
        black: z.object({
            name: z.string(),
            rating: z.number(),
        }),
        white: z.object({
            name: z.string(),
            rating: z.number(),
        }),
        year: z.number(),
        month: z.string(),
    })),
});
