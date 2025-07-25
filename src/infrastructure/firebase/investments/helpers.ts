/******************************************************************************
 *                                                                             *
 * Creation Date : 16/04/2025                                                  *
 *                                                                             *
 * Property : (c) This program, code or item is the Intellectual Property of   *
 * Evelyn Neves Barreto. Any use or copy of this code is prohibited without    *
 * the express written authorization of Evelyn. All rights reserved.           *
 *                                                                             *
 *******************************************************************************/

export const parseCurrency = (value: string): number => {
    return (
        parseFloat(value.replace(/[R$\.\s]/g, "").replace(",", ".")) || 0
    );
};

export const formatCurrency = (value: number, isNegative?: boolean): string => {
    const prefix = isNegative ? "- R$" : "R$";
    return `${prefix} ${value.toLocaleString("pt-BR", {
        minimumFractionDigits: 2,
    })}`;
};

export const getEmptyInvestments = () => ({
    totalAmount: 0,
    fixedIncome: {
        total: 0,
        governmentBonds: 0,
        privatePensionFixed: 0,
    },
    variableIncome: {
        total: 0,
        investmentFunds: 0,
        privatePensionVariable: 0,
        stockMarket: 0,
    },
});

export const parseInvestmentData = (data: any) => ({
    totalAmount: parseCurrency(data.totalAmount),
    fixedIncome: {
        total: parseCurrency(data.fixedIncome.total),
        governmentBonds: parseCurrency(data.fixedIncome.governmentBonds),
        privatePensionFixed: parseCurrency(data.fixedIncome.privatePensionFixed),
    },
    variableIncome: {
        total: parseCurrency(data.variableIncome.total),
        investmentFunds: parseCurrency(data.variableIncome.investmentFunds),
        privatePensionVariable: parseCurrency(data.variableIncome.privatePensionVariable),
        stockMarket: parseCurrency(data.variableIncome.stockMarket),
    },
});

export const toCurrencyData = (data: any) => ({
    totalAmount: formatCurrency(data.totalAmount),
    fixedIncome: {
        total: formatCurrency(data.fixedIncome.total),
        governmentBonds: formatCurrency(data.fixedIncome.governmentBonds),
        privatePensionFixed: formatCurrency(data.fixedIncome.privatePensionFixed),
    },
    variableIncome: {
        total: formatCurrency(data.variableIncome.total),
        investmentFunds: formatCurrency(data.variableIncome.investmentFunds),
        privatePensionVariable: formatCurrency(data.variableIncome.privatePensionVariable),
        stockMarket: formatCurrency(data.variableIncome.stockMarket),
    },
});
