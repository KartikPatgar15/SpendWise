// src/main/java/com/spendwise/model/Budget.java
// NEW file — Phase 2. Does not touch any existing model.

package com.spendwise.model;

import jakarta.persistence.*;

@Entity
@Table(
    name = "budgets",
    uniqueConstraints = @UniqueConstraint(columnNames = {"month", "year"})
)
public class Budget {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // 1–12
    @Column(nullable = false)
    private int month;

    @Column(nullable = false)
    private int year;

    @Column(nullable = false)
    private double amount;

    // ── Constructors ──────────────────────────────────────────────────────────
    public Budget() {}

    public Budget(int month, int year, double amount) {
        this.month  = month;
        this.year   = year;
        this.amount = amount;
    }

    // ── Getters & Setters ─────────────────────────────────────────────────────
    public Long getId()             { return id; }
    public int  getMonth()          { return month; }
    public int  getYear()           { return year; }
    public double getAmount()       { return amount; }

    public void setId(Long id)          { this.id = id; }
    public void setMonth(int month)     { this.month = month; }
    public void setYear(int year)       { this.year = year; }
    public void setAmount(double amount){ this.amount = amount; }
}
