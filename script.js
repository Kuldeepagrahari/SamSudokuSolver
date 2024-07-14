import Solution from "./soduku.js";

const board = document.getElementById("board");

board.addEventListener("keyup", (event) => {
    const tdEl = event.target;
    const tdVal = tdEl.innerText;
    if (!(tdVal >= 1 && tdVal <= 9)){ 
        tdEl.innerText = "";
        
        tdEl.style.backgroundColor="white"
        tdEl.style.color="black"
    }
    else {
        tdEl.innerText = tdVal;
        tdEl.style.backgroundColor="rgb(100, 6, 241)"
        tdEl.style.color="white"
        
    }
});

function boardToString() {
    const tdata = document.getElementsByTagName("td");
    let TabEntries = "";

    for (let i = 0; i < tdata.length; i++) {
        if (tdata[i].innerText >= 1 && tdata[i].innerText <= 9) {
            TabEntries += tdata[i].innerText;
        } else {
            TabEntries += ".";
        }
    }
    return TabEntries;
}

function clearer() {
    const tdata = document.getElementsByTagName("td");
    for (let i = 0; i < tdata.length; i++) {
        tdata[i].innerText = "";
        tdata[i].style.backgroundColor="white"
        tdata[i].style.color="black"
    }
    
}

function stringToBoard(boardString) {
    const tdata = document.getElementsByTagName("td");
    for (let i = 0; i < boardString.length; i++) {
        tdata[i].innerText = boardString[i] !== '.' ? boardString[i] : '';
    }
}

const solvebtn = document.querySelector("#solve");
const resetbtn = document.getElementById("reset");
const sudokuSolver = new Solution();

solvebtn.addEventListener("click", () => {
    const boardString = boardToString();
    if (!sudokuSolver.isValidSudoku(boardString)) {
        alert("Sorry! Invalid Entries based on Sudoku rules.");
        board.style.backgroundColor="red"
        
        return;

    }
    const solution = sudokuSolver.solutionStr(boardString);
    if (solution) {
        stringToBoard(solution);
    } else {
        alert("Sorry! Invalid Entries");
    }
});

resetbtn.addEventListener("click", clearer);
