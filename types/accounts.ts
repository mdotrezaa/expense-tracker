export type Account = {
  id: string
  name: string
  type: "cash" | "bank" | "ewallet" | "credit"
}
// types/transfer.ts
export type Transfer = {
  id: string
  from: string
  to: string
  amount: number
  date: string
}
// types/goal.ts
export type Goal = {
  id: string;
  name: string;
  target: number;       // target amount
  saved: number;        // current saved amount
  accountId: string;    // which account is funding it
};
