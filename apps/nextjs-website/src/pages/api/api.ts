// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { Product } from '@/pages/api/types/product';
import { products } from '@/features/products';
import { PageOverview } from '@/pages/api/types/pageOverview';

export function getProductsPaths(
  req: NextApiRequest,
  res: NextApiResponse<readonly Product[]>
) {
  return res.status(200).json(products);
}

// export function getPageOverviewBySlug(slug: string): PageOverview {
//   return {};
// }

