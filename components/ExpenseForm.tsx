/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem
} from "@/components/ui/select"

import { Category } from "@/types/category"
import { Account } from "@/types/accounts"
import { Expense } from "@/types/expense"

export default function ExpenseForm({
  categories,
  accounts,
  onAdd
}: {
  categories: Category[]
  accounts: Account[]
  onAdd: (e: Expense) => void
}) {
  const [type, setType] = useState<"expense" | "income">("expense")
  const [title, setTitle] = useState("")
  const [amount, setAmount] = useState("")
  const [category, setCategory] = useState(categories[0]?.id ?? "")
  const [accountId, setAccountId] = useState(accounts[0]?.id ?? "")

  const submit = () => {
    if (!title || !amount || !accountId) return

    onAdd({
      id: crypto.randomUUID(),
      title,
      amount: Number(amount),
      type, // ✅ income / expense
      category,
      account: accountId,
      date: new Date().toISOString()
    })

    setTitle("")
    setAmount("")
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-6 gap-2">
      {/* Income / Expense */}
      <Select value={type} onValueChange={(v) => setType(v as any)}>
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="expense">Expense</SelectItem>
          <SelectItem value="income">Income</SelectItem>
        </SelectContent>
      </Select>

      {/* Title */}
      <Input
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      {/* Amount */}
      <Input
        type="number"
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />

      {/* Category */}
      <Select value={category} onValueChange={setCategory}>
        <SelectTrigger>
          <SelectValue placeholder="Category" />
        </SelectTrigger>
        <SelectContent>
          {categories.map((c) => (
            <SelectItem key={c.id} value={c.id}>
              {c.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Account */}
      <Select value={accountId} onValueChange={setAccountId}>
        <SelectTrigger>
          <SelectValue placeholder="Account" />
        </SelectTrigger>
        <SelectContent>
          {accounts.map((a) => (
            <SelectItem key={a.id} value={a.id}>
              {a.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Submit */}
      <Button onClick={submit}>
        Add
      </Button>
    </div>
  )
}
