package com.urlshortener.controller;

import com.urlshortener.dto.*;
import com.urlshortener.service.AnalyticsService;
import com.urlshortener.service.UrlService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/urls")
@RequiredArgsConstructor
public class UrlController {

    private final UrlService urlService;
    private final AnalyticsService analyticsService;

    @PostMapping
    public ResponseEntity<ShortUrlResponse> createUrl(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody CreateUrlRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(urlService.createShortUrl(userDetails.getUsername(), request));
    }

    @GetMapping
    public ResponseEntity<List<ShortUrlResponse>> getUserUrls(
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(urlService.getUserUrls(userDetails.getUsername()));
    }

    @GetMapping("/{id}/analytics")
    public ResponseEntity<AnalyticsResponse> getAnalytics(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id) {
        return ResponseEntity.ok(analyticsService.getAnalytics(userDetails.getUsername(), id));
    }

    @PatchMapping("/{id}")
    public ResponseEntity<ShortUrlResponse> updateUrl(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id,
            @RequestBody UpdateUrlRequest request) {
        return ResponseEntity.ok(urlService.updateUrl(userDetails.getUsername(), id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUrl(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id) {
        urlService.deleteUrl(userDetails.getUsername(), id);
        return ResponseEntity.noContent().build();
    }
}
