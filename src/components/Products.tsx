import Product from "@/components/Product";
import { PropertyWithList } from "@/app/models/propertyWithList";
import { Collection } from "@/app/gitbook/collections";
import Link from "next/link";

const Products = ({ list }: PropertyWithList<Collection>) => {
    return (
        <>
            <ul>
                {
                    list.map((collection) => (
                        <li key={ collection.id }>
                            <Link href={`/products/${collection.id}`}>
                                <div>
                                    <Product
                                        name={ collection.title }
                                        id={ collection.id }
                                        isVisible={ collection.visibility }
                                        key={ collection.id }
                                    />
                                </div>
                            </Link>
                        </li>
                        )
                    )
                }
            </ul>
        </>
    )
}

export default Products;
