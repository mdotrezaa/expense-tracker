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
import { Category } from "@/types/category"
import { Expense } from "@/types/expense"
import { generateColor } from "@/lib/utils"

export default function CategoryManagerModal({
  open,
  onOpenChange,
  categories,
  setCategories,
  expenses
}: {
  open: boolean
  onOpenChange: (v: boolean) => void
  categories: Category[]
  setCategories: React.Dispatch<React.SetStateAction<Category[]>>
  expenses: Expense[]
}) {
  const [name, setName] = useState("")

  const add = () => {
    if (!name.trim()) return
    setCategories(p => [...p, { id: crypto.randomUUID(), name,color: generateColor(p.length) }])
    setName("")
  }

  const remove = (id: string) => {
    if (expenses.some(e => e.category === id)) {
      alert("Category is used")
      return
    }
    setCategories(p => p.filter(c => c.id !== id))
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Manage Categories</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex gap-2">
            <Input value={name} onChange={e => setName(e.target.value)} />
            <Button onClick={add}>Add</Button>
          </div>

          {categories.map(c => (
            <div key={c.id} className="flex justify-between border p-2 rounded">
              <span>{c.name}</span>
              <Button size="sm" variant="destructive" onClick={() => remove(c.id)}>
                Delete
              </Button>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}
