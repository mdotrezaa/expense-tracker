"use client"

import { Input } from "@/components/ui/input"

export default function MonthPicker({
  value,
  onChange
}: {
  value: string
  onChange: (v: string) => void
}) {
  return (
    <Input
      type="month"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-fit"
    />
  )
}
