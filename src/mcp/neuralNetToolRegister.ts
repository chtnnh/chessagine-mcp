import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import z from "zod";
import { fenSchema, tokenSchema } from "../runner/schema.js";
import { postToolAdapter } from "@jalpp/mcp-adapter";

const BASE_URL = "https://nn-analyze-service-717993082875.us-central1.run.app";

export function registerNeuralNetTools(server: McpServer): void {
  postToolAdapter(server, {
    name: "get-maia3-analysis",
    description:
      "Analyze chess position using Maia3 neural network trained on human games at specific rating levels. Provides human-like move suggestions and evaluations, and estimated human eval HEE, tailored to player strength (600-2600 rating).",
    endpoint: `${BASE_URL}/nn-analyze`,
    inputSchema: {
      fen: fenSchema,
      engine: z.literal("maia3").default("maia3"),
      rating: z
        .number()
        .min(600)
        .max(2600)
        .describe(
          "Target player rating level for analysis, the rating must be the following values: [600, 700, 800, 900, 1000, 1100, 1200, 1300, 1400, 1500, 1600, 1700, 1800, 1900, 2000, 2100, 2200, 2300, 2400, 2500, 2600]",
        ),
    },
  });

  postToolAdapter(server, {
    name: "get-leela-analysis",
    description:
      "Analyze chess position using Leela Chess Zero neural network. Provides strong tactical analysis with neural network evaluation and candidate moves, and estimated converted stockfish like centi-pawn eval. Uses T1-256x10 neural net, trained on self played games",
    endpoint: `${BASE_URL}/nn-analyze`,
    inputSchema: {
      fen: fenSchema,
      engine: z.literal("leela").default("leela"),
    },
  });

  postToolAdapter(server, {
    name: "get-elite-leela-analysis",
    description:
      "Analyze chess position using Elite Leela Chess Zero with enhanced evaluation. Provides top-level computer analysis with deep neural network insights likeevaluation and candidate moves, and estimated converted stockfish like centi-pawn eval. Trained on 20M games from Lichess Elite Database (2500 - 3000)",
    endpoint: `${BASE_URL}/nn-analyze`,
    inputSchema: {
      fen: fenSchema,
      engine: z.literal("elite-leela").default("elite-leela"),
    },
  });
}
