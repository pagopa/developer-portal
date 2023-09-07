import CloseIcon from '@mui/icons-material/Close';
import MenuIcon from '@mui/icons-material/Menu';

interface HamburgerMenuProps {
  open: boolean;
  onOpen: () => void;
  onClose: () => void;
}

export const HamburgerMenu = ({ open, onOpen, onClose }: HamburgerMenuProps) =>
  open ? (
    <CloseIcon
      color="primary"
      cursor="pointer"
      onClick={onClose}
      aria-label="chiudi"
      aria-haspopup="true"
      aria-expanded="true"
    />
  ) : (
    <MenuIcon
      color="primary"
      cursor="pointer"
      onClick={onOpen}
      aria-label="apri"
      aria-haspopup="true"
      aria-expanded="false"
    />
  );
