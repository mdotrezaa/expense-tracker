/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer
} from "recharts"

import { Expense } from "@/types/expense"
import {
  INCOME_COLOR,
  EXPENSE_COLOR
} from "@/lib/utils"

type Props = {
  expenses: Expense[]
  selectedType?: "income" | "expense"
  onSelectType: (type?: "income" | "expense") => void
}

export default function IncomeExpenseDonut({
  expenses,
  selectedType,
  onSelectType
}: Props) {
  const income = expenses
    .filter((e) => e.type === "income")
    .reduce((s, e) => s + e.amount, 0)

  const expense = expenses
    .filter((e) => e.type === "expense")
    .reduce((s, e) => s + e.amount, 0)

  const total = income + expense

  const data = [
    {
      id: "income",
      name: "Income",
      value: income,
      color: INCOME_COLOR
    },
    {
      id: "expense",
      name: "Expense",
      value: expense,
      color: EXPENSE_COLOR
    }
  ].filter((d) => d.value > 0)

  if (!data.length) {
    return (
      <p className="text-sm text-muted-foreground">
        No income or expense data
      </p>
    )
  }

  return (
    <div className="flex flex-col md:flex-row gap-6">
      {/* ===== Donut ===== */}
      <div className="h-64 flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={4}
              onClick={(d) =>
                onSelectType(
                  d.id === selectedType ? undefined : (d.id as any)
                )
              }
            >
              {data.map((d) => (
                <Cell
                  key={d.id}
                  fill={d.color}
                  opacity={
                    !selectedType || selectedType === d.id
                      ? 1
                      : 0.3
                  }
                />
              ))}
            </Pie>

            <Tooltip
              formatter={(value) => {
                if (typeof value !== "number") return "Rp 0"
                const pct = ((value / total) * 100).toFixed(1);
                return [`Rp ${value.toLocaleString("id-ID")} (${pct}%)`, ""];
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* ===== Legend ===== */}
      <div className="space-y-3 min-w-[180px]">
        {data.map((d) => {
          const pct = ((d.value / total) * 100).toFixed(1)

          return (
            <button
              key={d.id}
              onClick={() =>
                onSelectType(
                  d.id === selectedType ? undefined : (d.id as any)
                )
              }
              className={`flex items-center gap-2 w-full p-2 rounded hover:bg-muted ${
                selectedType === d.id
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
