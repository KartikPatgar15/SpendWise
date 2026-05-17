package com.spendwise.model;

import java.util.List;
import java.util.Map;

public class MonthlyResponse {

    private List<Expense> expenses;
    private Map<Expense.ExpenseType, Double> categorySummary;
    private double total;
    private double lastMonthTotal;
    private double difference;

    public List<Expense> getExpenses() {
        return expenses;
    }

    public void setExpenses(List<Expense> expenses) {
        this.expenses = expenses;
    }

    public Map<Expense.ExpenseType, Double> getCategorySummary() {
        return categorySummary;
    }

    public void setCategorySummary(Map<Expense.ExpenseType, Double> categorySummary) {
        this.categorySummary = categorySummary;
    }

    public double getTotal() {
        return total;
    }

    public void setTotal(double total) {
        this.total = total;
    }

    public double getLastMonthTotal() {
        return lastMonthTotal;
    }

    public void setLastMonthTotal(double lastMonthTotal) {
        this.lastMonthTotal = lastMonthTotal;
    }

    public double getDifference() {
        return difference;
    }

    public void setDifference(double difference) {
        this.difference = difference;
    }
}