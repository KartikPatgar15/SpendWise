package com.spendwise.controller;

import com.spendwise.model.Expense;
import com.spendwise.repository.ExpenseRepository;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;
import java.util.*;
import java.util.List;
import com.spendwise.model.MonthlyResponse;
import com.spendwise.model.WeeklyResponse;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/expenses")
public class ExpenseController {

    private final ExpenseRepository expenseRepository;

    public ExpenseController(ExpenseRepository expenseRepository) {
        this.expenseRepository = expenseRepository;
    }

    // Add Expense (SAVE to DB)
    @PostMapping
    public Expense addExpense(@RequestBody Expense expense) {
        return expenseRepository.save(expense);
    }

    @GetMapping("/history")
    public List<Expense> getAllHistory() {

        List<Expense> expenses = expenseRepository.findAll();

        // Sort latest first
        expenses.sort((a, b) -> b.getDate().compareTo(a.getDate()));

        return expenses;
    }

    @GetMapping("/monthly")
    public MonthlyResponse getMonthlyExpenses() {

        List<Expense> allExpenses = expenseRepository.findAll();

        LocalDate today = LocalDate.now();

        // Start of current month
        LocalDate monthStart = today.withDayOfMonth(1);

        // Start of last month
        LocalDate lastMonthStart = monthStart.minusMonths(1);

        List<Expense> currentMonth = new ArrayList<>();
        List<Expense> lastMonth = new ArrayList<>();

        for (Expense e : allExpenses) {
            if (!e.getDate().isBefore(monthStart)) {
                currentMonth.add(e);
            } else if (!e.getDate().isBefore(lastMonthStart) && e.getDate().isBefore(monthStart)) {
                lastMonth.add(e);
            }
        }

        // Sort latest first
        currentMonth.sort((a, b) -> b.getDate().compareTo(a.getDate()));

        // Totals
        double total = currentMonth.stream().mapToDouble(Expense::getAmount).sum();
        double lastMonthTotal = lastMonth.stream().mapToDouble(Expense::getAmount).sum();

        // Category summary
        Map<Expense.ExpenseType, Double> categorySummary = new HashMap<>();

        for (Expense e : currentMonth) {
            categorySummary.put(
                    e.getType(),
                    categorySummary.getOrDefault(e.getType(), 0.0) + e.getAmount()
            );
        }

        MonthlyResponse response = new MonthlyResponse();
        response.setExpenses(currentMonth);
        response.setCategorySummary(categorySummary);
        response.setTotal(total);
        response.setLastMonthTotal(lastMonthTotal);
        response.setDifference(total - lastMonthTotal);

        return response;
    }

    @GetMapping("/ai/suggestion")
    public String getAISuggestion() {

        List<Expense> allExpenses = expenseRepository.findAll();

        LocalDate today = LocalDate.now();
        LocalDate weekStart = today.minusDays(7);

        double total = 0;

        Map<Expense.ExpenseType, Double> categoryMap = new HashMap<>();

        for (Expense e : allExpenses) {
            if (!e.getDate().isBefore(weekStart)) {
                total += e.getAmount();

                categoryMap.put(
                        e.getType(),
                        categoryMap.getOrDefault(e.getType(), 0.0) + e.getAmount()
                );
            }
        }

        // Find highest spending category
        Expense.ExpenseType maxCategory = null;
        double maxAmount = 0;

        for (Map.Entry<Expense.ExpenseType, Double> entry : categoryMap.entrySet()) {
            if (entry.getValue() > maxAmount) {
                maxAmount = entry.getValue();
                maxCategory = entry.getKey();
            }
        }

        if (maxCategory == null) {
            return "No expenses this week.";
        }

        return "You are spending most on " + maxCategory +
                ". Try to reduce it to save more money 💡";
    }

    @GetMapping("/monthly/download")
    public String downloadMonthlyExpenses() {

        List<Expense> allExpenses = expenseRepository.findAll();

        LocalDate today = LocalDate.now();
        LocalDate monthStart = today.withDayOfMonth(1);

        List<Expense> currentMonth = new ArrayList<>();

        for (Expense e : allExpenses) {
            if (!e.getDate().isBefore(monthStart)) {
                currentMonth.add(e);
            }
        }

        StringBuilder csv = new StringBuilder();

        // Header
        csv.append("Date,Amount,Type,Description\n");

        // Data
        for (Expense e : currentMonth) {
            csv.append(e.getDate()).append(",")
                    .append(e.getAmount()).append(",")
                    .append(e.getType()).append(",")
                    .append(e.getDescription()).append("\n");
        }

        return csv.toString();
    }
    // Get All Expenses (FETCH from DB)
    @GetMapping
    public List<Expense> getAllExpenses() {
        return expenseRepository.findAll();
    }

    // Delete Expense by ID
    @DeleteMapping("/{id}")
    public String deleteExpense(@PathVariable int id) {

        if (expenseRepository.existsById(id)) {
            expenseRepository.deleteById(id);
            return "Expense deleted successfully!";
        } else {
            return "Expense not found!";
        }
    }
    @GetMapping("/weekly")
    public WeeklyResponse getWeeklyExpenses() {

        List<Expense> allExpenses = expenseRepository.findAll();

        LocalDate today = LocalDate.now();
        LocalDate weekStart = today.minusDays(7);
        LocalDate lastWeekStart = weekStart.minusDays(7);

        List<Expense> currentWeek = new ArrayList<>();
        List<Expense> lastWeek = new ArrayList<>();

        for (Expense e : allExpenses) {
            if (e.getDate().isAfter(weekStart) && e.getDate().isBefore(today.plusDays(1))) {
                currentWeek.add(e);
            } else if (e.getDate().isAfter(lastWeekStart) && e.getDate().isBefore(weekStart)) {
                lastWeek.add(e);
            }
        }

        // Sort by date (latest first)
        currentWeek.sort((a, b) -> b.getDate().compareTo(a.getDate()));

        // Total calculation
        double total = currentWeek.stream().mapToDouble(Expense::getAmount).sum();
        double lastWeekTotal = lastWeek.stream().mapToDouble(Expense::getAmount).sum();

        // Category summary
        Map<Expense.ExpenseType, Double> categorySummary = new HashMap<>();

        for (Expense e : currentWeek) {
            categorySummary.put(
                    e.getType(),
                    categorySummary.getOrDefault(e.getType(), 0.0) + e.getAmount()
            );
        }

        WeeklyResponse response = new WeeklyResponse();
        response.setExpenses(currentWeek);
        response.setCategorySummary(categorySummary);
        response.setTotal(total);
        response.setLastWeekTotal(lastWeekTotal);
        response.setDifference(total - lastWeekTotal);

        return response;
    }
    // Update Expense by ID
    @PutMapping("/{id}")
    public String updateExpense(@PathVariable int id, @RequestBody Expense expense) {

        if (expenseRepository.existsById(id)) {
            expense.setId(id);
            expenseRepository.save(expense);
            return "Expense updated successfully!";
        } else {
            return "Expense not found!";
        }
    }
}