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
    items: ReadonlyArray<Collection>;
    next?: Next;
}

const makeHttpCall = async (pageId?: string): Promise<CollectionList> => {
    const url = pageId ? `https://api.gitbook.com/v1/orgs/${pagoPaOrgId}/collections?page=${pageId}` : `https://api.gitbook.com/v1/orgs/${pagoPaOrgId}/collections`;
    const getCollectionsReq = await fetch(url, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    return await getCollectionsReq.json();
}

export const getCollections = async (pageId?: string): Promise<CollectionList['items']> => {
    let collections: Collection[] = [];
    do {
        const collList: CollectionList = await makeHttpCall(pageId);
        pageId = collList.next?.page;
        collections = collections.concat(collList.items);
    } while (pageId);
    return collections;
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
