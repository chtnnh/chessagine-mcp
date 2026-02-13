/**
 * @file PGN Viewer component using MCP Apps SDK + ChessAgine
 */
import type { App, McpUiHostContext } from "@modelcontextprotocol/ext-apps";
import { useApp } from "@modelcontextprotocol/ext-apps/react";
import { useCallback, useEffect, useState, useRef } from "react";
import { pgnEdit } from "@mliebelt/pgn-viewer";
import "./pgnviewer.css";

const EXAMPLE_PGN = `[Event "F/S Return Match"]
[Site "Belgrade"]
[Date "1992.11.04"]
[Round "29"]
[White "Fischer, Robert J."]
[Black "Spassky, Boris V."]
[Result "1/2-1/2"]

1. e4 e5 2. Nf3 Nc6 3. Bb5 a6`;

interface PgnViewerConfig {
  pgn: string;
  locale?: string;
  pieceStyle?: string;
  theme?: string;
  showCoords?: boolean;
  showResult?: boolean;
  timerTime?: string;
  startPlay?: number;
  showFen?: boolean;
  boardSize?: string;
}

export function PgnViewer() {
  const [hostContext, setHostContext] = useState<McpUiHostContext | undefined>();
  const [currentPgn, setCurrentPgn] = useState<string>(EXAMPLE_PGN);
  const [viewerConfig, setViewerConfig] = useState<PgnViewerConfig>({
    pgn: EXAMPLE_PGN,
    locale: "en",
    pieceStyle: "merida",
    theme: "blue",
    showCoords: true,
    showResult: true,
    timerTime: "0",
    startPlay: 0,
    showFen: false,
    boardSize: "400",
  });
  
  const viewerId = useRef(`pgn-viewer-${Math.random().toString(36).substr(2, 9)}`);
  const viewerInitialized = useRef(false);

  const { app, error } = useApp({
    appInfo: { name: "ChessAgine PGN Viewer App", version: "1.0.0" },
    capabilities: {},
    onAppCreated: (app) => {
      app.onteardown = async () => {
        console.info("PGN Viewer app is being torn down");
        return {};
      };

      app.ontoolinput = async (input) => {
        console.info("Received tool call input:", input);
        
        const pgn = input.arguments?.pgn as string;
        if (pgn) {
          console.info("Setting PGN from tool input:", pgn);
          setCurrentPgn(pgn);
          setViewerConfig(prev => ({ ...prev, pgn }));
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

  // Initialize PGN viewer when config changes
  useEffect(() => {
    if (viewerConfig.pgn && viewerId.current) {
      try {
        console.info("Initializing PGN viewer with config:", viewerConfig);
        pgnEdit(viewerId.current, {
          pgn: viewerConfig.pgn,
          locale: viewerConfig.locale,
          pieceStyle: viewerConfig.pieceStyle,
          theme: viewerConfig.theme,
          showCoords: viewerConfig.showCoords,
          showResult: viewerConfig.showResult,
          timerTime: viewerConfig.timerTime,
          startPlay: viewerConfig.startPlay,
          showFen: viewerConfig.showFen,
          boardSize: viewerConfig.boardSize,
        });
        viewerInitialized.current = true;
      } catch (e) {
        console.error("Error initializing PGN viewer:", e);
      }
    }
  }, [viewerConfig]);

  const handlePgnChange = useCallback((newPgn: string) => {
    setCurrentPgn(newPgn);
    setViewerConfig(prev => ({ ...prev, pgn: newPgn }));
  }, []);

  const handlePieceStyleChange = useCallback((style: string) => {
    setViewerConfig(prev => ({ ...prev, pieceStyle: style }));
  }, []);

  const handleThemeChange = useCallback((theme: string) => {
    setViewerConfig(prev => ({ ...prev, theme }));
  }, []);

  const handleBoardSizeChange = useCallback((size: string) => {
    setViewerConfig(prev => ({ ...prev, boardSize: size }));
  }, []);

  const handleToggleCoords = useCallback(() => {
    
    setViewerConfig(prev => ({ ...prev, showCoords: !prev.showCoords }));
  }, []);

  const handleToggleFen = useCallback(() => {
    setViewerConfig(prev => ({ ...prev, showFen: !prev.showFen }));
  }, []);

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

  return (
    <main
      className="pgn-viewer-main"
      style={{
        paddingTop: hostContext?.safeAreaInsets?.top,
        paddingRight: hostContext?.safeAreaInsets?.right,
        paddingBottom: hostContext?.safeAreaInsets?.bottom,
        paddingLeft: hostContext?.safeAreaInsets?.left,
      }}
    >
      <div className="container">
        <h2>♔ PGN Game Viewer ♚</h2>
        
        <div className="pgn-input-section">
          <label htmlFor="pgn-input">PGN Notation:</label>
          <textarea
            id="pgn-input"
            className="pgn-input"
            value={currentPgn}
            onChange={(e) => handlePgnChange(e.target.value)}
            placeholder="Enter PGN notation"
            rows={10}
          />
        </div>
        
        <div className="controls">
          <div className="control-group">
            <label>Piece Style:</label>
            <select 
              className="control-select" 
              value={viewerConfig.pieceStyle}
              onChange={(e) => handlePieceStyleChange(e.target.value)}
            >
              <option value="merida">Merida</option>
              <option value="case">Case</option>
              <option value="condal">Condal</option>
              <option value="leipzig">Leipzig</option>
              <option value="maya">Maya</option>
            </select>
          </div>

          <div className="control-group">
            <label>Theme:</label>
            <select 
              className="control-select" 
              value={viewerConfig.theme}
              onChange={(e) => handleThemeChange(e.target.value)}
            >
              <option value="blue">Blue</option>
              <option value="green">Green</option>
              <option value="brown">Brown</option>
              <option value="informator">Informator</option>
            </select>
          </div>

          <div className="control-group">
            <label>Board Size:</label>
            <select 
              className="control-select" 
              value={viewerConfig.boardSize}
              onChange={(e) => handleBoardSizeChange(e.target.value)}
            >
              <option value="300">Small (300px)</option>
              <option value="400">Medium (400px)</option>
              <option value="500">Large (500px)</option>
              <option value="600">X-Large (600px)</option>
            </select>
          </div>
        </div>

        <div className="toggle-controls">
          <label className="toggle-label">
            <input
              type="checkbox"
              checked={viewerConfig.showCoords || false}
              onChange={handleToggleCoords}
            />
            Show Coordinates
          </label>
          <label className="toggle-label">
            <input
              type="checkbox"
              checked={viewerConfig.showFen || false}
              onChange={handleToggleFen}
            />
            Show FEN
          </label>
        </div>
        
        <div className="viewer-wrapper">
          <div id={viewerId.current} className="pgn-viewer-container"></div>
        </div>
      </div>
    </main>
  );
}