import ExcelJS from "exceljs"
import { Expense } from "@/types/expense"
import { Category } from "@/types/category"
import { Account } from "@/types/accounts"
import { getMonthKey } from "./utils"

export async function exportExpensesXlsx({
  expenses,
  categories,
  accounts,
  month
}: {
  expenses: Expense[]
  categories: Category[]
  accounts: Account[]
  month: string
}) {
  const workbook = new ExcelJS.Workbook()
  const sheet = workbook.addWorksheet("Transactions")

  sheet.columns = [
    { header: "Date", key: "date", width: 15 },
    { header: "Type", key: "type", width: 10 },
    { header: "Title", key: "title", width: 25 },
    { header: "Category", key: "category", width: 20 },
    { header: "Account", key: "account", width: 20 },
    { header: "Amount", key: "amount", width: 15 }
  ]

  const catMap = Object.fromEntries(categories.map(c => [c.id, c.name]))
  const accMap = Object.fromEntries(accounts.map(a => [a.id, a.name]))

  expenses
    .filter(e => getMonthKey(e.date) === month)
    .forEach(e => {
      sheet.addRow({
        date: new Date(e.date).toLocaleDateString(),
        type: e.type,
        title: e.title,
        category: catMap[e.category] ?? "-",
        account: accMap[e.account] ?? "-",
        amount: e.type === "expense" ? -e.amount : e.amount
      })
    })

  // 💄 Styling
  sheet.getRow(1).font = { bold: true }
  sheet.getColumn("amount").numFmt = '"Rp"#,##0;-"Rp"#,##0'

  const buffer = await workbook.xlsx.writeBuffer()

  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  })

  const url = window.URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = `expenses-${month}.xlsx`
  a.click()
  window.URL.revokeObjectURL(url)
}
