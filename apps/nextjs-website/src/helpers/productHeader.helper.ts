import { Product } from '@/lib/types/product';
import { MenuDropdownProp } from '@/editorialComponents/Header/components/MenuDropdown';
import { Theme } from '@/editorialComponents/types/components';

export function productToMenuItems(
  product: Product,
  path: string,
  theme: Theme
): readonly MenuDropdownProp[] {
  // total possible items and corresponding links are:
  // Overview: app-io/overview
  // Quickstart Guide: app-io/quick-start
  // API: app-io/api or app-io/api/main if there's only one api in the list
  // Tutorials: app-io/tutorials
  // Guides: app-io/guides

  return [
    {
      label: 'Overview',
      href: `/${product.slug}/overview`,
      active: path.startsWith(`/${product.slug}/overview`),
      theme,
    },
    // if there's quiskstart guide data, add it to the menu
    product.quickstart_guide?.data
      ? {
          label: 'Quickstart Guide',
          href: `/${product.slug}/quick-start`,
          active: path.startsWith(`/${product.slug}/quick-start`),
          theme,
        }
      : null,
    // if there's api data, and consists of only one item in the list, add it to the menu
    product.api_data_list_page?.data &&
    product.api_data_list_page.data.attributes.apiData.data.length === 1
      ? {
          label: 'API',
          href: `/${product.slug}/api/${
            product.api_data_list_page.data.attributes.apiData.data[0]
              .attributes.apiRestDetail?.slug ??
            product.api_data_list_page.data.attributes.apiData.data[0]
              .attributes.apiSoapUrl
          }`,
          active: path.startsWith(`/${product.slug}/api/main`),
          theme,
        }
      : null,
    // if there's api data, and consists of more than one item in the list, add it to the menu
    product.api_data_list_page?.data &&
    product.api_data_list_page.data.attributes.apiData.data.length > 1
      ? {
          label: 'API',
          href: `/${product.slug}/api`,
          active: path.startsWith(`/${product.slug}/api`),
          theme,
        }
      : null,
    // if there's tutorials data, add it to the menu
    product.tutorial_list_page?.data
      ? {
          label: 'Tutorials',
          href: `/${product.slug}/tutorials`,
          active: path.startsWith(`/${product.slug}/tutorials`),
          theme,
        }
      : null,
    // if there's guides data, add it to the menu
    product.guide_list_page?.data
      ? {
          label: 'Guides',
          href: `/${product.slug}/guides`,
          active: path.startsWith(`/${product.slug}/guides`),
          theme,
        }
      : null,
  ].filter((item) => item !== null) as readonly MenuDropdownProp[];
}
