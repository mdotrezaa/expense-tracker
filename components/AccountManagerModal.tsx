/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem
} from "@/components/ui/select"
import { Account } from "@/types/accounts"
import { Expense } from "@/types/expense"

export default function AccountManagerModal({
  open,
  onOpenChange,
  accounts,
  setAccounts,
  expenses
}: {
  open: boolean
  onOpenChange: (v: boolean) => void
  accounts: Account[]
  setAccounts: React.Dispatch<React.SetStateAction<Account[]>>
  expenses: Expense[]
}) {
  const [name, setName] = useState("")
  const [type, setType] = useState<Account["type"]>("cash")

  const add = () => {
    if (!name.trim()) return
    setAccounts(p => [...p, { id: crypto.randomUUID(), name, type }])
    setName("")
  }

  const remove = (id: string) => {
    if (expenses.some(e => e.accountId === id)) {
      alert("Account is used")
      return
    }
    setAccounts(p => p.filter(a => a.id !== id))
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Manage Accounts</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex gap-2">
            <Input value={name} onChange={e => setName(e.target.value)} />
            <Select value={type} onValueChange={v => setType(v as any)}>
              <SelectTrigger className="w-36">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cash">Cash</SelectItem>
                <SelectItem value="bank">Bank</SelectItem>
                <SelectItem value="ewallet">E-Wallet</SelectItem>
                <SelectItem value="credit">Credit Card</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={add}>Add</Button>
          </div>

          {accounts.map(a => (
            <div key={a.id} className="flex justify-between border p-2 rounded">
              <span>{a.name} ({a.type})</span>
              <Button size="sm" variant="destructive" onClick={() => remove(a.id)}>
                Delete
              </Button>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}
