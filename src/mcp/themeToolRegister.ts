import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import z from "zod";
import { fenSchema, gamePgnSchema, sideSchema } from "../runner/schema.js";
import { ThemeAnalysisService } from "../services/themeanalysis.js";

export function registerThemeAnalysisTools(server: McpServer): void {
  const themeService = new ThemeAnalysisService();

  server.registerTool(
    "get-theme-scores",
    {
      description: "Get chess theme eval scores (material, mobility, space, positional, king safety, tactics, dark/light sqaure control) for a given position fen and the side to eval from. Positive eval means white is better, negative means black is better, Zero is equal",
      inputSchema: {
        fen: fenSchema,
        color: sideSchema,
      },
      annotations: {
        openWorldHint: false
      }
    },
    async ({ fen, color }) => {
      const { data, error } = themeService.getThemeScores(fen, color);

      return {
        content: [
          {
            type: "text",
            text: error || JSON.stringify(data, null, 2),
          },
        ],
      };
    }
  );

  server.registerTool(
    "get-tactical-position-summary",
    {
      description: "Get tactical position summary like hanging pieces, semi protected pieces, forks, pins for the given fen",
      inputSchema: {
        fen: fenSchema
      },
      annotations: {
        openWorldHint: false
      }
    },
    async ({ fen }) => {
      const { data, error } = themeService.getTacticalPositionSummary(fen);

      return {
        content: [
          {
            type: "text",
            text: error || JSON.stringify(data, null, 2),
          },
        ],
      };
    }
  );

  server.registerTool(
    "analyze-variation-themes",
    {
      description: "Analyze how chess themes change across a sequence of moves",
      inputSchema: {
        rootFen: fenSchema,
        moves: z.array(z.string()).describe("Array of moves in algebraic notation"),
        color: sideSchema,
      },
      annotations: {
        openWorldHint: false
      }
    },
    async ({ rootFen, moves, color }) => {
      const { data, error } = themeService.analyzeVariationThemes(rootFen, moves, color);

      return {
        content: [
          {
            type: "text",
            text: error || JSON.stringify(data, null, 2),
          },
        ],
      };
    }
  );

  server.registerTool(
    "get-theme-progression",
    {
      description: "Get the progression of a specific chess theme over a variation",
      inputSchema: {
        rootFen: fenSchema,
        moves: z.array(z.string()).describe("Array of moves in algebraic notation"),
        color: sideSchema,
        theme: z.enum([
          "material",
          "mobility", 
          "space",
          "positional",
          "kingSafety",
          "tactical",
          "lightsqaureControl",
          "darksqaureControl"
        ]).describe("Theme to track"),
      },
      annotations: {
        openWorldHint: false
      }
    },
    async ({ rootFen, moves, color, theme }) => {
      const { data, error } = themeService.getThemeProgression(rootFen, moves, color, theme);

      return {
        content: [
          {
            type: "text",
            text: error || JSON.stringify(data, null, 2),
          },
        ],
      };
    }
  );

  server.registerTool(
    "compare-variations",
    {
      description: "Compare multiple chess variations and return their theme analyses",
      inputSchema: {
        rootFen: fenSchema,
        variations: z.array(
          z.object({
            name: z.string(),
            moves: z.array(z.string()),
          })
        ).describe("Array of variations to compare"),
        color: sideSchema,
      },
      annotations: {
        openWorldHint: false
      }
    },
    async ({ rootFen, variations, color }) => {
      const { data, error } = themeService.compareVariations(rootFen, variations, color);

      return {
        content: [
          {
            type: "text",
            text: error || JSON.stringify(data, null, 2),
          },
        ],
      };
    }
  );

  server.registerTool(
    "find-critical-moments",
    {
      description: "Find moves in a chess variation where there are significant theme changes",
      inputSchema: {
        rootFen: fenSchema,
        moves: z.array(z.string()).describe("Array of moves in algebraic notation"),
        color: sideSchema,
        threshold: z.number().optional().default(0.5).describe("Threshold for significant changes"),
      },
      annotations: {
        openWorldHint: false
      }
    },
    async ({ rootFen, moves, color, threshold = 0.5 }) => {
      const { data, error } = themeService.findCriticalMoments(rootFen, moves, color, threshold);

      return {
        content: [
          {
            type: "text",
            text: error || JSON.stringify(data, null, 2),
          },
        ],
      };
    }
  );

  server.registerTool(
    "generate-game-review",
    {
      description: "Generate a comprehensive game review with theme progression analysis from a PGN. Analyzes material, mobility, space, positional play, and king safety for both players throughout the game.",
      inputSchema: {
        pgn: gamePgnSchema,
        criticalMomentThreshold: z.number()
          .min(0.1)
          .max(2.0)
          .default(0.5)
          .optional()
          .describe("Threshold for identifying critical moments (default: 0.5). Lower values find more moments."),
        format: z.enum(["json", "text"])
          .default("text")
          .optional()
          .describe("Output format: 'json' for structured data or 'text' for human-readable report"),
      },
      annotations: {
        openWorldHint: false
      }
    },
    async ({ pgn, criticalMomentThreshold = 0.5, format = "text" }) => {
      const { data, error } = themeService.generateGameReview(pgn, criticalMomentThreshold, format);

      return {
        content: [
          {
            type: "text",
            text: error || (typeof data === 'string' ? data : JSON.stringify(data, null, 2)),
          },
        ],
      };
    }
  );
}