package com.urlshortener.config;

import com.zaxxer.hikari.HikariConfig;
import com.zaxxer.hikari.HikariDataSource;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;

import javax.sql.DataSource;
import java.net.URI;

/**
 * Converts Railway/Heroku-style postgres://user:pass@host:port/db
 * into a proper JDBC URL for HikariCP.
 */
@Configuration
public class DataSourceConfig {

    @Value("${DATABASE_URL:}")
    private String rawDatabaseUrl;

    @Value("${spring.datasource.url:jdbc:postgresql://localhost:5432/urlshortener}")
    private String jdbcUrl;

    @Value("${spring.datasource.username:postgres}")
    private String username;

    @Value("${spring.datasource.password:password}")
    private String password;

    @Bean
    @Primary
    public DataSource dataSource() {
        HikariConfig config = new HikariConfig();

        // If Railway provides postgres:// style URL, parse it
        if (rawDatabaseUrl != null && rawDatabaseUrl.startsWith("postgres")) {
            try {
                URI uri = new URI(rawDatabaseUrl.replace("postgres://", "postgresql://"));
                String host = uri.getHost();
                int    port = uri.getPort() > 0 ? uri.getPort() : 5432;
                String db   = uri.getPath().replaceFirst("/", "");
                String[] userInfo = uri.getUserInfo().split(":");

                config.setJdbcUrl("jdbc:postgresql://" + host + ":" + port + "/" + db + "?sslmode=require");
                config.setUsername(userInfo[0]);
                config.setPassword(userInfo[1]);
            } catch (Exception e) {
                // Fall through to standard JDBC
                config.setJdbcUrl(jdbcUrl);
                config.setUsername(username);
                config.setPassword(password);
            }
        } else {
            config.setJdbcUrl(jdbcUrl);
            config.setUsername(username);
            config.setPassword(password);
        }

        config.setDriverClassName("org.postgresql.Driver");
        config.setMaximumPoolSize(5);
        config.setConnectionTimeout(20000);
        return new HikariDataSource(config);
    }
}
