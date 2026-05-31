package com.pocketgardener.repository;

import com.pocketgardener.entity.CommunityFollowEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CommunityFollowRepository extends JpaRepository<CommunityFollowEntity, String> {
    boolean existsByFollowerUserIdAndTargetUserId(String followerUserId, String targetUserId);

    Optional<CommunityFollowEntity> findByFollowerUserIdAndTargetUserId(String followerUserId, String targetUserId);

    List<CommunityFollowEntity> findByFollowerUserId(String followerUserId);
}
