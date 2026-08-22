package com.spendwise.controller;

import com.spendwise.model.SavingsGoal;
import com.spendwise.repository.SavingsGoalRepository;
import com.spendwise.security.UserPrincipal;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/goals")
public class SavingsGoalController {

    private final SavingsGoalRepository goalRepo;

    public SavingsGoalController(SavingsGoalRepository goalRepo) {
        this.goalRepo = goalRepo;
    }

    // GET /goals — all active (incomplete) goals for current user
    @GetMapping
    public List<SavingsGoal> getActive(@AuthenticationPrincipal UserPrincipal principal) {
        return goalRepo.findByUserIdAndCompletedFalse(principal.getId());
    }

    // GET /goals/completed — all completed goals for current user
    @GetMapping("/completed")
    public List<SavingsGoal> getCompleted(@AuthenticationPrincipal UserPrincipal principal) {
        return goalRepo.findByUserIdAndCompletedTrue(principal.getId());
    }

    // POST /goals — create goal for current user
    @PostMapping
    public ResponseEntity<SavingsGoal> create(@RequestBody SavingsGoal goal, @AuthenticationPrincipal UserPrincipal principal) {
        goal.setUserId(principal.getId());
        goal.setSavedAmount(0);
        goal.setCompleted(false);
        return ResponseEntity.ok(goalRepo.save(goal));
    }

    // PUT /goals/{id} — update goal name/target/date if owned by current user
    @PutMapping("/{id}")
    public ResponseEntity<SavingsGoal> update(@PathVariable Long id,
                                              @RequestBody SavingsGoal updated,
                                              @AuthenticationPrincipal UserPrincipal principal) {
        return goalRepo.findByIdAndUserId(id, principal.getId()).map(g -> {
            g.setName(updated.getName());
            g.setTargetAmount(updated.getTargetAmount());
            g.setTargetDate(updated.getTargetDate());
            return ResponseEntity.ok(goalRepo.save(g));
        }).orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }

    // POST /goals/{id}/contribute — add amount to savedAmount if owned by current user
    @PostMapping("/{id}/contribute")
    public ResponseEntity<SavingsGoal> contribute(@PathVariable Long id,
                                                  @RequestBody Map<String, Double> body,
                                                  @AuthenticationPrincipal UserPrincipal principal) {
        return goalRepo.findByIdAndUserId(id, principal.getId()).map(g -> {
            double contribution = body.getOrDefault("amount", 0.0);
            double newSaved     = g.getSavedAmount() + contribution;
            g.setSavedAmount(newSaved);

            // Auto-complete when target reached
            if (newSaved >= g.getTargetAmount()) {
                g.setCompleted(true);
            }

            return ResponseEntity.ok(goalRepo.save(g));
        }).orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }

    // DELETE /goals/{id} — delete only if owned by current user
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id, @AuthenticationPrincipal UserPrincipal principal) {
        return goalRepo.findByIdAndUserId(id, principal.getId()).map(g -> {
            goalRepo.delete(g);
            return ResponseEntity.noContent().<Void>build();
        }).orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }
}
