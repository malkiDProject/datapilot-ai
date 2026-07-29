# DataPilot AI System Design

## 1. Product overview
DataPilot AI is a backend-oriented platform for helping teams import tabular data, understand its structure, map it to a target schema, and transform it into a usable output format for integration workflows. The first version focuses on CSV ingestion and uses an LLM to assist with schema mapping suggestions, while keeping human review and deterministic validation in the loop.

## 2. Problem statement
Many organizations receive data from external systems in inconsistent formats. Mapping uploaded data to the schema required by an internal application, API, or downstream service is often manual, repetitive, and error-prone. DataPilot AI aims to reduce this effort by automating the initial analysis and mapping workflow while preserving deterministic validation and human oversight.

## 3. Target users
- Backend developers integrating external systems with internal services
- Integration engineers building data pipelines and transformation flows
- Technical operations teams managing import and export processes
- Companies that need to normalize and map external data into their own internal schemas

## 4. MVP scope
The MVP will support the following workflow:
1. Upload a CSV file
2. Parse headers and sample rows
3. Basic validation
4. Analyze the file structure
5. Suggest a mapping to a dynamically supplied target schema using an LLM
6. Allow the user to approve or correct the proposed mapping
7. Validate and transform the records
8. Export the result to a target format

JSON will be the first supported output format, but the architecture should be designed so that future support can be added for XML, CSV, API payloads, SQL inserts, and other formats.

## 5. Out of scope for the first version
- Support for non-CSV file formats such as Excel, JSON, or XML
- Highly advanced data cleansing and enrichment capabilities
- Full workflow orchestration or multi-step pipelines
- Authentication, authorization, and multi-tenant access control
- Persistent historical execution logs and audit trails
- Full user interface for interactive editing
- Multi-provider LLM orchestration beyond the initial integration design

## 6. Main workflow
The initial workflow is:

Upload CSV
→ Parse headers and sample rows
→ Basic validation
→ Analyze the file structure
→ Suggest mapping using the LLM
→ User approval
→ Validate and transform records
→ Export

The basic validation step includes checks such as:
- The file is not empty
- A header row exists
- The CSV format is valid
- The file encoding is supported
- The file size is within acceptable limits

The LLM should only receive files that have already passed these deterministic validations.

## 7. Initial API endpoints
The initial API surface may include:

- POST /api/v1/imports
  - Start a new import job by uploading a CSV file
- GET /api/v1/imports/:id
  - Retrieve the current state of an import job
- POST /api/v1/imports/:id/analyze
  - Perform parsing and structural analysis
- POST /api/v1/imports/:id/mappings/suggest
  - Receive file context and a target schema definition, then return mapping suggestions
- POST /api/v1/imports/:id/mappings/approve
  - Accept a user-approved or corrected mapping
- POST /api/v1/imports/:id/transform
  - Validate and transform rows into the target structure
- GET /api/v1/imports/:id/export
  - Retrieve the generated export result or metadata

## 8. Main entities
- ImportJob
  - Represents the entire import lifecycle, including the uploaded file, file analysis, target schema, mapping suggestions, approved mapping, transformation result, and export
- FileAnalysis
  - Contains parsed headers, sample rows, and inferred structure
- TargetSchema
  - A dynamically supplied schema definition, such as a JSON schema or sample JSON document
- MappingSuggestion
  - Represents the LLM-generated mapping suggestion with explanation and confidence
- Mapping
  - Represents the final approved or corrected mapping
- TransformationResult
  - Contains the validated and transformed records ready for export
- Export
  - Represents the generated output artifact in a target format

## 9. Responsibilities of the LLM
The LLM should be responsible for:
- Understanding the semantic meaning of source columns
- Inferring field meaning from sample rows
- Suggesting mappings to the target schema
- Explaining why each mapping was selected
- Providing a confidence score for every mapping
- Highlighting ambiguous mappings that require user attention

The LLM should always act as an advisor, not as the final decision maker.

## 10. What must not be delegated to the LLM
The following should not be delegated to the LLM:
- Final approval of mappings
- Determining business correctness without user oversight
- Making critical validation decisions that affect data integrity without explicit rules
- Performing irreversible transformations without review
- Acting as an authoritative source of truth for business logic

The system should treat LLM output as advisory and always preserve a review and validation step.

## 11. Design Principles
- The LLM is advisory, not authoritative.
- Business rules are deterministic.
- Every transformation should be reproducible.
- AI suggestions must always be reviewable by the user.
- The platform should support multiple LLM providers in the future.

## 12. Future improvements
Future versions may add:
- Support for additional file formats and output formats
- More advanced validation and transformation rules
- Persistent jobs, audit trails, and history
- Authentication, permissions, and multi-tenant support
- Support for richer target schema definitions and schema inference
- Integration with external APIs and data stores
