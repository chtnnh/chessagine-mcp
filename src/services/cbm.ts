
export class ChessBoardMagicService {
  private baseUrl: string = "https://api.chessboardmagic.com";
  private authToken: string | undefined;

  constructor() {
    this.authToken = process.env.CHESSBOARD_MAGIC_PAT;
  }

  private async makeRequest(endpoint: string): Promise<{ data?: any; error?: string }> {
    if (!this.authToken) {
      return { error: "Missing Personal Access Token (PAT)" };
    }

    const url = `${this.baseUrl}${endpoint}`;

    try {
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${this.authToken}`,
        },
      });

      let data;
      try {
        data = await response.json();
      } catch {
        return { error: `Invalid JSON response (status ${response.status})` };
      }

      if (response.status !== 200) {
        return { error: `API error: ${JSON.stringify(data)}` };
      }

      return { data };
    } catch (error) {
      return { error: `Request failed: ${error}` };
    }
  }

  async getRepertoires(): Promise<{ data?: any; error?: string }> {
    return this.makeRequest("/mcp/repertoires");
  }

  async getGames(): Promise<{ data?: any; error?: string }> {
    return this.makeRequest("/mcp/games");
  }

  async getGameDetails(gameId: string): Promise<{ data?: any; error?: string }> {
    if (!gameId) {
      return { error: "Missing required argument: gameId" };
    }
    return this.makeRequest(`/mcp/games/${gameId}`);
  }

  async getRepertoireDetails(repertoireId: string): Promise<{ data?: any; error?: string }> {
    if (!repertoireId) {
      return { error: "Missing required argument: repertoireId" };
    }
    return this.makeRequest(`/mcp/repertoires/${repertoireId}`);
  }

  async getTcecStats(fen: string): Promise<{ data?: any; error?: string }> {
    if (!fen) {
      return { error: "Missing required argument: fen" };
    }
    return this.makeRequest(`/mcp/tcec/stats?fen=${fen}`);
  }

  async getTcecGames(fen: string): Promise<{ data?: any; error?: string }> {
    if (!fen) {
      return { error: "Missing required argument: fen" };
    }
    return this.makeRequest(`/mcp/tcec/games?fen=${fen}`);
  }

  async getCorrStats(fen: string): Promise<{ data?: any; error?: string }> {
    if (!fen) {
      return { error: "Missing required argument: fen" };
    }
    return this.makeRequest(`/mcp/corr/stats?fen=${fen}`);
  }

  async getCorrGames(fen: string): Promise<{ data?: any; error?: string }> {
    if (!fen) {
      return { error: "Missing required argument: fen" };
    }
    return this.makeRequest(`/mcp/corr/games?fen=${fen}`);
  }
}