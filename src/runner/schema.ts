import z from "zod";

export const fenSchema = z
  .string()
  .regex(
    /^([rnbqkpRNBQKP1-8]+\/){7}[rnbqkpRNBQKP1-8]+ [bw] [KQkq-]+ [a-h][1-8]|[a-h][1-8]|[a-h][1-8]|[a-h][1-8]|- \d+ \d+$/,
    "Invalid FEN format"
  ).describe("FEN string representing the board position");

export const sideSchema = z.enum(["w", "b"]).describe("Side to evaluate from");

export const engineDepthSchema = z.number().min(12).max(30).describe("Search depth for Stockfish engine");

export const moveSchema = z.string().describe("The move to be played (in SAN or UCI format)");

export const moveAlgSchema = z.array(z.string()).describe("Array of moves in algebraic notation");

export const gamePgnSchema = z.string().describe("Game PGN");

export const cbmGameIdSchema = z.string().describe("game ID to fetch chessboardmagic game")

export const cbmRepIdSchema = z.string().describe("repertoire ID to fetch a repertoire from chessboardmagic")

export const is3dSchema = z.boolean().describe("3D view of the board").optional()

export const is960Schema = z.boolean().describe("Is this a chess960 variant user query");

export const tokenSchema = z.string().optional().describe("Bearer token to authenticate the request, falls back to server configured token if not provided");
