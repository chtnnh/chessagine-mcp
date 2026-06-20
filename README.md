# ChessAgine MCP

<p align="center">
  <img src="/icon.png" alt="ChessAgine" width="200"/>
</p>

**ChessAgine MCP** is a Model Context Protocol server that gives LLMs deep chess awareness by exposing real-time board state, Stockfish analysis, opening databases, Lichess games, and neural engines including Maia2, Leela, and Elite Leela.

It also renders individual positions and full PGN games for in-depth visual analysis—enabling AI agents to reason about positions, evaluate variations, detect themes, explore game databases, and interact directly with chess engines.

## Preview

<p align="center">
  <img src="/preview.png" alt="ChessAgine Preview" />
</p>

## Installation

### Option 1: Using MCPB File (Recommended)

Download the `chessagine-mcp.mcpb` file and install it directly in Claude Desktop:

1. Download the latest release from [GitHub releases](https://github.com/jalpp/chessagine-mcp/releases)
2. Open Claude Desktop
3. Go to Settings → Extensions → Install from file
4. Select the `chessagine-mcp.mcpb` file
5. Restart Claude Desktop

> [!NOTE]  
> To make sure its working correctly ask it to render the chessboard or a specific chess query

### Option 2: Local Development Setup

#### Prerequisites
- Node.js 22+ 
- npm or yarn package manager

#### Clone and Setup
```bash
git clone https://github.com/jalpp/chessagine-mcp.git
cd chessagine-mcp
npm install
npm run build
```

#### Configure Claude Desktop

Add to `~/Library/Application Support/Claude/claude_desktop_config.json`:

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

### Usage:

- show me my last Lichess game I played, I'm insert_your_username there, also analyze the game using Stockfish
- given fen compare and constrast what stockfish thinks vs Leela and Maia
- analyze my opening rep from Chessboard magic.

### ChessAgine.Skill

to properly use ChessAgine MCP, give LLM access to how to properly use the it via .skill file in ./chessagine-skill/ folder

### Deploy your own instance

You can deploy your own copy to Vercel in a few clicks:

1. Fork this repo
2. Go to [vercel.com/new](https://vercel.com/new) and import your fork
3. No environment variables needed — just deploy
4. Your server will be at `https://your-project.vercel.app/mcp`

### Dev commands

```bash
npm run build:mcp  # Builds the mcp server layer which generates mcpb file
npm run build:ui   # Builds the ChessAgine MCP UI html files
npm run build      # Builds entire project, use for local development
npm run start      # starts the MCP server
npm run debug      # opens MCP inspector to inspect new changes made
```

## License

This project is licensed under the MIT License, the /themes and /protocol are under GPL. See the [LICENSE](LICENSE) file for details.

## Authors
@jalpp
