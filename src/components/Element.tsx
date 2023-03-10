import { Element } from '@/domain/product';
import { Typography } from '@mui/material';
import Cards from '@/components/Cards';

const PageElement = (props: Element) => {
  switch (props.type) {
    case 'h1':
    case 'h2':
    case 'h3':
      return <Typography variant={props.type}>{props.text}</Typography>;
    case 'paragraph':
      return <Typography variant={'body2'}>{props.text}</Typography>;
    case 'cards':
      return Cards(props);
  }
};

export default PageElement;
