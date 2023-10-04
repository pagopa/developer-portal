import MuiTabs from '@mui/material/Tabs';
import MuiTab from '@mui/material/Tab';
import { TabsProps } from 'gitbook-docs/markdoc/schema/tabs';
import React, { ReactNode } from 'react';
import { useTheme } from '@mui/material';

const Tabs = ({ titles, children }: TabsProps<ReactNode>) => {
  const { palette } = useTheme();
  const [value, setValue] = React.useState(0);

  const handleChange = (_: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <>
      <MuiTabs
        value={value}
        onChange={handleChange}
        visibleScrollbar={false}
        scrollButtons={false}
        sx={{
          borderTop: `1px solid ${palette.divider}`,
          borderLeft: `1px solid ${palette.divider}`,
          borderRight: `1px solid ${palette.divider}`,
          borderBottom: 0,
          borderTopLeftRadius: '4px',
          borderTopRightRadius: '4px',
          display: 'inline-block',
          marginBottom: '-8px',
          '& .MuiTabs-scroller': {
            display: 'inline',
          },
          '& .MuiTabs-indicator': {
            display: 'none',
          },
          '& .MuiButtonBase-root': {
            borderRight: `1px solid ${palette.divider}`,
            '&:last-child': {
              borderRight: 0,
            },
          },
        }}
      >
        {titles.map((title, index) => (
          <MuiTab
            label={title}
            key={index}
            sx={{
              backgroundColor: palette.background.default,
              borderBottom: `1px solid ${palette.divider}`,
              '&.Mui-selected': {
                backgroundColor: palette.common.white,
                borderBottom: 0,
                color: palette.text.primary,
              },
            }}
          />
        ))}
      </MuiTabs>
      {children.map((child, index) => (
        <div
          key={index}
          hidden={value !== index}
          style={{
            border: `1px solid ${palette.divider}`,
            borderTopRightRadius: 4,
            borderBottomRightRadius: 4,
            borderBottomLeftRadius: 4,
            padding: 16,
          }}
        >
          {child}
        </div>
      ))}
    </>
  );
};

export default Tabs;
