import HeroSpace from '@/components/HeroSpace';
import { Container } from '@mui/material';
import Breadcrumbs from './Breadcrumbs';

const Hero = () => (
   <Container maxWidth='lg'>
        <Breadcrumbs />
        <HeroSpace
            title={'Fai firmare documenti e contratti ai cittadini'}
            description={'Quis aute iure reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint obcaecat cupiditat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'}
        />
      </Container>

);

export default Hero;
