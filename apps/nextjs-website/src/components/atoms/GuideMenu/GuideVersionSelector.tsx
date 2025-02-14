import Dropdown from '@/components/atoms/Dropdown/Dropdown';
import { ExpandLess, ExpandMore } from '@mui/icons-material';
import { useTheme } from '@mui/material';
import { useTranslations } from 'next-intl';

export type GuideVersionSelectorProps = {
  versionName: string;
  versions: { name: string; path: string }[];
};

const GuideVersionSelector = ({
  versionName,
  versions,
}: GuideVersionSelectorProps) => {
  const { palette } = useTheme();
  const t = useTranslations();

  return (
    <Dropdown
      label={`${t('shared.version')} ${versionName}`}
      items={versions.map((version) => ({
        href: version.path,
        label: version.name,
      }))}
      icons={{ opened: <ExpandLess />, closed: <ExpandMore /> }}
      buttonStyle={{
        color: palette.action.active,
        display: 'flex',
        justifyContent: 'space-between',
        padding: '16px 32px',
      }}
      menuStyle={{
        style: {
          width: '347px',
          maxWidth: '347px',
          left: 0,
          right: 0,
        },
      }}
      menuAnchorOrigin={{
        vertical: 'bottom',
        horizontal: 'center',
      }}
    />
  );
};

export default GuideVersionSelector;
