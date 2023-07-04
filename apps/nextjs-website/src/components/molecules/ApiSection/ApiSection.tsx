import { useMemo, useState } from 'react';
import { ApiViewer } from '@/components/atoms/ApiViewer';
import { InvertTheme, Menu, MenuItems, Flex, Button } from '@stoplight/mosaic';
import { Product } from '@/lib/types/product';

export type ApiPageProps = {
  readonly product: Product;
  readonly specURLs: {
    url: string;
    hideTryIt?: boolean;
    hideExport?: boolean;
  }[];
};

/* Component from DemoNavbar in Elements */
const ApiSection = ({ product, specURLs }: ApiPageProps) => {
  const [apiDescriptionUrl, setApiDescriptionUrl] = useState(specURLs[0].url);

  const menuItems = useMemo(() => {
    const items: MenuItems = [
      {
        type: 'option_group',
        value: apiDescriptionUrl,
        onChange: setApiDescriptionUrl,
        children: specURLs.map((s) => ({
          ...s,
          title: s.url,
          value: s.url,
        })),
      },
    ];

    return items;
  }, [apiDescriptionUrl, specURLs]);

  const selectedApi = useMemo(
    () =>
      specURLs.find((item) => item?.url === apiDescriptionUrl) || specURLs[0],
    [apiDescriptionUrl, specURLs]
  );

  return (
    <>
      <InvertTheme>
        <Flex h='2xl' shrink={0} px={5} alignItems='center' bg='canvas-pure'>
          <Flex justifyContent='center' w='1/6'>
            {specURLs.length > 1 && (
              <Menu
                closeOnPress
                aria-label='Select the api'
                items={menuItems}
                renderTrigger={({ isOpen }) => (
                  <Button iconRight={['fas', 'caret-down']} active={isOpen}>
                    {selectedApi.url}
                  </Button>
                )}
              />
            )}
          </Flex>
        </Flex>
      </InvertTheme>
      <ApiViewer
        product={product}
        specURL={selectedApi.url}
        hideTryIt={selectedApi.hideTryIt}
      />
    </>
  );
};

export default ApiSection;
