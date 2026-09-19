import React from 'react';

export const Scanlines = ({ isCritical }) => {
  return (
    <>
      <div class="scanlines" aria-hidden="true" />
      <div id="alert-wash" className={`alert-wash ${isCritical ? 'is-critical' : ''}`} aria-hidden="true" />
    </>
  );
};
