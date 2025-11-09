import { getBoardState } from "./state.js";
import { STATE_THEMES } from "../types/types.js";
import { TacticalBoard } from "../themes/tacticalBoard.js";
import { TempoCalculator } from "../themes/temoCalculator.js";
export class PositionScorer {
    state;
    tacticalScorer;
    tempoScorer;
    side;
    constructor(fen, color) {
        this.state = getBoardState(fen);
        this.tacticalScorer = new TacticalBoard(fen);
        this.side = color;
        this.tempoScorer = new TempoCalculator(this.state, this.tacticalScorer, this.side);
    }
    get getSideScorer() {
        return this.side == "w" ? this.state.white : this.state.black;
    }
    getThemeScore(theme) {
        if (this.side === "w")
            return this.getSideThemeScore(theme);
        return -(this.getSideThemeScore(theme));
    }
    getSideThemeScore(theme) {
        const currentSideState = this.getSideScorer;
        switch (theme) {
            case STATE_THEMES.KING_SAFETY:
                return currentSideState.kingSafetyScore.kingsafetysadvantage;
            case STATE_THEMES.MATERIAL:
                return currentSideState.materialScore.materialadvantage;
            case STATE_THEMES.MOBILITY:
                return currentSideState.pieceMobilityScore.mobilityadvantage;
            case STATE_THEMES.POSITIONAL:
                return currentSideState.positionalScore.positionalAdvatange;
            case STATE_THEMES.SPACE:
                return currentSideState.spaceScore.spaceadvantage;
            case STATE_THEMES.TACTICAL:
                return this.tacticalScorer.calculateTacticalScore(this.side);
            case STATE_THEMES.SQAURE_CONTROL_LIGHT:
                return currentSideState.squareControlScore.lightSquareAdvantage;
            case STATE_THEMES.SQAURE_CONTROL_DARK:
                return currentSideState.squareControlScore.darkSqaureAdvantage;
            case STATE_THEMES.TEMPO:
                return this.tempoScorer.getTempoAdvantage();
        }
        return 0;
    }
}
