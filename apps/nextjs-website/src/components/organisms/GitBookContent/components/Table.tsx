import { styled, useTheme } from '@mui/material/styles';
import MUITableContainer from '@mui/material/TableContainer';
import MUITable from '@mui/material/Table';
import MUITableHead from '@mui/material/TableHead';
import MUITableBody from '@mui/material/TableBody';
import MUITableRow from '@mui/material/TableRow';
import MUITableCell, { TableCellProps } from '@mui/material/TableCell';
import { ReactNode } from 'react';
import { TableProps } from 'gitbook-docs/markdoc/schema/table';
import { Checkbox } from '@mui/material';

export const Table = ({ children }: TableProps<ReactNode>) => (
  <MUITableContainer component={'div'}>
    <MUITable
      sx={{
        borderCollapse: 'collapse',
        borderStyle: 'hidden',
      }}
    >
      {children}
    </MUITable>
  </MUITableContainer>
);

export const TableHead = styled(MUITableHead)(({ theme }) => ({
  backgroundColor: theme.palette.background.default,
  borderBottom: `2px solid ${theme.palette.divider}`,
}));
export const TableBody = styled(MUITableBody)(() => ({
  fontSize: 16,
  'span.MuiTypography-body1': {
    fontSize: '1rem !important',
  },
}));
export const TableR = MUITableRow;

export const TableH = styled(MUITableCell)(({ theme }) => ({
  border: `1px solid ${theme.palette.divider} !important`,
  fontSize: 16,
  fontWeight: 600,
  padding: '0.5rem 1rem',
}));


export const TableD = (props: TableCellProps) => {
  const theme = useTheme();
  return (
    <MUITableCell
      sx={{ border: `1px solid ${theme.palette.divider}` }}
      {...props}
    >
      {props.children === 'true' ? (
        <Checkbox
          disabled
          checked
          style={{ color: theme.palette.primary.main }}
        />
      ) : props.children == 'false' ? (
        <Checkbox disabled />
      ) : (
        props.children || ''
      )}
    </MUITableCell>
  );
};

export default Table;
