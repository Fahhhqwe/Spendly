"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  ArrowDownRight,
  Wallet,
  BarChart3,
  ListChecks,
} from "lucide-react";

type Expense = {
  exp_id: number;
  usr_id: number;
  exp_title: string;
  exp_amount: number;
  exp_type: "income" | "expense";
  exp_category: string;
  exp_note?: string;
  exp_date: string;
};

export default function HomePage() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const res = await fetch("https://backend-spendly-production.up.railway.app/api/expenses");
        if (!res.ok) throw new Error("Failed to fetch expenses");
        const data: Expense[] = await res.json();

        // filter เฉพาะ userId = 1
        setExpenses(data.filter((e) => e.usr_id === 1));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchExpenses();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-emerald-700">
        Loading...
      </div>
    );
  }

  const income = expenses.filter((e) => e.exp_type === "income");
  const outExpenses = expenses.filter((e) => e.exp_type === "expense");

  const totalIncome = income.reduce((s, e) => s + e.exp_amount, 0);
  const totalExpense = outExpenses.reduce((s, e) => s + e.exp_amount, 0);
  const balance = totalIncome - totalExpense;

  const expenseByCategory = outExpenses.reduce<Record<string, number>>(
    (acc, e) => {
      acc[e.exp_category] = (acc[e.exp_category] || 0) + e.exp_amount;
      return acc;
    },
    {}
  );

  const topCategory = Object.entries(expenseByCategory).sort(
    (a, b) => b[1] - a[1]
  )[0];

  return (
    <div className="min-h-screen bg-emerald-50 px-6 py-10">
      <main className="mx-auto max-w-6xl space-y-10">
        {/* Hero */}
        <section className="rounded-3xl bg-gradient-to-r from-emerald-600 to-emerald-500 p-8 text-white shadow">
          <h1 className="text-3xl font-semibold">Welcome back 👋</h1>
          <p className="mt-2 text-emerald-100">
            Track your income & expenses easily with Spendly
          </p>
        </section>

        {/* Summary */}
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <SummaryCard
            title="Total Income"
            value={totalIncome}
            icon={<ArrowUpRight size={20} />}
            variant="income"
          />
          <SummaryCard
            title="Total Expense"
            value={totalExpense}
            icon={<ArrowDownRight size={20} />}
            variant="expense"
          />
          <SummaryCard
            title="Balance"
            value={balance}
            icon={<Wallet size={20} />}
            variant={balance >= 0 ? "income" : "expense"}
          />
        </section>

        {/* Insights */}
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="rounded-2xl bg-white p-6 shadow ring-1 ring-emerald-100">
            <p className="text-sm text-gray-500">หมวดที่ใช้เงินมากที่สุด</p>
            {topCategory ? (
              <p className="mt-2 text-xl font-semibold text-emerald-700">
                {topCategory[0]} — ฿{topCategory[1].toLocaleString()}
              </p>
            ) : (
              <p className="mt-2 text-gray-400">ยังไม่มีข้อมูล</p>
            )}
          </div>

          <div className="rounded-2xl bg-white p-6 shadow ring-1 ring-emerald-100">
            <p className="text-sm text-gray-500">จำนวนรายการทั้งหมด</p>
            <p className="mt-2 text-xl font-semibold text-emerald-700">
              {expenses.length} รายการ
            </p>
          </div>
        </section>

        {/* Quick actions */}
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Link
            href="/dashboard"
            className="group rounded-2xl bg-white p-6 shadow ring-1 ring-emerald-100 hover:bg-emerald-50 transition"
          >
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 group-hover:bg-emerald-200 transition">
                <BarChart3 />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">Dashboard</h3>
                <p className="text-sm text-gray-500">View summary & analytics</p>
              </div>
            </div>
          </Link>

          <Link
            href="/expenses"
            className="group rounded-2xl bg-white p-6 shadow ring-1 ring-emerald-100 hover:bg-emerald-50 transition"
          >
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 group-hover:bg-emerald-200 transition">
                <ListChecks />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">Manage Expenses</h3>
                <p className="text-sm text-gray-500">Add & manage transactions</p>
              </div>
            </div>
          </Link>
        </section>
      </main>
    </div>
  );
}

function SummaryCard({
  title,
  value,
  icon,
  variant,
}: {
  title: string;
  value: number;
  icon: React.ReactNode;
  variant: "income" | "expense";
}) {
  const color = variant === "income" ? "text-emerald-700" : "text-rose-600";
  const bg = variant === "income" ? "bg-emerald-100" : "bg-rose-100";

  return (
    <div className="flex items-center justify-between rounded-2xl bg-white p-5 shadow ring-1 ring-emerald-100">
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <p className={`mt-1 text-2xl font-semibold ${color}`}>
          ฿{value.toLocaleString()}
        </p>
      </div>
      <div className={`flex h-10 w-10 items-center justify-center rounded-full ${bg} ${color}`}>
        {icon}
      </div>
    </div>
  );
}
