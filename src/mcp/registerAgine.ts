import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { registerLichessTools } from "./lichessToolRegister.js";
import { registerRenderingTools } from "./renderToolRegister.js";
import { registerUtilsTools } from "./utilToolRegister.js";
import { registerStockfishTools } from "./stockfishToolRegister.js";
import { registerCBMTools } from "./cbmToolRegister.js";
import { registerChessDBTools } from "./chessDbToolRegister.js";
import { registerNeuralNetTools } from "./neuralNetToolRegister.js";
import { registerPosiraTools } from "./posiraToolRegister.js";


export function registerAgine(server: McpServer): void {
    registerLichessTools(server);
    registerRenderingTools(server);
    registerCBMTools(server);
    registerStockfishTools(server);
    registerUtilsTools(server);
    registerChessDBTools(server);
    registerNeuralNetTools(server);
    registerPosiraTools(server);
}