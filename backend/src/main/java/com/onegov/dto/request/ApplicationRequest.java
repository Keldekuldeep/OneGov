package com.onegov.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.util.List;
import java.util.Map;

@Data
public class ApplicationRequest {
    @NotBlank(message = "User ID is required")
    private String userId;
    
    @NotBlank(message = "Scheme name is required")
    private String schemeName;
    
    private String schemeId;
    private List<String> documents;
    private Map<String, Object> formData;
}
