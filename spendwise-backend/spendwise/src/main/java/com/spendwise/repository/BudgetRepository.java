package com.spendwise.repository;

import com.spendwise.model.Budget;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BudgetRepository extends JpaRepository<Budget, Long> {

    Optional<Budget> findByUserIdAndMonthAndYear(Long userId, int month, int year);

    Optional<Budget> findByIdAndUserId(Long id, Long userId);

    List<Budget> findByUserIdIsNull();

    Optional<Budget> findByMonthAndYear(int month, int year);
}
