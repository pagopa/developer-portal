import Product from "@/components/Product";
import { getProductDetail } from "@/app/gitbook/collections";

//@ts-ignore
export default async function Page({ params }) {
    const { productId } = params;
    const product = await getProductDetail(productId);


    return (<Product
        name={ product.title }
        id={ product.id }
        isVisible={ product.visibility }
        />
    );
}
