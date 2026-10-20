package com.urlshortener.exception;

public class DuplicateShortCodeException extends RuntimeException {
    public DuplicateShortCodeException(String code) {
        super("Short code already in use: " + code);
    }
}
