package com.spendwise.controller;

import com.spendwise.model.Budget;
import com.spendwise.repository.BudgetRepository;
import com.spendwise.security.UserPrincipal;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/budget")
public class BudgetController {

    private final BudgetRepository budgetRepository;

    public BudgetController(BudgetRepository budgetRepository) {
        this.budgetRepository = budgetRepository;
    }

    // ── GET /budget/current ───────────────────────────────────────────────────
    // Returns the budget for current user's current month.
    @GetMapping("/current")
    public ResponseEntity<Map<String, Object>> getCurrentBudget(@AuthenticationPrincipal UserPrincipal principal) {
        LocalDate now   = LocalDate.now();
        int month       = now.getMonthValue();
        int year        = now.getYear();

        Optional<Budget> budget = budgetRepository.findByUserIdAndMonthAndYear(principal.getId(), month, year);

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
    // Returns budget for current user's specific month/year.
    @GetMapping
    public ResponseEntity<Map<String, Object>> getBudget(
            @RequestParam int month,
            @RequestParam int year,
            @AuthenticationPrincipal UserPrincipal principal) {

        Optional<Budget> budget = budgetRepository.findByUserIdAndMonthAndYear(principal.getId(), month, year);
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
    // Create or update budget for a month scoped to current user.
    @PostMapping
    public ResponseEntity<Budget> setbudget(@RequestBody Budget request, @AuthenticationPrincipal UserPrincipal principal) {
        Optional<Budget> existing = budgetRepository.findByUserIdAndMonthAndYear(
                principal.getId(), request.getMonth(), request.getYear());

        Budget budget;
        if (existing.isPresent()) {
            budget = existing.get();
            budget.setAmount(request.getAmount());
        } else {
            budget = new Budget(principal.getId(), request.getMonth(), request.getYear(), request.getAmount());
        }

        return ResponseEntity.ok(budgetRepository.save(budget));
    }

    // ── DELETE /budget/{id} ───────────────────────────────────────────────────
    // Deletes budget only if it belongs to current user.
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBudget(@PathVariable Long id, @AuthenticationPrincipal UserPrincipal principal) {
        Optional<Budget> existing = budgetRepository.findByIdAndUserId(id, principal.getId());
        if (existing.isPresent()) {
            budgetRepository.delete(existing.get());
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }
}
