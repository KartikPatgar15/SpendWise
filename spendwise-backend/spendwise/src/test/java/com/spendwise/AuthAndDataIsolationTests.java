package com.spendwise;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.spendwise.model.*;
import com.spendwise.repository.*;
import com.spendwise.controller.RecurringExpenseController;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import java.time.LocalDate;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@TestPropertySource(locations = "classpath:application-test.properties")
public class AuthAndDataIsolationTests {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ExpenseRepository expenseRepository;

    @Autowired
    private BudgetRepository budgetRepository;

    @Autowired
    private SavingsGoalRepository savingsGoalRepository;

    @Autowired
    private RecurringExpenseRepository recurringExpenseRepository;

    @Autowired
    private RecurringExpenseController recurringController;

    private String demoToken;
    private Long demoUserId;

    private String privateToken;
    private Long privateUserId;

    @BeforeEach
    void setUp() throws Exception {
        expenseRepository.deleteAll();
        budgetRepository.deleteAll();
        savingsGoalRepository.deleteAll();
        recurringExpenseRepository.deleteAll();

        // 1. Authenticate as public demo account
        MvcResult demoLoginResult = mockMvc.perform(post("/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(Map.of(
                                "username", "demo",
                                "password", "1234"
                        ))))
                .andExpect(status().isOk())
                .andReturn();

        Map<?, ?> demoMap = objectMapper.readValue(demoLoginResult.getResponse().getContentAsString(), Map.class);
        demoToken = (String) demoMap.get("token");
        demoUserId = ((Number) demoMap.get("id")).longValue();

        // 2. Register or login private user
        if (!userRepository.existsByUsername("private_alice")) {
            MvcResult privateRegisterResult = mockMvc.perform(post("/auth/register")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(Map.of(
                                    "username", "private_alice",
                                    "password", "secretpass123"
                            ))))
                    .andExpect(status().isCreated())
                    .andReturn();

            Map<?, ?> privMap = objectMapper.readValue(privateRegisterResult.getResponse().getContentAsString(), Map.class);
            privateToken = (String) privMap.get("token");
            privateUserId = ((Number) privMap.get("id")).longValue();
        } else {
            MvcResult privateLoginResult = mockMvc.perform(post("/auth/login")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(Map.of(
                                    "username", "private_alice",
                                    "password", "secretpass123"
                            ))))
                    .andExpect(status().isOk())
                    .andReturn();

            Map<?, ?> privMap = objectMapper.readValue(privateLoginResult.getResponse().getContentAsString(), Map.class);
            privateToken = (String) privMap.get("token");
            privateUserId = ((Number) privMap.get("id")).longValue();
        }
    }

    @Test
    @DisplayName("Test 1: Public Demo Account Login & Invalid Password Rejection")
    void testDemoLoginAndSecurity() throws Exception {
        // Valid demo credentials
        mockMvc.perform(post("/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(Map.of(
                                "username", "demo",
                                "password", "1234"
                        ))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.username").value("demo"))
                .andExpect(jsonPath("$.token").isNotEmpty());

        // Invalid demo password
        mockMvc.perform(post("/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(Map.of(
                                "username", "demo",
                                "password", "wrongpass"
                        ))))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.error").value("Invalid username or password"));
    }

    @Test
    @DisplayName("Test 2: Private User Registration and Conflict on Duplicate")
    void testPrivateRegistrationAndConflict() throws Exception {
        // Duplicate username
        mockMvc.perform(post("/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(Map.of(
                                "username", "demo",
                                "password", "9999"
                        ))))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.error").value("Username is already taken"));
    }

    @Test
    @DisplayName("Test 3: Unauthenticated Requests are Rejected with 403")
    void testUnauthenticatedRejection() throws Exception {
        mockMvc.perform(get("/expenses"))
                .andExpect(status().isForbidden());

        mockMvc.perform(get("/budget/current"))
                .andExpect(status().isForbidden());

        mockMvc.perform(get("/goals"))
                .andExpect(status().isForbidden());
    }

    @Test
    @DisplayName("Test 4: Expense Isolation Between Demo and Private Users")
    void testExpenseIsolation() throws Exception {
        // Private user creates private expense
        Expense privExp = new Expense();
        privExp.setDescription("Private MacBook Pro");
        privExp.setAmount(85000.0);
        privExp.setType(Expense.ExpenseType.OTHER);
        privExp.setDate(LocalDate.now());

        mockMvc.perform(post("/expenses")
                        .header("Authorization", "Bearer " + privateToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(privExp)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.description").value("Private MacBook Pro"));

        // Demo user creates demo expense
        Expense demoExp = new Expense();
        demoExp.setDescription("Demo Lunch");
        demoExp.setAmount(250.0);
        demoExp.setType(Expense.ExpenseType.FOOD);
        demoExp.setDate(LocalDate.now());

        mockMvc.perform(post("/expenses")
                        .header("Authorization", "Bearer " + demoToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(demoExp)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.description").value("Demo Lunch"));

        // Demo queries history -> must ONLY see Demo Lunch
        mockMvc.perform(get("/expenses/history")
                        .header("Authorization", "Bearer " + demoToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].description").value("Demo Lunch"));

        // Private user queries history -> must ONLY see Private MacBook Pro
        mockMvc.perform(get("/expenses/history")
                        .header("Authorization", "Bearer " + privateToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].description").value("Private MacBook Pro"));
    }

    @Test
    @DisplayName("Test 5: ID Tampering Protection - Demo User Cannot Modify/Delete Private Expense")
    void testExpenseIdTamperingProtection() throws Exception {
        // Private user creates expense
        Expense privExp = new Expense();
        privExp.setDescription("Confidential Medical Bill");
        privExp.setAmount(5000.0);
        privExp.setType(Expense.ExpenseType.OTHER);
        privExp.setDate(LocalDate.now());

        MvcResult createResult = mockMvc.perform(post("/expenses")
                        .header("Authorization", "Bearer " + privateToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(privExp)))
                .andExpect(status().isOk())
                .andReturn();

        Expense created = objectMapper.readValue(createResult.getResponse().getContentAsString(), Expense.class);
        int privateExpId = created.getId();

        // Demo user attempts to DELETE private expense -> 404 NOT_FOUND
        mockMvc.perform(delete("/expenses/" + privateExpId)
                        .header("Authorization", "Bearer " + demoToken))
                .andExpect(status().isNotFound());

        // Demo user attempts to UPDATE private expense -> 404 NOT_FOUND
        privExp.setDescription("Hacked Description");
        mockMvc.perform(put("/expenses/" + privateExpId)
                        .header("Authorization", "Bearer " + demoToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(privExp)))
                .andExpect(status().isNotFound());

        // Verify private expense is intact in database
        mockMvc.perform(get("/expenses/history")
                        .header("Authorization", "Bearer " + privateToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].description").value("Confidential Medical Bill"));
    }

    @Test
    @DisplayName("Test 6: Budget Isolation Between Users")
    void testBudgetIsolation() throws Exception {
        int month = LocalDate.now().getMonthValue();
        int year = LocalDate.now().getYear();

        // Private user sets budget
        Budget privBudget = new Budget(month, year, 60000.0);
        mockMvc.perform(post("/budget")
                        .header("Authorization", "Bearer " + privateToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(privBudget)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.amount").value(60000.0));

        // Demo user checks budget -> found is false, amount is 0
        mockMvc.perform(get("/budget/current")
                        .header("Authorization", "Bearer " + demoToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.found").value(false))
                .andExpect(jsonPath("$.amount").value(0));

        // Demo user sets own budget
        Budget demoBudget = new Budget(month, year, 15000.0);
        mockMvc.perform(post("/budget")
                        .header("Authorization", "Bearer " + demoToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(demoBudget)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.amount").value(15000.0));

        // Verify private user budget is unchanged
        mockMvc.perform(get("/budget/current")
                        .header("Authorization", "Bearer " + privateToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.found").value(true))
                .andExpect(jsonPath("$.amount").value(60000.0));
    }

    @Test
    @DisplayName("Test 7: Savings Goals Isolation and Contribution Tampering")
    void testSavingsGoalsIsolation() throws Exception {
        // Private user creates goal
        SavingsGoal privGoal = new SavingsGoal();
        privGoal.setName("Private Emergency Fund");
        privGoal.setTargetAmount(100000.0);
        privGoal.setTargetDate(LocalDate.now().plusMonths(6));

        MvcResult goalResult = mockMvc.perform(post("/goals")
                        .header("Authorization", "Bearer " + privateToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(privGoal)))
                .andExpect(status().isOk())
                .andReturn();

        SavingsGoal createdGoal = objectMapper.readValue(goalResult.getResponse().getContentAsString(), SavingsGoal.class);
        Long privateGoalId = createdGoal.getId();

        // Demo user lists goals -> returns empty list
        mockMvc.perform(get("/goals")
                        .header("Authorization", "Bearer " + demoToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(0)));

        // Demo user attempts to contribute to private goal -> 404 NOT_FOUND
        mockMvc.perform(post("/goals/" + privateGoalId + "/contribute")
                        .header("Authorization", "Bearer " + demoToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(Map.of("amount", 500.0))))
                .andExpect(status().isNotFound());

        // Private user contributes to own goal -> 200 OK, savedAmount = 500
        mockMvc.perform(post("/goals/" + privateGoalId + "/contribute")
                        .header("Authorization", "Bearer " + privateToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(Map.of("amount", 500.0))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.savedAmount").value(500.0));
    }

    @Test
    @DisplayName("Test 8: Recurring Expenses & Scheduled Processing Ownership")
    void testRecurringExpensesAndSchedulerOwnership() throws Exception {
        // Private user creates daily recurring expense
        RecurringExpense rec = new RecurringExpense();
        rec.setDescription("Private Server VPS");
        rec.setAmount(1200.0);
        rec.setType("OTHER");
        rec.setFrequency("DAILY");
        rec.setStartDate(LocalDate.now());

        mockMvc.perform(post("/recurring")
                        .header("Authorization", "Bearer " + privateToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(rec)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.description").value("Private Server VPS"));

        // Demo user lists recurring -> empty
        mockMvc.perform(get("/recurring")
                        .header("Authorization", "Bearer " + demoToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(0)));

        // Execute scheduled processing
        recurringController.processRecurringExpenses();

        // Verify generated expense is stamped with private user's ID
        mockMvc.perform(get("/expenses")
                        .header("Authorization", "Bearer " + privateToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].description").value("[R] Private Server VPS"))
                .andExpect(jsonPath("$[0].amount").value(1200.0));

        // Demo user cannot see the generated expense
        mockMvc.perform(get("/expenses")
                        .header("Authorization", "Bearer " + demoToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(0)));
    }
}
