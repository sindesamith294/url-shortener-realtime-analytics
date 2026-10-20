package com.urlshortener.service;

import com.urlshortener.dto.*;
import com.urlshortener.entity.*;
import com.urlshortener.exception.*;
import com.urlshortener.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UrlService {

    private static final String ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    private static final int CODE_LENGTH = 6;
    private final SecureRandom random = new SecureRandom();

    private final ShortUrlRepository shortUrlRepository;
    private final UserRepository userRepository;
    private final ClickEventRepository clickEventRepository;

    @Value("${app.base-url}")
    private String baseUrl;

    @Transactional
    public ShortUrlResponse createShortUrl(String userEmail, CreateUrlRequest request) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        String code;
        if (request.getCustomCode() != null && !request.getCustomCode().isBlank()) {
            code = request.getCustomCode().trim();
            if (shortUrlRepository.existsByShortCode(code)) {
                throw new DuplicateShortCodeException(code);
            }
        } else {
            code = generateUniqueCode();
        }

        ShortUrl shortUrl = ShortUrl.builder()
                .user(user)
                .originalUrl(request.getOriginalUrl())
                .shortCode(code)
                .expiresAt(request.getExpiresAt())
                .isActive(true)
                .build();

        shortUrlRepository.save(shortUrl);
        return toResponse(shortUrl, 0L);
    }

    public List<ShortUrlResponse> getUserUrls(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return shortUrlRepository.findByUserOrderByCreatedAtDesc(user).stream()
                .map(u -> toResponse(u, clickEventRepository.countByShortUrl(u)))
                .collect(Collectors.toList());
    }

    @Transactional
    public ShortUrlResponse updateUrl(String userEmail, Long id, UpdateUrlRequest request) {
        ShortUrl shortUrl = getUrlOwnedBy(userEmail, id);
        if (request.getIsActive() != null) shortUrl.setActive(request.getIsActive());
        if (request.getExpiresAt() != null) shortUrl.setExpiresAt(request.getExpiresAt());
        shortUrlRepository.save(shortUrl);
        return toResponse(shortUrl, clickEventRepository.countByShortUrl(shortUrl));
    }

    @Transactional
    public void deleteUrl(String userEmail, Long id) {
        ShortUrl shortUrl = getUrlOwnedBy(userEmail, id);
        shortUrlRepository.delete(shortUrl);
    }

    /** Called on redirect – records the click and returns original URL */
    @Transactional
    public String resolveAndRecord(String shortCode, String referrer, String userAgent) {
        ShortUrl shortUrl = shortUrlRepository.findByShortCode(shortCode)
                .orElseThrow(() -> new ResourceNotFoundException("Short URL not found: " + shortCode));

        if (!shortUrl.isActive()) {
            throw new ResourceNotFoundException("This link has been deactivated");
        }
        if (shortUrl.getExpiresAt() != null && shortUrl.getExpiresAt().isBefore(LocalDateTime.now())) {
            throw new ResourceNotFoundException("This link has expired");
        }

        ClickEvent event = ClickEvent.builder()
                .shortUrl(shortUrl)
                .referrer(referrer)
                .userAgent(userAgent)
                .build();
        clickEventRepository.save(event);

        return shortUrl.getOriginalUrl();
    }

    private ShortUrl getUrlOwnedBy(String userEmail, Long id) {
        ShortUrl shortUrl = shortUrlRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("URL not found"));
        if (!shortUrl.getUser().getEmail().equals(userEmail)) {
            throw new ResourceNotFoundException("URL not found");
        }
        return shortUrl;
    }

    private String generateUniqueCode() {
        String code;
        do {
            StringBuilder sb = new StringBuilder(CODE_LENGTH);
            for (int i = 0; i < CODE_LENGTH; i++) {
                sb.append(ALPHABET.charAt(random.nextInt(ALPHABET.length())));
            }
            code = sb.toString();
        } while (shortUrlRepository.existsByShortCode(code));
        return code;
    }

    private ShortUrlResponse toResponse(ShortUrl u, long clicks) {
        return ShortUrlResponse.builder()
                .id(u.getId())
                .originalUrl(u.getOriginalUrl())
                .shortCode(u.getShortCode())
                .shortUrl(baseUrl + "/" + u.getShortCode())
                .createdAt(u.getCreatedAt())
                .expiresAt(u.getExpiresAt())
                .isActive(u.isActive())
                .totalClicks(clicks)
                .build();
    }
}
