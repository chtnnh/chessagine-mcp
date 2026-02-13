/**
 * @file ChessBoard component using MCP Apps SDK + ChessAgine
 */
import type { App, McpUiHostContext } from "@modelcontextprotocol/ext-apps";
import { useApp } from "@modelcontextprotocol/ext-apps/react";
import { useCallback, useEffect, useState } from "react";
import { Chessboard } from "react-chessboard";
import "./chessboard.css";

const STARTING_FEN = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

// Color scheme configurations for react-chessboard
const COLOR_SCHEMES = {
  classic: {
    lightSquare: '#f0d9b5',
    darkSquare: '#b58863',
  },
  blue: {
    lightSquare: '#e8edf9',
    darkSquare: '#7389ae',
  },
  green: {
    lightSquare: '#ffffdd',
    darkSquare: '#86a666',
  },
  brown: {
    lightSquare: '#f0d9b5',
    darkSquare: '#946f51',
  },
  gray: {
    lightSquare: '#e0e0e0',
    darkSquare: '#808080',
  },
} as const;

type ColorScheme = keyof typeof COLOR_SCHEMES;

export function ChessBoard() {
  const [hostContext, setHostContext] = useState<McpUiHostContext | undefined>();
  const [currentFen, setCurrentFen] = useState<string>(STARTING_FEN);
  const [boardOrientation, setBoardOrientation] = useState<"white" | "black">('white');
  const [colorScheme, setColorScheme] = useState<ColorScheme>('classic');

  const { app, error } = useApp({
    appInfo: { name: "ChessAgine Board Wiget App", version: "1.0.0" },
    capabilities: {},
    onAppCreated: (app) => {
      app.onteardown = async () => {
        console.info("ChessBoard app is being torn down");
        return {};
      };

      app.ontoolinput = async (input) => {
        console.info("Received tool call input:", input);
        
        // Extract FEN from tool call arguments
        const fen = input.arguments?.fen as string;
        if (fen) {
          console.info("Setting FEN from tool input:", fen);
          setCurrentFen(fen);
        }
      };

      app.ontoolresult = async (result) => {
        console.info("Received tool call result:", result);
      };

      app.ontoolcancelled = (params) => {
        console.info("Tool call cancelled:", params.reason);
      };

      app.onerror = (error) => {
        console.error("App error:", error);
      };

      app.onhostcontextchanged = (params) => {
        setHostContext((prev) => ({ ...prev, ...params }));
      };
    },
  });

  useEffect(() => {
    if (app) {
      setHostContext(app.getHostContext());
    }
  }, [app]);

  const handleFlipBoard = useCallback(() => {
    setBoardOrientation(prev => prev === 'white' ? 'black' : 'white');
  }, []);

  const handleFenChange = useCallback((newFen: string) => {
    setCurrentFen(newFen);
  }, []);

  const handleColorSchemeChange = useCallback((scheme: ColorScheme) => {
    setColorScheme(scheme);
  }, []);

  const getFenInfo = (fen: string) => {
    const parts = fen.split(' ');
    return {
      turn: parts[1] || 'w',
      castling: parts[2] || '-',
      enPassant: parts[3] || '-',
      halfmove: parts[4] || '0',
      fullmove: parts[5] || '1'
    };
  };

  if (error) {
    return (
      <div className="error-container">
        <strong>ERROR:</strong> {error.message}
        <p className="error-details">
          Make sure the ChessAgine MCP server is properly configured and running.
        </p>
      </div>
    );
  }

  if (!app) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Connecting to ChessAgine MCP server...</p>
      </div>
    );
  }

  const info = getFenInfo(currentFen);
  const turnText = info.turn === 'w' ? 'White' : 'Black';
  const currentColorScheme = COLOR_SCHEMES[colorScheme];

  return (
    <main
      className="chess-board-main"
      style={{
        paddingTop: hostContext?.safeAreaInsets?.top,
        paddingRight: hostContext?.safeAreaInsets?.right,
        paddingBottom: hostContext?.safeAreaInsets?.bottom,
        paddingLeft: hostContext?.safeAreaInsets?.left,
      }}
    >
      <div className="container">
        <h2>♔ Chess Position Viewer ♚</h2>
        
        <input
          type="text"
          className="fen-input"
          value={currentFen}
          onChange={(e) => handleFenChange(e.target.value)}
          placeholder="Enter FEN notation"
        />
        
        <div className="controls">
          <button className="btn" onClick={handleFlipBoard}>
            🔄 Flip Board
          </button>
          <select 
            className="color-scheme" 
            value={colorScheme}
            onChange={(e) => handleColorSchemeChange(e.target.value as ColorScheme)}
          >
            <option value="classic">Classic</option>
            <option value="blue">Blue</option>
            <option value="green">Green</option>
            <option value="brown">Brown</option>
            <option value="gray">Gray</option>
          </select>
        </div>
        
        <div className="board-wrapper">
          <Chessboard
            options={{
            position: currentFen,
            boardOrientation: boardOrientation,
            darkSquareStyle: { backgroundColor: currentColorScheme.darkSquare },
            lightSquareStyle: {backgroundColor: currentColorScheme.lightSquare },
            allowDragging: true,
            }}
          />
        </div>
        
        <div className="info">
          <strong>Turn:</strong> {turnText} | <strong>Castling:</strong> {info.castling} | <strong>En Passant:</strong> {info.enPassant}<br/>
          <strong>Halfmove:</strong> {info.halfmove} | <strong>Fullmove:</strong> {info.fullmove}
        </div>
      </div>
    </main>
  );
}