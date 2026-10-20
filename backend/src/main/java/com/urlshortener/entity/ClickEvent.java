package com.urlshortener.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "click_events")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ClickEvent {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "short_url_id", nullable = false)
    private ShortUrl shortUrl;

    @Column(nullable = false, updatable = false)
    private LocalDateTime clickedAt;

    @Column(length = 512)
    private String referrer;

    @Column(length = 512)
    private String userAgent;

    @PrePersist
    public void prePersist() {
        clickedAt = LocalDateTime.now();
    }
}
