import { Webinar } from '@/lib/types/webinar';
import EContainer from '@/editorialComponents/EContainer/EContainer';
import { Box, useTheme } from '@mui/material';
import VimeoPlayer from '@/components/atoms/VimeoPlayer/VimeoPlayer';

type WebinarPlayerSectionProps = {
  webinar: Webinar;
};
const WebinarPlayerSection = ({ webinar }: WebinarPlayerSectionProps) => {
  const { palette } = useTheme();

  return (
    webinar.playerSrc && (
      <div style={{ backgroundColor: palette.grey[50] }}>
        <EContainer>
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              justifyContent: 'left',
              alignContent: 'stretch',
              flexGrow: 1,
              gap: 3,
              marginBottom: 10,
            }}
          >
            <Box sx={{ width: { md: '66%' } }}>
              <VimeoPlayer playerSrc={webinar.playerSrc} />
            </Box>
            <Box> {/* TODO: Insert Form */} </Box>
          </Box>
        </EContainer>
      </div>
    )
  );
};

export default WebinarPlayerSection;
