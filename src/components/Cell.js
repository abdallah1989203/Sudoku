import React from 'react';
import './Cell.css';

function Cell({ value, editable, isSelected, onClick }) {
  return (
    <div
      className={`cell ${!editable ? 'fixed' : ''} ${isSelected ? 'selected' : ''}`}
      onClick={onClick}
    >
      {value || ''}
    </div>
  );
}

export default Cell;
