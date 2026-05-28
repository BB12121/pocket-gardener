package com.pocketgardener;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import static org.hamcrest.Matchers.greaterThanOrEqualTo;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class ApiSmokeTest {
    @Autowired
    private MockMvc mockMvc;

    private String demoToken() throws Exception {
        return mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"loginName\":\"demo\",\"password\":\"123456\"}"))
                .andExpect(status().isOk())
                .andReturn()
                .getResponse()
                .getContentAsString()
                .replaceAll(".*\"token\":\"([^\"]+)\".*", "$1");
    }

    @Test
    void gardenSnapshotContainsSeedData() throws Exception {
        mockMvc.perform(get("/api/garden")
                        .header("Authorization", "Bearer " + demoToken()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.plants.length()", greaterThanOrEqualTo(4)))
                .andExpect(jsonPath("$.careTasks.length()", greaterThanOrEqualTo(5)))
                .andExpect(jsonPath("$.currentWeather.city").exists())
                .andExpect(jsonPath("$.currentUser.username").value("小绿手"));
    }

    @Test
    void taskStatusCanBeUpdated() throws Exception {
        mockMvc.perform(patch("/api/tasks/t1")
                        .header("Authorization", "Bearer " + demoToken())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"status\":\"已完成\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("已完成"));
    }

    @Test
    void plantCanBeCreated() throws Exception {
        mockMvc.perform(post("/api/plants")
                        .header("Authorization", "Bearer " + demoToken())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"nickname\":\"新绿\",\"speciesName\":\"绿萝\",\"location\":\"卧室\",\"tags\":[\"耐阴\"]}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.nickname").value("新绿"))
                .andExpect(jsonPath("$.status").value("健康"));
    }
}
