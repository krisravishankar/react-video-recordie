import React, { ReactElement } from 'react';

export function PauseIcon(): ReactElement {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width='24'
      height='24'
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
    >
      <circle cx='12' cy='12' r='10'></circle>
      <line x1='10' y1='15' x2='10' y2='9'></line>
      <line x1='14' y1='15' x2='14' y2='9'></line>
    </svg>
  );
}
