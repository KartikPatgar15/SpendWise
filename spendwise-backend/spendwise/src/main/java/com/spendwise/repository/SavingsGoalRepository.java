package com.spendwise.repository;

import com.spendwise.model.SavingsGoal;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface SavingsGoalRepository extends JpaRepository<SavingsGoal, Long> {

    List<SavingsGoal> findByUserIdAndCompletedFalse(Long userId);

    List<SavingsGoal> findByUserIdAndCompletedTrue(Long userId);

    Optional<SavingsGoal> findByIdAndUserId(Long id, Long userId);

    List<SavingsGoal> findByUserIdIsNull();

    List<SavingsGoal> findByCompletedFalse();

    List<SavingsGoal> findByCompletedTrue();
}
