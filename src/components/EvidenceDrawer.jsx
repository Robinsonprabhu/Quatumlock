import React from 'react';

export const EvidenceDrawer = ({ isOpen, evidenceList, onClose }) => {
  return (
    <>
      <aside id="evidence-drawer" className={`evidence-drawer ${isOpen ? 'is-active' : ''}`} aria-hidden={!isOpen}>
        <div className="evidence-drawer__header">
          <h2>EVIDENCE DATABASE</h2>
          <button id="btn-close-evidence" className="btn btn--icon" aria-label="Close evidence database" onClick={onClose}>
            &times;
          </button>
        </div>
        <div className="evidence-drawer__list" id="evidence-list">
          {evidenceList.length === 0 ? (
            <p className="evidence-empty">No evidence acquired yet. Keep investigating.</p>
          ) : (
            evidenceList.map((ev, idx) => (
              <div key={ev.id || idx} className="evidence-card">
                <div className="evidence-card__id">EVIDENCE #{String(idx + 1).padStart(3, '0')}</div>
                <h3 className="evidence-card__title">{ev.title}</h3>
                <p className="evidence-card__note">{ev.note}</p>
              </div>
            ))
          )}
        </div>
      </aside>
      <div id="evidence-backdrop" className={`backdrop ${isOpen ? 'is-active' : ''}`} aria-hidden={!isOpen} onClick={onClose} />
    </>
  );
};
