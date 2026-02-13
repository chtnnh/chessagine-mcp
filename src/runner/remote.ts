#!/usr/bin/env node

import { createMcpExpressApp } from "@modelcontextprotocol/sdk/server/express.js";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import cors from "cors";
import type { Request, Response } from "express";
import { server } from "./server.js";
import { registerAgine } from "../mcp/registerAgine.js";

/**
 * Factory function to create a new MCP server instance
 */
function createChessAgineServer(): McpServer {
  // Create a new server instance for each request
  const serverInstance = Object.create(server);
  registerAgine(serverInstance);
  return serverInstance;
}

/**
 * Starts the ChessAgine MCP server with Streamable HTTP transport
 */
async function startStreamableHTTPServer(): Promise<void> {
  const port = parseInt(process.env.PORT ?? "3001", 10);
  const app = createMcpExpressApp({ host: "0.0.0.0" });
  
  app.use(cors());

  app.all("/mcp", async (req: Request, res: Response) => {
    const serverInstance = createChessAgineServer();
    const transport = new StreamableHTTPServerTransport({
      sessionIdGenerator: undefined,
    });

    res.on("close", () => {
      transport.close().catch(() => {});
      serverInstance.close().catch(() => {});
    });

    try {
      await serverInstance.connect(transport);
      await transport.handleRequest(req, res, req.body);
    } catch (error) {
      console.error("ChessAgine MCP error:", error);
      if (!res.headersSent) {
        res.status(500).json({
          jsonrpc: "2.0",
          error: { code: -32603, message: "Internal server error" },
          id: null,
        });
      }
    }
  });

  const httpServer = app.listen(port, () => {
    console.log(`ChessAgine MCP server listening on http://localhost:${port}/mcp`);
  });

  const shutdown = () => {
    console.log("\nShutting down ChessAgine MCP server...");
    httpServer.close(() => process.exit(0));
  };

  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);
}

async function main() {
  try {
    await startStreamableHTTPServer();
  } catch (error) {
    console.error("Failed to start ChessAgine MCP server:", error);
    process.exit(1);
  }
}

process.on('unhandledRejection', (reason) => {
  console.error('Unhandled rejection:', reason);
  process.exit(1);
});

main().catch((error) => {
  console.error("Fatal error in main():", error);
  process.exit(1);
});