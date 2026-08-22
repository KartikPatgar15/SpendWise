package com.spendwise.model;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "savings_goals")
public class SavingsGoal {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id")
    private Long userId;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private double targetAmount;

    @Column(nullable = false)
    private double savedAmount;

    private LocalDate targetDate;

    @Column(nullable = false)
    private boolean completed = false;

    public SavingsGoal() {}

    public Long getId()              { return id; }
    public Long getUserId()          { return userId; }
    public String getName()          { return name; }
    public double getTargetAmount()  { return targetAmount; }
    public double getSavedAmount()   { return savedAmount; }
    public LocalDate getTargetDate() { return targetDate; }
    public boolean isCompleted()     { return completed; }

    public void setId(Long id)                   { this.id = id; }
    public void setUserId(Long userId)           { this.userId = userId; }
    public void setName(String n)                { this.name = n; }
    public void setTargetAmount(double a)        { this.targetAmount = a; }
    public void setSavedAmount(double a)         { this.savedAmount = a; }
    public void setTargetDate(LocalDate d)       { this.targetDate = d; }
    public void setCompleted(boolean c)          { this.completed = c; }
}
