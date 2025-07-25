/******************************************************************************
 *                                                                             *
 * Creation Date : 16/04/2025                                                  *
 *                                                                             *
 * Property : (c) This program, code or item is the Intellectual Property of   *
 * Evelyn Neves Barreto. Any use or copy of this code is prohibited without    *
 * the express written authorization of Evelyn. All rights reserved.           *
 *                                                                             *
 *******************************************************************************/

export type Investment = {
    totalAmount: string;
    fixedIncome: {
        total: string;
        governmentBonds: string;
        privatePensionFixed: string;
        fixedIncomeFunds: string;
    };
    variableIncome: {
        total: string;
        privatePensionVariable: string;
        stockMarket: string;
        investmentFunds: string;
    };
};
