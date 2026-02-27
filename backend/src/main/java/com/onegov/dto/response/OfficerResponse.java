package com.onegov.dto.response;

import com.onegov.model.Officer;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OfficerResponse {
    private String token;
    private Officer officer;
}
