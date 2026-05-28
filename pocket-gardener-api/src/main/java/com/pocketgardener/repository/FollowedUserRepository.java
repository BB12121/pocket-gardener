package com.pocketgardener.repository;

import com.pocketgardener.entity.FollowedUserEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FollowedUserRepository extends JpaRepository<FollowedUserEntity, String> {
}
