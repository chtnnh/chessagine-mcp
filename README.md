# ChessAgine MCP

<p align="center">
  <img src="/icon.png" alt="ChessAgine" width="200"/>
</p>


ChessAgine MCP acts as a chess layer behind LLMs, it allows LLMs to sit on top of chess engines, databases, common APIs to smartly chess queries.

## Preview

<p align="center">
  <img src="/assets/screenshots/claude4.png" alt="ChessAgine"/>
</p>
(Doing interactive puzzles in Claude Desktop using MCP server)


## Installation

### Option 1: Using MCPB File (Recommended)

Download the `chessagine-mcp.mcpb` file and install it directly in Claude Desktop:

1. Download the latest release from [GitHub releases](https://github.com/jalpp/chessagine-mcp/releases)
2. Open Claude Desktop
3. Go to Settings → Extensions → Install from file
4. Select the `chessagine-mcp.mcpb` file
5. Restart Claude Desktop

### Option 2: Local Development Setup

#### Prerequisites
- Node.js 22+ 
- npm or yarn package manager

#### Clone and Setup
```bash
git clone https://github.com/jalpp/chessagine-mcp.git
cd chessagine-mcp
npm install
npm run build:mcp
```

#### Configure Claude Desktop
Add to your `claude_desktop_config.json`:

**macOS/Linux:**
```json
{
  "mcpServers": {
    "chessagine-mcp": {
      "command": "node",
      "args": ["/absolute/path/to/chessagine-mcp/build/runner/stdio.js"]
    }
  }
}
```

**Windows:**
```json
{
  "mcpServers": {
    "chessagine-mcp": {
      "command": "node", 
      "args": ["C:\\absolute\\path\\to\\chessagine-mcp\\build\\runner\\stdio.js"]
    }
  }
}
```


### Dev commands

```bash
npm run build:mcp  # Build the projects and mcpb file
npm run start       # start local server
npm run debug      # opens MCP inspector to inspect new changes made
```

## License

This project is licensed under the MIT License, the /themes and /protocol are under GPL. See the [LICENSE](LICENSE) file for details.

## Authors
@jalpp
