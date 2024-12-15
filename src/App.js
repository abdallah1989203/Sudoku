import React, { useState } from 'react';
import './App.css';
import Board from './components/Board';
import { generateSudoku, isSolved, isValidMove, isCurrentSolutionValid } from './utils/sudoku';

function App() {
  const [board, setBoard] = useState(generateSudoku('medium'));
  const [selectedCell, setSelectedCell] = useState(null);
  const [message, setMessage] = useState('');
  const [difficulty, setDifficulty] = useState('medium');

  const handleCellClick = (row, col) => {
    setSelectedCell({ row, col });
    setMessage('');
  };

  const handleNumberInput = (number) => {
    if (selectedCell && board[selectedCell.row][selectedCell.col].editable) {
      // Check if the move is valid
      if (!isValidMove(board, selectedCell.row, selectedCell.col, number)) {
        setMessage('Dieser Zug ist nicht erlaubt! Die Zahl existiert bereits in der Zeile, Spalte oder dem 3x3-Block.');
        return;
      }

      const newBoard = JSON.parse(JSON.stringify(board));
      newBoard[selectedCell.row][selectedCell.col].value = number;
      setBoard(newBoard);

      // Check if the current solution is valid
      if (!isCurrentSolutionValid(newBoard)) {
        setMessage('Achtung: Die aktuelle Lösung enthält Fehler!');
      } else if (isSolved(newBoard)) {
        setMessage('Glückwunsch! Du hast das Sudoku richtig gelöst!');
      }
    }
  };

  const handleClearCell = () => {
    if (selectedCell && board[selectedCell.row][selectedCell.col].editable) {
      const newBoard = JSON.parse(JSON.stringify(board));
      newBoard[selectedCell.row][selectedCell.col].value = 0;
      setBoard(newBoard);
      setMessage('');
    }
  };

  const handleCheckSolution = () => {
    if (isCurrentSolutionValid(board)) {
      if (isSolved(board)) {
        setMessage('Glückwunsch! Deine Lösung ist komplett und korrekt!');
      } else {
        setMessage('Deine bisherige Lösung ist korrekt, aber das Sudoku ist noch nicht vollständig gelöst.');
      }
    } else {
      setMessage('Die aktuelle Lösung enthält Fehler. Überprüfe deine Eingaben.');
    }
  };

  const handleShowSolution = () => {
    const newBoard = JSON.parse(JSON.stringify(board));
    newBoard.forEach((row, rowIndex) => {
      row.forEach((cell, colIndex) => {
        newBoard[rowIndex][colIndex].value = newBoard[rowIndex][colIndex].solution;
      });
    });
    setBoard(newBoard);
    setMessage('Hier ist die richtige Lösung!');
  };

  const handleNewGame = (newDifficulty = difficulty) => {
    setDifficulty(newDifficulty);
    setBoard(generateSudoku(newDifficulty));
    setSelectedCell(null);
    setMessage(`Neues ${getDifficultyName(newDifficulty)} Spiel gestartet!`);
  };

  const getDifficultyName = (diff) => {
    const names = {
      easy: 'Leichtes',
      medium: 'Mittleres',
      hard: 'Schweres'
    };
    return names[diff] || diff;
  };

  return (
    <div className="App">
      <h1>Sudoku</h1>
      {message && <div className="message">{message}</div>}
      <div className="difficulty-buttons">
        <button 
          onClick={() => handleNewGame('easy')} 
          className={`difficulty-button ${difficulty === 'easy' ? 'active' : ''}`}
        >
          Leicht
        </button>
        <button 
          onClick={() => handleNewGame('medium')} 
          className={`difficulty-button ${difficulty === 'medium' ? 'active' : ''}`}
        >
          Mittel
        </button>
        <button 
          onClick={() => handleNewGame('hard')} 
          className={`difficulty-button ${difficulty === 'hard' ? 'active' : ''}`}
        >
          Schwer
        </button>
      </div>
      <Board 
        board={board} 
        selectedCell={selectedCell}
        onCellClick={handleCellClick}
      />
      <div className="controls">
        <div className="number-pad">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((number) => (
            <button
              key={number}
              onClick={() => handleNumberInput(number)}
              className="number-button"
            >
              {number}
            </button>
          ))}
        </div>
        <div className="action-buttons">
          <button onClick={() => handleNewGame()} className="action-button new-game">
            Neues Spiel
          </button>
          <button onClick={handleClearCell} className="action-button">
            Löschen
          </button>
          <button onClick={handleCheckSolution} className="action-button check">
            Lösung prüfen
          </button>
          <button onClick={handleShowSolution} className="action-button solution">
            Lösung zeigen
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
