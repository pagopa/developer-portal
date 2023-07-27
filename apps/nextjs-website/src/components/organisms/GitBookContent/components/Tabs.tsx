import MuiTabs from '@mui/material/Tabs';
import MuiTab from '@mui/material/Tab';
import { TabsProps } from 'gitbook-docs/markdoc/schema/tabs';
import React, { ReactNode } from 'react';

const Tabs = ({ titles, children }: TabsProps<ReactNode>) => {
  const [value, setValue] = React.useState(0);

  const handleChange = (_: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <>
      <MuiTabs value={value} onChange={handleChange}>
        {titles.map((title, index) => (
          <MuiTab label={title} key={index} />
        ))}
      </MuiTabs>
      {children.map((child, index) => (
        <div key={index} hidden={value !== index}>
          {child}
        </div>
      ))}
    </>
  );
};

export default Tabs;
