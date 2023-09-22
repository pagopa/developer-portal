import { Box } from '@mui/material';

const TermsOfServiceScript = `
  <!-- OneTrust Privacy Notice start -->
  <!-- Container in which the privacy notice will be rendered -->
  <div id="otnotice-8fcc2abf-0ec6-4c6b-b585-5d73dda76e2f" class="otnotice"></div>
 
  <script src="https://privacyportalde-cdn.onetrust.com/privacy-notice-scripts/otnotice-1.0.min.js" type="text/javascript" charset="UTF-8" id="otprivacy-notice-script">
    settings="eyJjYWxsYmFja1VybCI6Imh0dHBzOi8vcHJpdmFjeXBvcnRhbC1kZS5vbmV0cnVzdC5jb20vcmVxdWVzdC92MS9wcml2YWN5Tm90aWNlcy9zdGF0cy92aWV3cyJ9"
  </script>
 
  <script type="text/javascript" charset="UTF-8">
    // To ensure external settings are loaded, use the Initialized promise:
    OneTrust.NoticeApi.Initialized.then(function() {
      OneTrust.NoticeApi.LoadNotices(["https://privacyportalde-cdn.onetrust.com/77f17844-04c3-4969-a11d-462ee77acbe1/privacy-notices/8fcc2abf-0ec6-4c6b-b585-5d73dda76e2f.json"]);
    });
  </script>
   
  <!-- OneTrust Privacy Notice end -->
`;

const TermsOfService = () => {
  return (
    <Box mt={5}>
      <div
        id='terms-of-service-script'
        dangerouslySetInnerHTML={{
          __html: TermsOfServiceScript,
        }}
      />
    </Box>
  );
};

export default TermsOfService;
