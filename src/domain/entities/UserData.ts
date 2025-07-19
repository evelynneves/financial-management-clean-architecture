import { Transaction } from "./Transaction";
import { Investment } from "./Investment";

export type UserData = {
    transactions: Transaction[];
    investments: Investment | null;
};
