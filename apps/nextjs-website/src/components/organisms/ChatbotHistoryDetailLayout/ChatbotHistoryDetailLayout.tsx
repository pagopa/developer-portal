import ChatbotHistoryNavigationMenu, {
  SessionNavigationData,
} from '@/components/atoms/ChatbotHistoryNavigationMenu/ChatbotHistoryNavigationMenu';
import ChatbotHistoryMessages from '@/components/molecules/ChatbotHistoryMessages/ChatbotHistoryMessages';
import { longDateOptions } from '@/config';
import { Query } from '@/lib/chatbot/queries';
import { Delete } from '@mui/icons-material';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Stack,
  Typography,
} from '@mui/material';
import { isEmpty } from 'fp-ts/lib/Array';
import { useTranslations, useFormatter } from 'next-intl';
import React, { useState } from 'react';

type ChatbotHistoryDetailLayoutProps = {
  queries: Query[];
  userName: string;
  previousSession?: SessionNavigationData;
  nextSession?: SessionNavigationData;
  onDeleteChatSession: (sessionId: string, sessionDate: string | null) => null;
};

const ChatbotHistoryDetailLayout = ({
  queries,
  userName,
  previousSession,
  nextSession,
  onDeleteChatSession,
}: ChatbotHistoryDetailLayoutProps) => {
  const [open, setOpen] = useState(false);
  const t = useTranslations();
  const format = useFormatter();

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  if (isEmpty(queries)) {
    return (
      <Typography variant='h4'>{t('chatBot.thereAreNoMessages')}</Typography>
    );
  }

  const firstQuery = queries[0];
  const date = format.dateTime(new Date(firstQuery.queriedAt), longDateOptions);

  return (
    <Stack direction='column' spacing={2}>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <DialogTitle id='alert-dialog-title'>
          {t('chatBot.deleteHeader')}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id='alert-dialog-description'>
            {t('chatBot.confirmDelete')}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button variant='outlined' onClick={handleClose}>
            {t('chatBot.deleteDismiss')}
          </Button>
          <Button
            variant='contained'
            onClick={() =>
              onDeleteChatSession(firstQuery.sessionId, firstQuery.createdAt)
            }
            autoFocus
          >
            {t('chatBot.deleteConfirm')}
          </Button>
        </DialogActions>
      </Dialog>
      <Typography variant='h4'>{t('chatBot.sessionTitle') + date}</Typography>
      <Stack direction='row' justifyContent='flex-end'>
        <Button
          variant='outlined'
          startIcon={<Delete />}
          color='error'
          sx={{ display: { xs: 'none', sm: 'flex' }, maxWidth: '162px' }}
          onClick={handleClickOpen}
        >
          {t('chatBot.deleteChat')}
        </Button>
      </Stack>
      <ChatbotHistoryMessages queries={queries} userName={userName} />
      <Box
        sx={{
          display: { xs: 'flex', md: 'none' },
          justifyContent: 'center',
          paddingTop: '2rem',
          width: '100%',
        }}
      >
        <Button
          variant='outlined'
          startIcon={<Delete />}
          color='error'
          onClick={() =>
            onDeleteChatSession(firstQuery.sessionId, firstQuery.createdAt)
          }
        >
          {t('chatBot.deleteChat')}
        </Button>
      </Box>
      <Box
        paddingTop='3rem'
        sx={{ display: { xs: 'none', md: 'block' }, width: '100%' }}
      >
        <ChatbotHistoryNavigationMenu
          previousSession={previousSession}
          nextSession={nextSession}
        />
      </Box>
    </Stack>
  );
};

export default ChatbotHistoryDetailLayout;
