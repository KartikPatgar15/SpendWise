package com.spendwise.model;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
public class Expense {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    private LocalDate date;   //

    private double amount;

    @Enumerated(EnumType.STRING)
    private ExpenseType type;   //

    private String description;

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public LocalDate getDate() {   //
        return date;
    }

    public void setDate(LocalDate date) {   //
        this.date = date;
    }

    public double getAmount() {
        return amount;
    }

    public void setAmount(double amount) {
        this.amount = amount;
    }

    public ExpenseType getType() {   //
        return type;
    }

    public void setType(ExpenseType type) {   //
        this.type = type;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public enum ExpenseType {
        FOOD,
        TRAVEL,
        MOBILE,
        LENT,
        ENTERTAINMENT,
        OTHER
    }
}