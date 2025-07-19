export type Transaction = {
    id?: string;
    month: string;
    date: string;
    type: string;
    amount: string;
    investmentType?: string;
    attachmentFileId?: string;
    isNegative?: boolean;
};
