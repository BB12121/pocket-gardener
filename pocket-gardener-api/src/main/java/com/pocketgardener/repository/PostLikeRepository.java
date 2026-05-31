package com.pocketgardener.repository;

import com.pocketgardener.entity.PostLikeEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface PostLikeRepository extends JpaRepository<PostLikeEntity, String> {
    boolean existsByPostIdAndUserId(String postId, String userId);

    Optional<PostLikeEntity> findByPostIdAndUserId(String postId, String userId);

    List<PostLikeEntity> findByUserId(String userId);
}
