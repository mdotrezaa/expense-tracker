import { Expense } from "@/types/expense"
import { Category } from "@/types/category"
import { Account } from "@/types/accounts"

export function exportExpensesCsv({
  expenses,
  categories,
  accounts,
  month
}: {
  expenses: Expense[]
  categories: Category[]
  accounts: Account[]
  month: string // YYYY-MM
}) {
  const rows = expenses
    .filter(e => e.date.startsWith(month))
    .map(e => {
      const category =
        e.type === "expense"
          ? categories.find(c => c.id === e.category)?.name ?? ""
          : "Income"

      const account =
        accounts.find(a => a.id === e.account)?.name ?? ""

      return {
        Date: new Date(e.date).toLocaleDateString(),
        Title: e.title,
        Type: e.type,
        Category: category,
        Account: account,
        Amount: e.amount
      }
    })

  if (!rows.length) return alert("No data for selected month")

  const csv =
    Object.keys(rows[0]).join(",") +
    "\n" +
    rows
      .map(r =>
        Object.values(r)
          .map(v => `"${v}"`)
          .join(",")
      )
      .join("\n")

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
  const url = URL.createObjectURL(blob)

  const a = document.createElement("a")
  a.href = url
  a.download = `expenses-${month}.csv`
  a.click()

  URL.revokeObjectURL(url)
}
