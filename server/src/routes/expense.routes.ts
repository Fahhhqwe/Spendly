import { Router } from "express";
import * as expenseController from "../controllers/expense.controller";

const router = Router({ mergeParams: true });

// สำหรับเฉพาะ user
router.get("/", expenseController.getExpensesByUser);        // GET /api/users/:userId/expenses
router.get("/:expId", expenseController.getExpenseById);     // GET /api/users/:userId/expenses/:expId
router.post("/", expenseController.createExpense);           // POST /api/users/:userId/expenses
router.put("/:expId", expenseController.updateExpense);      // PUT /api/users/:userId/expenses/:expId
router.delete("/:expId", expenseController.deleteExpense);   // DELETE /api/users/:userId/expenses/:expId

export default router;
