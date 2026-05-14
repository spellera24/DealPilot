package com.amilia.dealpilot.service;

import com.amilia.dealpilot.model.Deal;
import com.amilia.dealpilot.repository.DealRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DealService {

    private final DealRepository dealRepository;

    public DealService(DealRepository dealRepository) {
        this.dealRepository = dealRepository;
    }

    public Deal createDeal(Deal deal) {
        calculateDealNumbers(deal);
        return dealRepository.save(deal);
    }

    public List<Deal> getAllDeals() {
        return dealRepository.findAll();
    }

    public Deal getDealById(Long id) {
        return dealRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Deal not found with id: " + id));
    }

    public Deal updateAiSummary(Long id, String aiSummary) {
        Deal deal = getDealById(id);
        deal.setAiSummary(aiSummary);
        return dealRepository.save(deal);
    }

    private void calculateDealNumbers(Deal deal) {
        double arv = deal.getArv();
        double purchasePrice = deal.getPurchasePrice();
        double repairs = deal.getRepairs();
        double closingCosts = deal.getClosingCosts();
        double assignmentFee = deal.getAssignmentFee();

        // 75% is current my previous was .70 MAO formula which is not as realistic with wholesalings current markets
        double mao = (arv * 0.75) - repairs - closingCosts - assignmentFee;

        // Estimated profit
        double estimatedProfit = arv - purchasePrice - repairs - closingCosts - assignmentFee;

        // ROI
        double totalInvestment = purchasePrice + repairs + closingCosts + assignmentFee;
        double roi = totalInvestment > 0
                ? (estimatedProfit / totalInvestment) * 100
                : 0;

        deal.setMao(mao);
        deal.setEstimatedProfit(estimatedProfit);
        deal.setRoi(roi);
    }
}