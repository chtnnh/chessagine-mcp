import { getKnowledgeBase } from "../tools/knowlegebase.js";
import { moveToFenMap, PROMPT_CATEGORIES, collectFensFromGame } from "../utils/utils.js";
import { PUZZLE_THEMES } from "../tools/puzzle.js";
export class ChessUtilsService {
    getKnowledgeBase() {
        try {
            const knowledge = getKnowledgeBase();
            return { data: knowledge };
        }
        catch (error) {
            return { error: "Error getting chess knowledge base" };
        }
    }
    getStarterPrompts() {
        try {
            const categories = Object.entries(PROMPT_CATEGORIES).map(([key, value]) => ({
                id: key,
                name: value.name,
                promptCount: value.prompts.length
            }));
            return { data: categories };
        }
        catch (error) {
            return { error: "Error getting starter prompts" };
        }
    }
    getPuzzleThemes() {
        try {
            const themes = PUZZLE_THEMES.map(theme => ({
                tag: theme.tag,
                description: theme.description,
            }));
            return {
                data: {
                    totalThemes: themes.length,
                    themes: themes,
                    popularThemes: [
                        "fork", "pin", "skewer", "discoveredAttack",
                        "mateIn1", "mateIn2", "mateIn3",
                        "hangingPiece", "sacrifice", "deflection"
                    ],
                    difficultyThemes: [
                        "mateIn1", "mateIn2", "mateIn3", "mateIn4", "mateIn5",
                        "short", "long", "veryLong"
                    ],
                }
            };
        }
        catch (error) {
            return { error: `Error getting puzzle themes: ${error}` };
        }
    }
    parsePgnIntoFens(pgn) {
        if (!pgn) {
            return { error: "Missing required argument: pgn" };
        }
        try {
            const fens = collectFensFromGame(pgn);
            return {
                data: {
                    fens: fens
                }
            };
        }
        catch (error) {
            return { error: "Invalid PGN" };
        }
    }
    getFenMapLookup(pgn, isAfter) {
        if (!pgn) {
            return { error: "Missing required argument: pgn" };
        }
        if (isAfter === undefined || isAfter === null) {
            return { error: "Missing required argument: isAfter" };
        }
        try {
            const fenMap = moveToFenMap(pgn, isAfter);
            return {
                data: {
                    fenMap: fenMap,
                    moveCount: Object.keys(fenMap).length,
                    mappingType: isAfter ? "after move" : "before move"
                }
            };
        }
        catch (error) {
            return { error: `Error generating move-to-FEN map: ${error}` };
        }
    }
}
