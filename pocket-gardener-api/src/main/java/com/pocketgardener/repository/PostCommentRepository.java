package com.pocketgardener.repository;

import com.pocketgardener.entity.PostCommentEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PostCommentRepository extends JpaRepository<PostCommentEntity, String> {
    List<PostCommentEntity> findByPostIdOrderByTimeDesc(String postId);
}
