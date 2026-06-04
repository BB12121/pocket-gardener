package com.pocketgardener;

import com.pocketgardener.repository.PlantGrowthPointRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import static org.hamcrest.Matchers.greaterThanOrEqualTo;
import static org.junit.jupiter.api.Assertions.assertTrue;
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
    @Autowired
    private PlantGrowthPointRepository plantGrowthPointRepository;

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

    @Test
    void careLogCanBeCreatedThroughUseCaseController() throws Exception {
        mockMvc.perform(post("/api/logs")
                        .header("Authorization", "Bearer " + demoToken())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"plantId\":\"p1\",\"type\":\"浇水\",\"note\":\"盆土偏干\",\"status\":\"正常\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.plantId").value("p1"))
                .andExpect(jsonPath("$.type").value("浇水"))
                .andExpect(jsonPath("$.note").value("盆土偏干"));
    }

    @Test
    void careLogCanStoreImages() throws Exception {
        mockMvc.perform(post("/api/logs")
                        .header("Authorization", "Bearer " + demoToken())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"plantId\":\"p1\",\"type\":\"修剪\",\"note\":\"剪掉黄叶\",\"status\":\"正常\",\"images\":[\"data:image/jpeg;base64,abc\"]}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.images[0]").value("data:image/jpeg;base64,abc"));
    }

    @Test
    void careLogCanAppendGrowthDataPoints() throws Exception {
        mockMvc.perform(post("/api/logs")
                        .header("Authorization", "Bearer " + demoToken())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"plantId\":\"p1\",\"type\":\"观察\",\"note\":\"新增测量\",\"status\":\"生长旺盛\",\"height\":43.5,\"leaves\":31,\"health\":96}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.plantId").value("p1"));

        assertTrue(plantGrowthPointRepository.findByPlantId("p1").stream()
                .anyMatch(point -> "height".equals(point.getMetric()) && point.getValue() == 43.5));
        assertTrue(plantGrowthPointRepository.findByPlantId("p1").stream()
                .anyMatch(point -> "leaves".equals(point.getMetric()) && point.getValue() == 31.0));
        assertTrue(plantGrowthPointRepository.findByPlantId("p1").stream()
                .anyMatch(point -> "health".equals(point.getMetric()) && point.getValue() == 96.0));
    }

    @Test
    void communityPostCanStoreImages() throws Exception {
        mockMvc.perform(post("/api/posts")
                        .header("Authorization", "Bearer " + demoToken())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"type\":\"经验\",\"title\":\"晒晒今天的绿萝\",\"content\":\"叶片状态很好\",\"tags\":[\"绿萝\"],\"images\":[\"data:image/jpeg;base64,post\"]}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.images[0]").value("data:image/jpeg;base64,post"));
    }

    @Test
    void communityPostCanBeLikedAndCommented() throws Exception {
        String token = demoToken();

        mockMvc.perform(post("/api/posts/c1/like")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value("c1"))
                .andExpect(jsonPath("$.likes", greaterThanOrEqualTo(43)))
                .andExpect(jsonPath("$.likedByCurrentUser").value(true));

        mockMvc.perform(post("/api/posts/c1/comments")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"content\":\"这条经验很有帮助\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.post.id").value("c1"))
                .andExpect(jsonPath("$.post.comments", greaterThanOrEqualTo(9)))
                .andExpect(jsonPath("$.comments[0].content").value("这条经验很有帮助"));
    }
    @Test
    void communityPostLikeTogglesForCurrentUser() throws Exception {
        String token = demoToken();
        String postId = "c2";
        int initialLikes = 5;

        mockMvc.perform(post("/api/posts/" + postId + "/like")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.likedByCurrentUser").value(true))
                .andExpect(jsonPath("$.likes").value(initialLikes + 1));

        mockMvc.perform(post("/api/posts/" + postId + "/like")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.likedByCurrentUser").value(false))
                .andExpect(jsonPath("$.likes").value(initialLikes));
    }

    @Test
    void followStateIsScopedToCurrentUser() throws Exception {
        String demoToken = demoToken();

        String otherToken = mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"loginName\":\"other-user\",\"password\":\"123456\",\"username\":\"other\",\"city\":\"shanghai\"}"))
                .andExpect(status().isOk())
                .andReturn()
                .getResponse()
                .getContentAsString()
                .replaceAll(".*\"token\":\"([^\"]+)\".*", "$1");

        mockMvc.perform(post("/api/community-users/cu2/follow")
                        .header("Authorization", "Bearer " + otherToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[?(@=='cu2')]").exists());

        mockMvc.perform(get("/api/garden")
                        .header("Authorization", "Bearer " + demoToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.followedUsers[?(@=='cu2')]").doesNotExist());

        mockMvc.perform(get("/api/garden")
                        .header("Authorization", "Bearer " + otherToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.followedUsers[?(@=='cu2')]").exists());
    }
}
