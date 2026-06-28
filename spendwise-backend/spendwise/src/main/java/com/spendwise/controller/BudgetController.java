// src/main/java/com/spendwise/controller/BudgetController.java
// NEW file — Phase 2. Does not modify ExpenseController.

package com.spendwise.controller;

import com.spendwise.model.Budget;
import com.spendwise.repository.BudgetRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/budget")
@CrossOrigin(origins = "*")
public class BudgetController {

    private final BudgetRepository budgetRepository;

    public BudgetController(BudgetRepository budgetRepository) {
        this.budgetRepository = budgetRepository;
    }

    // ── GET /budget/current ───────────────────────────────────────────────────
    // Returns the budget for the current month.
    // Frontend calls this on app load to hydrate useBudget hook.
    @GetMapping("/current")
    public ResponseEntity<Map<String, Object>> getCurrentBudget() {
        LocalDate now   = LocalDate.now();
        int month       = now.getMonthValue();
        int year        = now.getYear();

        Optional<Budget> budget = budgetRepository.findByMonthAndYear(month, year);

        Map<String, Object> response = new HashMap<>();
        if (budget.isPresent()) {
            response.put("found",  true);
            response.put("id",     budget.get().getId());
            response.put("month",  budget.get().getMonth());
            response.put("year",   budget.get().getYear());
            response.put("amount", budget.get().getAmount());
        } else {
            response.put("found",  false);
            response.put("amount", 0);
        }
        return ResponseEntity.ok(response);
    }

    // ── GET /budget?month=6&year=2025 ─────────────────────────────────────────
    // Returns budget for a specific month/year (for historical views).
    @GetMapping
    public ResponseEntity<Map<String, Object>> getBudget(
            @RequestParam int month,
            @RequestParam int year) {

        Optional<Budget> budget = budgetRepository.findByMonthAndYear(month, year);
        Map<String, Object> response = new HashMap<>();

        if (budget.isPresent()) {
            response.put("found",  true);
            response.put("id",     budget.get().getId());
            response.put("month",  budget.get().getMonth());
            response.put("year",   budget.get().getYear());
            response.put("amount", budget.get().getAmount());
        } else {
            response.put("found",  false);
            response.put("amount", 0);
        }
        return ResponseEntity.ok(response);
    }

    // ── POST /budget ──────────────────────────────────────────────────────────
    // Create or update budget for a month.
    // Body: { "month": 6, "year": 2025, "amount": 12000 }
    @PostMapping
    public ResponseEntity<Budget> setbudget(@RequestBody Budget request) {
        Optional<Budget> existing = budgetRepository.findByMonthAndYear(
                request.getMonth(), request.getYear());

        Budget budget;
        if (existing.isPresent()) {
            // Update existing
            budget = existing.get();
            budget.setAmount(request.getAmount());
        } else {
            // Create new
            budget = new Budget(request.getMonth(), request.getYear(), request.getAmount());
        }

        return ResponseEntity.ok(budgetRepository.save(budget));
    }

    // ── DELETE /budget/{id} ───────────────────────────────────────────────────
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBudget(@PathVariable Long id) {
        budgetRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
