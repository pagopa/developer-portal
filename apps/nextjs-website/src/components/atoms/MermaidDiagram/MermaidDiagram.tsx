'use client';

import React, { useEffect, useRef } from 'react';
import mermaid from 'mermaid';

interface MermaidDiagramProps {
  chart: string;
}

mermaid.initialize({});

const MermaidDiagram: React.FC<MermaidDiagramProps> = ({ chart }) => {
  // Generate a unique id for the diagram based on the chart content
  const id = chart
    .split('')
    .map((s) => s.charCodeAt(0))
    .reduce((a, b) => a + b)
    .toString();

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
