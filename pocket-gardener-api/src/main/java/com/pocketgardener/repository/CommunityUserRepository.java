package com.pocketgardener.repository;

import com.pocketgardener.entity.CommunityUserEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CommunityUserRepository extends JpaRepository<CommunityUserEntity, String> {
}
