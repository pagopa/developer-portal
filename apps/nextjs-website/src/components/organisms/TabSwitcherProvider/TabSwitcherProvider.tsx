import React, {
  useState,
  createContext,
  useContext,
  ReactNode,
  SetStateAction,
  Dispatch,
} from 'react';
import Typography from '@mui/material/Typography';
import { Box } from '@mui/material';

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
  if (!context) {
    console.error(
      'TabSwitcherContext not found, did you forget to use TabSwitcherContextProvider?'
    );
    return null;
  }

  const { activeTabID, setActiveTabID } = context;

  const isActive = id === activeTabID;

  return (
    <Box
      onClick={() => setActiveTabID(id)}
      sx={{
        backgroundColor: isActive ? '#e6eef9' : 'transparent',
        borderRight: isActive ? '2px solid #0062C3' : 'none',
        '& > div > span': {
          color: isActive ? '#0062C3' : '#17324D',
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
    console.error(
      'TabSwitcherContext not found, did you forget to use TabSwitcherContextProvider?'
    );
    return null;
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
