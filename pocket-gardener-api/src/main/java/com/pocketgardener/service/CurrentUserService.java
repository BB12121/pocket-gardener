package com.pocketgardener.service;

import com.pocketgardener.entity.UserEntity;
import com.pocketgardener.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class CurrentUserService {
    private static final String DEMO_USER_ID = "u1";

    private final UserRepository userRepository;

    public CurrentUserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Transactional(readOnly = true)
    public UserEntity demoUser() {
        return userRepository.findById(DEMO_USER_ID)
                .orElseThrow(() -> new IllegalStateException("Missing demo user seed data"));
    }
}
