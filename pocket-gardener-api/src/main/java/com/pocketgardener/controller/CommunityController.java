package com.pocketgardener.controller;

import com.pocketgardener.dto.GardenDtos.CreatePostRequest;
import com.pocketgardener.dto.GardenDtos.CreateCommentRequest;
import com.pocketgardener.dto.GardenDtos.CommunityPostCommentsResponse;
import com.pocketgardener.entity.UserEntity;
import com.pocketgardener.model.DomainModels.CommunityPost;
import com.pocketgardener.service.CommunityService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestAttribute;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = {"http://localhost:5173", "http://127.0.0.1:5173"})
public class CommunityController {
    private final CommunityService communityService;

    public CommunityController(CommunityService communityService) {
        this.communityService = communityService;
    }

    @PostMapping("/posts")
    public CommunityPost createPost(@RequestAttribute("currentUser") UserEntity currentUser,
                                    @Valid @RequestBody CreatePostRequest request) {
        return communityService.createPost(currentUser, request);
    }

    @PostMapping("/posts/{postId}/like")
    public CommunityPost likePost(@RequestAttribute("currentUser") UserEntity currentUser,
                                  @PathVariable String postId) {
        return communityService.toggleLike(currentUser, postId);
    }

    @GetMapping("/posts/{postId}/comments")
    public CommunityPostCommentsResponse postComments(@RequestAttribute("currentUser") UserEntity currentUser,
                                                      @PathVariable String postId) {
        return communityService.postComments(currentUser, postId);
    }

    @PostMapping("/posts/{postId}/comments")
    public CommunityPostCommentsResponse addComment(@RequestAttribute("currentUser") UserEntity currentUser,
                                                    @PathVariable String postId,
                                                    @Valid @RequestBody CreateCommentRequest request) {
        return communityService.addComment(currentUser, postId, request);
    }

    @PostMapping("/community-users/{userId}/follow")
    public List<String> toggleFollow(@RequestAttribute("currentUser") UserEntity currentUser,
                                     @PathVariable String userId) {
        return communityService.toggleFollow(currentUser, userId);
    }
}
