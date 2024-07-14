class Solution {
    
    isSafe(row, col, val, board) {
        for (let i = 0; i < 9; i++) {
            if (board[row][i] == val || board[i][col] == val) return false;
        }

        const startRow = 3 * Math.floor(row / 3);
        const startCol = 3 * Math.floor(col / 3);
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (board[startRow + i][startCol + j] == val) return false;
            }
        }

        return true;
    }

    solve(board) {
        
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                if (board[i][j] == '.') {
                    for (let k = 1; k <= 9; k++) {
                        if (this.isSafe(i, j, String(k), board)) {
                            board[i][j] = String(k);
                            if (this.solve(board)) return true;
                            board[i][j] = '.';
                        }
                      
                    }
                    return false;
                }
            }
        }
        return true;
    }

    solutionStr(boardString) {
        const board = [];
        for (let i = 0; i < 9; i++) {
            board.push(boardString.slice(i * 9, i * 9 + 9).split(''));
        }
        if (this.solve(board)) {
            return board.flat().join('');
        } else {
            return null;
        }
    }

    isValidSudoku(board) {
        // Check rows and columns
        for (let i = 0; i < 9; i++) {
            let row = new Array(9).fill(0);
            let col = new Array(9).fill(0);
            for (let j = 0; j < 9; j++) {
                if (board[i][j] !== '.') {
                    if (row[board[i][j] - 1]++) return false;
                    row[board[i][j] - 1]++;
                }
                if (board[j][i] !== '.') {
                    if (col[board[j][i] - 1]++) return false;
                    col[board[j][i] - 1]++;
                }
            }
        }

        // Check 3x3 subgrids
        for (let i = 0; i < 9; i += 3) {
            for (let j = 0; j < 9; j += 3) {
                let box = new Array(9).fill(0);
                for (let k = 0; k < 3; k++) {
                    for (let l = 0; l < 3; l++) {
                        let val = board[i + k][j + l];
                        if (val !== '.') {
                            if (box[val - 1]++) return false;
                            box[val - 1]++;
                        }
                    }
                }
            }
        }

        return true;
    }
}

export default Solution;
