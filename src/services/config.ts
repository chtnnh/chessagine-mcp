
type ExternalService = 'SF_BASE_URL' | 'NN_BASE_URL' | 'CHESSDB_BASE_URL' | 'LICHESS_BASE_URL' | 'POSIRA_BASE_URL' | 'CBM_BASE_URL' | 'GUBBINS_BASE_URL'

export const SERVICE_CONFIG_BASE_URL_MAP: Record<ExternalService, string> = {
    SF_BASE_URL: "https://stockfish-service-717993082875.us-central1.run.app",
    NN_BASE_URL: "https://www.chessagine.com/api/nn",
    CHESSDB_BASE_URL: "https://www.chessdb.cn/cdb.php",
    LICHESS_BASE_URL: "https://lichess.org",
    POSIRA_BASE_URL: "https://api.posira.dev",
    CBM_BASE_URL: "https://api.chessboardmagic.com",
    GUBBINS_BASE_URL: "https://api.chessgubbins.com",
}; 