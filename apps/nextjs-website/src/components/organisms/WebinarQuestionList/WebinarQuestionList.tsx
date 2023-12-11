'use client';
import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Webinar } from '@/lib/types/webinar';
import useSWR from 'swr';
import { getWebinarQuestionList } from '@/lib/webinarApi';

type Props = {
  webinar: Webinar;
};

const WebinarQuestionList = (props: Props) => {
  // listWebinarQuestion
  const { data, error } = useSWR(props.webinar.slug, getWebinarQuestionList, {
    refreshInterval: 2500,
  });

  if (error) return <div>Failed to load</div>;
  else if (!data) return <div>Loading...</div>;
  else
    return (
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label='simple table'>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Question</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((item) => (
              <TableRow
                key={`${item.webinarId}${item.createdAt.toISOString()}`}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component='th' scope='row'>
                  {item.givenName} {item.familyName}
                </TableCell>
                <TableCell>{item.question}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
};

export default WebinarQuestionList;
