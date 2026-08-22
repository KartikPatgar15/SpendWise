package com.spendwise.controller;

import com.spendwise.model.Expense;
import com.spendwise.model.RecurringExpense;
import com.spendwise.repository.ExpenseRepository;
import com.spendwise.repository.RecurringExpenseRepository;
import com.spendwise.security.UserPrincipal;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/recurring")
public class RecurringExpenseController {

    private final RecurringExpenseRepository recurringRepo;
    private final ExpenseRepository expenseRepo;

    public RecurringExpenseController(RecurringExpenseRepository recurringRepo,
                                      ExpenseRepository expenseRepo) {
        this.recurringRepo = recurringRepo;
        this.expenseRepo   = expenseRepo;
    }

    @GetMapping
    public List<RecurringExpense> getAll(@AuthenticationPrincipal UserPrincipal principal) {
        return recurringRepo.findByUserIdAndActiveTrue(principal.getId());
    }

    @PostMapping
    public ResponseEntity<RecurringExpense> create(@RequestBody RecurringExpense r, @AuthenticationPrincipal UserPrincipal principal) {
        r.setUserId(principal.getId());
        r.setActive(true);
        return ResponseEntity.ok(recurringRepo.save(r));
    }

    @PutMapping("/{id}")
    public ResponseEntity<RecurringExpense> update(@PathVariable Long id,
                                                   @RequestBody RecurringExpense updated,
                                                   @AuthenticationPrincipal UserPrincipal principal) {
        return recurringRepo.findByIdAndUserId(id, principal.getId()).map(r -> {
            r.setDescription(updated.getDescription());
            r.setAmount(updated.getAmount());
            r.setType(updated.getType());
            r.setFrequency(updated.getFrequency());
            r.setDayOf(updated.getDayOf());
            r.setEndDate(updated.getEndDate());
            r.setActive(updated.isActive());
            return ResponseEntity.ok(recurringRepo.save(r));
        }).orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id, @AuthenticationPrincipal UserPrincipal principal) {
        return recurringRepo.findByIdAndUserId(id, principal.getId()).map(r -> {
            r.setActive(false);
            recurringRepo.save(r);
            return ResponseEntity.noContent().<Void>build();
        }).orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }

    @PostMapping("/process")
    public ResponseEntity<String> processDue() {
        processRecurringExpenses();
        return ResponseEntity.ok("Processed recurring expenses");
    }

    public void processRecurringExpenses() {
        LocalDate today = LocalDate.now();
        List<RecurringExpense> actives = recurringRepo.findByActiveTrue();

        for (RecurringExpense r : actives) {
            if (r.getUserId() == null) continue;
            if (r.getEndDate() != null && today.isAfter(r.getEndDate())) continue;

            boolean isDue = switch (r.getFrequency() != null ? r.getFrequency() : "") {
                case "DAILY"   -> true;
                case "WEEKLY"  -> r.getDayOf() != null && today.getDayOfWeek().getValue() == r.getDayOf();
                case "MONTHLY" -> r.getDayOf() != null && today.getDayOfMonth() == r.getDayOf();
                default        -> false;
            };

            if (isDue) {
                String tag = "[R] " + r.getDescription();

                // Check not already created today for this specific user
                boolean alreadyCreated = expenseRepo.findByUserId(r.getUserId()).stream()
                        .anyMatch(e -> e.getDescription() != null && e.getDescription().equals(tag)
                                && today.equals(e.getDate()));

                if (!alreadyCreated) {
                    Expense e = new Expense();
                    e.setUserId(r.getUserId());
                    e.setDescription(tag);
                    e.setAmount(r.getAmount());
                    try {
                        e.setType(Expense.ExpenseType.valueOf(r.getType()));
                    } catch (Exception ex) {
                        e.setType(Expense.ExpenseType.OTHER);
                    }
                    e.setDate(today);
                    expenseRepo.save(e);
                }
            }
        }
    }
}