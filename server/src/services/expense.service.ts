import { supabaseAdmin } from "../config/supabase";

export const getExpenseAll = async () => {
    const { data, error } = await supabaseAdmin
        .from("expenses")
        .select("*")

    if (error) throw error;
    return data;
}

export const getExpensesByUser = async (userId: number) => {
    const { data, error } = await supabaseAdmin
        .from("expenses")
        .select("*")
        .eq("usr_id", userId);

    if (error) throw error;
    return data;
};

export const getExpenseById = async (
    expId: number,
    userId: number
) => {
    const { data, error } = await supabaseAdmin
        .from("expenses")
        .select("*")
        .eq("exp_id", expId)
        .eq("usr_id", userId)
        .single();

    if (error) throw error;
    return data;
};

export const createExpense = async (payload: {
    usr_id: number;
    exp_title: string;
    exp_amount: number;
    exp_type: "income" | "expense";
    exp_category: "Food" | "Bills" | "Salary" | "Transport" | "Entertainment";
    exp_note?: string;
    exp_date: string;
}) => {
    const { data, error } = await supabaseAdmin
        .from("expenses")
        .insert(payload)
        .select()
        .single();

    if (error) throw error;
    return data;
}

export const updateExpense = async (
    expId: number,
    userId: number,
    payload: {
        exp_title: string;
        exp_amount: number;
        exp_type: "income" | "expense";
        exp_category: "Food" | "Bills" | "Salary" | "Transport" | "Entertainment";
        exp_note?: string;
        exp_date: string;
    }
) => {
    const { data, error } = await supabaseAdmin
        .from("expenses")
        .update(payload)
        .eq("exp_id", expId)
        .eq("usr_id", userId)
        .select()
        .single();

    if (error) throw error;
    return data;
};

export const deleteExpense = async (
    expId: number,
    userId: number
) => {
    const { error } = await supabaseAdmin
        .from("expenses")
        .delete()
        .eq("exp_id", expId)
        .eq("usr_id", userId);

    if (error) throw error;
};
