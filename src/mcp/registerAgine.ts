import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { registerAgineSystemPrompt } from "./systemPromptRegister.js";
import { registerLichessTools } from "./lichessToolRegister.js";
import { registerRenderingTools } from "./renderToolRegister.js";
import { registerBoardStateTools } from "./boardstateToolRegister.js";
import { registerThemeAnalysisTools } from "./themeToolRegister.js";
import { registerUtilsTools } from "./utilToolRegister.js";
import { registerLocalStockfishTools } from "./stockfishServerRegister.js";
import { registerCBM } from "./cbmToolRegister.js";


export function registerAgine(server: McpServer): void {
    registerAgineSystemPrompt(server);
    registerLichessTools(server);
    registerRenderingTools(server);
    registerBoardStateTools(server);
    registerCBM(server);
    registerLocalStockfishTools(server);
    registerThemeAnalysisTools
    registerUtilsTools(server);
    registerCBM(server);
}