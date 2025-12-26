# ChessAgine MCP

[![smithery badge](https://smithery.ai/badge/@jalpp/chessagine-mcp)](https://smithery.ai/server/@jalpp/chessagine-mcp)
<p align="center">
  <img src="/icon.png" alt="ChessAgine" width="200"/>
</p>

A comprehensive Model Context Protocol (MCP) server that provides advanced chess analysis capabilities by implementing [Chess Context Protocol Server](https://github.com/jalpp/chessagineweb/tree/main/chessContextProtocol) and integrating Stockfish engine evaluation, neural net Maia2/Lc0 policy eval, positional theme analysis, opening databases, puzzle training, game visualization, and chess knowledge for enhanced chess understanding and gameplay improvement.

## Preview

<p align="center">
  <img src="/assets/screenshots/claude4.png" alt="ChessAgine"/>
</p>
(Doing interactive puzzles in Claude Desktop using MCP server)


## Features

### 🔧 Core Analysis Tools
- **Stockfish Integration**: Deep engine analysis with configurable search depth
- **Neural Network Integration:** Give LLM access to chess neural net policy and evals
- **Theme Analysis**: Evaluate material, mobility, space, positional factors, and king safety
- **Variation Analysis**: Compare multiple lines and track positional changes
- **Move Validation**: Check move legality and generate board state descriptions
- **Game Review**: Comprehensive game analysis with theme progression and critical moments

### 🎮 Interactive Features
- **Visual Board Rendering**: Generate HTML chess boards for any position
- **Dynamic Game Viewer**: Interactive game replay with move navigation
- **Puzzle Training**: Access Lichess puzzle database with theme filtering
- **Game Fetching**: Retrieve user games from Lichess for analysis

### 📊 Database Integration  
- **Lichess Master Games**: Access master-level opening statistics and games
- **Lichess User Games**: Analyze how positions are played across skill levels
- **Lichess Puzzle Database**: 3+ million tactical puzzles with theme-based filtering
- **ChessDB**: Query extensive game databases for move evaluations and statistics

### 🧠 Knowledge Base
- **Chess Principles**: Silman's imbalances and Fine's 30 principles
- **Endgame Theory**: Essential endgame knowledge and patterns
- **Strategic Concepts**: Comprehensive chess improvement guidelines
- **Puzzle Themes**: 150+ tactical motifs and patterns

## Installation

### Option 0: Installing via Smithery

To install ChessAgine automatically via [Smithery](https://smithery.ai/server/@jalpp/chessagine-mcp):

```bash
npx -y @smithery/cli install @jalpp/chessagine-mcp
```

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
npm run dev        # test and interact with chessAgine via smithery
npm run debug      # opens MCP inspector to inspect new changes made
```

## Community
- **Discord**: [Join ChessAgine community](https://discord.gg/suepW7FRCY)

## License

This project is licensed under the MIT License, the /themes and /protocol are under GPL. See the [LICENSE](LICENSE) file for details.

## Authors
@jalpp
