import express from "express";
import cors from "cors";
import userExpenseRoutes from "./routes/expense.routes";
import allExpenseRoutes from "./routes/expenseAll.routes"; // router ใหม่สำหรับ all expenses

const app = express();
app.use(express.json());

const PORT = Number(process.env.PORT) || 4080;

// เปิด CORS สำหรับ Next.js frontend
app.use(cors({
    origin: "*", // หรือ "*" ถ้าทดลอง
    credentials: true,
}));


// สำหรับ user-specific expenses
app.use("/api/users/:userId/expenses", userExpenseRoutes);

// สำหรับ all expenses (ไม่ต้องใช้ userId)
app.use("/api/expenses", allExpenseRoutes);

app.get("/", (req, res) => {
    res.send("Spendly is running");
});

app.listen(PORT, () => {
    console.log(`Backend running on port ${PORT}`);
});
