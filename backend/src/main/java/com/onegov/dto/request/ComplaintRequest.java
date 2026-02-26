package com.onegov.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class ComplaintRequest {
    @NotBlank(message = "User ID is required")
    private String userId;
    
    @NotBlank(message = "Type is required")
    private String type;
    
    @NotBlank(message = "Category is required")
    private String category;
    
    @NotBlank(message = "Description is required")
    private String description;
    
    private String priority = "medium";
}
