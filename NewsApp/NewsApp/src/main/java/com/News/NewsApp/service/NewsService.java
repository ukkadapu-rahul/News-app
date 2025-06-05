package com.News.NewsApp.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class NewsService {
    private final RestTemplate restTemplate;

    @Value("${gnews.api.key}")
    private String apiKey;

    public NewsService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    public String getNewsByCategory(String category) {
        String url = "https://gnews.io/api/v4/top-headlines?topic=" + category + "&token=" + apiKey + "&lang=en&country=in";
        ResponseEntity<String> response = restTemplate.getForEntity(url, String.class);
        return response.getBody(); // This returns the news as raw JSON string
    }
    public String searchNews(String query) {
        String url = "https://gnews.io/api/v4/search?q=" + query + "&token=" + apiKey + "&lang=en&country=in";
        ResponseEntity<String> response = restTemplate.getForEntity(url, String.class);
        return response.getBody();
    }

}
