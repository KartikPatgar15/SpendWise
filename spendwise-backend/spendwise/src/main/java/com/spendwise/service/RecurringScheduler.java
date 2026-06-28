// src/main/java/com/spendwise/service/RecurringScheduler.java
// FIX: package was "services" — corrected to "service" to match project structure.

package com.spendwise.service;

import com.spendwise.controller.RecurringExpenseController;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
public class RecurringScheduler {

    private final RecurringExpenseController controller;

    public RecurringScheduler(RecurringExpenseController controller) {
        this.controller = controller;
    }

    // Runs every day at 00:01
    @Scheduled(cron = "0 1 0 * * *")
    public void runDaily() {
        controller.processRecurringExpenses();
    }
}
