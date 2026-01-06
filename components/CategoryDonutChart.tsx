"use client"

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer
} from "recharts"

import { Expense } from "@/types/expense"
import { Category } from "@/types/category"

type Props = {
  expenses: Expense[]
  categories: Category[]
  selectedCategoryId?: string
  onSelectCategory: (id?: string) => void
}

export default function CategoryDonutChart({
  expenses,
  categories,
  selectedCategoryId,
  onSelectCategory
}: Props) {
  const totalAll = expenses.filter(t=> t.type === 'expense').reduce((s, e) => s + e.amount, 0)

  const data = categories
    .map((c) => {
      const total = expenses
        .filter((e) => e.category === c.id)
        .reduce((s, e) => s + e.amount, 0)

      return {
        id: c.id,
        name: c.name,
        value: total,
        color: c.color
      }
    })
    .filter((d) => d.value > 0)

  if (!data.length) {
    return (
      <p className="text-sm text-muted-foreground">
        No expense data
      </p>
    )
  }

  return (
    <div className="flex flex-col md:flex-row gap-6">
      {/* ===== Donut ===== */}
      <div className="h-72 flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              innerRadius={65}
              outerRadius={110}
              paddingAngle={4}
              onClick={(d) =>
                onSelectCategory(
                  d.id === selectedCategoryId ? undefined : d.id
                )
              }
            >
              {data.map((d) => (
                <Cell
                  key={d.id}
                  fill={d.color}
                  opacity={
                    !selectedCategoryId ||
                    selectedCategoryId === d.id
                      ? 1
                      : 0.3
                  }
                />
              ))}
            </Pie>

            {/* % tooltip */}
            <Tooltip
              formatter={(value) => {
                if (typeof value !== "number") return "Rp 0"
                const pct = ((value / totalAll) * 100).toFixed(1)
                return [`Rp ${value.toLocaleString("id-ID")} (${pct}%)`, ""]
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* ===== Legend ===== */}
      <div className="space-y-2 min-w-[200px]">
        {data.map((d) => {
          const pct = ((d.value / totalAll) * 100).toFixed(1)

          return (
            <button
              key={d.id}
              onClick={() =>
                onSelectCategory(
                  d.id === selectedCategoryId ? undefined : d.id
                )
              }
              className={`flex items-center gap-2 w-full text-left p-2 rounded hover:bg-muted ${
                selectedCategoryId === d.id
                  ? "bg-muted font-semibold"
                  : ""
              }`}
            >
              <span
                className="h-3 w-3 rounded-full"
                style={{ backgroundColor: d.color }}
              />
              <span className="flex-1">{d.name}</span>
              <span className="text-sm text-muted-foreground">
                {pct}%
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
