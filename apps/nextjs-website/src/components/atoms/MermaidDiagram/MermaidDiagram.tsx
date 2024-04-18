'use client';

import React, { useEffect, useRef } from 'react';
import mermaid from 'mermaid';

interface MermaidDiagramProps {
  chart: string;
}

mermaid.initialize({});

const MermaidDiagram: React.FC<MermaidDiagramProps> = ({ chart }) => {
  const id = chart;
  useEffect(() => {
    document.getElementById(id)?.removeAttribute('data-processed');
    mermaid.contentLoaded();
  }, [chart, id]);

  return (
    <div className='mermaid' id={id}>
      {chart}
    </div>
  );
};

export default MermaidDiagram;
