const pagoPaOrgId = process.env['PAGOPA_ORG_ID'];
const token = process.env['GITBOOK_API_KEY'];

export type Collection = {
    object: string;
    id: string;
    title: string;
    path?: string;
    visibility: string;
    collection?: string;
    publishingType?: string;
    primarySpace?: string;
}

export type Next = {
    page: string;
}

export type CollectionList = {
    items: Collection[];
    next?: Next;
}

export const getCollections = async (): Promise<CollectionList> => {
    const getCollectionsReq = await fetch(`https://api.gitbook.com/v1/orgs/${pagoPaOrgId}/collections`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    const getCollectionsResp = await getCollectionsReq.json();
    return {
        ...getCollectionsResp
    };
}

export const getProductDetail = async (id: string): Promise<Collection> => {
    const productDetailReq = await fetch(`https://api.gitbook.com/v1/collections/${id}`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    const productDetailResp = await productDetailReq.json();
    return {
        ...productDetailResp
    };
}
