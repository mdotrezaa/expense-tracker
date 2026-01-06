"use client";

import { Goal } from "@/types/accounts";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";

export default function GoalList({
  goals,
  onDelete,
}: {
  goals: Goal[];
  onDelete: (id: string) => void;
}) {
  return (
    <div className="space-y-3">
      {goals.map((g) => {
        const progress = Math.min((g.saved / g.target) * 100, 100);
        return (
          <div key={g.id} className="border rounded p-3 flex flex-col gap-2">
            <div className="flex justify-between items-center font-medium">
              <span>{g.name}</span>
              <Button
                size="sm"
                variant="destructive"
                onClick={() => onDelete(g.id)}
              >
                Delete
              </Button>
            </div>
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Saved: Rp {g.saved.toLocaleString()}</span>
              <span>Target: Rp {g.target.toLocaleString()}</span>
            </div>
            <Progress value={progress} className="h-3 rounded" />
          </div>
        );
      })}
    </div>
  );
}
