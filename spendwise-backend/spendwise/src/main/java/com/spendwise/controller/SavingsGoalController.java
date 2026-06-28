// src/main/java/com/spendwise/controller/SavingsGoalController.java
// Phase 3 — CRUD for savings goals + contribute endpoint.

package com.spendwise.controller;

import com.spendwise.model.SavingsGoal;
import com.spendwise.repository.SavingsGoalRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/goals")
@CrossOrigin(origins = "*")
public class SavingsGoalController {

    private final SavingsGoalRepository goalRepo;

    public SavingsGoalController(SavingsGoalRepository goalRepo) {
        this.goalRepo = goalRepo;
    }

    // GET /goals — all active (incomplete) goals
    @GetMapping
    public List<SavingsGoal> getActive() {
        return goalRepo.findByCompletedFalse();
    }

    // GET /goals/completed
    @GetMapping("/completed")
    public List<SavingsGoal> getCompleted() {
        return goalRepo.findByCompletedTrue();
    }

    // POST /goals — create goal
    @PostMapping
    public ResponseEntity<SavingsGoal> create(@RequestBody SavingsGoal goal) {
        goal.setSavedAmount(0);
        goal.setCompleted(false);
        return ResponseEntity.ok(goalRepo.save(goal));
    }

    // PUT /goals/{id} — update goal name/target/date
    @PutMapping("/{id}")
    public ResponseEntity<SavingsGoal> update(@PathVariable Long id,
                                              @RequestBody SavingsGoal updated) {
        return goalRepo.findById(id).map(g -> {
            g.setName(updated.getName());
            g.setTargetAmount(updated.getTargetAmount());
            g.setTargetDate(updated.getTargetDate());
            return ResponseEntity.ok(goalRepo.save(g));
        }).orElse(ResponseEntity.notFound().build());
    }

    // POST /goals/{id}/contribute — add amount to savedAmount
    // Body: { "amount": 500 }
    @PostMapping("/{id}/contribute")
    public ResponseEntity<SavingsGoal> contribute(@PathVariable Long id,
                                                  @RequestBody Map<String, Double> body) {
        return goalRepo.findById(id).map(g -> {
            double contribution = body.getOrDefault("amount", 0.0);
            double newSaved     = g.getSavedAmount() + contribution;
            g.setSavedAmount(newSaved);

            // Auto-complete when target reached
            if (newSaved >= g.getTargetAmount()) {
                g.setCompleted(true);
            }

            return ResponseEntity.ok(goalRepo.save(g));
        }).orElse(ResponseEntity.notFound().build());
    }

    // DELETE /goals/{id}
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        goalRepo.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
