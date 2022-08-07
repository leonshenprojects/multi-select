import type { NextApiRequest, NextApiResponse } from "next";
import productGroupData from "../../lib/productGroupData";

export type ProductGroupData = {
  productGroups: Array<string>;
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<ProductGroupData>
) {
  if (req.method === "GET") {
    return res.status(200).json({ productGroups: productGroupData.data });
  }

  return res.status(405);
}
