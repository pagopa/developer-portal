import React, {
  useState,
  createContext,
  useContext,
  ReactNode,
  SetStateAction,
  Dispatch,
} from 'react';
import { Box, useTheme } from '@mui/material';

type TabSwitcherContextType = {
  setActiveTabID: Dispatch<SetStateAction<string>>;
  activeTabID: string;
};

//the name of this context will be TabSwitcherContext
const TabSwitcherContext = createContext<TabSwitcherContextType | null>(null);

type TabProps = {
  id: string;
  children: ReactNode;
};

function Tab({ id, children }: TabProps) {
  const context = useContext(TabSwitcherContext);
  const { palette } = useTheme();
  if (!context) {
    // eslint-disable-next-line functional/no-throw-statements
    throw new Error(
      'TabSwitcherContext not found, did you forget to use TabSwitcherContextProvider?'
    );
  }

  const { activeTabID, setActiveTabID } = context;

  const isActive = id === activeTabID;
  const tabColor = palette.primary.dark;

  return (
    <Box
      onClick={() => setActiveTabID(id)}
      sx={{
        backgroundColor: isActive
          ? palette.primaryAction.selected
          : 'transparent',
        borderRight: isActive ? `2px solid ${tabColor}` : 'none',
        '& > div > span': {
          color: isActive ? tabColor : palette.text.primary,
        },
        cursor: 'pointer',
      }}
    >
      {children}
    </Box>
  );
}

type TabPanelProps = {
  whenActive: string;
  children: ReactNode;
};

function TabPanel({ whenActive, children }: TabPanelProps) {
  const context = useContext(TabSwitcherContext);
  if (!context) {
    // eslint-disable-next-line functional/no-throw-statements
    throw new Error(
      'TabSwitcherContext not found, did you forget to use TabSwitcherContextProvider?'
    );
  }
  const { activeTabID } = context;

  return activeTabID === whenActive ? children : null;
}

type TabSwitcherProps = {
  children: ReactNode;
  defaultActiveTabID?: string;
};

function TabSwitcherProvider({
  children,
  defaultActiveTabID,
}: TabSwitcherProps) {
  const [activeTabID, setActiveTabID] = useState(defaultActiveTabID || '');
  return (
    <TabSwitcherContext.Provider value={{ activeTabID, setActiveTabID }}>
      {children}
    </TabSwitcherContext.Provider>
  );
}

export default TabSwitcherProvider;
export { Tab, TabPanel };
