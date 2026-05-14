package com.amilia.dealpilot.repository;

import com.amilia.dealpilot.model.Deal;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DealRepository extends JpaRepository<Deal, Long> {
}