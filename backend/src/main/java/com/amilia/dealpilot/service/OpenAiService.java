package com.amilia.dealpilot.service;

import com.amilia.dealpilot.model.Deal;
import org.springframework.stereotype.Service;

@Service
public class OpenAiService {

    public String analyzeDeal(Deal deal) {
        String grade;
        String recommendation;
        String strategy;
        String sellerMessage;

        if (deal.getEstimatedProfit() >= 50000) {
            grade = "A";
            recommendation = "Excellent wholesale opportunity with strong projected margins.";
            strategy = "This deal supports an aggressive acquisition strategy. Consider locking it up quickly before competition.";
            sellerMessage = "Hi, after reviewing the numbers, I’m very interested in moving forward quickly if timing works on your end.";
        } else if (deal.getEstimatedProfit() >= 20000) {
            grade = "B";
            recommendation = "Solid investment opportunity with healthy profit potential.";
            strategy = "This appears to be a workable deal if repair estimates remain accurate.";
            sellerMessage = "Hi, I reviewed the numbers and this looks like something I’d like to move forward on. Let’s discuss next steps.";
        } else if (deal.getEstimatedProfit() >= 0) {
            grade = "C";
            recommendation = "Marginal deal with tighter profit margins.";
            strategy = "Proceed cautiously and negotiate the purchase price lower if possible.";
            sellerMessage = "Hi, I’m interested, but based on current numbers I’d need some flexibility to make this work.";
        } else {
            grade = "D";
            recommendation = "High-risk deal with negative projected returns.";
            strategy = "This acquisition does not currently meet safe investment criteria unless pricing changes significantly.";
            sellerMessage = "Hi, after reviewing the numbers, I’d need to revisit pricing before moving forward.";
        }

        return """
DEAL ANALYSIS

Property Address: %s

DEAL GRADE
Grade: %s

FINANCIAL BREAKDOWN
Purchase Price: $%.2f
ARV: $%.2f
Repairs: $%.2f
Closing Costs: $%.2f
Assignment Fee: $%.2f

INVESTMENT METRICS
MAO (75%% Rule): $%.2f
Estimated Profit: $%.2f
ROI: %.2f%%

AI RECOMMENDATION
%s

ACQUISITION STRATEGY
%s

SELLER FOLLOW-UP MESSAGE
%s
"""
        .formatted(
                deal.getAddress(),
                grade,
                deal.getPurchasePrice(),
                deal.getArv(),
                deal.getRepairs(),
                deal.getClosingCosts(),
                deal.getAssignmentFee(),
                deal.getMao(),
                deal.getEstimatedProfit(),
                deal.getRoi(),
                recommendation,
                strategy,
                sellerMessage
        );
    }
}