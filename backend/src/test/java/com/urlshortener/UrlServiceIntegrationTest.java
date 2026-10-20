package com.urlshortener;

import com.urlshortener.dto.CreateUrlRequest;
import com.urlshortener.dto.ShortUrlResponse;
import com.urlshortener.entity.User;
import com.urlshortener.repository.ClickEventRepository;
import com.urlshortener.repository.ShortUrlRepository;
import com.urlshortener.repository.UserRepository;
import com.urlshortener.service.UrlService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("test")
@Transactional
class UrlServiceIntegrationTest {

    @Autowired
    private UrlService urlService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ShortUrlRepository shortUrlRepository;

    @Autowired
    private ClickEventRepository clickEventRepository;

    private User testUser;

    @BeforeEach
    void setUp() {
        testUser = userRepository.save(User.builder()
                .email("test@example.com")
                .passwordHash("hashed")
                .build());
    }

    @Test
    void shouldCreateShortUrl() {
        CreateUrlRequest req = new CreateUrlRequest();
        req.setOriginalUrl("https://example.com/very/long/url");

        ShortUrlResponse response = urlService.createShortUrl(testUser.getEmail(), req);

        assertNotNull(response.getShortCode());
        assertEquals("https://example.com/very/long/url", response.getOriginalUrl());
        assertTrue(response.isActive());
    }

    @Test
    void shouldResolveAndRecordClick() {
        CreateUrlRequest req = new CreateUrlRequest();
        req.setOriginalUrl("https://target.example.com");
        ShortUrlResponse created = urlService.createShortUrl(testUser.getEmail(), req);

        String resolved = urlService.resolveAndRecord(created.getShortCode(), null, null);

        assertEquals("https://target.example.com", resolved);
        long clicks = clickEventRepository.count();
        assertEquals(1, clicks);
    }

    @Test
    void shouldRejectCustomDuplicateCode() {
        CreateUrlRequest req1 = new CreateUrlRequest();
        req1.setOriginalUrl("https://first.com");
        req1.setCustomCode("mycode");
        urlService.createShortUrl(testUser.getEmail(), req1);

        CreateUrlRequest req2 = new CreateUrlRequest();
        req2.setOriginalUrl("https://second.com");
        req2.setCustomCode("mycode");

        assertThrows(Exception.class, () -> urlService.createShortUrl(testUser.getEmail(), req2));
    }
}
