import { Router } from "express";
import * as expenseController from "../controllers/expense.controller";

const allRouter = Router();

// GET all expenses ของทุก user
allRouter.get("/", expenseController.getExpensesAll); // GET /api/expenses

export default allRouter;
