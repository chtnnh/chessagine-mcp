// MCPStockfishHTTP.ts
import axios from 'axios';
export class MCPStockfishHTTPClient {
    client;
    constructor(host) {
        this.client = axios.create({
            baseURL: `${host}`,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }
    async checkHealth() {
        try {
            const response = await this.client.get('/health', {
                timeout: 5000
            });
            return response.status === 200;
        }
        catch (error) {
            console.error('Health check failed:', error);
            return false;
        }
    }
    async evaluatePosition(params) {
        try {
            const response = await this.client.post('/evaluate', params, {});
            return response.data.data;
        }
        catch (error) {
            if (axios.isAxiosError(error)) {
                const axiosError = error;
                const errorMessage = axiosError.response?.data?.error || axiosError.message;
                console.error('Evaluation failed:', errorMessage);
                throw new Error(errorMessage);
            }
            console.error('Evaluation failed:', error);
            throw error;
        }
    }
    async getBestMove(fen, depth = 15) {
        try {
            const response = await this.client.post('/bestmove', { fen, depth }, {});
            return {
                bestMove: response.data.bestMove,
                evaluation: response.data.evaluation
            };
        }
        catch (error) {
            if (axios.isAxiosError(error)) {
                const axiosError = error;
                const errorMessage = axiosError.response?.data?.error || axiosError.message;
                console.error('Best move request failed:', errorMessage);
                throw new Error(errorMessage);
            }
            console.error('Best move request failed:', error);
            throw error;
        }
    }
    async getBookAnalysis(fen) {
        try {
            const response = await this.client.post('/book', { fen });
            return response.data.book;
        }
        catch (error) {
            if (axios.isAxiosError(error)) {
                const axiosError = error;
                const errorMessage = axiosError.response?.data?.error || axiosError.message;
                console.error('Book analysis failed:', errorMessage);
                throw new Error(errorMessage);
            }
            console.error('Book analysis failed:', error);
            throw error;
        }
    }
    async analyzeBatch(positions) {
        try {
            const response = await this.client.post('/analyze-batch', { positions }, {});
            return response.data.results;
        }
        catch (error) {
            if (axios.isAxiosError(error)) {
                const axiosError = error;
                const errorMessage = axiosError.response?.data?.error || axiosError.message;
                console.error('Batch analysis failed:', errorMessage);
                throw new Error(errorMessage);
            }
            console.error('Batch analysis failed:', error);
            throw error;
        }
    }
}
