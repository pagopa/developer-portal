import ChatMessage, {
  Message,
} from '@/components/atoms/ChatMessage/ChatMessage';
import {
  Box,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Stack,
  useTheme,
} from '@mui/material';
import ChatInputText from '../../atoms/ChatInputText/ChatInputText';
import MenuIcon from '@mui/icons-material/Menu';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Delete, History } from '@mui/icons-material';
import { Query } from '@/lib/chatbot/queries';
import { compact } from 'lodash';

type ChatProps = {
  queries: Query[];
  onSendQuery: (query: string) => null;
};

const Chat = ({ queries, onSendQuery }: ChatProps) => {
  const { palette } = useTheme();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const messages = useMemo(
    () =>
      compact(
        queries.flatMap((q) => [
          q.question && q.queriedAt
            ? {
                text: q.question,
                isQuestion: true,
                timestamp: q.queriedAt,
              }
            : null,
          q.answer && q.createdAt
            ? {
                text: q.answer,
                isQuestion: false,
                timestamp: q.createdAt,
              }
            : null,
        ])
      ),
    [queries]
  ) satisfies Message[];
  const open = Boolean(anchorEl);

  const scrollRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [queries]);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Stack direction={'column'}>
      <Box
        bgcolor={palette.grey[200]}
        width={'auto'}
        sx={{ borderTopLeftRadius: 4, borderTopRightRadius: 4 }}
      >
        <Stack
          direction={'row'}
          justifyContent={'flex-end'}
          paddingX={'0.75rem'}
          paddingY={'0.25rem'}
        >
          <IconButton
            aria-controls='chat-menu'
            aria-haspopup='true'
            aria-expanded={open ? 'true' : undefined}
            onClick={handleClick}
          >
            <MenuIcon />
          </IconButton>
          <Menu
            id='chat-menu'
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            MenuListProps={{
              'aria-labelledby': 'chat-button',
            }}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
          >
            <MenuItem onClick={handleClose}>
              <ListItemIcon>
                <Delete fontSize='small' />
              </ListItemIcon>
              <ListItemText>Delete</ListItemText>
            </MenuItem>
            <MenuItem onClick={handleClose}>
              <ListItemIcon>
                <History fontSize='small' />
              </ListItemIcon>
              <ListItemText>Cronologia Chat</ListItemText>
            </MenuItem>
          </Menu>
        </Stack>
      </Box>
      <Box
        bgcolor={palette.grey[300]}
        sx={{
          borderBottomLeftRadius: 4,
          borderBottomRightRadius: 4,
          padding: 2,
        }}
      >
        <Stack
          direction={'column'}
          minHeight='50vh'
          maxHeight='50vh'
          justifyContent='space-between'
        >
          <Stack
            direction={'column'}
            sx={{
              overflow: 'auto',
              paddingRight: '0.5rem',
            }}
          >
            {messages.map((message, index) => (
              <Stack
                key={index}
                ref={index === message.text.length - 1 ? scrollRef : null}
                direction={'row'}
                width={'100%'}
                justifyContent={message.isQuestion ? 'flex-end' : 'flex-start'}
                marginBottom={'1rem'}
              >
                <ChatMessage {...message} />
              </Stack>
            ))}
          </Stack>
          <Box sx={{ paddingTop: '1rem' }}>
            <ChatInputText onSubmit={onSendQuery} />
          </Box>
        </Stack>
      </Box>
    </Stack>
  );
};

export default Chat;
