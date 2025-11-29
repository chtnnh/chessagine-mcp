import { cbmGameIdSchema, cbmRepIdSchema } from "../runner/schema.js";
const API_BASE = "https://api.chessboardmagic.com";
const pat = process.env.CHESSBOARD_MAGIC_PAT;
export function registerCBM(mcpserver) {
    mcpserver.registerTool("get-chessboardmagic-repertoires", {
        description: "Fetch user's chess repertoires from the Chessboard Magic Repertoire Builder",
        inputSchema: {},
        annotations: {
            openWorldHint: true
        }
    }, async () => {
        if (!pat) {
            return {
                content: [
                    {
                        type: "text",
                        text: "Missing Personal Access Token (PAT)",
                    },
                ],
            };
        }
        const url = `${API_BASE}/mcp/repertoires`;
        try {
            const response = await fetch(url, {
                headers: {
                    Authorization: `Bearer ${pat}`,
                },
            });
            let data;
            try {
                data = await response.json();
            }
            catch {
                return {
                    content: [
                        {
                            type: "text",
                            text: `Invalid JSON response (status ${response.status})`,
                        },
                    ],
                };
            }
            if (response.status !== 200) {
                return {
                    content: [
                        {
                            type: "text",
                            text: `API error: ${JSON.stringify(data)}`,
                        },
                    ],
                };
            }
            return {
                content: [
                    {
                        type: "text",
                        text: JSON.stringify(data, null, 2),
                    },
                ],
            };
        }
        catch (error) {
            return {
                content: [
                    {
                        type: "text",
                        text: `Error fetching repertoires: ${error}`,
                    },
                ],
            };
        }
    });
    mcpserver.registerTool("get-chessboardmagic-games", {
        description: "Fetch user's chess games from the Chessboard Magic Repertoire Builder",
        inputSchema: {},
        annotations: {
            openWorldHint: true
        }
    }, async () => {
        if (!pat) {
            return {
                content: [
                    {
                        type: "text",
                        text: "Missing Personal Access Token (PAT)",
                    },
                ],
            };
        }
        const url = `${API_BASE}/mcp/games`;
        try {
            const response = await fetch(url, {
                headers: {
                    Authorization: `Bearer ${pat}`,
                },
            });
            let data;
            try {
                data = await response.json();
            }
            catch {
                return {
                    content: [
                        {
                            type: "text",
                            text: `Invalid JSON response (status ${response.status})`,
                        },
                    ],
                };
            }
            if (response.status !== 200) {
                return {
                    content: [
                        {
                            type: "text",
                            text: `API error: ${JSON.stringify(data)}`,
                        },
                    ],
                };
            }
            return {
                content: [
                    {
                        type: "text",
                        text: JSON.stringify(data, null, 2),
                    },
                ],
            };
        }
        catch (error) {
            return {
                content: [
                    {
                        type: "text",
                        text: `Error fetching games: ${error}`,
                    },
                ],
            };
        }
    });
    mcpserver.registerTool("get-chessboardmagic-game-details", {
        description: "Fetch user's single game's metadata, moves, tags, variations and comment links",
        inputSchema: {
            gameId: cbmGameIdSchema,
        },
        annotations: {
            openWorldHint: true
        }
    }, async ({ gameId }) => {
        if (!gameId) {
            return {
                content: [
                    {
                        type: "text",
                        text: "Missing required argument: gameId",
                    },
                ],
            };
        }
        if (!pat) {
            return {
                content: [
                    {
                        type: "text",
                        text: "Missing Personal Access Token (PAT)",
                    },
                ],
            };
        }
        const url = `${API_BASE}/mcp/games/${gameId}`;
        try {
            const response = await fetch(url, {
                headers: {
                    Authorization: `Bearer ${pat}`,
                },
            });
            let data;
            try {
                data = await response.json();
            }
            catch {
                return {
                    content: [
                        {
                            type: "text",
                            text: `Invalid JSON response (status ${response.status})`,
                        },
                    ],
                };
            }
            if (response.status !== 200) {
                return {
                    content: [
                        {
                            type: "text",
                            text: `API error: ${JSON.stringify(data)}`,
                        },
                    ],
                };
            }
            return {
                content: [
                    {
                        type: "text",
                        text: JSON.stringify(data, null, 2),
                    },
                ],
            };
        }
        catch (error) {
            return {
                content: [
                    {
                        type: "text",
                        text: `Error fetching game details: ${error}`,
                    },
                ],
            };
        }
    });
    mcpserver.registerTool("get-chessboardmagic-repertoire-details", {
        description: "Fetch user's single repertoire metadata, moves, variations and comment links",
        inputSchema: {
            repertoireId: cbmRepIdSchema,
        },
        annotations: {
            openWorldHint: true
        }
    }, async ({ repertoireId }) => {
        if (!repertoireId) {
            return {
                content: [
                    {
                        type: "text",
                        text: "Missing required argument: repertoireId",
                    },
                ],
            };
        }
        if (!pat) {
            return {
                content: [
                    {
                        type: "text",
                        text: "Missing Personal Access Token (PAT)",
                    },
                ],
            };
        }
        const url = `${API_BASE}/mcp/repertoires/${repertoireId}`;
        try {
            const response = await fetch(url, {
                headers: {
                    Authorization: `Bearer ${pat}`,
                },
            });
            let data;
            try {
                data = await response.json();
            }
            catch {
                return {
                    content: [
                        {
                            type: "text",
                            text: `Invalid JSON response (status ${response.status})`,
                        },
                    ],
                };
            }
            if (response.status !== 200) {
                return {
                    content: [
                        {
                            type: "text",
                            text: `API error: ${JSON.stringify(data)}`,
                        },
                    ],
                };
            }
            return {
                content: [
                    {
                        type: "text",
                        text: JSON.stringify(data, null, 2),
                    },
                ],
            };
        }
        catch (error) {
            return {
                content: [
                    {
                        type: "text",
                        text: `Error fetching repertoire details: ${error}`,
                    },
                ],
            };
        }
    });
}
