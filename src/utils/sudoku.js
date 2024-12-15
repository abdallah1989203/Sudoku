// Hilfsfunktion zum Erstellen eines leeren Sudoku-Boards
function createEmptyBoard() {
  return Array(9).fill().map(() => Array(9).fill(0));
}

// Hilfsfunktion zum Prüfen, ob eine Zahl an einer Position gültig ist
function isValid(board, row, col, num) {
  // Prüfe Zeile
  for (let x = 0; x < 9; x++) {
    if (board[row][x] === num) return false;
  }

  // Prüfe Spalte
  for (let x = 0; x < 9; x++) {
    if (board[x][col] === num) return false;
  }

  // Prüfe 3x3 Box
  let startRow = row - row % 3;
  let startCol = col - col % 3;
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (board[i + startRow][j + startCol] === num) return false;
    }
  }

  return true;
}

// Hilfsfunktion zum Lösen eines Sudoku mit Backtracking
function solveSudoku(board) {
  let row = 0;
  let col = 0;
  let isEmpty = false;
  
  // Finde eine leere Zelle
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      if (board[i][j] === 0) {
        row = i;
        col = j;
        isEmpty = true;
        break;
      }
    }
    if (isEmpty) break;
  }

  // Wenn keine leere Zelle gefunden wurde, ist das Sudoku gelöst
  if (!isEmpty) return true;

  // Versuche Zahlen von 1 bis 9
  for (let num = 1; num <= 9; num++) {
    if (isValid(board, row, col, num)) {
      board[row][col] = num;
      if (solveSudoku(board)) return true;
      board[row][col] = 0;
    }
  }
  return false;
}

// Funktion zum Generieren eines vollständig gelösten Sudoku
function generateSolvedSudoku() {
  const board = createEmptyBoard();
  
  // Fülle die Diagonalen 3x3 Boxen
  for (let i = 0; i < 9; i += 3) {
    let nums = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    for (let row = i; row < i + 3; row++) {
      for (let col = i; col < i + 3; col++) {
        const randomIndex = Math.floor(Math.random() * nums.length);
        board[row][col] = nums[randomIndex];
        nums.splice(randomIndex, 1);
      }
    }
  }

  // Löse den Rest des Sudokus
  solveSudoku(board);
  return board;
}

// Funktion zum Entfernen von Zahlen, um ein Puzzle zu erstellen
function createPuzzle(solvedBoard, difficulty = 'medium') {
  const board = JSON.parse(JSON.stringify(solvedBoard));
  const puzzle = Array(9).fill().map(() =>
    Array(9).fill().map(() => ({ value: 0, editable: true, solution: 0 }))
  );

  // Anzahl der zu entfernenden Zahlen je nach Schwierigkeitsgrad
  const cellsToRemove = {
    easy: 40,
    medium: 50,
    hard: 60
  }[difficulty];

  // Erstelle eine Liste aller Positionen
  let positions = [];
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      positions.push([i, j]);
    }
  }

  // Mische die Positionen
  for (let i = positions.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [positions[i], positions[j]] = [positions[j], positions[i]];
  }

  // Entferne Zahlen an zufälligen Positionen
  for (let i = 0; i < cellsToRemove; i++) {
    if (positions.length > 0) {
      const [row, col] = positions[i];
      board[row][col] = 0;
    }
  }

  // Erstelle das Puzzle-Objekt mit der Lösung
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      puzzle[i][j] = {
        value: board[i][j],
        editable: board[i][j] === 0,
        solution: solvedBoard[i][j]
      };
    }
  }

  return puzzle;
}

// Hauptfunktion zum Generieren eines neuen Sudoku-Puzzles
export function generateSudoku(difficulty = 'medium') {
  // Create a solved Sudoku board
  const solvedBoard = generateSolvedSudoku();
  
  // Convert the solved board to our cell structure
  const board = solvedBoard.map(row =>
    row.map(value => ({
      value: value,
      editable: false,
      solution: value
    }))
  );

  // Define number of cells to remove based on difficulty
  const cellsToRemove = {
    easy: 30,
    medium: 45,
    hard: 55
  }[difficulty] || 45;

  // Remove numbers to create the puzzle
  let attempts = cellsToRemove;
  while (attempts > 0) {
    const row = Math.floor(Math.random() * 9);
    const col = Math.floor(Math.random() * 9);
    
    if (board[row][col].value !== 0) {
      board[row][col].value = 0;
      board[row][col].editable = true;
      attempts--;
    }
  }

  return board;
}

// Function to check if the current state is valid
export function isValidMove(board, row, col, value) {
  // Temporäres Board nur mit Zahlen erstellen
  const tempBoard = board.map(row => row.map(cell => cell.value));
  tempBoard[row][col] = 0; // Aktuelle Position temporär leeren
  return isValid(tempBoard, row, col, value);
}

// Function to check if the puzzle is completely solved and correct
export function isSolved(board) {
  // Check if all cells are filled
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (board[row][col].value === 0) {
        return false;
      }
      // Check if the value matches the solution
      if (board[row][col].value !== board[row][col].solution) {
        return false;
      }
    }
  }
  return true;
}

// Function to check if the current solution is correct so far
export function isCurrentSolutionValid(board) {
  // Check rows
  for (let row = 0; row < 9; row++) {
    const rowValues = new Set();
    for (let col = 0; col < 9; col++) {
      const value = board[row][col].value;
      if (value !== 0) {
        if (rowValues.has(value)) {
          return false;
        }
        rowValues.add(value);
      }
    }
  }

  // Check columns
  for (let col = 0; col < 9; col++) {
    const colValues = new Set();
    for (let row = 0; row < 9; row++) {
      const value = board[row][col].value;
      if (value !== 0) {
        if (colValues.has(value)) {
          return false;
        }
        colValues.add(value);
      }
    }
  }

  // Check 3x3 boxes
  for (let boxRow = 0; boxRow < 9; boxRow += 3) {
    for (let boxCol = 0; boxCol < 9; boxCol += 3) {
      const boxValues = new Set();
      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          const value = board[boxRow + i][boxCol + j].value;
          if (value !== 0) {
            if (boxValues.has(value)) {
              return false;
            }
            boxValues.add(value);
          }
        }
      }
    }
  }

  return true;
}
