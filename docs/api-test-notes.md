# API Test Notes

Test tool used: Thunder Client extension in VS Code  
Test period: March 2026  
Purpose: Manual testing of Noroff v2 Auction House endpoints before building the frontend

## Authenticated Noroff v2 requests

Authenticated Auction House requests require:

- Authorization: Bearer <accessToken>
- X-Noroff-API-Key: <apiKey>

## Register

- Method: POST
- Endpoint: /auth/register
- Body: name, email, password
- Header: Content-Type: application/json
- Notes: Returns error if profile already exists

## Login

- Method: POST
- Endpoint: /auth/login
- Body: email, password
- Header: Content-Type: application/json
- Notes: Successful response returns profile data and accessToken

## Get all listings

- Method: GET
- Endpoint: /auction/listings
- Auth required: No
- Response: returns data array of listings
- Important fields: id, title, description, media, tags, endsAt, \_count.bids

## Get active listings

- Method: GET
- Endpoint: /auction/listings?\_active=true
- Auth required: No
- Response: returns active listings only

## Get listings with seller info

- Method: GET
- Endpoint: /auction/listings?\_seller=true
- Auth required: No
- Response: returns listings including seller object
- Seller fields seen: name, email, bio, avatar, banner

## Get single listing

- Method: GET
- Endpoint: /auction/listings/{id}?\_seller=true&\_bids=true
- Auth required: No
- Response: returns one listing object inside data
- Important fields: id, title, description, media, tags, created, updated, endsAt, bids, seller

## Get single profile

- Method: GET
- Endpoint: /auction/profiles/{name}
- Auth required: Yes
- Headers:
  - Authorization: Bearer <accessToken>
  - X-Noroff-API-Key: <apiKey>
- Important fields:
  - name
  - email
  - bio
  - avatar
  - banner
  - credits
  - \_count.listings

## Get profile listings

- Method: GET
- Endpoint: /auction/profiles/{name}/listings
- Auth required: Yes
- Headers:
  - Authorization: Bearer <accessToken>
  - X-Noroff-API-Key: <apiKey>
- Response: returns listings created by the profile
- Notes: Empty data array is possible

## Get profile bids

- Method: GET
- Endpoint: /auction/profiles/{name}/bids?\_listings=true
- Auth required: Yes
- Headers:
  - Authorization: Bearer <accessToken>
  - X-Noroff-API-Key: <apiKey>
- Response: returns bids made by the profile, optionally including listing data
- Notes: Empty data array is possible

## Update profile

- Method: PUT
- Endpoint: /auction/profiles/{name}
- Auth required: Yes
- Headers:
  - Authorization: Bearer <accessToken>
  - X-Noroff-API-Key: <apiKey>
  - Content-Type: application/json
- Body:
  - bio
  - avatar { url, alt }
  - banner { url, alt }
- Response: returns updated profile data

## Create listing

- Method: POST
- Endpoint: /auction/listings
- Auth required: Yes
- Headers:
  - Authorization: Bearer <accessToken>
  - X-Noroff-API-Key: <apiKey>
  - Content-Type: application/json
- Body:
  - title
  - description
  - tags
  - media [{ url, alt }]
  - endsAt
- Response:
  - id
  - title
  - description
  - media
  - tags
  - created
  - updated
  - endsAt
  - \_count.bids

## Update listing

- Method: PUT
- Endpoint: /auction/listings/{id}
- Auth required: Yes
- Headers:
  - Authorization: Bearer <accessToken>
  - X-Noroff-API-Key: <apiKey>
  - Content-Type: application/json
- Body:
  - title
  - description
  - tags
  - media [{ url, alt }]
- Response:
  - id
  - title
  - description
  - media
  - tags
  - created
  - updated
  - endsAt
  - \_count.bids
- Notes: endsAt remained unchanged in this update test

## Delete listing

- Method: DELETE
- Endpoint: /auction/listings/{id}
- Auth required: Yes
- Headers:
  - Authorization: Bearer <accessToken>
  - X-Noroff-API-Key: <apiKey>
- Response: 204 No Content
- Notes: no response body is returned on success

## Place bid

- Method: POST
- Endpoint: /auction/listings/{id}/bids
- Auth required: Yes
- Headers:
  - Authorization: Bearer <accessToken>
  - X-Noroff-API-Key: <apiKey>
  - Content-Type: application/json
- Body:
  - amount
- Success response: 201 Created
- Verified by:
  - GET /auction/profiles/{name}/bids?\_listings=true
- Notes: A successful bid of 1000 was placed on listing 7d219938-a8d7-441c-985b-94a412f9bf78 and later confirmed through the profile bids endpoint.
