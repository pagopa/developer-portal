import { Box } from '@mui/material';

type VimeoPlayerProps = {
  playerSrc: string;
};

const VimeoPlayer = ({ playerSrc }: VimeoPlayerProps) => {
  return (
    <Box sx={{ position: 'relative', paddingBottom: '56.25%' }}>
      <iframe
        src={playerSrc}
        allow='autoplay; fullscreen; picture-in-picture'
        style={{
          border: 'none',
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
        }}
      ></iframe>
    </Box>
  );
};

export default VimeoPlayer;
