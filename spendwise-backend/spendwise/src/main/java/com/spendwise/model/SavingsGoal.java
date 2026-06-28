// src/main/java/com/spendwise/model/SavingsGoal.java
// Phase 3 — Savings Goals entity.

package com.spendwise.model;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "savings_goals")
public class SavingsGoal {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name; // e.g. "New Laptop", "Emergency Fund"

    @Column(nullable = false)
    private double targetAmount;

    @Column(nullable = false)
    private double savedAmount; // manually updated by user

    // Optional target date
    private LocalDate targetDate;

    @Column(nullable = false)
    private boolean completed = false;

    // ── Constructors ──────────────────────────────────────────────────────────
    public SavingsGoal() {}

    // ── Getters & Setters ─────────────────────────────────────────────────────
    public Long getId()              { return id; }
    public String getName()          { return name; }
    public double getTargetAmount()  { return targetAmount; }
    public double getSavedAmount()   { return savedAmount; }
    public LocalDate getTargetDate() { return targetDate; }
    public boolean isCompleted()     { return completed; }

    public void setId(Long id)                   { this.id = id; }
    public void setName(String n)                { this.name = n; }
    public void setTargetAmount(double a)        { this.targetAmount = a; }
    public void setSavedAmount(double a)         { this.savedAmount = a; }
    public void setTargetDate(LocalDate d)       { this.targetDate = d; }
    public void setCompleted(boolean c)          { this.completed = c; }
}
