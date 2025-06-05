package com.News.NewsApp.controller;

import com.News.NewsApp.service.NewsService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/api/news")
public class NewsController {

    private final NewsService newsService;

    public NewsController(NewsService newsService) {
        this.newsService = newsService;
    }

    @GetMapping("/{category}")
    public String getNews(@PathVariable String category) {
        return newsService.getNewsByCategory(category);
    }

    @GetMapping("/search")
    public ResponseEntity<?> searchNews(@RequestParam("q") String query) {
        String news = newsService.searchNews(query);
        return ResponseEntity.ok().body(news);
    }


}//end