package com.urlshortener.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class UpdateUrlRequest {
    private Boolean isActive;
    private LocalDateTime expiresAt;
}
