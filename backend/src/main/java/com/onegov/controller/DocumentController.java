package com.onegov.controller;

import com.onegov.dto.response.ApiResponse;
import com.onegov.model.Document;
import com.onegov.service.DocumentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.concurrent.ExecutionException;

@RestController
@RequestMapping("/api/documents")
public class DocumentController {

    @Autowired
    private DocumentService documentService;

    @PostMapping("/upload")
    public ResponseEntity<?> uploadDocument(@RequestBody Map<String, Object> request) {
        try {
            String userId = (String) request.get("userId");
            String type = (String) request.get("type");
            String fileName = (String) request.get("fileName");
            String fileUrl = (String) request.get("fileUrl");
            Long fileSize = Long.valueOf(request.get("fileSize").toString());
            
            Document document = documentService.uploadDocument(userId, type, fileName, fileUrl, fileSize);
            return ResponseEntity.status(HttpStatus.CREATED).body(document);
        } catch (ExecutionException | InterruptedException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to upload document"));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getDocumentById(@PathVariable String id) {
        try {
            Document document = documentService.getDocumentById(id);
            return ResponseEntity.ok(document);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error(e.getMessage()));
        } catch (ExecutionException | InterruptedException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to fetch document"));
        }
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getUserDocuments(@PathVariable String userId) {
        try {
            List<Document> documents = documentService.getUserDocuments(userId);
            return ResponseEntity.ok(documents);
        } catch (ExecutionException | InterruptedException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to fetch documents"));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteDocument(@PathVariable String id) {
        try {
            documentService.deleteDocument(id);
            return ResponseEntity.ok(ApiResponse.success("Document deleted successfully", null));
        } catch (ExecutionException | InterruptedException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to delete document"));
        }
    }

    @PutMapping("/{id}/verify")
    public ResponseEntity<?> verifyDocument(
            @PathVariable String id,
            @RequestBody Map<String, String> request) {
        try {
            String verifiedBy = request.get("verifiedBy");
            String status = request.get("status");
            
            Document document = documentService.verifyDocument(id, verifiedBy, status);
            return ResponseEntity.ok(document);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error(e.getMessage()));
        } catch (ExecutionException | InterruptedException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to verify document"));
        }
    }
}
