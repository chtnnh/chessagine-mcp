import { getThemeScores, analyzeVariationThemes, getThemeProgression, compareVariations, findCriticalMoments } from "../review/ovp.js";
import { generateGameReview, formatGameReview } from "../review/gamereview.js";
import { TacticalBoard } from "../themes/tacticalBoard.js";
import { validColorSchema } from "../utils/utils.js";
export class ThemeAnalysisService {
    getThemeScores(fen, color) {
        if (!fen) {
            return { error: "Missing required argument: fen" };
        }
        if (!color) {
            return { error: "Missing required argument: color" };
        }
        try {
            const validColor = validColorSchema(color);
            const result = getThemeScores(fen, validColor);
            return { data: result };
        }
        catch (error) {
            return { error: "Error getting theme scores" };
        }
    }
    getTacticalPositionSummary(fen) {
        if (!fen) {
            return { error: "Missing required argument: fen" };
        }
        try {
            const tactics = new TacticalBoard(fen);
            return { data: tactics.toString() };
        }
        catch (error) {
            return { error: "Error getting tactical position summary" };
        }
    }
    analyzeVariationThemes(rootFen, moves, color) {
        if (!rootFen) {
            return { error: "Missing required argument: rootFen" };
        }
        if (!moves || moves.length === 0) {
            return { error: "Missing required argument: moves" };
        }
        if (!color) {
            return { error: "Missing required argument: color" };
        }
        try {
            const validColor = validColorSchema(color);
            const result = analyzeVariationThemes(rootFen, moves, validColor);
            return { data: result };
        }
        catch (error) {
            return { error: "Error analyzing variation themes" };
        }
    }
    getThemeProgression(rootFen, moves, color, theme) {
        if (!rootFen) {
            return { error: "Missing required argument: rootFen" };
        }
        if (!moves || moves.length === 0) {
            return { error: "Missing required argument: moves" };
        }
        if (!color) {
            return { error: "Missing required argument: color" };
        }
        if (!theme) {
            return { error: "Missing required argument: theme" };
        }
        try {
            const validColor = validColorSchema(color);
            const result = getThemeProgression(rootFen, moves, validColor, theme);
            return { data: result };
        }
        catch (error) {
            return { error: "Error getting theme progression" };
        }
    }
    compareVariations(rootFen, variations, color) {
        if (!rootFen) {
            return { error: "Missing required argument: rootFen" };
        }
        if (!variations || variations.length === 0) {
            return { error: "Missing required argument: variations" };
        }
        if (!color) {
            return { error: "Missing required argument: color" };
        }
        try {
            const validColor = validColorSchema(color);
            const result = compareVariations(rootFen, variations, validColor);
            return { data: result };
        }
        catch (error) {
            return { error: "Error comparing variations" };
        }
    }
    findCriticalMoments(rootFen, moves, color, threshold = 0.5) {
        if (!rootFen) {
            return { error: "Missing required argument: rootFen" };
        }
        if (!moves || moves.length === 0) {
            return { error: "Missing required argument: moves" };
        }
        if (!color) {
            return { error: "Missing required argument: color" };
        }
        try {
            const validColor = validColorSchema(color);
            const result = findCriticalMoments(rootFen, moves, validColor, threshold);
            return { data: result };
        }
        catch (error) {
            return { error: "Error finding critical moments" };
        }
    }
    generateGameReview(pgn, criticalMomentThreshold = 0.5, format = "text") {
        if (!pgn) {
            return { error: "Missing required argument: pgn" };
        }
        try {
            const review = generateGameReview(pgn, criticalMomentThreshold);
            if (format === "json") {
                return { data: review };
            }
            const formattedReview = formatGameReview(review);
            const detailedOutput = this.buildDetailedReviewOutput(review, formattedReview);
            return { data: detailedOutput };
        }
        catch (error) {
            return {
                error: `Error generating game review: ${error instanceof Error ? error.message : 'Invalid PGN or analysis error'}`
            };
        }
    }
    buildDetailedReviewOutput(review, formattedReview) {
        let output = formattedReview + "\n\n";
        output += "=== DETAILED THEME CHANGES ===\n\n";
        output += "WHITE:\n";
        review.whiteAnalysis.overallThemes.themeChanges.forEach((tc) => {
            output += `  ${tc.theme}: ${tc.initialScore.toFixed(2)} → ${tc.finalScore.toFixed(2)} `;
            output += `(${tc.change > 0 ? '+' : ''}${tc.change.toFixed(2)}, ${tc.percentChange.toFixed(1)}%)\n`;
        });
        output += "\nBLACK:\n";
        review.blackAnalysis.overallThemes.themeChanges.forEach((tc) => {
            output += `  ${tc.theme}: ${tc.initialScore.toFixed(2)} → ${tc.finalScore.toFixed(2)} `;
            output += `(${tc.change > 0 ? '+' : ''}${tc.change.toFixed(2)}, ${tc.percentChange.toFixed(1)}%)\n`;
        });
        if (review.whiteAnalysis.criticalMoments.length > 0) {
            output += "\n=== WHITE'S CRITICAL MOMENTS ===\n";
            review.whiteAnalysis.criticalMoments.forEach((cm) => {
                const moveNum = Math.floor(cm.moveIndex / 2) + 1;
                output += `\nMove ${moveNum}: ${cm.move}\n`;
                cm.themeChanges.forEach((tc) => {
                    output += `  ${tc.theme}: ${tc.change > 0 ? '+' : ''}${tc.change.toFixed(2)}\n`;
                });
            });
        }
        if (review.blackAnalysis.criticalMoments.length > 0) {
            output += "\n=== BLACK'S CRITICAL MOMENTS ===\n";
            review.blackAnalysis.criticalMoments.forEach((cm) => {
                const moveNum = Math.floor(cm.moveIndex / 2) + 1;
                output += `\nMove ${moveNum}: ${cm.move}\n`;
                cm.themeChanges.forEach((tc) => {
                    output += `  ${tc.theme}: ${tc.change > 0 ? '+' : ''}${tc.change.toFixed(2)}\n`;
                });
            });
        }
        return output;
    }
}
