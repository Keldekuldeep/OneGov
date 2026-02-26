package com.onegov.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TimelineEntry {
    private String stage;
    private String status;
    private LocalDateTime timestamp;
    private OfficerInfo officer;
}
