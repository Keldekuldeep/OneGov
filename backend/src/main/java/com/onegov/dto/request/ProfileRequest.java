package com.onegov.dto.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProfileRequest {
    private String userId;
    private String name;
    private Integer age;
    private String gender;
    private String category;
    private String occupation;
    private Long income;
    private String state;
    private Boolean hasBPLCard;
    private Boolean isMinority;
    private Boolean hasDisability;
    private Boolean isStudent;
    private Boolean isFarmer;
}
