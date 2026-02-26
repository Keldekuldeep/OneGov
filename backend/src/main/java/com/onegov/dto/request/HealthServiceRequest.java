package com.onegov.dto.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class HealthServiceRequest {
    private String userId;
    private String serviceType;
    private Map<String, Object> formData;
}
