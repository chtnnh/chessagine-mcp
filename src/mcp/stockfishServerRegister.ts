import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { MCPStockfishHTTPClient } from "../engine/client.js";
import { fenSchema, engineDepthSchema } from "../runner/schema.js";
import { z } from "zod";

export function registerLocalStockfishTools(server: McpServer): void {
  let stockfishClient: MCPStockfishHTTPClient;
  const host = "https://mcpstockfish.vercel.app/";

  stockfishClient = new MCPStockfishHTTPClient(host);

  // General Stockfish analysis
  server.tool(
    "get-stockfish-analysis",
    "Analyze a chess position using Stockfish WASM engine",
    {
      fen: fenSchema,
      depth: engineDepthSchema,
    },
    async ({ fen, depth }) => {
      try {
        const isHealthy = await stockfishClient.checkHealth();
        if (!isHealthy) {
          throw new Error("Stockfish service is not available");
        }

        const result = await stockfishClient.evaluatePosition({
          fen: fen as string,
          depth: depth as number,
          multiPv: 1,
        });

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `Error: ${
                error instanceof Error ? error.message : "Unknown error"
              }`,
            },
          ],
          isError: true,
        };
      }
    }
  );

  // Get best move
  server.tool(
    "get-best-move",
    "Find the best move in a chess position using Stockfish",
    {
      fen: fenSchema,
      depth: engineDepthSchema,
    },
    async ({ fen, depth }) => {
      try {
        const isHealthy = await stockfishClient.checkHealth();
        if (!isHealthy) {
          throw new Error("Stockfish service is not available");
        }

        const result = await stockfishClient.evaluatePosition({
          fen: fen as string,
          depth: depth as number,
          multiPv: 1,
        });

        const bestMove = result.bestmove
        const evaluation = result.lines[0]

        return {
          content: [
            {
              type: "text",
              text: `Best move: ${bestMove}\nEvaluation: ${JSON.stringify(evaluation)}`,
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `Error: ${
                error instanceof Error ? error.message : "Unknown error"
              }`,
            },
          ],
          isError: true,
        };
      }
    }
  );

  // Multi-PV analysis
  server.tool(
    "get-stockfish-multipv-analysis",
    "Analyze a chess position and get multiple best move candidates",
    {
      fen: fenSchema,
      depth: engineDepthSchema,
      numLines: z.number().min(1).max(5).describe("Number of best move lines to analyze (1-5)"),
    },
    async ({ fen, depth, numLines }) => {
      try {
        const isHealthy = await stockfishClient.checkHealth();
        if (!isHealthy) {
          throw new Error("Stockfish service is not available");
        }

        const result = await stockfishClient.evaluatePosition({
          fen: fen as string,
          depth: depth as number,
          multiPv: numLines as number,
        });

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `Error: ${
                error instanceof Error ? error.message : "Unknown error"
              }`,
            },
          ],
          isError: true,
        };
      }
    }
  );

  // Batch analysis
  server.tool(
    "get-stockfish-batch-analysis",
    "Analyze multiple chess positions in batch using Stockfish",
    {
      positions: z.array(
        z.object({
          fen: fenSchema,
        })
      ).describe("Array of positions to analyze"),
    },
    async ({ positions,}) => {
      try {
        const isHealthy = await stockfishClient.checkHealth();
        if (!isHealthy) {
          throw new Error("Stockfish service is not available");
        }
    
        const results = await stockfishClient.analyzeBatch(positions)

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(results, null, 2),
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `Error: ${
                error instanceof Error ? error.message : "Unknown error"
              }`,
            },
          ],
          isError: true,
        };
      }
    }
  );
}