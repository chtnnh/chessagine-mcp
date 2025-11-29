import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { registerAgineSystemPrompt } from "./agineSystemPromptRegister.js";
import { registerLichessTools } from "./lichessToolRegister.js";
import { registerRenderingTools } from "./renderToolRegister.js";
import { registerStateTools } from "./stateToolRegister.js";
import { registerThemeCalculationTools } from "./themeToolRegister.js";
import { registerUtilsTools } from "./utilToolRegister.js";
import { registerLocalStockfishTools } from "./stockfishServerRegister.js";
import { registerChessDBTools } from "./chessDbToolRegister.js";
import { registerCBM } from "./cbmRegister.js";


export function registerAgine(server: McpServer): void {
    registerAgineSystemPrompt(server);
    registerLichessTools(server);
    registerRenderingTools(server);
    registerStateTools(server);
    registerChessDBTools(server);
    registerLocalStockfishTools(server);
    registerThemeCalculationTools(server);
    registerUtilsTools(server);
    registerCBM(server);
}