/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useState } from "react";
import { useLocalStorage } from "@/hooks/useLocalStorage";

import { Expense } from "@/types/expense";
import { Category } from "@/types/category";
import { Account, Goal, Transfer } from "@/types/accounts";

import { getMonthKey } from "@/lib/utils";
import { exportExpensesCsv } from "@/lib/exportCSV";
import { exportExpensesXlsx } from "@/lib/exportXlsx";

import MonthPicker from "@/components/MonthPicker";
import ExpenseDialog from "@/components/ExpenseDialog";
import ExpenseList from "@/components/ExpenseList";

import CategoryManagerModal from "@/components/CategoryManagerModal";
import AccountManagerModal from "@/components/AccountManagerModal";
import TransferModal from "@/components/TransferModal";

import AccountBalanceList from "@/components/AccountBalanceList";
import CategoryDonutChart from "@/components/CategoryDonutChart";
import IncomeExpenseDonut from "@/components/IncomeExpenseDonut";

import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Home,
  PieChart,
  Wallet,
  Settings,
  Plus,
  EllipsisVertical,
  PiggyBank,
} from "lucide-react";
import GoalDialog from "@/components/GoalDialog";
import GoalList from "@/components/GoalList";

type Tab = "home" | "charts" | "accounts" | "settings" | "savings";

export default function HomePage() {
  /* =====================
     Persistent State (client-only)
  ====================== */
  const [expenses, setExpenses] = useLocalStorage<Expense[]>("expenses", []);
  const [categories, setCategories] = useLocalStorage<Category[]>(
    "categories",
    [{ id: crypto.randomUUID(), name: "Food", color: "#4f46e5" }],
  );
  const [accounts, setAccounts] = useLocalStorage<Account[]>("accounts", [
    { id: crypto.randomUUID(), name: "Cash", type: "cash" },
  ]);
  const [transfers, setTransfers] = useLocalStorage<Transfer[]>(
    "transfers",
    [],
  );
  const [goals, setGoals] = useLocalStorage<Goal[]>("goals", []);

  /* =====================
     UI State
  ====================== */
  const [tab, setTab] = useState<Tab>("home");
  const [month, setMonth] = useState(getMonthKey(new Date()));
  const [selectedCategory, setSelectedCategory] = useState<string>();
  const [selectedType, setSelectedType] = useState<"income" | "expense">();

  const [expenseOpen, setExpenseOpen] = useState(false);
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [transferOpen, setTransferOpen] = useState(false);

  /* =====================
     Client-side Derived Data
  ====================== */
  const [monthlyExpenses, setMonthlyExpenses] = useState<Expense[]>([]);
  const [filteredExpenses, setFilteredExpenses] = useState<Expense[]>([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const monthExp = expenses.filter((e) => getMonthKey(e.date) === month);
    setMonthlyExpenses((prev) => {
      const same =
        prev.length === monthExp.length &&
        prev.every((e, i) => e.id === monthExp[i].id);
      return same ? prev : monthExp;
    });

    const filtered = monthExp.filter(
      (e) =>
        (!selectedCategory || e.category === selectedCategory) &&
        (!selectedType || e.type === selectedType),
    );
    setFilteredExpenses((prev) => {
      const same =
        prev.length === filtered.length &&
        prev.every((e, i) => e.id === filtered[i].id);
      return same ? prev : filtered;
    });

    const totalAmount = filtered.reduce((s, e) => {
      if (e.type === "expense") return s - e.amount;
      if (e.type === "income") return s + e.amount;
      if (e.type === "saving") return s - e.amount; // or ignore if you want
      return s;
    }, 0);
    setTotal(totalAmount);
  }, [expenses, month, selectedCategory, selectedType]);

  const handleGoalAdd = (goalId: string, amount: number) => {
    setGoals((prev) =>
      prev.map((g) =>
        g.id === goalId ? { ...g, saved: g.saved + amount } : g,
      ),
    );
  };
  const handleGoalDelete = (id: string) => {
    setGoals((prev) => prev.filter((g) => g.id !== id));
  };
  /* =====================
     Render
  ====================== */
  return (
    <>
      {/* ===== App Header ===== */}
      <header className="sticky top-0 z-20 bg-background border-b">
        <div className="px-4 py-3">
          {/* Top row */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            {/* Title */}
            <h1 className="font-semibold text-lg whitespace-nowrap">
              💸 Expense Tracker
            </h1>

            {/* Controls */}
            <div className="flex items-center gap-2">
              <div className="flex-1 sm:flex-none">
                <MonthPicker value={month} onChange={setMonth} />
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button size="icon" variant="ghost">
                    <EllipsisVertical className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={() =>
                      exportExpensesCsv({
                        expenses,
                        categories,
                        accounts,
                        month,
                      })
                    }
                  >
                    Export CSV
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    onClick={() =>
                      exportExpensesXlsx({
                        expenses,
                        categories,
                        accounts,
                        month,
                      })
                    }
                  >
                    Export XLSX
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>

        {/* Summary */}
        {tab === "home" && (
          <div className="pb-3 text-center sm:text-left px-4">
            <p className="text-sm text-muted-foreground">This month</p>
            <p className="text-2xl font-bold">
              Rp {total.toLocaleString("id-ID")}
            </p>
          </div>
        )}
      </header>

      {/* ===== Main Content ===== */}
      <main className="px-4 pt-4 pb-28 space-y-4 max-w-5xl mx-auto">
        {/* HOME */}
        {tab === "home" && (
          <ExpenseList
            expenses={filteredExpenses}
            categories={categories}
            accounts={accounts}
            goals={goals} // pass goals
            onDelete={(id) => {
              const expenseToDelete = expenses.find((e) => e.id === id);

              // Remove the expense
              setExpenses((prev) => prev.filter((e) => e.id !== id));

              // If it's a saving linked to a goal, update that goal
              if (
                expenseToDelete?.type === "saving" &&
                expenseToDelete.goalId
              ) {
                setGoals((prev) =>
                  prev.map((g) =>
                    g.id === expenseToDelete.goalId
                      ? { ...g, saved: g.saved - expenseToDelete.amount }
                      : g,
                  ),
                );
              }
            }}
          />
        )}

        {/* CHARTS */}
        {tab === "charts" && (
          <>
            <Card>
              <CardHeader>
                <CardTitle>Income vs Expense</CardTitle>
              </CardHeader>
              <CardContent>
                <IncomeExpenseDonut
                  expenses={monthlyExpenses}
                  selectedType={selectedType}
                  onSelectType={setSelectedType}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>By Category</CardTitle>
              </CardHeader>
              <CardContent>
                <CategoryDonutChart
                  expenses={monthlyExpenses}
                  categories={categories}
                  selectedCategoryId={selectedCategory}
                  onSelectCategory={setSelectedCategory}
                />
              </CardContent>
            </Card>
          </>
        )}

        {/* ACCOUNTS */}
        {tab === "accounts" && (
          <>
            <AccountBalanceList
              accounts={accounts}
              expenses={expenses}
              transfers={transfers}
            />

            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setTransferOpen(true)}>
                Transfer
              </Button>
              <Button variant="outline" onClick={() => setAccountOpen(true)}>
                Manage Accounts
              </Button>
            </div>
          </>
        )}
        {tab === "savings" && (
          <Card>
            <CardHeader className="flex justify-between">
              <CardTitle>Savings Goals</CardTitle>
              <GoalDialog onAdd={(g) => setGoals((prev) => [...prev, g])} />
            </CardHeader>

            <CardContent>
              <GoalList goals={goals} onDelete={handleGoalDelete} />
            </CardContent>
          </Card>
        )}
        {/* SETTINGS */}
        {tab === "settings" && (
          <Card>
            <CardHeader>
              <CardTitle>Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button
                variant="outline"
                className="w-full"
                onClick={() => setCategoryOpen(true)}
              >
                Manage Categories
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={() =>
                  exportExpensesCsv({ expenses, categories, accounts, month })
                }
              >
                Export CSV
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={() =>
                  exportExpensesXlsx({ expenses, categories, accounts, month })
                }
              >
                Export XLSX
              </Button>
            </CardContent>
          </Card>
        )}
      </main>

      {/* ===== Floating Add Button ===== */}
      <button
        onClick={() => setExpenseOpen(true)}
        className="
          fixed bottom-16 left-1/2 -translate-x-1/2
          h-14 w-14 rounded-full
          bg-primary text-primary-foreground
          shadow-lg flex items-center justify-center
        "
      >
        <Plus />
      </button>

      {/* ===== Bottom Navigation ===== */}
      <nav className="fixed bottom-0 inset-x-0 bg-background border-t z-30">
        <div className="grid grid-cols-5">
          <BottomTab
            active={tab === "home"}
            icon={<Home />}
            label="Home"
            onClick={() => setTab("home")}
          />
          <BottomTab
            active={tab === "charts"}
            icon={<PieChart />}
            label="Charts"
            onClick={() => setTab("charts")}
          />
          <BottomTab
            active={tab === "accounts"}
            icon={<Wallet />}
            label="Accounts"
            onClick={() => setTab("accounts")}
          />
          <BottomTab
            active={tab === "savings"}
            icon={<PiggyBank />}
            label="Savings"
            onClick={() => setTab("savings")}
          />
          <BottomTab
            active={tab === "settings"}
            icon={<Settings />}
            label="Settings"
            onClick={() => setTab("settings")}
          />
        </div>
      </nav>

      {/* ===== Modals ===== */}
      <ExpenseDialog
        open={expenseOpen}
        onOpenChange={setExpenseOpen}
        categories={categories}
        accounts={accounts}
        goals={goals} // pass goals
        onAdd={(e) => {
          setExpenses((prev) => [e, ...prev]);
          if (e.goalId) handleGoalAdd(e.goalId, e.amount);
        }}
      />

      <CategoryManagerModal
        open={categoryOpen}
        onOpenChange={setCategoryOpen}
        categories={categories}
        setCategories={setCategories}
        expenses={expenses}
      />

      <AccountManagerModal
        open={accountOpen}
        onOpenChange={setAccountOpen}
        accounts={accounts}
        setAccounts={setAccounts}
        expenses={expenses}
      />

      <TransferModal
        open={transferOpen}
        onOpenChange={setTransferOpen}
        accounts={accounts}
        onTransfer={(t) => setTransfers((prev) => [t, ...prev])}
      />
    </>
  );
}

/* =====================
   Bottom Tab Item
===================== */
function BottomTab({
  icon,
  label,
  active,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`
        flex flex-col items-center justify-center py-2 text-xs
        ${active ? "text-primary" : "text-muted-foreground"}
      `}
    >
      {icon}
      {label}
    </button>
  );
}
