package com.amilia.dealpilot.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.PositiveOrZero;

@Entity
@Table(name = "deals")
public class Deal {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    private String address;

    @PositiveOrZero
    private double purchasePrice;

    @PositiveOrZero
    private double arv;

    @PositiveOrZero
    private double repairs;

    @PositiveOrZero
    private double closingCosts;

    @PositiveOrZero
    private double assignmentFee;

    private double mao;
    private double estimatedProfit;
    private double roi;
    private String status;

    @Column(length = 5000)
    private String aiSummary;

    private String notes;

    public Deal() {}

    public Long getId() {
        return id;
    }

    public String getAddress() {
        return address;
    }

    public double getPurchasePrice() {
        return purchasePrice;
    }

    public double getArv() {
        return arv;
    }

    public double getRepairs() {
        return repairs;
    }

    public double getClosingCosts() {
        return closingCosts;
    }

    public double getAssignmentFee() {
        return assignmentFee;
    }

    public double getMao() {
        return mao;
    }

    public double getEstimatedProfit() {
        return estimatedProfit;
    }

    public double getRoi() {
        return roi;
    }

    public String getStatus() {
        return status;
    }

    public String getAiSummary() {
        return aiSummary;
    }

    public String getNotes() {
        return notes;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public void setPurchasePrice(double purchasePrice) {
        this.purchasePrice = purchasePrice;
    }

    public void setArv(double arv) {
        this.arv = arv;
    }

    public void setRepairs(double repairs) {
        this.repairs = repairs;
    }

    public void setClosingCosts(double closingCosts) {
        this.closingCosts = closingCosts;
    }

    public void setAssignmentFee(double assignmentFee) {
        this.assignmentFee = assignmentFee;
    }

    public void setMao(double mao) {
        this.mao = mao;
    }

    public void setEstimatedProfit(double estimatedProfit) {
        this.estimatedProfit = estimatedProfit;
    }

    public void setRoi(double roi) {
        this.roi = roi;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public void setAiSummary(String aiSummary) {
        this.aiSummary = aiSummary;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }
}