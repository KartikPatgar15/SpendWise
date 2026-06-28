// src/main/java/com/spendwise/repository/BudgetRepository.java
// NEW file — Phase 2.

package com.spendwise.repository;

import com.spendwise.model.Budget;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface BudgetRepository extends JpaRepository<Budget, Long> {

    // Find budget for a specific month + year
    Optional<Budget> findByMonthAndYear(int month, int year);
}
