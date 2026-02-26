package com.onegov.service;

import com.google.cloud.firestore.Firestore;
import com.google.cloud.firestore.DocumentReference;
import com.google.cloud.firestore.DocumentSnapshot;
import com.google.cloud.firestore.QuerySnapshot;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.concurrent.ExecutionException;
import java.util.stream.Collectors;

@Service
public class FirebaseService {

    @Autowired
    private Firestore firestore;

    // Create document
    public String createDocument(String collection, String documentId, Map<String, Object> data) 
            throws ExecutionException, InterruptedException {
        firestore.collection(collection).document(documentId).set(data).get();
        return documentId;
    }

    // Get document by ID
    public DocumentSnapshot getDocument(String collection, String documentId) 
            throws ExecutionException, InterruptedException {
        return firestore.collection(collection).document(documentId).get().get();
    }

    // Get all documents in collection
    public List<DocumentSnapshot> getAllDocuments(String collection) 
            throws ExecutionException, InterruptedException {
        QuerySnapshot querySnapshot = firestore.collection(collection).get().get();
        return querySnapshot.getDocuments().stream()
                .map(doc -> (DocumentSnapshot) doc)
                .collect(Collectors.toList());
    }

    // Query documents by field
    public List<DocumentSnapshot> queryDocuments(String collection, String field, Object value) 
            throws ExecutionException, InterruptedException {
        QuerySnapshot querySnapshot = firestore.collection(collection)
                .whereEqualTo(field, value)
                .get()
                .get();
        return querySnapshot.getDocuments().stream()
                .map(doc -> (DocumentSnapshot) doc)
                .collect(Collectors.toList());
    }

    // Update document
    public void updateDocument(String collection, String documentId, Map<String, Object> updates) 
            throws ExecutionException, InterruptedException {
        firestore.collection(collection).document(documentId).update(updates).get();
    }

    // Delete document
    public void deleteDocument(String collection, String documentId) 
            throws ExecutionException, InterruptedException {
        firestore.collection(collection).document(documentId).delete().get();
    }

    // Check if document exists
    public boolean documentExists(String collection, String documentId) 
            throws ExecutionException, InterruptedException {
        DocumentSnapshot document = getDocument(collection, documentId);
        return document.exists();
    }

    // Generate unique ID
    public String generateId(String collection) {
        return firestore.collection(collection).document().getId();
    }
}
