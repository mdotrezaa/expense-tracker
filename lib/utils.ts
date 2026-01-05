import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const getMonthKey = (date: Date | string) =>
  new Date(date).toISOString().slice(0, 7) // YYYY-MM

/// lib/utils.ts
import { Expense } from "@/types/expense"
import { Transfer } from "@/types/accounts"

export function getAccountBalance(
  accountId: string,
  expenses: Expense[],
  transfers: Transfer[]
) {
  let balance = 0

  /* ===== Expenses & Income ===== */
  for (const e of expenses) {
    if (e.account !== accountId) continue

    if (e.type === "expense") {
      balance -= e.amount
    }

    if (e.type === "income") {
      balance += e.amount
    }
  }

  /* ===== Transfers ===== */
  for (const t of transfers) {
    if (t.fromAccount === accountId) {
      balance -= t.amount
    }
    if (t.toAccount === accountId) {
      balance += t.amount
    }
  }

  return balance
}


export const INCOME_COLOR = "#16a34a" // green
export const EXPENSE_COLOR = "#dc2626" // red

const PALETTE = [
  "#4f46e5",
  "#16a34a",
  "#dc2626",
  "#ca8a04",
  "#0891b2",
  "#9333ea",
  "#db2777",
  "#ea580c"
]

export function generateColor(index: number) {
  return PALETTE[index % PALETTE.length]
}
