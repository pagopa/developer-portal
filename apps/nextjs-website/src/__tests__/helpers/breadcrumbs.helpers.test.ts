import {
  pathToBreadcrumbs,
  productPageToBreadcrumbs,
} from '../../helpers/breadcrumbs.helpers';
import { mockProduct } from '../fixtures/mockProduct';
import { Path } from '@/lib/types/path';

it('should create breadcrumbs successfully', () => {
  const homepageTitle = 'home title';
  const product = mockProduct;
  const path = product.subpaths.tutorials?.path;
  const breadcrumbsPaths = productPageToBreadcrumbs({
    homepageTitle,
    product,
    path,
  });
  expect(breadcrumbsPaths.length).toEqual(3);
  expect(breadcrumbsPaths[0].path).toEqual('/');
  expect(breadcrumbsPaths[0].name).toEqual(homepageTitle);
  expect(breadcrumbsPaths[1].path).toEqual(product.subpaths.overview.path);
  expect(breadcrumbsPaths[1].name).toEqual(product.name);
  expect(breadcrumbsPaths[2].path).toEqual(path);
  expect(breadcrumbsPaths[2].name).toEqual(product.subpaths.tutorials?.name);
  const paths: readonly Path[] = [
    {
      name: 'test_name',
      path: 'test_path',
    },
    {
      name: 'test_2_name',
      path: 'test_2_path',
    },
  ];

  const breadcrumbsPathsWithPaths = productPageToBreadcrumbs({
    homepageTitle,
    product,
    path,
    paths,
  });
  expect(breadcrumbsPathsWithPaths.length).toEqual(3 + paths.length);
  const breadcrumbsSubpaths = breadcrumbsPathsWithPaths.slice(
    3,
    breadcrumbsPathsWithPaths.length
  );
  expect(breadcrumbsSubpaths).toEqual(paths);
});

it('should convert path url to breadcrumbs Path array', () => {
  const wrongPathUrl = '/test/wrong/path';
  const emptyArray = pathToBreadcrumbs(wrongPathUrl);
  expect(emptyArray.length).toBe(0);

  const rightPathUrl = '/test/right/path/some/test-title';
  const pathArray = pathToBreadcrumbs(rightPathUrl);
  expect(pathArray.length).toBe(1);
  expect(pathArray[0].path).toEqual(rightPathUrl);
  expect(pathArray[0].name).toEqual('test title');
});
