import { fenSchema } from "../runner/schema.js";
import { ChessDBService } from "../services/chessdb.js";
export function registerChessDBTools(server) {
    const chessDBService = new ChessDBService();
    server.registerTool("get-chessdb-analysis", {
        description: "Fetch position analysis and candidate moves from ChessDB",
        inputSchema: {
            fen: fenSchema
        },
        annotations: {
            openWorldHint: true
        }
    }, async ({ fen }) => {
        const { data, error } = await chessDBService.getAnalysis(fen);
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
