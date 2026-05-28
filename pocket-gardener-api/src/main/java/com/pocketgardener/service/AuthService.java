package com.pocketgardener.service;

import com.pocketgardener.dto.GardenDtos.AuthResponse;
import com.pocketgardener.dto.GardenDtos.LoginRequest;
import com.pocketgardener.dto.GardenDtos.RegisterRequest;
import com.pocketgardener.entity.UserEntity;
import com.pocketgardener.mapper.GardenMapper;
import com.pocketgardener.repository.UserRepository;
import org.springframework.security.crypto.bcrypt.BCrypt;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.Optional;
import java.util.UUID;

@Service
public class AuthService {
    private final UserRepository userRepository;

    public AuthService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Transactional
    public AuthResponse login(LoginRequest request) {
        UserEntity user = userRepository.findByLoginName(request.loginName())
                .orElseThrow(() -> new IllegalArgumentException("账号或密码错误"));
        if (user.getPasswordHash() == null || !BCrypt.checkpw(request.password(), user.getPasswordHash())) {
            throw new IllegalArgumentException("账号或密码错误");
        }
        user.setAuthToken(newToken());
        return toResponse(userRepository.save(user));
    }

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByLoginName(request.loginName())) {
            throw new IllegalArgumentException("账号已存在");
        }
        UserEntity user = new UserEntity(
                "u" + System.currentTimeMillis(),
                request.loginName(),
                BCrypt.hashpw(request.password(), BCrypt.gensalt()),
                newToken(),
                request.username(),
                "",
                LocalDate.now().toString(),
                request.city() == null || request.city().isBlank() ? "未设置" : request.city(),
                0,
                "🧑‍🌾"
        );
        return toResponse(userRepository.save(user));
    }

    @Transactional(readOnly = true)
    public Optional<UserEntity> findByToken(String token) {
        if (token == null || token.isBlank()) {
            return Optional.empty();
        }
        return userRepository.findByAuthToken(token);
    }

    public AuthResponse toResponse(UserEntity user) {
        return new AuthResponse(user.getAuthToken(), GardenMapper.toDto(user));
    }

    private String newToken() {
        return UUID.randomUUID().toString().replace("-", "");
    }
}
