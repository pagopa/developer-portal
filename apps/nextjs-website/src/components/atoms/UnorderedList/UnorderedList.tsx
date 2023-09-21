'use client';
import { FC } from 'react';
import { Typography } from '@mui/material';

export type UnorderedListProps = {
  readonly listItems: ReadonlyArray<string>;
};

export const UnorderedList: FC<UnorderedListProps> = ({
  listItems,
}: UnorderedListProps) => {
  return (
    listItems?.length && (
      <ul
        style={{
          listStyleType: 'square',
          lineHeight: '28px',
          margin: '8px 0 0 0',
          paddingLeft: '26px',
        }}
      >
        {listItems.map((item, index) => (
          <li key={index}>
            <Typography variant={'body2'}>{item}</Typography>
          </li>
        ))}
      </ul>
    )
  );
};
