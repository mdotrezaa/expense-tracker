"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Goal } from "@/types/accounts";

export default function GoalDialog({ onAdd }: { onAdd: (g: Goal) => void }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [target, setTarget] = useState<number | "">("");

  const submit = () => {
    if (!name || !target) return;

    onAdd({
      id: crypto.randomUUID(),
      name,
      target: Number(target),
      saved: 0,
      accountId: "", // optionally select account later
    });

    setName("");
    setTarget("");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Add Goal</Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Goal</DialogTitle>
        </DialogHeader>

        <div className="space-y-3">
          <Input
            placeholder="Goal Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Input
            type="number"
            placeholder="Target Amount"
            value={target}
            onChange={(e) => setTarget(Number(e.target.value))}
          />
          <Button onClick={submit} className="w-full">Save</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
