import React from 'react';

export type AlertPartProps = {
  text: string;
  title: string;
};

const AlertPart = ({ text, title }: AlertPartProps) => {
  return <div title={title}>{text}</div>;
};

export default AlertPart;
