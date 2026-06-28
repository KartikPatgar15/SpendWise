// src/main/java/com/spendwise/controller/RecurringExpenseController.java
// FIXED: Expense.setType() takes ExpenseType enum — convert String via Enum.valueOf()
// FIXED: Expense.setDate() takes LocalDate — pass LocalDate directly, not String
// FIXED: No embedded interfaces — file contains only this class

package com.spendwise.controller;

import com.spendwise.model.Expense;
import com.spendwise.model.RecurringExpense;
import com.spendwise.repository.ExpenseRepository;
import com.spendwise.repository.RecurringExpenseRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/recurring")
@CrossOrigin(origins = "*")
public class RecurringExpenseController {

    private final RecurringExpenseRepository recurringRepo;
    private final ExpenseRepository expenseRepo;

    public RecurringExpenseController(RecurringExpenseRepository recurringRepo,
                                      ExpenseRepository expenseRepo) {
        this.recurringRepo = recurringRepo;
        this.expenseRepo   = expenseRepo;
    }

    @GetMapping
    public List<RecurringExpense> getAll() {
        return recurringRepo.findByActiveTrue();
    }

    @PostMapping
    public ResponseEntity<RecurringExpense> create(@RequestBody RecurringExpense r) {
        r.setActive(true);
        return ResponseEntity.ok(recurringRepo.save(r));
    }

    @PutMapping("/{id}")
    public ResponseEntity<RecurringExpense> update(@PathVariable Long id,
                                                   @RequestBody RecurringExpense updated) {
        return recurringRepo.findById(id).map(r -> {
            r.setDescription(updated.getDescription());
            r.setAmount(updated.getAmount());
            r.setType(updated.getType());
            r.setFrequency(updated.getFrequency());
            r.setDayOf(updated.getDayOf());
            r.setEndDate(updated.getEndDate());
            r.setActive(updated.isActive());
            return ResponseEntity.ok(recurringRepo.save(r));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        recurringRepo.findById(id).ifPresent(r -> {
            r.setActive(false);
            recurringRepo.save(r);
        });
        return ResponseEntity.noContent().build();
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
            if (r.getEndDate() != null && today.isAfter(r.getEndDate())) continue;

            boolean isDue = switch (r.getFrequency()) {
                case "DAILY"   -> true;
                case "WEEKLY"  -> r.getDayOf() != null && today.getDayOfWeek().getValue() == r.getDayOf();
                case "MONTHLY" -> r.getDayOf() != null && today.getDayOfMonth() == r.getDayOf();
                default        -> false;
            };

            if (isDue) {
                String tag = "[R] " + r.getDescription();

                // Check not already created today — compare LocalDate directly
                boolean alreadyCreated = expenseRepo.findAll().stream()
                        .anyMatch(e -> e.getDescription().equals(tag)
                                && today.equals(e.getDate()));

                if (!alreadyCreated) {
                    Expense e = new Expense();
                    e.setDescription(tag);
                    e.setAmount(r.getAmount());
                    // FIXED: convert String → ExpenseType enum safely
                    try {
                        e.setType(Expense.ExpenseType.valueOf(r.getType()));
                    } catch (IllegalArgumentException ex) {
                        e.setType(Expense.ExpenseType.OTHER);
                    }
                    // FIXED: setDate() takes LocalDate, not String
                    e.setDate(today);
                    expenseRepo.save(e);
                }
            }
        }
    }
}