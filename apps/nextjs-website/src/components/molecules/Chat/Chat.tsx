import ChatMessage from '@/components/atoms/ChatMessage/ChatMessage';
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
import React from 'react';
import { Delete, History } from '@mui/icons-material';

type ChatProps = {
  chatMessages: { message: string; sender?: string; timestamp: string }[];
};

const Chat = ({ chatMessages }: ChatProps) => {
  const { palette } = useTheme();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Stack direction={'column'} height={'100%'}>
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
              'aria-labelledby': 'basic-button',
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
        sx={{ borderBottomLeftRadius: 4, borderBottomRightRadius: 4 }}
      >
        <Stack
          direction={'column'}
          height={'500px'}
          sx={{
            padding: '1rem',
          }}
        >
          <Stack
            direction={'column'}
            sx={{
              overflow: 'auto',
              paddingRight: '0.5rem',
            }}
          >
            {chatMessages.map((chatMessage, index) => (
              <Stack
                key={index}
                direction={'row'}
                width={'100%'}
                justifyContent={chatMessage.sender ? 'flex-end' : 'flex-start'}
                marginBottom={'1rem'}
              >
                <ChatMessage {...chatMessage} />
              </Stack>
            ))}
          </Stack>
          <Box sx={{ paddingTop: '1rem' }}>
            <ChatInputText
              onSubmit={(message) => {
                console.log(message);
                return null;
              }}
            />
          </Box>
        </Stack>
      </Box>
    </Stack>
  );
};

export default Chat;
