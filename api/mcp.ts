import { createMcpHandler } from "mcp-handler";
import {registerAgine} from "../src/mcp/registerAgine.js";


const mcpHandler = createMcpHandler(
  (server) => {
    registerAgine(server);
  },
  { serverInfo: { name: "ChessAgine", version: "0.6.0" } },
  { basePath: "", maxDuration: 60, sessionIdGenerator: undefined },
);


const handler = async (request: Request) => {
  const url = new URL(request.url);
  if (url.pathname.startsWith("/api/")) {
    url.pathname = url.pathname.replace("/api/", "/");
    return mcpHandler(new Request(url.toString(), request));
  }
  return mcpHandler(request);
};

export { handler as GET, handler as POST};