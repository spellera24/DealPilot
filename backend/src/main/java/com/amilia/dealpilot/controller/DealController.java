package com.amilia.dealpilot.controller;

import com.amilia.dealpilot.model.Deal;
import com.amilia.dealpilot.service.DealService;
import com.amilia.dealpilot.service.OpenAiService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/deals")
@CrossOrigin(origins = "http://localhost:5173")
public class DealController {

    private final DealService dealService;
    private final OpenAiService openAiService;

    public DealController(DealService dealService, OpenAiService openAiService) {
        this.dealService = dealService;
        this.openAiService = openAiService;
    }

    @PostMapping
    public Deal createDeal(@Valid @RequestBody Deal deal) {
        return dealService.createDeal(deal);
    }

    @GetMapping
    public List<Deal> getAllDeals() {
        return dealService.getAllDeals();
    }

    @GetMapping("/{id}")
    public Deal getDealById(@PathVariable Long id) {
        return dealService.getDealById(id);
    }

    @PostMapping("/{id}/analyze")
    public Deal analyzeDeal(@PathVariable Long id) {
        Deal deal = dealService.getDealById(id);
        String aiSummary = openAiService.analyzeDeal(deal);
        return dealService.updateAiSummary(id, aiSummary);
    }
}
