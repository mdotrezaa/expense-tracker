"use client";

import { useState } from "react";
import { useLocalStorage } from "@/hooks/useLocalStorage";

import { Expense } from "@/types/expense";
import { Category } from "@/types/category";
import { Account, Transfer } from "@/types/accounts";

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
} from "lucide-react";

/* =====================
   Bottom Tabs
===================== */
type Tab = "home" | "charts" | "accounts" | "settings";

export default function HomePage() {
  /* =====================
     Persistent State
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
     Derived Data
  ====================== */
  const monthlyExpenses = expenses.filter((e) => getMonthKey(e.date) === month);

  const filteredExpenses = monthlyExpenses.filter(
    (e) =>
      (!selectedCategory || e.category === selectedCategory) &&
      (!selectedType || e.type === selectedType),
  );

  const total = filteredExpenses.reduce((s, e) => s + e.amount, 0);

  /* =====================
     Render
  ====================== */
  return (
    <>
      {/* ===== App Header ===== */}
      <header className="sticky top-0 z-20 bg-background border-b">
        <div className="flex items-center justify-between px-4 py-3">
          <h1 className="font-semibold text-lg">💸 Expense Tracker</h1>
          <div className="flex items-center space-x-2">
            <MonthPicker value={month} onChange={setMonth} />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="icon" variant="ghost">
                  <EllipsisVertical />
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

        {tab === "home" && (
          <div className="text-center pb-3">
            <p className="text-sm text-muted-foreground">This month</p>
            <p className="text-2xl font-bold">Rp {total.toLocaleString()}</p>
          </div>
        )}
      </header>

      {/* ===== Content ===== */}
      <main className="px-4 pt-4 pb-28 space-y-4 max-w-5xl mx-auto">
        {/* HOME */}
        {tab === "home" && (
          <ExpenseList
            expenses={filteredExpenses}
            categories={categories}
            accounts={accounts}
            onDelete={(id) =>
              setExpenses((prev) => prev.filter((e) => e.id !== id))
            }
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
                  exportExpensesCsv({
                    expenses,
                    categories,
                    accounts,
                    month,
                  })
                }
              >
                Export CSV
              </Button>
              <Button
                variant="outline"
                className="w-full"
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
        <div className="grid grid-cols-4">
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
        onAdd={(e) => setExpenses((prev) => [e, ...prev])}
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
