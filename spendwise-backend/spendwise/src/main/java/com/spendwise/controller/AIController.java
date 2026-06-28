// src/main/java/com/spendwise/controller/AIController.java
// FIXED: getType() returns ExpenseType enum — use .name() to get String for groupingBy
// FIXED: getDate() returns LocalDate — no String conversion needed
// FIXED: getAmount() returns double — no parsing needed
// FIXED: No other classes embedded in this file

package com.spendwise.controller;

import com.spendwise.model.Expense;
import com.spendwise.repository.ExpenseRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/ai")
@CrossOrigin(origins = "*")
public class AIController {

    private final ExpenseRepository expenseRepo;
    private final RestTemplate restTemplate = new RestTemplate();

    @Value("${openai.api.key:}")
    private String openAiKey;

    private static final String OPENAI_URL = "https://api.openai.com/v1/chat/completions";
    private static final String MODEL      = "gpt-3.5-turbo";

    public AIController(ExpenseRepository expenseRepo) {
        this.expenseRepo = expenseRepo;
    }

    // GET /ai/insights
    @GetMapping("/insights")
    public ResponseEntity<Map<String, Object>> getInsights() {
        String summary = buildExpenseSummary();
        String prompt = """
            You are a personal finance advisor. Analyze this expense data and provide:
            1. 3 key spending insights (be specific with numbers)
            2. 3 actionable tips to reduce spending
            3. One positive observation about their spending habits

            Expense data:
            """ + summary + """

            Respond ONLY in this JSON format (no extra text):
            {
              "insights": ["insight1", "insight2", "insight3"],
              "tips": ["tip1", "tip2", "tip3"],
              "positive": "positive observation"
            }
            """;
        return callOpenAI(prompt);
    }

    // GET /ai/budget-suggestion
    @GetMapping("/budget-suggestion")
    public ResponseEntity<Map<String, Object>> getBudgetSuggestion() {
        String summary = buildExpenseSummary();
        String prompt = """
            Based on this spending data, suggest a realistic monthly budget.
            Consider the user's spending patterns and suggest 10-15%% savings.

            Expense data:
            """ + summary + """

            Respond ONLY in this JSON format (no extra text):
            {
              "suggestedBudget": 15000,
              "reasoning": "explanation",
              "breakdown": {
                "FOOD": 4000,
                "TRAVEL": 2000,
                "MOBILE": 1000,
                "ENTERTAINMENT": 1500,
                "OTHER": 2000
              }
            }
            """;
        return callOpenAI(prompt);
    }

    // POST /ai/categorize
    @PostMapping("/categorize")
    public ResponseEntity<Map<String, Object>> categorize(@RequestBody Map<String, String> body) {
        String description = body.getOrDefault("description", "");
        String prompt = "Categorize this expense into one of: FOOD, TRAVEL, MOBILE, ENTERTAINMENT, LENT, OTHER.\n"
                + "Description: \"" + description + "\"\n"
                + "Respond ONLY in JSON: { \"category\": \"FOOD\", \"confidence\": \"high\" }";
        return callOpenAI(prompt);
    }

    // ── Helpers ───────────────────────────────────────────────────────────────

    private String buildExpenseSummary() {
        List<Expense> all = expenseRepo.findAll();

        // FIXED: getType() returns ExpenseType enum — call .name() to get String key
        // FIXED: getAmount() returns double — no parsing needed
        Map<String, Double> byCategory = all.stream()
                .collect(Collectors.groupingBy(
                        e -> e.getType().name(),
                        Collectors.summingDouble(Expense::getAmount)
                ));

        double total = byCategory.values().stream().mapToDouble(Double::doubleValue).sum();

        StringBuilder sb = new StringBuilder();
        sb.append("Total expenses: ₹").append(String.format("%.2f", total)).append("\n");
        sb.append("Transaction count: ").append(all.size()).append("\n");
        sb.append("Category breakdown:\n");
        byCategory.forEach((cat, amt) ->
                sb.append("  ").append(cat)
                        .append(": ₹").append(String.format("%.2f", amt)).append("\n"));

        return sb.toString();
    }

    @SuppressWarnings("unchecked")
    private ResponseEntity<Map<String, Object>> callOpenAI(String prompt) {
        if (openAiKey == null || openAiKey.isBlank()) {
            return ResponseEntity.status(503).body(Map.of(
                    "error", "OpenAI API key not configured",
                    "hint",  "Set OPENAI_API_KEY environment variable"
            ));
        }

        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.setBearerAuth(openAiKey);

            Map<String, Object> requestBody = Map.of(
                    "model",       MODEL,
                    "messages",    List.of(Map.of("role", "user", "content", prompt)),
                    "temperature", 0.3
            );

            HttpEntity<Map<String, Object>> request = new HttpEntity<>(requestBody, headers);
            ResponseEntity<Map> response = restTemplate.postForEntity(OPENAI_URL, request, Map.class);

            List<Map<String, Object>> choices =
                    (List<Map<String, Object>>) response.getBody().get("choices");
            Map<String, Object> message =
                    (Map<String, Object>) choices.get(0).get("message");
            String content = (String) message.get("content");

            // Strip markdown code fences if present
            content = content.trim();
            if (content.startsWith("```json")) content = content.substring(7);
            if (content.startsWith("```"))     content = content.substring(3);
            if (content.endsWith("```"))       content = content.substring(0, content.length() - 3);

            return ResponseEntity.ok(Map.of("result", content.trim()));

        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }
}