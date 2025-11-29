export const viewBoardArtifact = (fen = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1', side = 'w', is3d = false) => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Chess Board Renderer</title>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
    <style>
        body {
            font-family: Arial, sans-serif;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            margin: 0;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }
        .container {
            background: white;
            padding: 30px;
            border-radius: 15px;
            box-shadow: 0 10px 40px rgba(0,0,0,0.3);
        }
        .controls {
            display: flex;
            gap: 10px;
            margin-bottom: 15px;
            flex-wrap: wrap;
        }
        .btn {
            padding: 8px 16px;
            border: none;
            border-radius: 5px;
            background: #667eea;
            color: white;
            cursor: pointer;
            font-size: 14px;
            transition: background 0.3s;
        }
        .btn:hover {
            background: #5568d3;
        }
        .color-scheme {
            padding: 8px 12px;
            border: 2px solid #ddd;
            border-radius: 5px;
            font-size: 14px;
            cursor: pointer;
        }
        .board {
            display: grid;
            grid-template-columns: repeat(8, 60px);
            grid-template-rows: repeat(8, 60px);
            border: 3px solid #333;
            box-shadow: 0 5px 15px rgba(0,0,0,0.3);
        }
        .square {
            width: 60px;
            height: 60px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 40px;
            cursor: default;
        }
        /* Color schemes */
        .classic-light { background-color: #f0d9b5; }
        .classic-dark { background-color: #b58863; }
        
        .blue-light { background-color: #e8edf9; }
        .blue-dark { background-color: #7389ae; }
        
        .green-light { background-color: #ffffdd; }
        .green-dark { background-color: #86a666; }
        
        .brown-light { background-color: #f0d9b5; }
        .brown-dark { background-color: #946f51; }
        
        .gray-light { background-color: #e0e0e0; }
        .gray-dark { background-color: #808080; }
        
        #canvas3d {
            width: 600px;
            height: 600px;
            border: 3px solid #333;
            box-shadow: 0 5px 15px rgba(0,0,0,0.3);
            cursor: grab;
        }
        #canvas3d:active {
            cursor: grabbing;
        }
        
        .hidden {
            display: none !important;
        }
        
        .info {
            margin-top: 20px;
            text-align: center;
            color: #333;
        }
        .fen-input {
            width: 100%;
            padding: 10px;
            margin-bottom: 15px;
            border: 2px solid #ddd;
            border-radius: 5px;
            font-family: monospace;
            font-size: 14px;
        }
        h2 {
            text-align: center;
            color: #333;
            margin-top: 0;
        }
        .coords {
            display: flex;
            justify-content: space-around;
            margin-top: 5px;
            font-weight: bold;
            color: #333;
        }
        .rank-coords {
            display: flex;
            flex-direction: column;
            justify-content: space-around;
            margin-right: 5px;
            font-weight: bold;
            color: #333;
        }
        .board-wrapper {
            display: flex;
            justify-content: center;
        }
    </style>
</head>
<body>
    <div class="container">
        <h2 id="title">♔ Chess Position Viewer ♚</h2>
        <input type="text" class="fen-input" id="fenInput" placeholder="Enter FEN notation">
        
        <div class="controls">
            <button class="btn" id="flipBtn">🔄 Flip Board</button>
            <button class="btn" id="viewToggleBtn">🎮 Switch View</button>
            <select class="color-scheme" id="colorScheme">
                <option value="classic">Classic</option>
                <option value="blue">Blue</option>
                <option value="green">Green</option>
                <option value="brown">Brown</option>
                <option value="gray">Gray</option>
            </select>
        </div>
        
        <div class="board-wrapper">
            <div id="board2d-wrapper">
                <div style="display: flex;">
                    <div class="rank-coords" id="rankCoords"></div>
                    <div>
                        <div class="board" id="chessboard"></div>
                        <div class="coords" id="fileCoords"></div>
                    </div>
                </div>
            </div>
            <div id="canvas3d" class="hidden"></div>
        </div>
        <div class="info" id="info"></div>
    </div>

    <script>
        const pieceSymbols = {
            'K': '♔', 'Q': '♕', 'R': '♖', 'B': '♗', 'N': '♘', 'P': '♙',
            'k': '♚', 'q': '♛', 'r': '♜', 'b': '♝', 'n': '♞', 'p': '♟'
        };

        let currentFen = '${fen}';
        let flipped = ${side === 'b' ? 'true' : 'false'};
        let colorScheme = 'classic';
        let is3dMode = ${is3d ? 'true' : 'false'};

        // 3D Variables
        let scene, camera, renderer, pieces3d = [], board3dSquares = [];
        let isDragging = false;
        let previousMousePosition = { x: 0, y: 0 };
        let is3dInitialized = false;

        // 2D Functions
        function updateCoordinates() {
            const rankCoords = document.getElementById('rankCoords');
            const fileCoords = document.getElementById('fileCoords');
            
            const ranks = flipped ? ['1','2','3','4','5','6','7','8'] : ['8','7','6','5','4','3','2','1'];
            const files = flipped ? ['h','g','f','e','d','c','b','a'] : ['a','b','c','d','e','f','g','h'];
            
            rankCoords.innerHTML = ranks.map(r => \`<div>\${r}</div>\`).join('');
            fileCoords.innerHTML = files.map(f => \`<div>\${f}</div>\`).join('');
        }

        function renderBoard2D(fen) {
            const board = document.getElementById('chessboard');
            board.innerHTML = '';
            
            if (!fen || fen.trim() === '') {
                fen = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
            }

            const parts = fen.split(' ');
            const position = parts[0];
            const ranks = position.split('/');
            const displayRanks = flipped ? [...ranks].reverse() : ranks;
            
            for (let rank = 0; rank < 8; rank++) {
                let file = 0;
                const rankStr = displayRanks[rank];
                const rankChars = flipped ? rankStr.split('').reverse().join('') : rankStr;
                
                for (let char of rankChars) {
                    if (char >= '1' && char <= '8') {
                        const emptySquares = parseInt(char);
                        for (let i = 0; i < emptySquares; i++) {
                            createSquare(rank, file, '');
                            file++;
                        }
                    } else {
                        createSquare(rank, file, pieceSymbols[char] || '');
                        file++;
                    }
                }
            }
            
            updateInfo(fen);
        }

        function createSquare(rank, file, piece) {
            const square = document.createElement('div');
            const isLight = (rank + file) % 2 === 0;
            const lightClass = \`\${colorScheme}-light\`;
            const darkClass = \`\${colorScheme}-dark\`;
            square.className = 'square ' + (isLight ? lightClass : darkClass);
            square.textContent = piece;
            document.getElementById('chessboard').appendChild(square);
        }

        // 3D Functions
        function init3D() {
            if (is3dInitialized) return;
            
            const container = document.getElementById('canvas3d');
            scene = new THREE.Scene();
            scene.background = new THREE.Color(0xf0f0f0);

            camera = new THREE.PerspectiveCamera(45, 1, 0.1, 1000);
            camera.position.set(0, 12, 12);
            camera.lookAt(0, 0, 0);

            renderer = new THREE.WebGLRenderer({ antialias: true });
            renderer.setSize(600, 600);
            renderer.shadowMap.enabled = true;
            container.appendChild(renderer.domElement);

            // Lighting
            const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
            scene.add(ambientLight);

            const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
            directionalLight.position.set(5, 10, 5);
            directionalLight.castShadow = true;
            directionalLight.shadow.mapSize.width = 2048;
            directionalLight.shadow.mapSize.height = 2048;
            scene.add(directionalLight);

            // Create board
            createBoard3D();

            // Mouse controls
            renderer.domElement.addEventListener('mousedown', onMouseDown);
            renderer.domElement.addEventListener('mousemove', onMouseMove);
            renderer.domElement.addEventListener('mouseup', onMouseUp);

            is3dInitialized = true;
            animate();
        }

        function createBoard3D() {
            const boardSize = 8;
            const squareSize = 1;
            const boardGeometry = new THREE.BoxGeometry(squareSize, 0.2, squareSize);

            for (let row = 0; row < boardSize; row++) {
                for (let col = 0; col < boardSize; col++) {
                    const isLight = (row + col) % 2 === 0;
                    const color = isLight ? 0xf0d9b5 : 0xb58863;
                    const material = new THREE.MeshStandardMaterial({ color });
                    
                    const square = new THREE.Mesh(boardGeometry, material);
                    square.position.set(col - 3.5, -0.1, row - 3.5);
                    square.receiveShadow = true;
                    scene.add(square);
                    board3dSquares.push(square);
                }
            }
        }

        function createPiece3D(piece, x, z) {
            const isWhite = piece === piece.toUpperCase();
            const color = isWhite ? 0xf5f5dc : 0x2c2416;
            
            const group = new THREE.Group();
            const pieceType = piece.toLowerCase();
            const material = new THREE.MeshStandardMaterial({ 
                color,
                metalness: 0.3,
                roughness: 0.4
            });
            
            // Base for all pieces
            const baseGeometry = new THREE.CylinderGeometry(0.35, 0.4, 0.15, 32);
            const base = new THREE.Mesh(baseGeometry, material);
            base.castShadow = true;
            base.receiveShadow = true;
            group.add(base);
            
            switch(pieceType) {
                case 'k': // King
                    const kingBody = new THREE.CylinderGeometry(0.25, 0.35, 0.6, 32);
                    const kingMesh1 = new THREE.Mesh(kingBody, material);
                    kingMesh1.position.y = 0.45;
                    kingMesh1.castShadow = true;
                    group.add(kingMesh1);
                    
                    const kingTop = new THREE.CylinderGeometry(0.28, 0.25, 0.3, 32);
                    const kingMesh2 = new THREE.Mesh(kingTop, material);
                    kingMesh2.position.y = 0.9;
                    kingMesh2.castShadow = true;
                    group.add(kingMesh2);
                    
                    // Cross on top
                    const crossV = new THREE.BoxGeometry(0.08, 0.35, 0.08);
                    const crossH = new THREE.BoxGeometry(0.25, 0.08, 0.08);
                    const crossV1 = new THREE.Mesh(crossV, material);
                    const crossH1 = new THREE.Mesh(crossH, material);
                    crossV1.position.y = 1.25;
                    crossH1.position.y = 1.15;
                    crossV1.castShadow = true;
                    crossH1.castShadow = true;
                    group.add(crossV1);
                    group.add(crossH1);
                    break;
                    
                case 'q': // Queen
                    const queenBody = new THREE.CylinderGeometry(0.25, 0.35, 0.6, 32);
                    const queenMesh1 = new THREE.Mesh(queenBody, material);
                    queenMesh1.position.y = 0.45;
                    queenMesh1.castShadow = true;
                    group.add(queenMesh1);
                    
                    const queenTop = new THREE.CylinderGeometry(0.26, 0.25, 0.25, 32);
                    const queenMesh2 = new THREE.Mesh(queenTop, material);
                    queenMesh2.position.y = 0.875;
                    queenMesh2.castShadow = true;
                    group.add(queenMesh2);
                    
                    // Crown spheres
                    for (let i = 0; i < 8; i++) {
                        const angle = (i * Math.PI * 2) / 8;
                        const crownBall = new THREE.SphereGeometry(0.06, 16, 16);
                        const crownMesh = new THREE.Mesh(crownBall, material);
                        crownMesh.position.x = Math.cos(angle) * 0.22;
                        crownMesh.position.y = 1.05;
                        crownMesh.position.z = Math.sin(angle) * 0.22;
                        crownMesh.castShadow = true;
                        group.add(crownMesh);
                    }
                    break;
                    
                case 'r': // Rook
                    const rookBody = new THREE.CylinderGeometry(0.28, 0.35, 0.7, 32);
                    const rookMesh = new THREE.Mesh(rookBody, material);
                    rookMesh.position.y = 0.5;
                    rookMesh.castShadow = true;
                    group.add(rookMesh);
                    
                    const rookTop = new THREE.CylinderGeometry(0.32, 0.28, 0.15, 32);
                    const rookMesh2 = new THREE.Mesh(rookTop, material);
                    rookMesh2.position.y = 0.925;
                    rookMesh2.castShadow = true;
                    group.add(rookMesh2);
                    
                    // Battlements
                    for (let i = 0; i < 4; i++) {
                        const angle = (i * Math.PI * 2) / 4;
                        const battlement = new THREE.BoxGeometry(0.12, 0.2, 0.12);
                        const battleMesh = new THREE.Mesh(battlement, material);
                        battleMesh.position.x = Math.cos(angle) * 0.28;
                        battleMesh.position.y = 1.1;
                        battleMesh.position.z = Math.sin(angle) * 0.28;
                        battleMesh.castShadow = true;
                        group.add(battleMesh);
                    }
                    break;
                    
                case 'b': // Bishop
                    const bishopBody = new THREE.CylinderGeometry(0.22, 0.35, 0.6, 32);
                    const bishopMesh1 = new THREE.Mesh(bishopBody, material);
                    bishopMesh1.position.y = 0.45;
                    bishopMesh1.castShadow = true;
                    group.add(bishopMesh1);
                    
                    const bishopNeck = new THREE.CylinderGeometry(0.15, 0.22, 0.3, 32);
                    const bishopMesh2 = new THREE.Mesh(bishopNeck, material);
                    bishopMesh2.position.y = 0.9;
                    bishopMesh2.castShadow = true;
                    group.add(bishopMesh2);
                    
                    const bishopHead = new THREE.SphereGeometry(0.18, 32, 32);
                    const bishopMesh3 = new THREE.Mesh(bishopHead, material);
                    bishopMesh3.position.y = 1.15;
                    bishopMesh3.castShadow = true;
                    group.add(bishopMesh3);
                    
                    // Cross cut
                    const cut = new THREE.SphereGeometry(0.08, 16, 16);
                    const cutMesh = new THREE.Mesh(cut, material);
                    cutMesh.position.y = 1.3;
                    cutMesh.castShadow = true;
                    group.add(cutMesh);
                    break;
                    
                case 'n': // Knight
                    const knightBody = new THREE.CylinderGeometry(0.25, 0.35, 0.5, 32);
                    const knightMesh1 = new THREE.Mesh(knightBody, material);
                    knightMesh1.position.y = 0.4;
                    knightMesh1.castShadow = true;
                    group.add(knightMesh1);
                    
                    // Horse head approximation
                    const headBase = new THREE.BoxGeometry(0.3, 0.5, 0.25);
                    const headMesh = new THREE.Mesh(headBase, material);
                    headMesh.position.y = 0.9;
                    headMesh.position.z = 0.1;
                    headMesh.rotation.x = -0.3;
                    headMesh.castShadow = true;
                    group.add(headMesh);
                    
                    const snout = new THREE.BoxGeometry(0.2, 0.25, 0.2);
                    const snoutMesh = new THREE.Mesh(snout, material);
                    snoutMesh.position.y = 0.9;
                    snoutMesh.position.z = 0.3;
                    snoutMesh.castShadow = true;
                    group.add(snoutMesh);
                    
                    // Ears
                    const ear = new THREE.ConeGeometry(0.08, 0.15, 16);
                    const ear1 = new THREE.Mesh(ear, material);
                    const ear2 = new THREE.Mesh(ear, material);
                    ear1.position.set(-0.1, 1.15, 0.1);
                    ear2.position.set(0.1, 1.15, 0.1);
                    ear1.castShadow = true;
                    ear2.castShadow = true;
                    group.add(ear1);
                    group.add(ear2);
                    break;
                    
                case 'p': // Pawn
                    const pawnBody = new THREE.CylinderGeometry(0.2, 0.3, 0.5, 32);
                    const pawnMesh = new THREE.Mesh(pawnBody, material);
                    pawnMesh.position.y = 0.4;
                    pawnMesh.castShadow = true;
                    group.add(pawnMesh);
                    
                    const pawnHead = new THREE.SphereGeometry(0.18, 32, 32);
                    const pawnMesh2 = new THREE.Mesh(pawnHead, material);
                    pawnMesh2.position.y = 0.8;
                    pawnMesh2.castShadow = true;
                    group.add(pawnMesh2);
                    break;
            }

            group.position.set(x, 0.075, z);
            return group;
        }

        function clearPieces3D() {
            pieces3d.forEach(piece => scene.remove(piece));
            pieces3d = [];
        }

        function renderBoard3D(fen) {
            clearPieces3D();
            
            if (!fen || fen.trim() === '') {
                fen = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
            }

            const parts = fen.split(' ');
            const position = parts[0];
            const ranks = position.split('/');
            
            for (let rank = 0; rank < 8; rank++) {
                let file = 0;
                const rankStr = ranks[rank];
                
                for (let char of rankStr) {
                    if (char >= '1' && char <= '8') {
                        file += parseInt(char);
                    } else {
                        const x = file - 3.5;
                        const z = (flipped ? (7 - rank) : rank) - 3.5;
                        const piece = createPiece3D(char, x, z);
                        scene.add(piece);
                        pieces3d.push(piece);
                        file++;
                    }
                }
            }
            
            updateInfo(fen);
        }

        function onMouseDown(e) {
            isDragging = true;
            previousMousePosition = { x: e.clientX, y: e.clientY };
        }

        function onMouseMove(e) {
            if (isDragging) {
                const deltaX = e.clientX - previousMousePosition.x;
                const deltaY = e.clientY - previousMousePosition.y;

                const rotationSpeed = 0.005;
                const moveSpeed = 0.02;

                // Rotate camera around the board
                const radius = Math.sqrt(camera.position.x ** 2 + camera.position.z ** 2);
                const angle = Math.atan2(camera.position.z, camera.position.x);
                const newAngle = angle - deltaX * rotationSpeed;
                
                camera.position.x = radius * Math.cos(newAngle);
                camera.position.z = radius * Math.sin(newAngle);
                camera.position.y = Math.max(5, camera.position.y - deltaY * moveSpeed);
                
                camera.lookAt(0, 0, 0);

                previousMousePosition = { x: e.clientX, y: e.clientY };
            }
        }

        function onMouseUp() {
            isDragging = false;
        }

        function animate() {
            if (!is3dMode) return;
            requestAnimationFrame(animate);
            renderer.render(scene, camera);
        }

        function updateInfo(fen) {
            const parts = fen.split(' ');
            const turn = parts[1] || 'w';
            const castling = parts[2] || '-';
            const enPassant = parts[3] || '-';
            const halfmove = parts[4] || '0';
            const fullmove = parts[5] || '1';
            const turnText = turn === 'w' ? 'White' : 'Black';
            
            document.getElementById('info').innerHTML = \`<strong>Turn:</strong> \${turnText} | <strong>Castling:</strong> \${castling} | <strong>En Passant:</strong> \${enPassant}<br><strong>Halfmove:</strong> \${halfmove} | <strong>Fullmove:</strong> \${fullmove}\`;
        }

        function toggleView() {
            is3dMode = !is3dMode;
            const board2d = document.getElementById('board2d-wrapper');
            const board3d = document.getElementById('canvas3d');
            const title = document.getElementById('title');
            const colorScheme = document.getElementById('colorScheme');
            const btn = document.getElementById('viewToggleBtn');
            
            if (is3dMode) {
                board2d.classList.add('hidden');
                board3d.classList.remove('hidden');
                colorScheme.classList.add('hidden');
                title.textContent = '♔ Chess Position Viewer 3D ♚';
                btn.textContent = '📐 Switch to 2D';
                
                if (!is3dInitialized) {
                    init3D();
                }
                renderBoard3D(currentFen);
                animate();
            } else {
                board2d.classList.remove('hidden');
                board3d.classList.add('hidden');
                colorScheme.classList.remove('hidden');
                title.textContent = '♔ Chess Position Viewer 2D ♚';
                btn.textContent = '🎮 Switch to 3D';
                renderBoard2D(currentFen);
            }
        }

        // Event listeners
        const fenInput = document.getElementById('fenInput');
        fenInput.addEventListener('input', (e) => {
            currentFen = e.target.value;
            if (is3dMode) {
                renderBoard3D(currentFen);
            } else {
                renderBoard2D(currentFen);
            }
        });

        document.getElementById('flipBtn').addEventListener('click', () => {
            flipped = !flipped;
            if (is3dMode) {
                renderBoard3D(currentFen);
            } else {
                updateCoordinates();
                renderBoard2D(currentFen);
            }
        });

        document.getElementById('viewToggleBtn').addEventListener('click', toggleView);

        document.getElementById('colorScheme').addEventListener('change', (e) => {
            colorScheme = e.target.value;
            if (!is3dMode) {
                renderBoard2D(currentFen);
            }
        });

        // Initial render
        fenInput.value = currentFen;
        if (is3dMode) {
            document.getElementById('board2d-wrapper').classList.add('hidden');
            document.getElementById('canvas3d').classList.remove('hidden');
            document.getElementById('colorScheme').classList.add('hidden');
            document.getElementById('title').textContent = '♔ Chess Position Viewer 3D ♚';
            document.getElementById('viewToggleBtn').textContent = '📐 Switch to 2D';
            init3D();
            renderBoard3D(currentFen);
        } else {
            updateCoordinates();
            renderBoard2D(currentFen);
        }
    </script>
</body>
</html>
`;