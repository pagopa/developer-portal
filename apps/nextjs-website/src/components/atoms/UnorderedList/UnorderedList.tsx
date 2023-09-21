'use client';
import { FC } from 'react';
import styles from './styles.module.css';
import { Typography } from '@mui/material';

export type UnorderedListProps = {
  readonly listItems: ReadonlyArray<string>;
};

export const UnorderedList: FC<UnorderedListProps> = ({
  listItems,
}: UnorderedListProps) => {
  return (
    listItems?.length && (
      <ul className={styles.UnorderedList}>
        {listItems.map((item, index) => (
          <li key={index}>
            <Typography variant={'body2'}>{item}</Typography>
          </li>
        ))}
      </ul>
    )
  );
};
