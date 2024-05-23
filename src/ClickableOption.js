import React from 'react';

function ClickableOption({ value, onClick }) {
  return (
    <button type="button" onClick={onClick} value={value}>  {value}    </button>
  );
}

export default ClickableOption;
