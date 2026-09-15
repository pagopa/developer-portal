import { Document, Page, View, Text, Image } from '@react-pdf/renderer';
import { useTheme } from '@mui/material';
import { Font } from '@react-pdf/renderer';

Font.register({
  family: 'Titillium Sans Pro',
  fonts: [
    { src: '/fonts/TitilliumWeb-Regular.ttf', fontWeight: 400 },
    { src: '/fonts/TitilliumWeb-Bold.ttf', fontWeight: 700 },
  ],
});

export type CertificateTemplateProps = {
  userName: string;
  webinarName: string;
  createdOn: string;
  title: string;
  subtitle: string;
  createdAt: string;
  certification: string;
  attended: string;
};

const CertificateTemplate = ({
  userName,
  webinarName,
  createdOn,
  title,
  subtitle,
  createdAt,
  certification,
  attended,
}: CertificateTemplateProps) => {
  const { palette } = useTheme();

  return (
    <Document>
      <Page size='A4' orientation='landscape'>
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            width: '100%',
            height: '100%',
          }}
        >
          <View
            style={{
              flex: 1,
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <View
              style={{
                display: 'flex',
                flexDirection: 'column',
                height: '50%',
              }}
            >
              <Text
                style={{
                  paddingTop: '-24px',
                  fontFamily: 'Titillium Sans Pro',
                  fontWeight: 700,
                  fontSize: '80px',
                  color: palette.text.primary,
                }}
              >
                {title}
              </Text>
              <Text
                style={{
                  paddingTop: '-48px',
                  fontFamily: 'Titillium Sans Pro',
                  fontWeight: 700,
                  fontSize: '36px',
                  color: palette.text.primary,
                }}
              >
                {subtitle}
              </Text>
              <Text
                style={{
                  paddingTop: '-48px',
                  fontFamily: 'Titillium Sans Pro',
                  fontWeight: 400,
                  fontSize: '11px',
                  color: palette.text.primary,
                }}
              >
                {createdAt} {createdOn}
              </Text>

              <View
                style={{
                  paddingTop: '24px',
                  display: 'flex',
                  flexDirection: 'row',
                }}
              >
                <Image
                  style={{ width: 'auto', height: '48px' }}
                  src='/images/logo-pagopa-big.png'
                />
                <Text
                  style={{
                    fontFamily: 'Titillium Sans Pro',
                    paddingLeft: '14px',
                    fontWeight: 600,
                    fontSize: '28px',
                    color: palette.grey['300'],
                  }}
                >
                  DevPortal
                </Text>
              </View>
            </View>
            <View
              style={{
                borderBottomWidth: '2px',
                borderBottomColor: palette.grey['100'],
                marginHorizontal: '-24px',
              }}
            />
            <View
              style={{
                paddingTop: '24px',
                display: 'flex',
                flexDirection: 'column',
                height: '50%',
              }}
            >
              <Text
                style={{
                  fontFamily: 'Titillium Sans Pro',
                  fontWeight: 400,
                  fontSize: '11px',
                  color: palette.text.primary,
                }}
              >
                {certification}
              </Text>
              <Text
                style={{
                  fontFamily: 'Titillium Sans Pro',
                  fontWeight: 600,
                  fontSize: '28px',
                  color: palette.text.primary,
                }}
              >
                {userName}
              </Text>

              <Text
                style={{
                  paddingTop: '12px',
                  fontFamily: 'Titillium Sans Pro',
                  fontWeight: 400,
                  fontSize: '11px',
                  color: palette.text.primary,
                }}
              >
                {attended}
              </Text>
              <Text
                style={{
                  fontFamily: 'Titillium Sans Pro',
                  fontWeight: 600,
                  letterSpacing: 0,
                  fontSize: '28px',
                  color: palette.text.primary,
                }}
              >
                {webinarName}
              </Text>
            </View>
          </View>
          <View
            style={{
              display: 'flex',
              height: '100%',
              alignItems: 'flex-end',
              flexDirection: 'column',
            }}
          >
            <Image
              style={{ height: '100%', width: 'auto', objectFit: 'contain' }}
              src='/images/certificate-banner.png'
            />
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default CertificateTemplate;
