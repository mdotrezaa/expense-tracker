// types/expense.ts
export type Expense = {
  id: string
  title: string
  amount: number
  type: "income" | "expense"
  category?: string
  account: string        // primary account
  toAccount?: string     // only for income (optional)
  date: string
}
