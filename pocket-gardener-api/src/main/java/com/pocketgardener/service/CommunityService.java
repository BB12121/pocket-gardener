package com.pocketgardener.service;

import com.pocketgardener.dto.GardenDtos.CommunityPostCommentsResponse;
import com.pocketgardener.dto.GardenDtos.CreateCommentRequest;
import com.pocketgardener.dto.GardenDtos.CreatePostRequest;
import com.pocketgardener.entity.CommunityPostEntity;
import com.pocketgardener.entity.CommunityFollowEntity;
import com.pocketgardener.entity.PostCommentEntity;
import com.pocketgardener.entity.PostLikeEntity;
import com.pocketgardener.entity.UserEntity;
import com.pocketgardener.mapper.GardenMapper;
import com.pocketgardener.model.DomainModels.CommunityPost;
import com.pocketgardener.repository.CommunityPostRepository;
import com.pocketgardener.repository.CommunityFollowRepository;
import com.pocketgardener.repository.PostCommentRepository;
import com.pocketgardener.repository.PostLikeRepository;
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
    private final CommunityFollowRepository communityFollowRepository;
    private final PostCommentRepository postCommentRepository;
    private final PostLikeRepository postLikeRepository;

    public CommunityService(BusinessIdGenerator idGenerator,
                            CommunityPostRepository communityPostRepository,
                            CommunityFollowRepository communityFollowRepository,
                            PostCommentRepository postCommentRepository,
                            PostLikeRepository postLikeRepository) {
        this.idGenerator = idGenerator;
        this.communityPostRepository = communityPostRepository;
        this.communityFollowRepository = communityFollowRepository;
        this.postCommentRepository = postCommentRepository;
        this.postLikeRepository = postLikeRepository;
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
                safeImages(request.images())
        );
        return GardenMapper.toDto(communityPostRepository.save(post), false);
    }

    @Transactional
    public CommunityPost toggleLike(UserEntity currentUser, String postId) {
        CommunityPostEntity post = requirePost(postId);
        return postLikeRepository.findByPostIdAndUserId(postId, currentUser.getId())
                .map(like -> {
                    postLikeRepository.delete(like);
                    post.decrementLikes();
                    return GardenMapper.toDto(communityPostRepository.save(post), false);
                })
                .orElseGet(() -> {
                    postLikeRepository.save(new PostLikeEntity(postId, currentUser.getId()));
                    post.incrementLikes();
                    return GardenMapper.toDto(communityPostRepository.save(post), true);
                });
    }

    @Transactional(readOnly = true)
    public CommunityPostCommentsResponse postComments(UserEntity currentUser, String postId) {
        CommunityPostEntity post = requirePost(postId);
        return responseFor(currentUser, post);
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
        return responseFor(currentUser, savedPost);
    }

    @Transactional
    public List<String> toggleFollow(UserEntity currentUser, String userId) {
        communityFollowRepository.findByFollowerUserIdAndTargetUserId(currentUser.getId(), userId)
                .ifPresentOrElse(
                        communityFollowRepository::delete,
                        () -> communityFollowRepository.save(new CommunityFollowEntity(currentUser.getId(), userId))
                );
        return followedUserIds(currentUser.getId());
    }

    @Transactional(readOnly = true)
    public List<String> followedUserIds(String currentUserId) {
        return communityFollowRepository.findByFollowerUserId(currentUserId).stream()
                .map(CommunityFollowEntity::getTargetUserId)
                .toList();
    }

    private CommunityPostEntity requirePost(String postId) {
        return communityPostRepository.findById(postId)
                .orElseThrow(() -> new IllegalArgumentException("帖子不存在: " + postId));
    }

    private CommunityPostCommentsResponse responseFor(UserEntity currentUser, CommunityPostEntity post) {
        return new CommunityPostCommentsResponse(
                GardenMapper.toDto(post, postLikeRepository.existsByPostIdAndUserId(post.getId(), currentUser.getId())),
                postCommentRepository.findByPostIdOrderByTimeDesc(post.getId()).stream()
                        .map(GardenMapper::toDto)
                        .toList()
        );
    }

    private List<String> safeImages(List<String> images) {
        if (images == null) {
            return List.of();
        }
        return images.stream()
                .filter(image -> image != null && !image.isBlank())
                .limit(3)
                .toList();
    }
}
