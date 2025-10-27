import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
export const server = new McpServer({
    name: "chessagine-mcp",
    version: "2.0.0",
    capabilities: {
        resources: {},
        tools: {},
    },
});
