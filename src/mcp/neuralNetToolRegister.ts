import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import z from "zod";
import { fenSchema } from "../runner/schema.js";
import { postToolAdapter } from "@jalpp/mcp-adapter";

const BASE_URL = "https://nn-analyze-service-717993082875.us-central1.run.app";

export function registerNeuralNetTools(server: McpServer): void {

  postToolAdapter(server, {
    name: "get-maia2-analysis",
    description: "Analyze chess position using Maia2 neural network trained on human games at specific rating levels. Provides human-like move suggestions and evaluations tailored to player strength (1100-1900 rating).",
    endpoint: `${BASE_URL}/nn-analyze`,
    inputSchema: {
      fen: fenSchema,
      engine: z.literal("maia2").default("maia2"),
      rating: z.number().min(1100).max(1900).describe("Target player rating level for analysis, the rating must be the following values: [1100, 1200, 1300, 1400, 1500, 1600, 1700, 1800, 1900]"),
    },
    auth: {type: "bearer", token: process.env.LICHESS_API_TOKEN!}
  });

  postToolAdapter(server, {
    name: "get-leela-analysis",
    description: "Analyze chess position using Leela Chess Zero neural network. Provides strong tactical analysis with neural network evaluation and candidate moves. Uses T1-256x10 neural net, trained on self played games",
    endpoint: `${BASE_URL}/nn-analyze`,
    inputSchema: {
      fen: fenSchema,
      engine: z.literal("leela").default("leela"),
    },
  });

  postToolAdapter(server, {
    name: "get-elite-leela-analysis",
    description: "Analyze chess position using Elite Leela Chess Zero with enhanced evaluation. Provides top-level computer analysis with deep neural network insights. Trained on 20M games from Lichess Elite Database (2500 - 3000)",
    endpoint: `${BASE_URL}/nn-analyze`,
    inputSchema: {
      fen: fenSchema,
      engine: z.literal("elite-leela").default("elite-leela"),
    },
  });
}