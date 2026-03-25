# Case Management System - Backend API Documentation

## Overview
This backend provides a complete case management system for a legal case management application. It allows lawyers to create cases for clients, manage case details, and add hearing dates. Clients can view their cases.

## Models

### Case Model
- **lawyerId**: Reference to the lawyer handling the case (required)
- **clientId**: Reference to the client involved in the case (required)
- **title**: Case title (required)
- **description**: Detailed case description (required)
- **status**: Case status (Active, Pending, Closed, Dismissed) - default: Active
- **hearingDates**: Array of hearing date objects
  - date: Hearing date (required)
  - description: Hearing description
  - status: Hearing status (Scheduled, Completed, Postponed, Cancelled) - default: Scheduled
  - createdAt: Timestamp when hearing was added
- **caseType**: Type of case (Criminal, Civil, Family, Corporate, Tax, Immigration, Other) - required
- **court**: Court or jurisdiction information
- **caseNumber**: Case number assigned by court
- **timestamps**: createdAt and updatedAt automatically added

## API Endpoints

### Authentication Required
All case endpoints require authentication via JWT token in the Authorization header.

### 1. Create a Case
**POST** `/api/cases`
- **Access**: Private/Lawyer
- **Body**:
  ```json
  {
    "clientId": "client_object_id",
    "title": "Case Title",
    "description": "Detailed case description",
    "caseType": "Criminal",
    "court": "High Court",
    "caseNumber": "CR-2024-001"
  }
  ```
- **Response**: Created case with populated lawyer and client details

### 2. Get Lawyer's Cases
**GET** `/api/cases/lawyer`
- **Access**: Private/Lawyer
- **Response**: Array of cases handled by the authenticated lawyer

### 3. Get Client's Cases
**GET** `/api/cases/client`
- **Access**: Private/Client
- **Response**: Array of cases for the authenticated client

### 4. Get Case by ID
**GET** `/api/cases/:id`
- **Access**: Private/Lawyer or Client (own case only)
- **Response**: Detailed case information

### 5. Update Case
**PUT** `/api/cases/:id`
- **Access**: Private/Lawyer (own case only)
- **Body**: Any combination of updatable fields (title, description, status, caseType, court, caseNumber)
- **Response**: Updated case details

### 6. Add Hearing Date
**POST** `/api/cases/:id/hearings`
- **Access**: Private/Lawyer (own case only)
- **Body**:
  ```json
  {
    "date": "2024-12-01T10:00:00Z",
    "description": "Initial hearing",
    "status": "Scheduled"
  }
  ```
- **Response**: Updated case with new hearing date

### 7. Update Hearing Date
**PUT** `/api/cases/:caseId/hearings/:hearingIndex`
- **Access**: Private/Lawyer (own case only)
- **Body**: Updated hearing details (date, description, status)
- **Response**: Updated case details

### 8. Delete Case
**DELETE** `/api/cases/:id`
- **Access**: Private/Lawyer (own case only)
- **Response**: Success message

## Request Flow Examples

### Creating a Case
1. Lawyer authenticates and gets JWT token
2. Lawyer selects a client from their client list
3. Lawyer fills case details form
4. POST request to `/api/cases` with case data
5. Case is created and linked to both lawyer and client

### Adding Hearing Dates
1. Lawyer views a specific case
2. Lawyer adds hearing date through form
3. POST request to `/api/cases/:id/hearings`
4. Hearing date is added to the case's hearingDates array

### Client Viewing Cases
1. Client authenticates and gets JWT token
2. GET request to `/api/cases/client`
3. Client receives all their cases with lawyer information

## Security Features
- JWT authentication required for all endpoints
- Role-based access control (lawyer vs client)
- Ownership verification (users can only access their own cases)
- Input validation and sanitization

## Error Handling
- 400: Bad Request (validation errors)
- 401: Unauthorized (missing/invalid token)
- 403: Forbidden (access denied)
- 404: Not Found (case/client not found)
- 500: Internal Server Error

## Database Relationships
- Cases reference both Lawyer and Client models
- Hearing dates are embedded in the case document
- Efficient indexing on lawyerId, clientId, status, and caseType

This system provides a robust foundation for legal case management with proper security, validation, and relationship handling.
