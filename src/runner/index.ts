import z from "zod";
import { registerAgine } from "../mcp/registerAgine.js";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

export const configSchema = z.object({
  lichessApiKey: z
    .string()
    .optional()
    .describe("Lichess API key to access Lichess Studies"),
  lichessUsername: z
    .string()
    .optional()
    .describe("Lichess username for mcp user"),
});

export default function createServer({
  config,
}: {
  config: z.infer<typeof configSchema>;
}) {
  const Mcpserver = new McpServer({
    name: "chessagine-mcp",
    websiteUrl: "https://www.chessagine.com/",
    version: "2.0.0",
    capabilities: {
      resources: {},
      tools: {},
      prompt: {},
    },
  });

  console.warn(config);

  process.env.LICHESS_API_KEY = config.lichessApiKey || "";
  process.env.LICHESS_USERNAME = config.lichessUsername || "";

  registerAgine(Mcpserver);

  return Mcpserver.server;
}
