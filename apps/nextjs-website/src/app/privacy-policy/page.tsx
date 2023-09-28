import SiteHeader from '@/components/molecules/SiteHeader/SiteHeader';
import { getProducts } from '@/lib/api';
import { Box } from '@mui/material';

const privacyPolicyScript = `
<!-- OneTrust Privacy Notice start -->
 <!-- Container in which the privacy notice will be rendered -->
 <div id="otnotice-119e178b-550d-4327-a0ee-29ff8cf6701c" class="otnotice"></div>

 <script src="https://privacyportalde-cdn.onetrust.com/privacy-notice-scripts/otnotice-1.0.min.js" type="text/javascript" charset="UTF-8" id="otprivacy-notice-script">
   settings="eyJjYWxsYmFja1VybCI6Imh0dHBzOi8vcHJpdmFjeXBvcnRhbC1kZS5vbmV0cnVzdC5jb20vcmVxdWVzdC92MS9wcml2YWN5Tm90aWNlcy9zdGF0cy92aWV3cyJ9"
  </script>

 <script type="text/javascript" charset="UTF-8">
   // To ensure external settings are loaded, use the Initialized promise:
   OneTrust.NoticeApi.Initialized.then(function() {
    OneTrust.NoticeApi.LoadNotices(["https://privacyportalde-cdn.onetrust.com/77f17844-04c3-4969-a11d-462ee77acbe1/privacy-notices/119e178b-550d-4327-a0ee-29ff8cf6701c.json"]);
   });
  </script>
 
 <!-- OneTrust Privacy Notice end -->
`;

const PrivacyPolicy = () => {
  const products = [...getProducts()];

  return (
    <>
      <SiteHeader products={products} />
      <Box mt={5}>
        <div
          id='privacy-policy-script'
          dangerouslySetInnerHTML={{
            __html: privacyPolicyScript,
          }}
        />
      </Box>
    </>
  );
};

export default PrivacyPolicy;
