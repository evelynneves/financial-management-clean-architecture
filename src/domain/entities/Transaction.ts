/******************************************************************************
 *                                                                             *
 * Creation Date : 16/04/2025                                                  *
 *                                                                             *
 * Property : (c) This program, code or item is the Intellectual Property of   *
 * Evelyn Neves Barreto. Any use or copy of this code is prohibited without    *
 * the express written authorization of Evelyn. All rights reserved.           *
 *                                                                             *
 *******************************************************************************/

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
