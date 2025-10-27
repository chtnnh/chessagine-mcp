import { WHITE, BLACK } from "chess.js";
import { BOARD_CENTRE, BOARD_FLANK } from "../types/types.js";
function getSpaceControl(chess, side) {
    let spaceMeasure = 0;
    for (const sq of BOARD_CENTRE) {
        spaceMeasure += chess.attackers(sq, side).length;
    }
    return spaceMeasure;
}
function getFlankSpaceControl(chess, side) {
    let flankMeasure = 0;
    for (const sq of BOARD_FLANK) {
        flankMeasure += chess.attackers(sq, side).length;
    }
    return flankMeasure;
}
export function getSideSpaceControl(chess, side) {
    const centre = getSpaceControl(chess, side);
    const flank = getFlankSpaceControl(chess, side);
    const total = centre + flank;
    // Calculate opponent's space control for advantage calculation
    const enemySide = side === WHITE ? BLACK : WHITE;
    const enemyCentre = getSpaceControl(chess, enemySide);
    const enemyFlank = getFlankSpaceControl(chess, enemySide);
    const enemyTotal = enemyCentre + enemyFlank;
    // Space advantage: positive = we control more, negative = opponent controls more
    const spaceAdvantage = total - enemyTotal;
    return {
        centerspacecontrolscore: centre,
        flankspacecontrolscore: flank,
        totalspacecontrolscore: total,
        spaceadvantage: spaceAdvantage, // Add this new field
    };
}
