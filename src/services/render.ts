import { viewBoardArtifact } from "../render/chessBoardRender.js";
import { gameRenderHtml } from "../render/gameRender.js";

export interface RenderResult {
  data?: {
    html: string;
    message: string;
  };
  error?: string;
}

export class ChessRenderingService {
  
  generateBoardView(fen: string, side: 'w' | 'b', is3d: boolean = false): RenderResult {
    if (!fen) {
      return { error: "Missing required argument: fen" };
    }
    
    if (!side) {
      return { error: "Missing required argument: side" };
    }

    try {
      const fullFen = fen.includes(' ') ? fen : `${fen} ${side} KQkq - 0 1`;
      const artifactHtml = viewBoardArtifact(fullFen, side, is3d);

      return {
        data: {
          html: artifactHtml,
          message: `Chess position rendered. FEN: ${fullFen}\n\nUse the artifact above to view the interactive chess board.`
        }
      };
    } catch (error) {
      return { error: `Error rendering chess board: ${error}` };
    }
  }

  generateGameView(): RenderResult {
    try {
      const artifactHtml = gameRenderHtml;

      return {
        data: {
          html: artifactHtml,
          message: `Chess positions rendered. Use the artifact above to view the interactive chess board.`
        }
      };
    } catch (error) {
      return { error: `Error rendering chess board: ${error}` };
    }
  }

  createResourceContent(html: string, message: string) {
    return [
      {
        type: "text" as const,
        text: message,
      },
      {
        type: "resource" as const,
        resource: {
          uri: `data:text/html;base64,${Buffer.from(html).toString('base64')}`,
          mimeType: "text/html",
          text: html
        }
      }
    ];
  }
}