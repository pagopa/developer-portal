import { styled } from '@mui/material/styles';
import MUITableContainer from '@mui/material/TableContainer';
import MUITable from '@mui/material/Table';
import MUITableHead from '@mui/material/TableHead';
import MUITableBody from '@mui/material/TableBody';
import MUITableRow from '@mui/material/TableRow';
import MUITableCell, { tableCellClasses } from '@mui/material/TableCell';
import { ReactNode } from 'react';
import Paper from '@mui/material/Paper';
import { TableProps } from 'gitbook-docs/markdoc/schema/table';

const StyledTableCell = styled(MUITableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.background.default,
    color: theme.palette.text.primary,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

export const Table = ({ children }: TableProps<ReactNode>) => (
  <MUITableContainer component={Paper}>
    <MUITable>{children}</MUITable>
  </MUITableContainer>
);

export const TableHead = MUITableHead;
export const TableBody = MUITableBody;
export const TableH = StyledTableCell;
export const TableR = styled(MUITableRow)(({ theme }) => ({
  '&:nth-of-type(even)': {
    backgroundColor: theme.palette.background.default,
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));
export const TableD = StyledTableCell;

export default Table;
