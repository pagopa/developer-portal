import Products from "@/components/Products";
import { getCollections } from "@/app/gitbook/collections";

export default async function ProductList() {
    const collections = await getCollections();
    return (
        <>
            <h1>Collections</h1>
            <Products list={ collections } />
        </>
    );
}
