import { registerAgineSystemPrompt } from "./agineSystemPromptRegister.js";
import { registerLichessTools } from "./lichessToolRegister.js";
import { registerRenderingTools } from "./renderToolRegister.js";
import { registerStateTools } from "./stateToolRegister.js";
import { registerThemeCalculationTools } from "./themeToolRegister.js";
import { registerUtilsTools } from "./utilToolRegister.js";
import { registerLocalStockfishTools } from "./stockfishServerRegister.js";
import { registerChessDBTools } from "./chessDbToolRegister.js";
export function registerAgine(server) {
    registerAgineSystemPrompt(server);
    registerLichessTools(server);
    registerRenderingTools(server);
    registerStateTools(server);
    registerChessDBTools(server);
    registerLocalStockfishTools(server);
    registerThemeCalculationTools(server);
    registerUtilsTools(server);
}
