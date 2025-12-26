export class ChessBoardMagicService {
    baseUrl = "https://api.chessboardmagic.com";
    authToken;
    constructor() {
        this.authToken = process.env.CHESSBOARD_MAGIC_PAT;
    }
    async makeRequest(endpoint) {
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
            }
            catch {
                return { error: `Invalid JSON response (status ${response.status})` };
            }
            if (response.status !== 200) {
                return { error: `API error: ${JSON.stringify(data)}` };
            }
            return { data };
        }
        catch (error) {
            return { error: `Request failed: ${error}` };
        }
    }
    async getRepertoires() {
        return this.makeRequest("/mcp/repertoires");
    }
    async getGames() {
        return this.makeRequest("/mcp/games");
    }
    async getGameDetails(gameId) {
        if (!gameId) {
            return { error: "Missing required argument: gameId" };
        }
        return this.makeRequest(`/mcp/games/${gameId}`);
    }
    async getRepertoireDetails(repertoireId) {
        if (!repertoireId) {
            return { error: "Missing required argument: repertoireId" };
        }
        return this.makeRequest(`/mcp/repertoires/${repertoireId}`);
    }
    async getTcecStats(fen) {
        if (!fen) {
            return { error: "Missing required argument: fen" };
        }
        return this.makeRequest(`/mcp/tcec/stats?fen=${fen}`);
    }
    async getTcecGames(fen) {
        if (!fen) {
            return { error: "Missing required argument: fen" };
        }
        return this.makeRequest(`/mcp/tcec/games?fen=${fen}`);
    }
    async getCorrStats(fen) {
        if (!fen) {
            return { error: "Missing required argument: fen" };
        }
        return this.makeRequest(`/mcp/corr/stats?fen=${fen}`);
    }
    async getCorrGames(fen) {
        if (!fen) {
            return { error: "Missing required argument: fen" };
        }
        return this.makeRequest(`/mcp/corr/games?fen=${fen}`);
    }
}
