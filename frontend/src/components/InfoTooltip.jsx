
import React, { useState, useEffect, useRef } from 'react';

export default function InfoTooltip({ title, children }) {
  const [isOpen, setIsOpen] = useState(false);
  const tooltipRef = useRef(null);

  useEffect(() => {
    function handleOutsideClick(event) {
      if (
        tooltipRef.current &&
        !tooltipRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener('pointerdown', handleOutsideClick);

    return () => {
      document.removeEventListener(
        'pointerdown',
        handleOutsideClick
      );
    };
  }, []);

  return (
    <span className="info-tooltip" ref={tooltipRef}>
      <button
        type="button"
        className="info-tooltip-button"
        aria-label={`Mais informações sobre ${title}`}
        aria-expanded={isOpen}
        onClick={() => setIsOpen((previous) => !previous)}
      >
        i
      </button>

      {isOpen && (
        <span className="info-tooltip-content" role="tooltip">
          <strong>{title}</strong>

          <span>{children}</span>
        </span>
      )}
    </span>
  );
}
