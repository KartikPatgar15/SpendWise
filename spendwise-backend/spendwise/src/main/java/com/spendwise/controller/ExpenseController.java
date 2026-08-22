package com.spendwise.controller;

import com.spendwise.model.Expense;
import com.spendwise.model.MonthlyResponse;
import com.spendwise.model.WeeklyResponse;
import com.spendwise.repository.ExpenseRepository;
import com.spendwise.security.UserPrincipal;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.*;

@RestController
@RequestMapping("/expenses")
public class ExpenseController {

    private final ExpenseRepository expenseRepository;

    public ExpenseController(ExpenseRepository expenseRepository) {
        this.expenseRepository = expenseRepository;
    }

    // Add Expense (SAVE to DB with authenticated userId)
    @PostMapping
    public Expense addExpense(@RequestBody Expense expense, @AuthenticationPrincipal UserPrincipal principal) {
        expense.setUserId(principal.getId());
        return expenseRepository.save(expense);
    }

    @GetMapping("/history")
    public List<Expense> getAllHistory(@AuthenticationPrincipal UserPrincipal principal) {
        return expenseRepository.findByUserIdOrderByDateDesc(principal.getId());
    }

    @GetMapping("/monthly")
    public MonthlyResponse getMonthlyExpenses(@AuthenticationPrincipal UserPrincipal principal) {
        List<Expense> allExpenses = expenseRepository.findByUserId(principal.getId());

        LocalDate today = LocalDate.now();

        // Start of current month
        LocalDate monthStart = today.withDayOfMonth(1);

        // Start of last month
        LocalDate lastMonthStart = monthStart.minusMonths(1);

        List<Expense> currentMonth = new ArrayList<>();
        List<Expense> lastMonth = new ArrayList<>();

        for (Expense e : allExpenses) {
            if (e.getDate() != null) {
                if (!e.getDate().isBefore(monthStart)) {
                    currentMonth.add(e);
                } else if (!e.getDate().isBefore(lastMonthStart) && e.getDate().isBefore(monthStart)) {
                    lastMonth.add(e);
                }
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
            if (e.getType() != null) {
                categorySummary.put(
                        e.getType(),
                        categorySummary.getOrDefault(e.getType(), 0.0) + e.getAmount()
                );
            }
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
    public String getAISuggestion(@AuthenticationPrincipal UserPrincipal principal) {
        List<Expense> allExpenses = expenseRepository.findByUserId(principal.getId());

        LocalDate today = LocalDate.now();
        LocalDate weekStart = today.minusDays(7);

        double total = 0;
        Map<Expense.ExpenseType, Double> categoryMap = new HashMap<>();

        for (Expense e : allExpenses) {
            if (e.getDate() != null && !e.getDate().isBefore(weekStart)) {
                total += e.getAmount();

                if (e.getType() != null) {
                    categoryMap.put(
                            e.getType(),
                            categoryMap.getOrDefault(e.getType(), 0.0) + e.getAmount()
                    );
                }
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
    public String downloadMonthlyExpenses(@AuthenticationPrincipal UserPrincipal principal) {
        List<Expense> allExpenses = expenseRepository.findByUserId(principal.getId());

        LocalDate today = LocalDate.now();
        LocalDate monthStart = today.withDayOfMonth(1);

        List<Expense> currentMonth = new ArrayList<>();

        for (Expense e : allExpenses) {
            if (e.getDate() != null && !e.getDate().isBefore(monthStart)) {
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
                    .append(e.getDescription() != null ? e.getDescription().replace(",", " ") : "").append("\n");
        }

        return csv.toString();
    }

    // Get All Expenses (FETCH from DB for authenticated user)
    @GetMapping
    public List<Expense> getAllExpenses(@AuthenticationPrincipal UserPrincipal principal) {
        return expenseRepository.findByUserId(principal.getId());
    }

    // Delete Expense by ID (Only allowed if expense belongs to authenticated user)
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteExpense(@PathVariable int id, @AuthenticationPrincipal UserPrincipal principal) {
        Optional<Expense> expenseOpt = expenseRepository.findByIdAndUserId(id, principal.getId());

        if (expenseOpt.isPresent()) {
            expenseRepository.delete(expenseOpt.get());
            return ResponseEntity.ok("Expense deleted successfully!");
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Expense not found!");
        }
    }

    @GetMapping("/weekly")
    public WeeklyResponse getWeeklyExpenses(@AuthenticationPrincipal UserPrincipal principal) {
        List<Expense> allExpenses = expenseRepository.findByUserId(principal.getId());

        LocalDate today = LocalDate.now();
        LocalDate weekStart = today.minusDays(7);
        LocalDate lastWeekStart = weekStart.minusDays(7);

        List<Expense> currentWeek = new ArrayList<>();
        List<Expense> lastWeek = new ArrayList<>();

        for (Expense e : allExpenses) {
            if (e.getDate() != null) {
                if (e.getDate().isAfter(weekStart) && e.getDate().isBefore(today.plusDays(1))) {
                    currentWeek.add(e);
                } else if (e.getDate().isAfter(lastWeekStart) && e.getDate().isBefore(weekStart)) {
                    lastWeek.add(e);
                }
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
            if (e.getType() != null) {
                categorySummary.put(
                        e.getType(),
                        categorySummary.getOrDefault(e.getType(), 0.0) + e.getAmount()
                );
            }
        }

        WeeklyResponse response = new WeeklyResponse();
        response.setExpenses(currentWeek);
        response.setCategorySummary(categorySummary);
        response.setTotal(total);
        response.setLastWeekTotal(lastWeekTotal);
        response.setDifference(total - lastWeekTotal);

        return response;
    }

    // Update Expense by ID (Only allowed if expense belongs to authenticated user)
    @PutMapping("/{id}")
    public ResponseEntity<String> updateExpense(@PathVariable int id, @RequestBody Expense expense, @AuthenticationPrincipal UserPrincipal principal) {
        Optional<Expense> expenseOpt = expenseRepository.findByIdAndUserId(id, principal.getId());

        if (expenseOpt.isPresent()) {
            expense.setId(id);
            expense.setUserId(principal.getId());
            expenseRepository.save(expense);
            return ResponseEntity.ok("Expense updated successfully!");
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Expense not found!");
        }
    }
}