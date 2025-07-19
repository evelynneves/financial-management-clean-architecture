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
