interface Input {
    data: any[];
    count: number;
    limit: number;
    skip: number;
}

interface Output {
    totalPage: number;
    startIndex: number;
    endIndex: number;
    currentPageFilteredCount: number;
}

export const getPaginationDetails = ({ data, count, limit, skip }: Input): Output => {
    const totalPage = Math.ceil(count / limit);
    const hasData = data?.length > 0;
    const startIndex = hasData ? skip + 1 : 0;
    const endIndex = Math.min(skip + data?.length, count);
    const currentPageFilteredCount = data?.length || 0;

    return {
        totalPage: totalPage || 0,
        startIndex: startIndex,
        endIndex: endIndex,
        currentPageFilteredCount
    }
}