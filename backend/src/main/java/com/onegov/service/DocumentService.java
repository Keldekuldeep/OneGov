package com.onegov.service;

import com.google.cloud.firestore.DocumentSnapshot;
import com.onegov.exception.ResourceNotFoundException;
import com.onegov.model.Document;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ExecutionException;
import java.util.stream.Collectors;

@Service
public class DocumentService {

    @Autowired
    private FirebaseService firebaseService;

    private static final String DOCUMENTS_COLLECTION = "documents";

    public Document uploadDocument(String userId, String type, String fileName, String fileUrl, Long fileSize) 
            throws ExecutionException, InterruptedException {
        String documentId = UUID.randomUUID().toString();

        Document document = new Document();
        document.setDocumentId(documentId);
        document.setUserId(userId);
        document.setType(type);
        document.setFileName(fileName);
        document.setFileUrl(fileUrl);
        document.setFileSize(fileSize);
        document.setVerificationStatus("pending");
        document.setUploadedAt(LocalDateTime.now());

        Map<String, Object> docData = convertToMap(document);
        firebaseService.createDocument(DOCUMENTS_COLLECTION, documentId, docData);

        return document;
    }

    public Document getDocumentById(String documentId) throws ExecutionException, InterruptedException {
        DocumentSnapshot doc = firebaseService.getDocument(DOCUMENTS_COLLECTION, documentId);
        
        if (!doc.exists()) {
            throw new ResourceNotFoundException("Document not found");
        }

        return convertToDocument(doc);
    }

    public List<Document> getUserDocuments(String userId) throws ExecutionException, InterruptedException {
        var docs = firebaseService.queryDocuments(DOCUMENTS_COLLECTION, "userId", userId);
        
        return docs.stream()
                .map(this::convertToDocument)
                .collect(Collectors.toList());
    }

    public void deleteDocument(String documentId) throws ExecutionException, InterruptedException {
        firebaseService.deleteDocument(DOCUMENTS_COLLECTION, documentId);
    }

    public Document verifyDocument(String documentId, String verifiedBy, String status) 
            throws ExecutionException, InterruptedException {
        Document document = getDocumentById(documentId);
        
        document.setVerificationStatus(status);
        document.setVerifiedBy(verifiedBy);
        document.setVerifiedAt(LocalDateTime.now());

        Map<String, Object> updates = new HashMap<>();
        updates.put("verificationStatus", status);
        updates.put("verifiedBy", verifiedBy);
        updates.put("verifiedAt", LocalDateTime.now().toString());

        firebaseService.updateDocument(DOCUMENTS_COLLECTION, documentId, updates);

        return document;
    }

    private Map<String, Object> convertToMap(Document doc) {
        Map<String, Object> map = new HashMap<>();
        map.put("documentId", doc.getDocumentId());
        map.put("userId", doc.getUserId());
        map.put("type", doc.getType());
        map.put("fileName", doc.getFileName());
        map.put("fileUrl", doc.getFileUrl());
        map.put("fileSize", doc.getFileSize());
        map.put("verificationStatus", doc.getVerificationStatus());
        map.put("uploadedAt", doc.getUploadedAt().toString());
        if (doc.getVerifiedBy() != null) {
            map.put("verifiedBy", doc.getVerifiedBy());
            map.put("verifiedAt", doc.getVerifiedAt().toString());
        }
        return map;
    }

    private Document convertToDocument(DocumentSnapshot doc) {
        Document document = new Document();
        document.setDocumentId(doc.getString("documentId"));
        document.setUserId(doc.getString("userId"));
        document.setType(doc.getString("type"));
        document.setFileName(doc.getString("fileName"));
        document.setFileUrl(doc.getString("fileUrl"));
        document.setFileSize(doc.getLong("fileSize"));
        document.setVerificationStatus(doc.getString("verificationStatus"));
        document.setUploadedAt(LocalDateTime.parse(doc.getString("uploadedAt")));
        if (doc.getString("verifiedBy") != null) {
            document.setVerifiedBy(doc.getString("verifiedBy"));
            document.setVerifiedAt(LocalDateTime.parse(doc.getString("verifiedAt")));
        }
        return document;
    }
}
