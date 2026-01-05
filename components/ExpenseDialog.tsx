/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog"
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

export default function ExpenseDialog({
  open,
  onOpenChange,
  categories,
  accounts,
  onAdd
}: {
  open: boolean
  onOpenChange: (v: boolean) => void
  categories: Category[]
  accounts: Account[]
  onAdd: (e: Expense) => void
}) {
  const [type, setType] = useState<"expense" | "income">("expense")
  const [title, setTitle] = useState("")
  const [amount, setAmount] = useState("")
  const [category, setCategory] = useState<string | undefined>(
    categories[0]?.id
  )
  const [account, setAccount] = useState<string | undefined>(
    accounts[0]?.id
  )
  const [toAccount, setToAccount] = useState<string | undefined>(
    accounts[0]?.id
  )

  const reset = () => {
    setTitle("")
    setAmount("")
    setType("expense")
    setCategory(categories[0]?.id)
    setAccount(accounts[0]?.id)
    setToAccount(accounts[0]?.id)
  }

  const submit = () => {
    if (!title || !amount || !account) return

    onAdd({
      id: crypto.randomUUID(),
      title,
      amount: Number(amount),
      type,
      category: type === "expense" ? category : undefined,
      account,
      toAccount: type === "income" ? toAccount : undefined,
      date: new Date().toISOString()
    })

    reset()
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Transaction</DialogTitle>
        </DialogHeader>

        <div className="space-y-3">
          {/* Type */}
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
          {type === "expense" && (
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
          )}

          {/* Account */}
          <Select value={account} onValueChange={setAccount}>
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

          {/* Income → To Account */}
          {type === "income" && (
            <Select value={toAccount} onValueChange={setToAccount}>
              <SelectTrigger>
                <SelectValue placeholder="Transfer to account" />
              </SelectTrigger>
              <SelectContent>
                {accounts.map((a) => (
                  <SelectItem key={a.id} value={a.id}>
                    {a.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          <Button onClick={submit} className="w-full">
            Save
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
