// src/main/java/com/spendwise/repository/SavingsGoalRepository.java
package com.spendwise.repository;

import com.spendwise.model.SavingsGoal;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface SavingsGoalRepository extends JpaRepository<SavingsGoal, Long> {
    List<SavingsGoal> findByCompletedFalse();
    List<SavingsGoal> findByCompletedTrue();
}
