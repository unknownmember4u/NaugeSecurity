import React from 'react';
import './NewtonsCradle.css';

export function NewtonsCradle({
  size = 50,
  speed = 1.2,
  color = '#f97316',
  className = '',
  style = {},
}) {
  const sizeValue = typeof size === 'number' ? `${size}px` : size;
  const speedValue = typeof speed === 'number' ? `${speed}s` : speed;

  const combinedStyle = {
    '--uib-size': sizeValue,
    '--uib-speed': speedValue,
    '--uib-color': color,
    ...style,
  };

  return (
    <div
      className={`newtons-cradle ${className}`}
      style={combinedStyle}
      role="status"
      aria-label="Loading..."
    >
      <div className="newtons-cradle__dot" />
      <div className="newtons-cradle__dot" />
      <div className="newtons-cradle__dot" />
      <div className="newtons-cradle__dot" />
    </div>
  );
}

export default NewtonsCradle;
