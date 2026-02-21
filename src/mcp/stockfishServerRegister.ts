import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StockfishService } from "../services/sfengine.js";
import { fenSchema, engineDepthSchema } from "../runner/schema.js";
import { z } from "zod";

export function registerLocalStockfishTools(server: McpServer): void {
  
  const stockfishClient = new StockfishService();

  server.registerTool(
    "get-stockfish-analysis",
    {
      description: "Analyze a chess position using Stockfish 18 Multi-threated Lite WASM engine",
      inputSchema: {
        fen: fenSchema,
        depth: engineDepthSchema,
      },
      annotations: {
        openWorldHint: true
      }
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

  server.registerTool(
    "fen-openingbook-lookup",
    {
      description: "Look up a fen in 12k positions of opening book to get name, moves information for fen",
      inputSchema: {
        fen: fenSchema,
      },
      annotations: {
        openWorldHint: true
      }
    },
    async ({ fen}) => {
      try {
        const isHealthy = await stockfishClient.checkHealth();
        if (!isHealthy) {
          throw new Error("Stockfish service is not available");
        }

        const book = await stockfishClient.getBookAnalysis(fen);

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(book, null, 2),
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

  server.registerTool(
    "get-stockfish-best-move",
    {
      description: "Find the best move in a chess position using Stockfish 18 Multi-threated Lite WASM engine",
      inputSchema: {
        fen: fenSchema,
        depth: engineDepthSchema,
      },
      annotations: {
        openWorldHint: true
      }
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


  server.registerTool(
    "get-stockfish-multipv-analysis",
    {
      description: "Analyze a chess position and get multiple best move candidates with Stockfish 18 Multi-threated Lite WASM engine",
      inputSchema: {
        fen: fenSchema,
        depth: engineDepthSchema,
        numLines: z.number().min(1).max(5).describe("Number of best move lines to analyze (1-5)"),
      },
      annotations: {
        openWorldHint: true
      }
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


  server.registerTool(
    "get-stockfish-batch-analysis",
    {
      description: "Analyze multiple chess positions in batch using Stockfish 18 Multi-threated Lite WASM engine",
      inputSchema: {
        positions: z.array(
          z.object({
            fen: fenSchema,
          })
        ).describe("Array of positions to analyze"),
      },
      annotations: {
        openWorldHint: true,
      }
    },
    async ({ positions }) => {
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