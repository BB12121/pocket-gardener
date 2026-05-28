package com.pocketgardener.repository;

import com.pocketgardener.entity.CommunityPostEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CommunityPostRepository extends JpaRepository<CommunityPostEntity, String> {
}
