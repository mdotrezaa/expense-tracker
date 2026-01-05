"use client"

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts"
import { Expense } from "@/types/expense"
import { Category } from "@/types/category"

type Props = {
  expenses: Expense[]
  categories: Category[]
}

export default function MonthlyChart({
  expenses,
  categories
}: Props) {
  // Group expenses by category
  const data = categories
    .map((c) => {
      const total = expenses
        .filter((e) => e.category === c.id)
        .reduce((sum, e) => sum + e.amount, 0)

      return {
        name: c.name,
        total
      }
    })
    .filter((d) => d.total > 0) // hide empty categories

  if (!data.length) {
    return (
      <p className="text-sm text-muted-foreground">
        No data for this month
      </p>
    )
  }

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="total" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
