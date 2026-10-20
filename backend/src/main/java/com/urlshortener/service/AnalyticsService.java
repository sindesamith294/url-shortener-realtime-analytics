package com.urlshortener.service;

import com.urlshortener.dto.AnalyticsResponse;
import com.urlshortener.dto.RecentClickDto;
import com.urlshortener.entity.ShortUrl;
import com.urlshortener.exception.ResourceNotFoundException;
import com.urlshortener.repository.ClickEventRepository;
import com.urlshortener.repository.ShortUrlRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AnalyticsService {

    private final ShortUrlRepository shortUrlRepository;
    private final ClickEventRepository clickEventRepository;

    public AnalyticsResponse getAnalytics(String userEmail, Long urlId) {
        ShortUrl shortUrl = shortUrlRepository.findById(urlId)
                .orElseThrow(() -> new ResourceNotFoundException("URL not found"));

        if (!shortUrl.getUser().getEmail().equals(userEmail)) {
            throw new ResourceNotFoundException("URL not found");
        }

        long total = clickEventRepository.countByShortUrl(shortUrl);

        // clicks by day
        List<Object[]> rawByDay = clickEventRepository.countClicksByDay(shortUrl);
        Map<String, Long> clicksByDay = new LinkedHashMap<>();
        for (Object[] row : rawByDay) {
            clicksByDay.put(row[0].toString(), (Long) row[1]);
        }

        // recent 20 clicks
        List<RecentClickDto> recent = clickEventRepository
                .findByShortUrlOrderByClickedAtDesc(shortUrl)
                .stream()
                .limit(20)
                .map(e -> RecentClickDto.builder()
                        .clickedAt(e.getClickedAt())
                        .referrer(e.getReferrer())
                        .userAgent(e.getUserAgent())
                        .build())
                .collect(Collectors.toList());

        return AnalyticsResponse.builder()
                .shortUrlId(urlId)
                .shortCode(shortUrl.getShortCode())
                .originalUrl(shortUrl.getOriginalUrl())
                .totalClicks(total)
                .clicksByDay(clicksByDay)
                .recentClicks(recent)
                .build();
    }
}
