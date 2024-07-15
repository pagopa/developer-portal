'use client';
import React, { FC, ReactNode } from 'react';
import { Box, Tab, Tabs, SxProps } from '@mui/material';

type TabPanelProps = {
  readonly children?: ReactNode;
  readonly index: number;
  readonly value: number;
  readonly sx?: SxProps;
};

const TabPanel: FC<TabPanelProps> = ({
  children,
  value,
  index,
  sx = {
    px: 3,
  },
}) => {
  return (
    <div
      role='tabpanel'
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
    >
      {value === index && <Box sx={sx}>{children}</Box>}
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
  sx?: SxProps;
};

export const TabComponent: FC<TabsProps> = ({
  items,
  variant,
  centered = false,
  sx,
}: TabsProps) => {
  const [currentTab, setCurrentTab] = React.useState(0);

  return (
    <>
      <Box
        sx={{
          borderBottom: 2,
          borderColor: 'divider',
          marginBottom: 6,
          position: 'relative',
          top: '2px',
        }}
      >
        <Tabs
          value={currentTab}
          variant={variant}
          centered={centered}
          onChange={(event, newValue: number) => {
            setCurrentTab(newValue);
          }}
          sx={{ position: 'relative', top: '2px' }}
        >
          {items.map((item, index) => (
            <Tab key={index} label={item.title} />
          ))}
        </Tabs>
      </Box>
      {items.map((item, index) => (
        <TabPanel key={index} value={currentTab} index={index} sx={sx}>
          {item.content}
        </TabPanel>
      ))}
    </>
  );
};

export default TabComponent;
