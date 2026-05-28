package com.pocketgardener.repository;

import com.pocketgardener.entity.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<UserEntity, String> {
    Optional<UserEntity> findByLoginName(String loginName);

    Optional<UserEntity> findByAuthToken(String authToken);

    boolean existsByLoginName(String loginName);
}
