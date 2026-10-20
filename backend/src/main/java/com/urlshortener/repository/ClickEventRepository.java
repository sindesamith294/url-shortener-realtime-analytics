package com.urlshortener.repository;

import com.urlshortener.entity.ClickEvent;
import com.urlshortener.entity.ShortUrl;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.time.LocalDateTime;
import java.util.List;

public interface ClickEventRepository extends JpaRepository<ClickEvent, Long> {

    List<ClickEvent> findByShortUrlOrderByClickedAtDesc(ShortUrl shortUrl);

    long countByShortUrl(ShortUrl shortUrl);

    @Query("SELECT DATE(c.clickedAt), COUNT(c) FROM ClickEvent c WHERE c.shortUrl = :url GROUP BY DATE(c.clickedAt) ORDER BY DATE(c.clickedAt)")
    List<Object[]> countClicksByDay(@Param("url") ShortUrl shortUrl);

    @Query("SELECT c.shortUrl, COUNT(c) as total FROM ClickEvent c WHERE c.shortUrl.user.id = :userId GROUP BY c.shortUrl ORDER BY total DESC")
    List<Object[]> findTopUrlsByUser(@Param("userId") Long userId);

    List<ClickEvent> findByShortUrlAndClickedAtAfter(ShortUrl shortUrl, LocalDateTime since);
}
