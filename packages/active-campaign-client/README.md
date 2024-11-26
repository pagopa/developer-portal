# Active Campaign API Client Documentation

## Configuration

The client requires two environment variables:
- `AC_BASE_URL`: Active Campaign API base URL
- `AC_API_KEY`: Active Campaign API key

## API Endpoints

### Contacts

#### Create Contact
```typescript
createContact(data: ACContactPayload)
```
- **Endpoint**: `POST /api/3/contacts`
- **Description**: Creates a new contact in Active Campaign
- **Parameters**:
    - `data`: Contact payload object

#### Update Contact
```typescript
updateContact(contactId: string, data: ACContactPayload)
```
- **Endpoint**: `PUT /api/3/contacts/{contactId}`
- **Description**: Updates an existing contact
- **Parameters**:
    - `contactId`: ID of the contact to update
    - `data`: Updated contact payload

#### Delete Contact
```typescript
deleteContact(contactId: string)
```
- **Endpoint**: `DELETE /api/3/contacts/{contactId}`
- **Description**: Removes a contact from the system
- **Parameters**:
    - `contactId`: ID of the contact to delete

#### Get Contact by Email
```typescript
getContactByEmail(email: string)
```
- **Endpoint**: `GET /api/3/contacts`
- **Description**: Retrieves a contact's ID using their email address
- **Parameters**:
    - `email`: Email address to search for
- **Returns**: Contact ID if found

### Lists

#### Create List
```typescript
createList(data: ACListPayload)
```
- **Endpoint**: `POST /api/3/lists`
- **Description**: Creates a new contact list
- **Parameters**:
    - `data`: List configuration payload

#### Get List ID by String ID
```typescript
getListIdByStringId(stringId: string)
```
- **Endpoint**: `GET /api/3/lists`
- **Description**: Retrieves a list's numeric ID using its string identifier
- **Parameters**:
    - `stringId`: String identifier of the list
- **Returns**: Numeric list ID if found

#### Delete List
```typescript
deleteList(id: number)
```
- **Endpoint**: `DELETE /api/3/lists/{id}`
- **Description**: Removes a contact list
- **Parameters**:
    - `id`: Numeric ID of the list to delete

#### Update List Status
```typescript
updateListStatus(data: ACListStatusPayload)
```
- **Endpoint**: `POST /api/3/contactLists`
- **Description**: Updates the status of a contact in a list
- **Parameters**:
    - `data`: List status update payload

## Authentication

All requests require authentication using an API key. The key is passed in the headers:
```typescript
{
  'Api-Token': apiKey,
  'Content-Type': 'application/json'
}
```

# Tests

Since the client is a wrapper around the Active Campaign API, it is not possible to test the client without making actual requests to the API.
The tests are therefore integration tests that require a valid Active Campaign account and API key to run.
They are skipped by default but can be run by deleting the `.skip` from the test suite.