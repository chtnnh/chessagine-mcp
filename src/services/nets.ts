export interface NeuralNetResult {
  data?: any;
  error?: string;
}

export type EngineType = "maia2" | "leela" | "elite-leela";

export class NeuralNetService {
  private baseUrl: string = "https://nn-analyze-service-717993082875.us-central1.run.app";

  constructor() {
  }

  async analyzePosition(
    fen: string,
    engine: EngineType,
    rating?: number
  ): Promise<NeuralNetResult> {
    if (!fen) {
      return { error: "Missing required argument: fen" };
    }

    if (!engine) {
      return { error: "Missing required argument: engine" };
    }

    const validEngines: EngineType[] = ["maia2", "leela", "elite-leela"];
    if (!validEngines.includes(engine)) {
      return {
        error: `Invalid engine. Must be one of: ${validEngines.join(", ")}`,
      };
    }

    if (engine === "maia2" && !rating) {
      return { error: "Rating is required for maia2 engine" };
    }

    try {
      const response = await fetch(`${this.baseUrl}/nn-analyze`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fen,
          engine,
          rating,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        return {
          error:
            errorData.error ||
            `HTTP ${response.status}: Failed to analyze position`,
        };
      }

      const result = await response.json();

      if (!result.success) {
        return { error: result.error || "Analysis failed" };
      }

      return { data: result.data };
    } catch (error) {
      return { error: `Request failed: ${error}` };
    }
  }

  async analyzeMaia2(fen: string, rating: number): Promise<NeuralNetResult> {
    return this.analyzePosition(fen, "maia2", rating);
  }

  async analyzeLeela(fen: string): Promise<NeuralNetResult> {
    return this.analyzePosition(fen, "leela");
  }

  async analyzeEliteLeela(fen: string): Promise<NeuralNetResult> {
    return this.analyzePosition(fen, "elite-leela");
  }
}
