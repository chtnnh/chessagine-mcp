import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { registerLichessTools } from "./lichessToolRegister.js";
import { registerRenderingTools } from "./renderToolRegister.js";
import { registerBoardStateTools } from "./boardstateToolRegister.js";
import { registerThemeAnalysisTools } from "./themeToolRegister.js";
import { registerUtilsTools } from "./utilToolRegister.js";
import { registerLocalStockfishTools } from "./stockfishServerRegister.js";
import { registerCBM } from "./cbmToolRegister.js";
import { registerChessDBTools } from "./chessDbToolRegister.js";
import { registerNeuralNetTools } from "./neuralNetToolRegister.js";


export function registerAgine(server: McpServer): void {
    registerLichessTools(server);
    registerRenderingTools(server);
    registerBoardStateTools(server);
    registerCBM(server);
    registerLocalStockfishTools(server);
    registerThemeAnalysisTools(server);
    registerUtilsTools(server);
    registerChessDBTools(server);
    registerNeuralNetTools(server);
}