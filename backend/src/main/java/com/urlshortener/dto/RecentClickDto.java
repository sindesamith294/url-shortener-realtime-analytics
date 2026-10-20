package com.urlshortener.dto;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Builder
public class RecentClickDto {
    private LocalDateTime clickedAt;
    private String referrer;
    private String userAgent;
}
