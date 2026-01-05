// components/AccountBalanceList.tsx
import { Account } from "@/types/accounts"
import { Expense } from "@/types/expense"
import { Transfer } from "@/types/accounts"
import { getAccountBalance } from "@/lib/utils"

export default function AccountBalanceList({
  accounts,
  expenses,
  transfers
}: {
  accounts: Account[]
  expenses: Expense[]
  transfers: Transfer[]
}) {
  return (
    <div className="grid md:grid-cols-3 gap-3">
      {accounts.map(a => {
        const balance = getAccountBalance(a.id, expenses, transfers)
        return (
          <div key={a.id} className="border rounded p-3">
            <div className="font-medium">{a.name}</div>
            <div className={`text-lg font-bold ${balance < 0 ? "text-red-500" : ""}`}>
              Rp {balance.toLocaleString()}
            </div>
          </div>
        )
      })}
    </div>
  )
}
