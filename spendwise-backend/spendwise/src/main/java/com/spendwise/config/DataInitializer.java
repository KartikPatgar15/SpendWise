package com.spendwise.config;

import com.spendwise.model.*;
import com.spendwise.repository.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataInitializer.class);

    private final UserRepository userRepository;
    private final ExpenseRepository expenseRepository;
    private final BudgetRepository budgetRepository;
    private final SavingsGoalRepository savingsGoalRepository;
    private final RecurringExpenseRepository recurringExpenseRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(UserRepository userRepository,
                           ExpenseRepository expenseRepository,
                           BudgetRepository budgetRepository,
                           SavingsGoalRepository savingsGoalRepository,
                           RecurringExpenseRepository recurringExpenseRepository,
                           PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.expenseRepository = expenseRepository;
        this.budgetRepository = budgetRepository;
        this.savingsGoalRepository = savingsGoalRepository;
        this.recurringExpenseRepository = recurringExpenseRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        // 1. Ensure public demo account exists
        User demoUser = userRepository.findByUsername("demo").orElseGet(() -> {
            log.info("Initializing public demo account (demo / 1234)...");
            User newUser = new User("demo", passwordEncoder.encode("1234"), "USER");
            return userRepository.save(newUser);
        });

        Long demoUserId = demoUser.getId();

        // 2. Safely migrate legacy records with no userId assigned
        List<Expense> unassignedExpenses = expenseRepository.findByUserIdIsNull();
        if (!unassignedExpenses.isEmpty()) {
            log.info("Migrating {} unassigned expenses to demo user...", unassignedExpenses.size());
            for (Expense e : unassignedExpenses) {
                e.setUserId(demoUserId);
            }
            expenseRepository.saveAll(unassignedExpenses);
        }

        List<Budget> unassignedBudgets = budgetRepository.findByUserIdIsNull();
        if (!unassignedBudgets.isEmpty()) {
            log.info("Migrating {} unassigned budgets to demo user...", unassignedBudgets.size());
            for (Budget b : unassignedBudgets) {
                b.setUserId(demoUserId);
            }
            budgetRepository.saveAll(unassignedBudgets);
        }

        List<SavingsGoal> unassignedGoals = savingsGoalRepository.findByUserIdIsNull();
        if (!unassignedGoals.isEmpty()) {
            log.info("Migrating {} unassigned savings goals to demo user...", unassignedGoals.size());
            for (SavingsGoal g : unassignedGoals) {
                g.setUserId(demoUserId);
            }
            savingsGoalRepository.saveAll(unassignedGoals);
        }

        List<RecurringExpense> unassignedRecurring = recurringExpenseRepository.findByUserIdIsNull();
        if (!unassignedRecurring.isEmpty()) {
            log.info("Migrating {} unassigned recurring expenses to demo user...", unassignedRecurring.size());
            for (RecurringExpense r : unassignedRecurring) {
                r.setUserId(demoUserId);
            }
            recurringExpenseRepository.saveAll(unassignedRecurring);
        }
    }
}
