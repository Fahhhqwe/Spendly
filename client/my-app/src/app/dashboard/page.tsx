"use client";

import { useState, useEffect } from "react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
} from "recharts";
import { ArrowUpRight, ArrowDownRight, Wallet } from "lucide-react";

/* =========================
   Types
========================= */
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

/* =========================
   Colors
========================= */
const PIE_COLORS = ["#34d399", "#60a5fa", "#fbbf24", "#fb7185", "#a78bfa"];

/* =========================
   Page
========================= */
export default function DashboardPage() {
    const [expenses, setExpenses] = useState<Expense[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchExpenses = async () => {
            try {
                const res = await fetch("http://localhost:4080/api/expenses");
                if (!res.ok) throw new Error("Failed to fetch expenses");
                const data: Expense[] = await res.json();

                // filter ให้เฉพาะ usr_id = 1
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

    const dailyData = expenses.map((e) => ({
        date: e.exp_date,
        income: e.exp_type === "income" ? e.exp_amount : 0,
        expense: e.exp_type === "expense" ? e.exp_amount : 0,
    }));

    const expenseByCategory = outExpenses.reduce<Record<string, number>>(
        (acc, e) => {
            acc[e.exp_category] = (acc[e.exp_category] || 0) + e.exp_amount;
            return acc;
        },
        {}
    );

    const pieData = Object.entries(expenseByCategory).map(([name, value]) => ({
        name,
        value,
    }));

    const recentExpenses = [...outExpenses]
        .sort((a, b) => b.exp_date.localeCompare(a.exp_date))
        .slice(0, 5);

    return (
        <div className="min-h-screen bg-emerald-50 px-6 py-10">
            <div className="mx-auto max-w-6xl space-y-8">
                {/* Header */}
                <div>
                    <h1 className="text-2xl font-semibold text-emerald-900">
                        Dashboard
                    </h1>
                    <p className="text-sm text-emerald-600">
                        Overview of your income & expenses
                    </p>
                </div>

                {/* Summary */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <SummaryCard
                        title="Income"
                        value={totalIncome}
                        icon={<ArrowUpRight size={20} />}
                        variant="income"
                    />
                    <SummaryCard
                        title="Expense"
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
                </div>

                {/* Charts */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    {/* Bar Chart */}
                    <div className="rounded-2xl bg-white p-5 shadow ring-1 ring-emerald-100">
                        <h2 className="mb-4 text-sm font-semibold text-gray-700">
                            Income / Expense by Date
                        </h2>

                        <ResponsiveContainer width="100%" height={260}>
                            <BarChart data={dailyData}>
                                <XAxis dataKey="date" />
                                <YAxis />
                                <Tooltip />
                                <Bar
                                    dataKey="income"
                                    fill="#34d399"
                                    radius={[4, 4, 0, 0]}
                                />
                                <Bar
                                    dataKey="expense"
                                    fill="#fb7185"
                                    radius={[4, 4, 0, 0]}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Pie Chart */}
                    <div className="rounded-2xl bg-white p-5 shadow ring-1 ring-emerald-100">
                        <h2 className="mb-4 text-sm font-semibold text-gray-700">
                            Expense by Category
                        </h2>

                        <ResponsiveContainer width="100%" height={260}>
                            <PieChart>
                                <Pie
                                    data={pieData}
                                    dataKey="value"
                                    nameKey="name"
                                    outerRadius={90}
                                    label
                                >
                                    {pieData.map((_, i) => (
                                        <Cell
                                            key={i}
                                            fill={PIE_COLORS[i % PIE_COLORS.length]}
                                        />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Recent Expenses */}
                <div className="rounded-2xl bg-white shadow ring-1 ring-emerald-100">
                    <div className="border-b px-6 py-4">
                        <h2 className="text-sm font-semibold text-gray-700">
                            Recent Expenses
                        </h2>
                    </div>

                    <div className="max-h-72 overflow-y-auto"> {/* <-- scroll container */}
                        <table className="w-full text-sm border-collapse">
                            <thead className="bg-emerald-50 text-emerald-900 uppercase text-xs tracking-wide sticky top-0 z-10">
                                <tr>
                                    <th className="px-6 py-3 text-left">Date</th>
                                    <th className="px-6 py-3 text-left">Title</th>
                                    <th className="px-6 py-3 text-left">Category</th>
                                    <th className="px-6 py-3 text-right">Amount</th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-emerald-100">
                                {recentExpenses.map((e) => (
                                    <tr
                                        key={e.exp_id}
                                        className="transition hover:bg-emerald-50/50"
                                    >
                                        <td className="px-6 py-4 text-gray-500 font-mono">
                                            {e.exp_date}
                                        </td>

                                        <td className="px-6 py-4">
                                            <p className="font-medium text-gray-800">
                                                {e.exp_title}
                                            </p>
                                            {e.exp_note && (
                                                <p className="text-xs text-gray-400 mt-0.5">
                                                    {e.exp_note}
                                                </p>
                                            )}
                                        </td>

                                        <td className="px-6 py-4 text-gray-600">
                                            {e.exp_category}
                                        </td>

                                        <td className="px-6 py-4 text-right font-semibold text-rose-600">
                                            ฿{e.exp_amount.toLocaleString("en-US")}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
        </div>
    );
}

/* =========================
   Summary Card
========================= */
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
                    ฿{value.toLocaleString("en-US")}
                </p>
            </div>

            <div className={`flex h-10 w-10 items-center justify-center rounded-full ${bg} ${color}`}>
                {icon}
            </div>
        </div>
    );
}
