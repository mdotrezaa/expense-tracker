// components/TransferModal.tsx
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
import { Account, Transfer } from "@/types/accounts"

export default function TransferModal({
  open,
  onOpenChange,
  accounts,
  onTransfer
}: {
  open: boolean
  onOpenChange: (v: boolean) => void
  accounts: Account[]
  onTransfer: (t: Transfer) => void
}) {
  const [from, setFrom] = useState("")
  const [to, setTo] = useState("")
  const [amount, setAmount] = useState("")

  const submit = () => {
    if (!from || !to || from === to || !amount) return

    onTransfer({
      id: crypto.randomUUID(),
      from,
      to,
      amount: Number(amount),
      date: new Date().toISOString()
    })

    setAmount("")
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Transfer Between Accounts</DialogTitle>
        </DialogHeader>

        <div className="space-y-3">
          <Select value={from} onValueChange={setFrom}>
            <SelectTrigger><SelectValue placeholder="From" /></SelectTrigger>
            <SelectContent>
              {accounts.map(a => (
                <SelectItem key={a.id} value={a.id}>{a.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={to} onValueChange={setTo}>
            <SelectTrigger><SelectValue placeholder="To" /></SelectTrigger>
            <SelectContent>
              {accounts.map(a => (
                <SelectItem key={a.id} value={a.id}>{a.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Input
            type="number"
            placeholder="Amount"
            value={amount}
            onChange={e => setAmount(e.target.value)}
          />

          <Button onClick={submit}>Transfer</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
