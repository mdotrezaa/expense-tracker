"use client"

import { Expense } from "@/types/expense"
import { Category } from "@/types/category"
import { Account } from "@/types/accounts"
import { Button } from "@/components/ui/button"

export default function ExpenseList({
  expenses,
  categories,
  accounts,
  onDelete
}: {
  expenses: Expense[]
  categories: Category[]
  accounts: Account[]
  onDelete: (id: string) => void
}) {
  const cat = (id: string) => categories.find(c => c.id === id)?.name
  const acc = (id: string) => accounts.find(a => a.id === id)?.name

  return (
    <div className="space-y-2">
      {expenses.map(e => (
        <div key={e.id} className="flex justify-between border p-2 rounded">
          <div>
            <div className="font-medium">{e.title}</div>
            <div className="text-sm text-muted-foreground">
              {cat(e.category)} · {acc(e.accountId)}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span>Rp {e.amount.toLocaleString()}</span>
            <Button size="sm" variant="destructive" onClick={() => onDelete(e.id)}>
              Delete
            </Button>
          </div>
        </div>
      ))}
    </div>
  )
}
