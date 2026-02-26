package com.onegov.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CitizenProfile {
    private String profileId;
    private String userId;
    private String name;
    private Integer age;
    private String gender;
    private String category; // General, OBC, SC, ST
    private String occupation;
    private Long income;
    private String state;
    private Boolean hasBPLCard;
    private Boolean isMinority;
    private Boolean hasDisability;
    private Boolean isStudent;
    private Boolean isFarmer;
    private List<String> eligibleSchemes;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
