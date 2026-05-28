package com.pocketgardener.service;

import com.pocketgardener.entity.*;
import com.pocketgardener.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.bcrypt.BCrypt;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Component
public class DatabaseSeeder implements CommandLineRunner {
    private final UserRepository userRepository;
    private final SpeciesRepository speciesRepository;
    private final PlantRepository plantRepository;
    private final CareLogRepository careLogRepository;
    private final CareTaskRepository careTaskRepository;
    private final AiSuggestionRepository aiSuggestionRepository;
    private final WeatherAlertRepository weatherAlertRepository;
    private final CommunityUserRepository communityUserRepository;
    private final FollowedUserRepository followedUserRepository;
    private final CommunityPostRepository communityPostRepository;
    private final AchievementRepository achievementRepository;
    private final CheckinDayRepository checkinDayRepository;
    private final PlantGrowthPointRepository plantGrowthPointRepository;

    public DatabaseSeeder(UserRepository userRepository, SpeciesRepository speciesRepository, PlantRepository plantRepository,
                          CareLogRepository careLogRepository, CareTaskRepository careTaskRepository,
                          AiSuggestionRepository aiSuggestionRepository, WeatherAlertRepository weatherAlertRepository,
                          CommunityUserRepository communityUserRepository, FollowedUserRepository followedUserRepository,
                          CommunityPostRepository communityPostRepository, AchievementRepository achievementRepository,
                          CheckinDayRepository checkinDayRepository, PlantGrowthPointRepository plantGrowthPointRepository) {
        this.userRepository = userRepository;
        this.speciesRepository = speciesRepository;
        this.plantRepository = plantRepository;
        this.careLogRepository = careLogRepository;
        this.careTaskRepository = careTaskRepository;
        this.aiSuggestionRepository = aiSuggestionRepository;
        this.weatherAlertRepository = weatherAlertRepository;
        this.communityUserRepository = communityUserRepository;
        this.followedUserRepository = followedUserRepository;
        this.communityPostRepository = communityPostRepository;
        this.achievementRepository = achievementRepository;
        this.checkinDayRepository = checkinDayRepository;
        this.plantGrowthPointRepository = plantGrowthPointRepository;
    }

    @Override
    @Transactional
    public void run(String... args) {
        if (userRepository.existsById("u1")) {
            userRepository.findById("u1").ifPresent(user -> {
                if (user.getLoginName() == null || user.getPasswordHash() == null) {
                    user.setLoginName("demo");
                    user.setPasswordHash(BCrypt.hashpw("123456", BCrypt.gensalt()));
                    userRepository.save(user);
                }
            });
            return;
        }
        userRepository.save(new UserEntity("u1", "demo", BCrypt.hashpw("123456", BCrypt.gensalt()), null, "小绿手", "138****1234", "2025-12-01", "杭州", 92, "🧑‍🌾"));
        speciesRepository.saveAll(List.of(
                new SpeciesEntity("s1", "绿萝", "Epipremnum aureum", "观叶植物", 3, 14, "散射光"),
                new SpeciesEntity("s2", "多肉（桃蛋）", "Graptopetalum amethystinum", "多肉植物", 7, 30, "全日照"),
                new SpeciesEntity("s3", "栀子花", "Gardenia jasminoides", "开花植物", 2, 10, "半日照"),
                new SpeciesEntity("s4", "龟背竹", "Monstera deliciosa", "观叶植物", 4, 21, "散射光")
        ));
        plantRepository.saveAll(List.of(
                new PlantEntity("p1", "小绿", "s1", "2026-01-15", "2026-01-10", "客厅窗台", "健康", List.of("耐阴", "喜湿"), "/images/plants/lvluo.jpg"),
                new PlantEntity("p2", "桃桃", "s2", "2026-02-20", "2026-02-18", "阳台", "健康", List.of("怕涝", "喜阳"), "/images/plants/duorou.jpg"),
                new PlantEntity("p3", "小栀", "s3", "2026-03-05", "2026-03-01", "阳台", "轻微黄叶", List.of("喜酸", "怕寒"), "/images/plants/zhizi.jpg"),
                new PlantEntity("p4", "大龟", "s4", "2026-04-10", "2026-04-08", "书房", "健康", List.of("耐阴", "喜湿"), "/images/plants/guibei.jpg")
        ));
        careLogRepository.saveAll(List.of(
                new CareLogEntity("l1", "p1", "浇水", "2026-05-06 08:30", "土壤偏干，浇透", "正常"),
                new CareLogEntity("l2", "p1", "施肥", "2026-05-01 09:00", "液态肥1:1000", "正常"),
                new CareLogEntity("l3", "p2", "浇水", "2026-05-04 10:00", "少量喷雾", "正常"),
                new CareLogEntity("l4", "p3", "浇水", "2026-05-05 07:30", "加了硫酸亚铁", "黄叶未改善"),
                new CareLogEntity("l5", "p3", "修剪", "2026-05-03 16:00", "剪去黄叶3片", "轻微黄叶"),
                new CareLogEntity("l6", "p4", "浇水", "2026-05-05 09:00", "浇透", "正常")
        ));
        careTaskRepository.saveAll(List.of(
                new CareTaskEntity("t1", "p1", "浇水", "2026-05-07 08:00", "高", "待处理", "规则生成"),
                new CareTaskEntity("t2", "p2", "浇水", "2026-05-08 10:00", "中", "待处理", "规则生成"),
                new CareTaskEntity("t3", "p3", "施肥", "2026-05-07 09:00", "高", "待处理", "AI建议"),
                new CareTaskEntity("t4", "p4", "浇水", "2026-05-09 09:00", "低", "待处理", "规则生成"),
                new CareTaskEntity("t5", "p3", "换盆", "2026-05-10 14:00", "中", "已延期", "AI建议")
        ));
        aiSuggestionRepository.saveAll(List.of(
                new AiSuggestionEntity("a1", "p3", "2026-05-06 10:00", "中", "GPT-4o", "栀子花黄叶可能由土壤碱化引起", "建议每周浇水时加入硫酸亚铁调节pH，检查排水孔并避免中午直射阳光。"),
                new AiSuggestionEntity("a2", "p1", "2026-05-04 14:00", "低", "GPT-4o", "绿萝生长状态良好，可考虑扦插繁殖", "当前绿萝长势旺盛，可在节点处剪取进行水培扦插。")
        ));
        weatherAlertRepository.saveAll(List.of(
                new WeatherAlertEntity("w1", "高温预警", "橙色", "2026-05-07 06:00", "建议将阳台多肉移至散射光处，增加通风，避免中午暴晒灼伤", List.of("p2", "p3")),
                new WeatherAlertEntity("w2", "暴雨预警", "蓝色", "2026-05-08 12:00", "建议收回阳台植物或加盖遮雨，防止盆土积水导致烂根", List.of("p2", "p3"))
        ));
        communityUserRepository.saveAll(List.of(
                new CommunityUserEntity("cu1", "花花世界", "养花10年，专注观叶植物", "上海", 128, 45),
                new CommunityUserEntity("cu2", "新手小白", "刚入坑的小白一枚", "北京", 12, 30),
                new CommunityUserEntity("cu3", "多肉控", "阳台多肉花园主理人", "深圳", 256, 60)
        ));
        followedUserRepository.saveAll(List.of(new FollowedUserEntity("cu1"), new FollowedUserEntity("cu3")));
        communityPostRepository.saveAll(List.of(
                new CommunityPostEntity("c1", "经验", "cu1", "花花世界", "绿萝爆盆秘诀分享", "坚持每周施薄肥，保持散射光，3个月从一盆变三盆！", "2026-05-05", 42, 8, List.of("绿萝", "施肥"), null, List.of("/images/posts/lvluo.jpg")),
                new CommunityPostEntity("c2", "求助", "cu2", "新手小白", "栀子花叶子发黄怎么办？", "买回来一周就开始黄叶，浇水也正常，求大神帮忙看看", "2026-05-06", 5, 12, List.of("栀子花", "黄叶"), "中", List.of("/images/posts/zhizi.jpg")),
                new CommunityPostEntity("c3", "经验", "cu3", "多肉控", "夏天多肉防晒攻略", "遮阳网+通风是关键，分享我的阳台改造方案。", "2026-05-04", 67, 15, List.of("多肉", "夏季养护"), null, List.of("/images/posts/duorou1.jpg", "/images/posts/duorou2.jpg"))
        ));
        achievementRepository.saveAll(List.of(
                new AchievementEntity("ach1", "初入园丁", "创建第一株植物档案", true, 1, 1),
                new AchievementEntity("ach2", "绿手指", "连续打卡7天", true, 7, 7),
                new AchievementEntity("ach3", "植物收藏家", "拥有5种不同植物", false, 4, 5)
        ));
        checkinDayRepository.saveAll(List.of("2026-05-01", "2026-05-02", "2026-05-03", "2026-05-04", "2026-05-05", "2026-05-06", "2026-05-07")
                .stream().map(CheckinDayEntity::new).toList());
        seedGrowth("p1", List.of(15, 18, 22, 26, 31, 35, 40), List.of(8, 10, 14, 18, 22, 26, 30), List.of(85, 88, 90, 92, 90, 93, 95));
        seedGrowth("p2", List.of(4, 4.5, 5, 5.5, 6), List.of(12, 14, 15, 16, 18), List.of(92, 90, 88, 91, 93));
        seedGrowth("p3", List.of(20, 24, 27, 29), List.of(30, 34, 32, 28), List.of(88, 82, 75, 70));
    }

    private void seedGrowth(String plantId, List<? extends Number> height, List<? extends Number> leaves, List<? extends Number> health) {
        List<String> dates = List.of("2026-02-01", "2026-02-15", "2026-03-01", "2026-03-15", "2026-04-01", "2026-04-15", "2026-05-01");
        saveMetric(plantId, "height", height, dates);
        saveMetric(plantId, "leaves", leaves, dates);
        saveMetric(plantId, "health", health, dates);
    }

    private void saveMetric(String plantId, String metric, List<? extends Number> values, List<String> dates) {
        for (int i = 0; i < values.size(); i++) {
            plantGrowthPointRepository.save(new PlantGrowthPointEntity(plantId + "-" + metric + "-" + i, plantId, metric, dates.get(Math.min(i, dates.size() - 1)), values.get(i).doubleValue()));
        }
    }
}
