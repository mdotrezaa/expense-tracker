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
