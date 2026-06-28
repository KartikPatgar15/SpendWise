// src/main/java/com/spendwise/model/RecurringExpense.java
// Phase 3 — Recurring Expenses entity.

package com.spendwise.model;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "recurring_expenses")
public class RecurringExpense {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String description;

    @Column(nullable = false)
    private double amount;

    @Column(nullable = false)
    private String type; // FOOD, TRAVEL, etc.

    // DAILY, WEEKLY, MONTHLY
    @Column(nullable = false)
    private String frequency;

    // Day of month (1-28) for MONTHLY; day of week (1=Mon) for WEEKLY
    private Integer dayOf;

    // Date this recurring expense starts
    @Column(nullable = false)
    private LocalDate startDate;

    // Optional end date — null means indefinite
    private LocalDate endDate;

    @Column(nullable = false)
    private boolean active = true;

    // ── Constructors ──────────────────────────────────────────────────────────
    public RecurringExpense() {}

    // ── Getters & Setters ─────────────────────────────────────────────────────
    public Long getId()                  { return id; }
    public String getDescription()       { return description; }
    public double getAmount()            { return amount; }
    public String getType()              { return type; }
    public String getFrequency()         { return frequency; }
    public Integer getDayOf()            { return dayOf; }
    public LocalDate getStartDate()      { return startDate; }
    public LocalDate getEndDate()        { return endDate; }
    public boolean isActive()            { return active; }

    public void setId(Long id)                   { this.id = id; }
    public void setDescription(String d)         { this.description = d; }
    public void setAmount(double a)              { this.amount = a; }
    public void setType(String t)                { this.type = t; }
    public void setFrequency(String f)           { this.frequency = f; }
    public void setDayOf(Integer d)              { this.dayOf = d; }
    public void setStartDate(LocalDate d)        { this.startDate = d; }
    public void setEndDate(LocalDate d)          { this.endDate = d; }
    public void setActive(boolean a)             { this.active = a; }
}
