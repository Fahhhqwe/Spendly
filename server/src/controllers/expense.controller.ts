// src/controllers/expense.controller.ts
import { Request, Response } from "express";
import * as expenseService from "../services/expense.service";

export const getExpensesAll = async (req: Request, res: Response) => {
    try {
        const expenses = await expenseService.getExpenseAll();
        res.json(expenses);
    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
};

export const getExpensesByUser = async (req: Request, res: Response) => {
    const userId = Number(req.params.userId);
    if (isNaN(userId)) {
        return res.status(400).json({ message: "Invalid userId" });
    }

    try {
        const expenses = await expenseService.getExpensesByUser(userId);
        res.json(expenses);
    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
};

export const getExpenseById = async (req: Request, res: Response) => {
    try {
        const expId = Number(req.params.expId);
        const userId = Number(req.params.userId);
        const expense = await expenseService.getExpenseById(expId, userId);
        res.json(expense);
    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
};

export const createExpense = async (req: Request, res: Response) => {
    try {
        const userId = Number(req.params.userId);

        const newExpense = await expenseService.createExpense({
            usr_id: userId,
            exp_title: req.body.exp_title,
            exp_amount: req.body.exp_amount,
            exp_type: req.body.exp_type,
            exp_category: req.body.exp_category,
            exp_note: req.body.exp_note,
            exp_date: req.body.exp_date,
        });

        res.status(201).json(newExpense);
    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
};

// ------------------------
// เพิ่ม Update
export const updateExpense = async (req: Request, res: Response) => {
    try {
        const expId = Number(req.params.expId);
        const userId = Number(req.params.userId);

        const updatedExpense = await expenseService.updateExpense(expId, userId, {
            exp_title: req.body.exp_title,
            exp_amount: req.body.exp_amount,
            exp_type: req.body.exp_type,
            exp_category: req.body.exp_category,
            exp_note: req.body.exp_note,
            exp_date: req.body.exp_date,
        });

        res.json(updatedExpense);
    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
};

// ------------------------
// เพิ่ม Delete
export const deleteExpense = async (req: Request, res: Response) => {
    try {
        const expId = Number(req.params.expId);
        const userId = Number(req.params.userId);

        await expenseService.deleteExpense(expId, userId);

        res.json({ message: "Expense deleted successfully" });
    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
};
