package com.onegov.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Scheme {
    private String schemeId;
    private String name;
    private String description;
    private String category;
    private String department;
    private Long benefitAmount;
    private Map<String, Object> eligibilityCriteria;
    private String[] requiredDocuments;
    private String applicationUrl;
    private Boolean isActive;
}
