import { styled, useTheme } from '@mui/material/styles';
import MUITableContainer from '@mui/material/TableContainer';
import MUITable from '@mui/material/Table';
import MUITableHead from '@mui/material/TableHead';
import MUITableBody from '@mui/material/TableBody';
import MUITableRow from '@mui/material/TableRow';
import MUITableCell, { TableCellProps } from '@mui/material/TableCell';
import { Fragment, ReactNode } from 'react';
import { TableProps } from 'gitbook-docs/markdoc/schema/table';
import { Checkbox } from '@mui/material';

export const Table = ({ children }: TableProps<ReactNode>) => (
  <MUITableContainer
    component={'div'}
    sx={{
      maxWidth: {
        xs: 'calc(100vw - 100px)',
        lg: 'calc(100vw - 700px)',
      },
    }}
  >
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
  fontSize: 18,
  'span.MuiTypography-body1': {
    fontSize: '1rem !important',
  },
}));
export const TableR = MUITableRow;

export const TableH = styled(MUITableCell)(({ theme }) => ({
  border: `1px solid ${theme.palette.divider} !important`,
  fontSize: 18,
  fontWeight: 600,
  padding: '0.5rem 1rem',
}));

export const TableD = (props: TableCellProps) => {
  const theme = useTheme();
  if (props.children === 'true' || props.children === 'false')
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
        ) : props.children === 'false' ? (
          <Checkbox disabled />
        ) : (
          props.children || ''
        )}
      </MUITableCell>
    );

  return (
    <MUITableCell
      sx={{
        border: `1px solid ${theme.palette.divider}`,
        padding: '0.5rem 1rem',
      }}
      {...props}
    >
      {Array.isArray(props.children)
        ? props.children.map((children, index) => (
            <Fragment key={index}>{children}</Fragment>
          ))
        : props.children}
    </MUITableCell>
  );
};

export default Table;
