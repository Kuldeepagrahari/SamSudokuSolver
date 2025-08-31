// --- 0. The Core Solver Class (Integrated) ---
// This class contains the backtracking algorithm to solve the Sudoku.
class Solution {
    solutionStr(boardString) {
        const board = [];
        for (let i = 0; i < 9; i++) {
            board.push(boardString.substring(i * 9, (i + 1) * 9).split(''));
        }

        this.solveSudoku(board);

        return board.map(row => row.join('')).join('');
    }

    solveSudoku(board) {
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                if (board[i][j] === '.') {
                    for (let c = 1; c <= 9; c++) {
                        const char = c.toString();
                        if (this.isValid(board, i, j, char)) {
                            board[i][j] = char;
                            if (this.solveSudoku(board)) {
                                return true;
                            } else {
                                board[i][j] = '.'; // Backtrack
                            }
                        }
                    }
                    return false;
                }
            }
        }
        return true; // Board is solved
    }

    isValid(board, row, col, c) {
        for (let i = 0; i < 9; i++) {
            if (board[i][col] === c) return false;
            if (board[row][i] === c) return false;
            const boxRow = 3 * Math.floor(row / 3) + Math.floor(i / 3);
            const boxCol = 3 * Math.floor(col / 3) + i % 3;
            if (board[boxRow][boxCol] === c) return false;
        }
        return true;
    }
}


// --- 1. DOM Elements & State ---
const boardElement = document.getElementById("board");
const solveBtn = document.getElementById("solve-btn");
const validateBtn = document.getElementById("validate-btn");
const resetBtn = document.getElementById("reset-btn");
const messageArea = document.getElementById("message-area");

let board = []; // 2D array representation
let isSolving = false;
const sudokuSolver = new Solution();

// --- 2. Board Initialization & Input Handling ---

function renderBlankBoard() {
    board = Array(9).fill().map(() => Array(9).fill(0));
    boardElement.innerHTML = '';
    for (let i = 0; i < 9; i++) {
        const rowEl = document.createElement('tr');
        for (let j = 0; j < 9; j++) {
            const cellEl = document.createElement('td');
            cellEl.contentEditable = true;
            cellEl.addEventListener('input', (e) => handleInput(e, i, j));
            rowEl.appendChild(cellEl);
        }
        boardElement.appendChild(rowEl);
    }
    solveBtn.disabled = true;
    validateBtn.disabled = false;
    messageArea.textContent = "Enter your puzzle numbers in the grid.";
    messageArea.style.color = "#fff";
}

function handleInput(e, row, col) {
    const tdEl = e.target;
    const tdVal = tdEl.textContent.trim();
    
    solveBtn.disabled = true;
    validateBtn.disabled = false;
    messageArea.textContent = "Board changed. Please validate before solving.";
    messageArea.style.color = "#fff";
    
    if (!/^[1-9]$/.test(tdVal)) {
        tdEl.textContent = "";
        board[row][col] = 0;
    } else {
        // Enforce single character in cell
        tdEl.textContent = tdVal[0];
        board[row][col] = parseInt(tdVal[0], 10);
    }
}

// --- 3. Validation Logic ---

function validateInitialBoard() {
    const tempBoard = board.map(row => [...row]);
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            const num = tempBoard[i][j];
            if (num !== 0) {
                tempBoard[i][j] = 0; 
                if (!isValidPlacement(tempBoard, i, j, num)) {
                    messageArea.textContent = "Invalid initial board setup. Check for duplicates.";
                    messageArea.style.color = "var(--error-color)";
                    solveBtn.disabled = true;
                    tempBoard[i][j] = num; 
                    return false;
                }
                tempBoard[i][j] = num;
            }
        }
    }
    
    messageArea.textContent = "Initial board is valid! Ready to solve.";
    messageArea.style.color = "var(--valid-glow)";
    solveBtn.disabled = false;
    validateBtn.disabled = true;
    return true;
}

function isValidPlacement(grid, row, col, num) {
    for (let i = 0; i < 9; i++) {
        if (grid[row][i] === num || grid[i][col] === num) return false;
    }
    const startRow = Math.floor(row / 3) * 3;
    const startCol = Math.floor(col / 3) * 3;
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (grid[startRow + i][startCol + j] === num) return false;
        }
    }
    return true;
}

// --- 4. Visual Solver ---

async function visualizeSolve() {
    if (isSolving) return;
    if (!validateInitialBoard()) return;

    isSolving = true;
    setButtonsDisabled(true);
    messageArea.textContent = "Solving...";
    messageArea.style.color = "var(--solving-color)";
    lockBoard(); 

    const tempBoard = board.map(row => [...row]);
    
    async function solveStep(row, col) {
        if (row === 9) return true;

        const nextRow = col === 8 ? row + 1 : row;
        const nextCol = col === 8 ? 0 : col + 1;

        if (tempBoard[row][col] !== 0) {
            return await solveStep(nextRow, nextCol);
        }

        for (let num = 1; num <= 9; num++) {
            if (isValidPlacement(tempBoard, row, col, num)) {
                tempBoard[row][col] = num;
                updateCell(row, col, num, 'solving');
                await delay(10);

                if (await solveStep(nextRow, nextCol)) {
                    return true;
                }

                tempBoard[row][col] = 0;
                updateCell(row, col, '', 'backtrack');
                await delay(10);
                updateCell(row, col, '', '');
            }
        }
        return false;
    }
    
    const solved = await solveStep(0, 0);
    if(solved) {
        messageArea.textContent = "Solution Found!";
        messageArea.style.color = "var(--valid-glow)";
    } else {
        messageArea.textContent = "No solution exists for this configuration.";
        messageArea.style.color = "var(--error-color)";
    }
    isSolving = false;
    setButtonsDisabled(false);
    solveBtn.disabled = true;
}

// --- 5. Utility & Helper Functions ---

function lockBoard() {
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            const cell = boardElement.rows[i].cells[j];
            cell.contentEditable = false;
            if(cell.textContent !== '') {
                cell.classList.add('given');
            }
        }
    }
}

function updateCell(row, col, value, className = '') {
    const cell = boardElement.rows[row].cells[col];
    cell.textContent = value;
    cell.className = '';
    if (className) cell.classList.add(className);
}

function setButtonsDisabled(disabled) {
    validateBtn.disabled = disabled;
    solveBtn.disabled = disabled;
    resetBtn.disabled = disabled;
}

const delay = (ms) => new Promise(res => setTimeout(res, ms));

// --- 6. Event Listeners ---
validateBtn.addEventListener('click', validateInitialBoard);
solveBtn.addEventListener('click', visualizeSolve);
resetBtn.addEventListener('click', renderBlankBoard);

// --- Initial Load ---
document.addEventListener('DOMContentLoaded', renderBlankBoard);