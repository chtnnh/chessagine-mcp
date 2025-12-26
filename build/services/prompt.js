export class ChessPromptService {
    getAnalyzePosition(fen, side = "white") {
        return [
            {
                role: "user",
                content: {
                    type: "text",
                    text: `Analyze this chess position from ${side}'s perspective. FEN: ${fen}. Cover material count, king safety, piece activity, pawn structure, control of key squares, tactical opportunities, and strategic plans. Conclude with an evaluation and recommend the best continuation.`,
                },
            },
        ];
    }
    getFindTactics(fen, side = "white") {
        return [
            {
                role: "user",
                content: {
                    type: "text",
                    text: `Find tactical opportunities for ${side} in this position. FEN: ${fen}. Look for pins, forks, skewers, discovered attacks, deflection, removal of defender, zwischenzug, back rank weaknesses, and mating patterns. Explain the tactical motif, key moves, why it works, and the resulting advantage.`,
                },
            },
        ];
    }
    getOpeningAnalysis(fen) {
        return [
            {
                role: "user",
                content: {
                    type: "text",
                    text: `Analyze this opening position. FEN: ${fen}. Identify the opening variation, explain key ideas for both sides, typical pawn structures, ideal piece placement, critical moves, common mistakes, and recommended continuations with explanations.`,
                },
            },
        ];
    }
    getEndgameAnalysis(fen) {
        return [
            {
                role: "user",
                content: {
                    type: "text",
                    text: `Analyze this endgame position. FEN: ${fen}. Identify the endgame type, evaluate if it is won, drawn, or unclear, explain relevant endgame principles, identify critical squares, describe winning or drawing technique, and reference similar theoretical positions.`,
                },
            },
        ];
    }
    getAnnotateGame(pgn) {
        return [
            {
                role: "user",
                content: {
                    type: "text",
                    text: `Annotate this chess game with detailed commentary: ${pgn}. Provide opening analysis, highlight critical moments, point out tactical opportunities, explain strategic themes, suggest move alternatives, assess positions throughout, and summarize key lessons.`,
                },
            },
        ];
    }
    getCompareGames(pgn1, pgn2) {
        return [
            {
                role: "user",
                content: {
                    type: "text",
                    text: `Compare these two chess games. Game 1: ${pgn1}. Game 2: ${pgn2}. Analyze opening similarities and differences, strategic themes, tactical patterns, critical decisions, style comparison, and lessons learned.`,
                },
            },
        ];
    }
    getExplainMistake(fen, move, bestMove) {
        const bestMoveText = bestMove ? ` Best move: ${bestMove}.` : "";
        return [
            {
                role: "user",
                content: {
                    type: "text",
                    text: `Explain why this move was a mistake. Position FEN: ${fen}. Move played: ${move}.${bestMoveText} Explain what the move tried to accomplish, why it fails, better alternatives, which chess principle was violated, and how to avoid similar mistakes.`,
                },
            },
        ];
    }
    getCreateTrainingPlan(level, weakness, timePerDay = "30") {
        const weaknessText = weakness ? ` Weakness to address: ${weakness}.` : "";
        return [
            {
                role: "user",
                content: {
                    type: "text",
                    text: `Create a chess training plan. Level: ${level}.${weaknessText} Available time: ${timePerDay} minutes per day. Include daily routine, study materials, tactical training, game analysis approach, opening preparation, endgame practice, progress tracking, and weekly goals. Make it practical and actionable.`,
                },
            },
        ];
    }
    getBuildRepertoire(color, style = "positional", timeControl = "rapid") {
        return [
            {
                role: "user",
                content: {
                    type: "text",
                    text: `Build an opening repertoire for ${color} with ${style} style for ${timeControl} games. Provide main lines, responses to each opponent move, key ideas, move orders, study resources, practice plan, and backup options. Keep recommendations practical and achievable.`,
                },
            },
        ];
    }
    getIdentifyPatterns(fen) {
        return [
            {
                role: "user",
                content: {
                    type: "text",
                    text: `Identify all chess patterns in this position. FEN: ${fen}. Look for tactical patterns (forks, pins, skewers), positional patterns (weak squares, bad pieces, pawn structures), mating patterns (back rank, smothered mate), endgame patterns (Lucena, Philidor, key squares), strategic patterns (minority attack, piece sacrifice themes), and pawn structure patterns (isolated pawns, hanging pawns, pawn chains). Explain significance and how to exploit or defend.`,
                },
            },
        ];
    }
}
