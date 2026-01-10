"use client";

import { useState, useEffect } from "react";
import { Pencil, Trash2, Plus, ArrowUpRight, ArrowDownRight, Wallet } from "lucide-react";
import Modal from "../components/Modaladd";

type Expense = {
    exp_id: number;
    usr_id: number;
    exp_title: string;
    exp_amount: number;
    exp_type: "income" | "expense";
    exp_category: string;
    exp_note?: string;
    exp_date: string;
    exp_created_at?: string;
};

const categories = ["Entertainment", "Bills", "Transport", "Food", "Salary"];

export default function ExpensesPage() {
    const [expenses, setExpenses] = useState<Expense[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
    const [loading, setLoading] = useState(true);

    // State สำหรับ modal ลบ
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [expenseToDelete, setExpenseToDelete] = useState<Expense | null>(null);

    useEffect(() => {
        const fetchExpenses = async () => {
            try {
                const res = await fetch("http://localhost:4080/api/expenses");
                if (!res.ok) throw new Error("Failed to fetch expenses");
                const data: Expense[] = await res.json();
                setExpenses(data.filter(e => e.usr_id === 1));
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchExpenses();
    }, []);

    const totalIncome = expenses
        .filter(e => e.exp_type === "income")
        .reduce((s, e) => s + e.exp_amount, 0);

    const totalExpense = expenses
        .filter(e => e.exp_type === "expense")
        .reduce((s, e) => s + e.exp_amount, 0);

    const balance = totalIncome - totalExpense;

    const openAddModal = () => {
        setEditingExpense(null);
        setIsModalOpen(true);
    };

    const openEditModal = (expense: Expense) => {
        setEditingExpense(expense);
        setIsModalOpen(true);
    };

    const openDeleteModal = (expense: Expense) => {
        setExpenseToDelete(expense);
        setDeleteModalOpen(true);
    };

    const confirmDeleteExpense = async () => {
        if (!expenseToDelete) return;

        try {
            const res = await fetch(`http://localhost:4080/api/users/1/expenses/${expenseToDelete.exp_id}`, {
                method: "DELETE",
            });
            if (!res.ok) throw new Error("Failed to delete expense");

            setExpenses(prev => prev.filter(exp => exp.exp_id !== expenseToDelete.exp_id));
            setDeleteModalOpen(false);
            setExpenseToDelete(null);
        } catch (err) {
            console.error(err);
            alert("เกิดข้อผิดพลาด ไม่สามารถลบรายการได้");
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center text-emerald-700">
                Loading...
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-emerald-50 px-6 py-10">
            <div className="mx-auto max-w-6xl space-y-8">

                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold text-emerald-900">Expenses</h1>
                        <p className="text-sm text-emerald-600">Manage your income & expenses</p>
                    </div>
                    <button
                        onClick={openAddModal}
                        className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-5 py-2.5 text-sm font-medium text-white shadow hover:bg-emerald-700 transition"
                    >
                        <Plus size={16} /> Add Expense
                    </button>
                </div>

                {/* Summary */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <SummaryCard title="Income" value={totalIncome} icon={<ArrowUpRight size={20} />} variant="income" />
                    <SummaryCard title="Expense" value={totalExpense} icon={<ArrowDownRight size={20} />} variant="expense" />
                    <SummaryCard title="Balance" value={balance} icon={<Wallet size={20} />} variant={balance >= 0 ? "income" : "expense"} />
                </div>

                {/* Table */}
                <div className="overflow-hidden rounded-2xl bg-white shadow ring-1 ring-emerald-100">
                    <div className="max-h-96 overflow-y-auto">
                        <table className="w-full text-sm border-collapse">
                            <thead className="bg-emerald-50 text-emerald-900 uppercase text-xs tracking-wide sticky top-0 z-10">
                                <tr>
                                    <th className="px-6 py-3 text-left">Date</th>
                                    <th className="px-6 py-3 text-left">Title</th>
                                    <th className="px-6 py-3 text-left">Category</th>
                                    <th className="px-6 py-3 text-center">Type</th>
                                    <th className="px-6 py-3 text-right">Amount</th>
                                    <th className="px-6 py-3 text-center">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-emerald-100">
                                {expenses
                                    .sort((a, b) => b.exp_date.localeCompare(a.exp_date))
                                    .map(e => (
                                        <tr key={e.exp_id} className="transition hover:bg-emerald-50/50">
                                            <td className="px-6 py-4 text-gray-500 font-mono">{e.exp_date}</td>
                                            <td className="px-6 py-4">
                                                <p className="font-medium text-gray-800">{e.exp_title}</p>
                                                {e.exp_note && <p className="text-xs text-gray-400 mt-0.5">{e.exp_note}</p>}
                                            </td>
                                            <td className="px-6 py-4 text-gray-600">{e.exp_category}</td>
                                            <td className="px-6 py-4 text-center">
                                                <span className={`inline-flex items-center justify-center rounded-full px-3 py-1 text-xs font-semibold ${e.exp_type === "income" ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-600"}`}>
                                                    {e.exp_type}
                                                </span>
                                            </td>
                                            <td className={`px-6 py-4 text-right font-semibold ${e.exp_type === "income" ? "text-emerald-600" : "text-rose-600"}`}>
                                                ฿{e.exp_amount.toLocaleString()}
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <div className="flex justify-center gap-2">
                                                    <button
                                                        onClick={() => openEditModal(e)}
                                                        className="flex h-8 w-8 items-center justify-center rounded-lg text-emerald-600 hover:bg-emerald-50 transition"
                                                        title="Edit"
                                                    >
                                                        <Pencil size={16} />
                                                    </button>
                                                    <button
                                                        onClick={() => openDeleteModal(e)}
                                                        className="flex h-8 w-8 items-center justify-center rounded-lg text-rose-500 hover:bg-rose-50 transition"
                                                        title="Delete"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Add/Edit Modal */}
                <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingExpense ? "Edit Expense" : "Add New Expense"}>
                    <form
                        className="space-y-4"
                        onSubmit={async (e) => {
                            e.preventDefault();
                            const formData = new FormData(e.target as HTMLFormElement);
                            const expenseData = {
                                exp_title: formData.get("title") as string,
                                exp_amount: Number(formData.get("amount")),
                                exp_type: formData.get("type") as "income" | "expense",
                                exp_category: formData.get("category") as string,
                                exp_note: formData.get("note") as string | null,
                                exp_date: formData.get("date") as string,
                            };

                            try {
                                let res;
                                if (editingExpense) {
                                    res = await fetch(`http://localhost:4080/api/users/1/expenses/${editingExpense.exp_id}`, {
                                        method: "PUT",
                                        headers: { "Content-Type": "application/json" },
                                        body: JSON.stringify(expenseData),
                                    });
                                } else {
                                    res = await fetch("http://localhost:4080/api/users/1/expenses", {
                                        method: "POST",
                                        headers: { "Content-Type": "application/json" },
                                        body: JSON.stringify(expenseData),
                                    });
                                }

                                if (!res.ok) throw new Error("Failed to save expense");

                                const savedExpense: Expense = await res.json();

                                if (editingExpense) {
                                    setExpenses(prev => prev.map(exp => exp.exp_id === savedExpense.exp_id ? savedExpense : exp));
                                } else {
                                    setExpenses(prev => [savedExpense, ...prev]);
                                }

                                setIsModalOpen(false);
                            } catch (err) {
                                console.error(err);
                                alert("เกิดข้อผิดพลาด ไม่สามารถบันทึกรายการได้");
                            }
                        }}
                    >
                        <div>
                            <label className="block text-sm text-gray-600">Title</label>
                            <input name="title" defaultValue={editingExpense?.exp_title || ""} required className="mt-1 w-full rounded-lg border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-emerald-400" />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-600">Amount</label>
                            <input name="amount" type="number" step="0.01" defaultValue={editingExpense?.exp_amount || ""} required className="mt-1 w-full rounded-lg border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-emerald-400" />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-600">Type</label>
                            <select name="type" defaultValue={editingExpense?.exp_type || "expense"} required className="mt-1 w-full rounded-lg border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-emerald-400">
                                <option value="income">Income</option>
                                <option value="expense">Expense</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm text-gray-600">Category</label>
                            <select name="category" defaultValue={editingExpense?.exp_category || ""} required className="mt-1 w-full rounded-lg border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-emerald-400">
                                <option value="">Select category</option>
                                {categories.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm text-gray-600">Note (optional)</label>
                            <textarea name="note" defaultValue={editingExpense?.exp_note || ""} rows={2} className="mt-1 w-full rounded-lg border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-emerald-400" />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-600">Date</label>
                            <input name="date" type="date" defaultValue={editingExpense?.exp_date || ""} required className="mt-1 w-full rounded-lg border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-emerald-400" />
                        </div>
                        <div className="flex justify-end gap-2 pt-4">
                            <button type="button" onClick={() => setIsModalOpen(false)} className="rounded-lg bg-gray-200 px-4 py-2 text-gray-700 hover:bg-gray-300 transition">Cancel</button>
                            <button type="submit" className="rounded-lg bg-emerald-600 px-4 py-2 text-white hover:bg-emerald-700 transition">Save</button>
                        </div>
                    </form>
                </Modal>

                {/* Delete Confirmation Modal */}
                <Modal isOpen={deleteModalOpen} onClose={() => setDeleteModalOpen(false)} title="Confirm Delete">
                    <p className="text-gray-700">Are you sure you want to delete "{expenseToDelete?.exp_title}"?</p>
                    <div className="mt-4 flex justify-end gap-2">
                        <button
                            onClick={() => setDeleteModalOpen(false)}
                            className="rounded-lg bg-gray-200 px-4 py-2 text-gray-700 hover:bg-gray-300 transition"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={confirmDeleteExpense}
                            className="rounded-lg bg-rose-600 px-4 py-2 text-white hover:bg-rose-700 transition"
                        >
                            Delete
                        </button>
                    </div>
                </Modal>
            </div>
        </div>
    );
}

function SummaryCard({ title, value, icon, variant }: { title: string; value: number; icon: React.ReactNode; variant: "income" | "expense" }) {
    const color = variant === "income" ? "text-emerald-700" : "text-rose-600";
    const bg = variant === "income" ? "bg-emerald-100" : "bg-rose-100";

    return (
        <div className="flex items-center justify-between rounded-2xl bg-white p-5 shadow ring-1 ring-emerald-100">
            <div>
                <p className="text-sm text-gray-500">{title}</p>
                <p className={`mt-1 text-2xl font-semibold ${color}`}>฿{value.toLocaleString()}</p>
            </div>
            <div className={`flex h-10 w-10 items-center justify-center rounded-full ${bg} ${color}`}>
                {icon}
            </div>
        </div>
    );
}
