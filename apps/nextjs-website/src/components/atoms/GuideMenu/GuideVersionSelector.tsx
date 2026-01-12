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
        border: '0.5px solid grey',
        margin: '5px 0 30px 30px',
        padding: '0px 8px',
        minHeight: 32,
        height: 32,
        lineHeight: 1,
        fontSize: '14px',
        width: '150px',
        backgroundColor: 'white',
        justifyContent: 'space-between',
      }}
      menuItemStyle={{
        paddingY: 0.5,
        minHeight: 28,
        fontSize: '14px',
        lineHeight: 1.2,
      }}
      menuStyle={{
        style: {
          width: '347px',
          maxWidth: '347px',
          left: 0,
          right: 0,
        },
      }}
    />
  );
};

export default GuideVersionSelector;
