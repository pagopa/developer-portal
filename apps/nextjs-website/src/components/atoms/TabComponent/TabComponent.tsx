'use client';
import React, { FC, ReactNode } from 'react';
import { Box, Tab, Tabs } from '@mui/material';

export type TabPanelProps = {
  readonly children?: ReactNode;
  readonly index: number;
  readonly value: number;
};

const TabPanel: FC<TabPanelProps> = ({ children, value, index }) => {
  return (
    <div
      role='tabpanel'
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
    >
      {value === index && <Box p={3}>{children}</Box>}
    </div>
  );
};

export type TabItem = {
  readonly title: string;
  readonly content: ReactNode;
};

export type TabsProps = {
  readonly items: ReadonlyArray<TabItem>;
};

export const TabComponent: FC<TabsProps> = ({ items }: TabsProps) => {
  const [currentTab, setCurrentTab] = React.useState(0);

  return (
    <div>
      <Tabs
        value={currentTab}
        onChange={(event, newValue: number) => {
          setCurrentTab(newValue);
        }}
      >
        {items.map((item, index) => (
          <Tab key={index} label={item.title} />
        ))}
      </Tabs>
      {items.map((item, index) => (
        <TabPanel key={index} value={currentTab} index={index}>
          {item.content}
        </TabPanel>
      ))}
    </>
  );
};

export default TabComponent;
