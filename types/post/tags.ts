export type GetTagsRequest = {
    pageNo?: number;
    pageSize?: number;
    tagName?: string;
    categoryId?: string;
}

export type GetTagsResponse = {
    tagName: string;
    tagUrl: string;
    categoryId: string;
    createTime: string;
    id: string;
    updateTime: string;
    description: string;
}