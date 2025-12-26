import { registerLichessTools } from "./lichessToolRegister.js";
import { registerRenderingTools } from "./renderToolRegister.js";
import { registerBoardStateTools } from "./boardstateToolRegister.js";
import { registerThemeAnalysisTools } from "./themeToolRegister.js";
import { registerUtilsTools } from "./utilToolRegister.js";
import { registerLocalStockfishTools } from "./stockfishServerRegister.js";
import { registerCBM } from "./cbmToolRegister.js";
import { registerChessDBTools } from "./chessDbToolRegister.js";
import { registerNeuralNetTools } from "./neuralNetToolRegister.js";
export function registerAgine(server) {
    registerLichessTools(server);
    registerRenderingTools(server);
    registerBoardStateTools(server);
    registerCBM(server);
    registerLocalStockfishTools(server);
    registerThemeAnalysisTools;
    registerUtilsTools(server);
    registerChessDBTools(server);
    registerNeuralNetTools(server);
}
