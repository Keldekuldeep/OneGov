package com.onegov.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Document {
    private String documentId;
    private String userId;
    private String type;
    private String fileName;
    private String fileUrl;
    private Long fileSize;
    private String verificationStatus; // pending, verified, rejected
    private LocalDateTime uploadedAt;
    private String verifiedBy;
    private LocalDateTime verifiedAt;
}
