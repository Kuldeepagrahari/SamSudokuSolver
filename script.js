import Solution from "./soduku.js";

const board = document.getElementById("board");

board.addEventListener("keyup", (event) => {
    const tdEl = event.target;
    const tdVal = tdEl.innerText.trim();
    if (!/^[1-9]$/.test(tdVal)) {
        tdEl.innerText = "";
        tdEl.style.backgroundColor = "white";
        tdEl.style.color = "black";
    } else {
        tdEl.innerText = tdVal;
        tdEl.style.backgroundColor = "rgb(22, 22, 22)";
        tdEl.style.color = "white";
    }
});

function boardToString() {
    const tdata = document.getElementsByTagName("td");
    let TabEntries = "";

    for (let i = 0; i < tdata.length; i++) {
        TabEntries += /^[1-9]$/.test(tdata[i].innerText) ? tdata[i].innerText : ".";
    }
    return TabEntries;
}

function clearer() {
    const tdata = document.getElementsByTagName("td");
    for (let i = 0; i < tdata.length; i++) {
        tdata[i].innerText = "";
        tdata[i].style.backgroundColor = "rgba(255, 255, 255, 0.2)";
        tdata[i].style.color = "white";
    }
    // board.style.backgroundColor = "white";
}

function stringToBoard(boardString) {
    const tdata = document.getElementsByTagName("td");
    for (let i = 0; i < boardString.length; i++) {
        tdata[i].innerText = boardString[i] !== '.' ? boardString[i] : '';
    }
}

function isValidBoard(boardString) {
    for (let i = 0; i < 9; i++) {
        let row = new Set(), col = new Set(), box = new Set();
        for (let j = 0; j < 9; j++) {
            let rowVal = boardString[i * 9 + j],
                colVal = boardString[j * 9 + i],
                boxVal = boardString[Math.floor(i / 3) * 27 + (i % 3) * 3 + Math.floor(j / 3) * 9 + (j % 3)];
            
            if (rowVal !== '.' && row.has(rowVal)) return false;
            if (colVal !== '.' && col.has(colVal)) return false;
            if (boxVal !== '.' && box.has(boxVal)) return false;
            
            row.add(rowVal);
            col.add(colVal);
            box.add(boxVal);
        }
    }
    return true;
}

const solvebtn = document.querySelector("#solve");
const resetbtn = document.getElementById("reset");
const sudokuSolver = new Solution();

solvebtn.addEventListener("click", () => {
    const boardString = boardToString();
    if (!isValidBoard(boardString)) {
        alert("Invalid Sudoku entries! Please correct the board.");
        board.style.backgroundColor = "red";
        return;
    }
    
    const solution = sudokuSolver.solutionStr(boardString);
    if (solution) {
        stringToBoard(solution);
    } else {
        alert("No valid solution exists for this Sudoku configuration.");
    }
});

resetbtn.addEventListener("click", clearer);
