import z from "zod";
import { fenSchema } from "../runner/schema.js";
import { NeuralNetService } from "../services/nets.js";
export function registerNeuralNetTools(server) {
    const neuralNetService = new NeuralNetService();
    server.registerTool("get-maia2-analysis", {
        description: "Analyze chess position using Maia2 neural network trained on human games at specific rating levels. Provides human-like move suggestions and evaluations tailored to player strength (1100-1900 rating).",
        inputSchema: {
            fen: fenSchema,
            rating: z.number()
                .min(1100)
                .max(1900)
                .describe("Target player rating level for analysis, the rating must be the following values: [1100, 1200, 1300, 1400, 1500, 1600, 1700, 1800, 1900]")
        },
        annotations: {
            openWorldHint: true
        }
    }, async ({ fen, rating }) => {
        const { data, error } = await neuralNetService.analyzeMaia2(fen, rating);
        return {
            content: [
                {
                    type: "text",
                    text: error || JSON.stringify(data, null, 2),
                },
            ],
        };
    });
    server.registerTool("get-leela-analysis", {
        description: "Analyze chess position using Leela Chess Zero neural network. Provides strong tactical analysis with neural network evaluation and candidate moves. Uses T1-256x10 neural net, trained on self played games",
        inputSchema: {
            fen: fenSchema
        },
        annotations: {
            openWorldHint: true
        }
    }, async ({ fen }) => {
        const { data, error } = await neuralNetService.analyzeLeela(fen);
        return {
            content: [
                {
                    type: "text",
                    text: error || JSON.stringify(data, null, 2),
                },
            ],
        };
    });
    server.registerTool("get-elite-leela-analysis", {
        description: "Analyze chess position using Elite Leela Chess Zero with enhanced evaluation. Provides top-level computer analysis with deep neural network insights. Trained on 20M games from Lichess Elite Database (2500 - 3000)",
        inputSchema: {
            fen: fenSchema
        },
        annotations: {
            openWorldHint: true
        }
    }, async ({ fen }) => {
        const { data, error } = await neuralNetService.analyzeEliteLeela(fen);
        return {
            content: [
                {
                    type: "text",
                    text: error || JSON.stringify(data, null, 2),
                },
            ],
        };
    });
}
