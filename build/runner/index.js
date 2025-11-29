import z from "zod";
import { registerAgine } from "../mcp/registerAgine.js";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
export const configSchema = z.object({
    lichessApiKey: z
        .string()
        .optional()
        .describe("Lichess API key to access Lichess Studies"),
    lichessUsername: z
        .string()
        .optional()
        .describe("Lichess username for mcp user"),
    chessboardmagicKey: z
        .string()
        .optional()
        .describe("Chessboardmagic Repitore Builder PAT")
});
export default function createServer({ config, }) {
    const Mcpserver = new McpServer({
        name: "chessagine-mcp",
        websiteUrl: "https://www.chessagine.com/",
        version: "2.0.0",
    });
    console.warn(config);
    process.env.LICHESS_API_KEY = config.lichessApiKey || "";
    process.env.LICHESS_USERNAME = config.lichessUsername || "";
    process.env.CHESSBOARD_MAGIC_PAT = config.chessboardmagicKey || "";
    registerAgine(Mcpserver);
    return Mcpserver.server;
}
