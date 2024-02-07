import ProductLayout, {
  ProductLayoutProps,
} from '@/components/organisms/ProductLayout/ProductLayout';
import { getGuide, getGuidePaths } from '@/lib/api';
import { Product } from '@/lib/types/product';
import { Box } from '@mui/material';
import React from 'react';
import GuideMenu from '@/components/atoms/GuideMenu/GuideMenu';
import GitBookContent from '@/components/organisms/GitBookContent/GitBookContent';
import GuideInPageMenu from '@/components/organisms/GuideInPageMenu/GuideInPageMenu';
import { FragmentProvider } from '@/components/organisms/FragmentProvider/FragmentProvider';
import {
  gitBookPagesWithTitle,
  spaceToPrefixMap,
  urlReplacesMap,
} from '@/_contents/products';
import { translations } from '@/_contents/translations';
import { ParseContentConfig } from 'gitbook-docs/parseContent';
import { Metadata } from 'next';
import { makeMetadata } from '@/helpers/metadata.helpers';
import { boolean } from 'io-ts';

type Params = {
  productSlug: string;
  productGuidePage: Array<string>;
};

export async function generateStaticParams() {
  return getGuidePaths().map(({ slug, guidePaths }) => ({
    productSlug: slug,
    productGuidePage: guidePaths,
  }));
}

type ProductGuidePageProps = {
  product: Product;
  guide: { name: string; path: string };
  version: {
    name: string;
    path: string;
  };
  versions: {
    name: string;
    path: string;
  }[];
  path: string;
  pathPrefix: string;
  isIndex: boolean;
  menu: string;
  body: string;
  bodyConfig: ParseContentConfig;
} & ProductLayoutProps;

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const {
    page: { path, title },
  } = await getGuide(params?.productSlug, params?.productGuidePage ?? ['']);

  return makeMetadata({
    title,
    url: path,
  });
}

const Page = async ({ params }: { params: Params }) => {
  const guideProps = await getGuide(
    params?.productSlug,
    params?.productGuidePage ?? ['']
  );

  const { product, page, guide, version, versions, source, bannerLinks } =
    guideProps;
  const props: ProductGuidePageProps = {
    ...page,
    product,
    guide,
    version,
    versions: Array.from(versions),
    bannerLinks,
    pathPrefix: source.pathPrefix,
    bodyConfig: {
      isPageIndex: page.isIndex,
      pagePath: page.path,
      assetsPrefix: source.assetsPrefix,
      gitBookPagesWithTitle,
      spaceToPrefix: spaceToPrefixMap,
      urlReplaces: urlReplacesMap,
    },
  };

  return (
    <ProductLayout
      product={props.product}
      path={props.path}
      bannerLinks={props.bannerLinks}
      showBreadcrumbs={false}
    >
      <FragmentProvider>
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', lg: 'row' },
            margin: '0 auto',
            maxWidth: '1900px',
          }}
        >
          <GuideMenu
            menu={props.menu}
            assetsPrefix={props.bodyConfig.assetsPrefix}
            linkPrefix={props.pathPrefix}
            guideName={props.guide.name}
            versionName={props.version.name}
            versions={props.versions}
          />
          <Box
            sx={{
              margin: '0 auto',
              padding: '56px 40px',
              flexGrow: { lg: 1 },
              maxWidth: {
                xs: '100%',
                lg: '1008px',
              },
            }}
          >
          <div style={{display: 'flex', justifyContent: 'space-between'}}>
          <pre style={{maxHeight: 1000, overflow: 'auto'}}>{props.body}</pre>
          <pre style={{maxHeight: 1000, overflow: 'auto'}}>{destructureSwagger(props.body)}</pre>
          </div>
          
          <GitBookContent content={destructureSwagger(props.body)} config={props.bodyConfig} />
          </Box>
          <Box
            sx={{
              display: { xs: 'none', lg: 'initial' },
              position: 'relative',
              padding: { lg: '80px 64px' },
              width: { lg: '270px' },
            }}
          >
            <Box
              sx={{
                position: 'sticky',
                maxWidth: '270px',
                top: 144,
              }}
            >
              <GuideInPageMenu
                assetsPrefix={props.bodyConfig.assetsPrefix}
                pagePath={props.path}
                inPageMenu={props.body}
                title={translations.productGuidePage.onThisPage}
              />
            </Box>
          </Box>
        </Box>
      </FragmentProvider>
    </ProductLayout>
  );
};

export default Page;

const destructureSwagger = (body: string) => {

  // splitto il body in righe e cerco le coppie di tag {% swagger-* e {% endswagger-*

  //  se una volta aperto un blocco swagger trovo un blocco che non inizia con {% swagger mi salvo il contenuto delle cose non swagger e lo rimetto dopo la chiusura del blocco swagger

  const lines = body.split('\n')
  let swaggerBlokDepth = 0
  let newLines: string[] = []
  let isCutting = false;
  var wrongBlocksBuffer = []

  // itero le righe
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    //console.log('line', line)

    // cerco se la riga inizia con {% swagger
    if (line.includes('{% swagger')) {
      swaggerBlokDepth++
      isCutting = false
      //console.log('trovato swagger', swaggerBlokDepth)
    }

    // cerco se la riga inizia con {% endswagger
    if (line.includes('{% endswagger')) {
      swaggerBlokDepth--
      isCutting = false
      //console.log('trovato endswagger', swaggerBlokDepth)
    }

    // se sono dentro un blocco swagger (swaggerBlokDepth > 0) e la riga non inizia con {% swagger o {% endswagger ma inizia con {% allora taglio
    if (swaggerBlokDepth > 0 && !line.includes('{% swagger') && !line.includes('{% endswagger') && line.includes('{%')) {
      //console.log('taglio', line)
      isCutting = true;
    }

    if(isCutting) {
      wrongBlocksBuffer.push(line)
    } else {
      newLines.push(line)

      if(wrongBlocksBuffer.length > 0 && swaggerBlokDepth === 0 && line.includes('{% endswagger ')) {
        newLines = newLines.concat(wrongBlocksBuffer)
        wrongBlocksBuffer = []
      }

    }
  }



  return newLines.join('\n')
}