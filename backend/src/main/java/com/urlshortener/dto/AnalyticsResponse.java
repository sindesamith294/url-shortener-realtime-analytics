package com.urlshortener.dto;

import lombok.Builder;
import lombok.Data;
import java.util.List;
import java.util.Map;

@Data
@Builder
public class AnalyticsResponse {
    private Long shortUrlId;
    private String shortCode;
    private String originalUrl;
    private long totalClicks;
    private Map<String, Long> clicksByDay;
    private List<RecentClickDto> recentClicks;
}
