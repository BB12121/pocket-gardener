package com.pocketgardener.service;

import com.pocketgardener.dto.GardenDtos.CommunityPostCommentsResponse;
import com.pocketgardener.dto.GardenDtos.CreateCommentRequest;
import com.pocketgardener.dto.GardenDtos.CreatePostRequest;
import com.pocketgardener.entity.CommunityPostEntity;
import com.pocketgardener.entity.FollowedUserEntity;
import com.pocketgardener.entity.PostCommentEntity;
import com.pocketgardener.entity.UserEntity;
import com.pocketgardener.mapper.GardenMapper;
import com.pocketgardener.model.DomainModels.CommunityPost;
import com.pocketgardener.repository.CommunityPostRepository;
import com.pocketgardener.repository.FollowedUserRepository;
import com.pocketgardener.repository.PostCommentRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
public class CommunityService {
    private static final DateTimeFormatter DATE_TIME = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm");

    private final BusinessIdGenerator idGenerator;
    private final CommunityPostRepository communityPostRepository;
    private final FollowedUserRepository followedUserRepository;
    private final PostCommentRepository postCommentRepository;

    public CommunityService(BusinessIdGenerator idGenerator,
                            CommunityPostRepository communityPostRepository,
                            FollowedUserRepository followedUserRepository,
                            PostCommentRepository postCommentRepository) {
        this.idGenerator = idGenerator;
        this.communityPostRepository = communityPostRepository;
        this.followedUserRepository = followedUserRepository;
        this.postCommentRepository = postCommentRepository;
    }

    @Transactional
    public CommunityPost createPost(UserEntity currentUser, CreatePostRequest request) {
        CommunityPostEntity post = new CommunityPostEntity(
                idGenerator.nextId("c"),
                request.type(),
                currentUser.getId(),
                currentUser.getUsername(),
                request.title(),
                request.content(),
                LocalDate.now().toString(),
                0,
                0,
                request.tags() == null ? List.of() : request.tags(),
                "求助".equals(request.type()) ? "中" : null,
                List.of()
        );
        return GardenMapper.toDto(communityPostRepository.save(post));
    }

    @Transactional
    public CommunityPost likePost(String postId) {
        CommunityPostEntity post = requirePost(postId);
        post.incrementLikes();
        return GardenMapper.toDto(communityPostRepository.save(post));
    }

    @Transactional(readOnly = true)
    public CommunityPostCommentsResponse postComments(String postId) {
        CommunityPostEntity post = requirePost(postId);
        return responseFor(post);
    }

    @Transactional
    public CommunityPostCommentsResponse addComment(UserEntity currentUser, String postId, CreateCommentRequest request) {
        CommunityPostEntity post = requirePost(postId);
        String content = request.content() == null ? "" : request.content().trim();
        if (content.isEmpty()) {
            throw new IllegalArgumentException("评论内容不能为空");
        }
        PostCommentEntity comment = new PostCommentEntity(
                idGenerator.nextId("cm"),
                postId,
                currentUser.getId(),
                currentUser.getUsername(),
                content,
                LocalDateTime.now().format(DATE_TIME)
        );
        postCommentRepository.save(comment);
        post.incrementComments();
        CommunityPostEntity savedPost = communityPostRepository.save(post);
        return responseFor(savedPost);
    }

    @Transactional
    public List<String> toggleFollow(String userId) {
        if (followedUserRepository.existsById(userId)) {
            followedUserRepository.deleteById(userId);
        } else {
            followedUserRepository.save(new FollowedUserEntity(userId));
        }
        return followedUserRepository.findAll().stream().map(FollowedUserEntity::getUserId).toList();
    }

    private CommunityPostEntity requirePost(String postId) {
        return communityPostRepository.findById(postId)
                .orElseThrow(() -> new IllegalArgumentException("帖子不存在: " + postId));
    }

    private CommunityPostCommentsResponse responseFor(CommunityPostEntity post) {
        return new CommunityPostCommentsResponse(
                GardenMapper.toDto(post),
                postCommentRepository.findByPostIdOrderByTimeDesc(post.getId()).stream()
                        .map(GardenMapper::toDto)
                        .toList()
        );
    }
}
