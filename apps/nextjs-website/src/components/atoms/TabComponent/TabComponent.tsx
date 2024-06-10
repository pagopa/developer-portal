'use client';
import React, { FC, ReactNode } from 'react';
import { Box, Tab, Tabs } from '@mui/material';

type TabPanelProps = {
  readonly children?: ReactNode;
  readonly index: number;
  readonly value: number;
  readonly px?: number;
  readonly py?: number;
};

const TabPanel: FC<TabPanelProps> = ({
  children,
  value,
  index,
  px = 3,
  py = 3,
}) => {
  return (
    <div
      role='tabpanel'
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
    >
      {value === index && (
        <Box px={px} py={py}>
          {children}
        </Box>
      )}
    </div>
  );
};

export type TabItem = {
  readonly title: string;
  readonly content: ReactNode;
};

export type TabsProps = {
  readonly items: ReadonlyArray<TabItem>;
  readonly centered?: boolean;
  readonly variant?: 'standard' | 'scrollable' | 'fullWidth';
  px?: number;
  py?: number;
};

export const TabComponent: FC<TabsProps> = ({
  items,
  variant,
  centered = false,
  px,
  py,
}: TabsProps) => {
  const [currentTab, setCurrentTab] = React.useState(0);

  return (
    <>
      <Tabs
        value={currentTab}
        variant={variant}
        centered={centered}
        onChange={(event, newValue: number) => {
          setCurrentTab(newValue);
        }}
      >
        {items.map((item, index) => (
          <Tab key={index} label={item.title} />
        ))}
      </Tabs>
      {items.map((item, index) => (
        <TabPanel key={index} value={currentTab} index={index} px={px} py={py}>
          {item.content}
        </TabPanel>
      ))}
    </>
  );
};

export default TabComponent;
