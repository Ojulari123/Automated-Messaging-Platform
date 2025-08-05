# Automated-Messaging-Platform
A small, reliable, easy-to-use web-based system that automatically sends occasion messages (e.g., birthdays, anniversaries) to approved members(Admin controls approval & rejection of memberships). Messages use reusable templates so the admin doesn’t have to compose them manually (it is allows for custom messaging)

The abbreviation 'AMS' is used throughout the source code and database to refer to the Automated Messaging System, for the sake of brevity.

## Frameworks
- FastAPI  
- SQLAlchemy  
- PostgreSQL  
- Twilio (SMS)  
- OAuth2 + JWT  
- dotenv

## File Structure
.
- main.py # Starts app, sets up lifespan
- user.py # Auth, user routes
- message.py # Auto/custom message routes
- schemas.py # Request/response schemas
- tables.py # DB models & connection
- func.py # Utility funcs (e.g., role check)
- .env # Environment variables

# How to compile the endpoints:
- First, navigate to the "Backend" directory(cd Backend)
- Secondly, run the command "uvicorn main:app --reload"

## Authentication & Users
POST /user/register-member – User signup
<!-- Everything else is only for admins only -->
POST /user/register-admin – Admin signup (admin-only)
POST /user/auth-login – Login, get tokens
POST /user/new-members/activate – Approve 1 pending member
POST /user/new-members/activate-all – Approve all pending members
POST /user/new-members/reject – Reject one pending member
POST /user/admin-members/reject-all – Reject all pending members
GET /user/retrieve-pending-members – See all pending members
DELETE /user/delete-a-member – Delete 1 user from the database
DELETE /user/delete-all-members – Delete all users from the database

## Dates
<!-- Admins only -->
GET /user/view-dates-table – All event dates (admin-only)
GET /user/query-dates-table/{user_id} – Dates for 1 user

## Messages
<!-- Admins only -->
POST /message/write-message – Auto message for events (birthday, anniversary, other)
POST /message/custom-message – Custom message for events to user(s)

## Note
- Dummy user is added at startup (helps local testing)
- Removed at shutdown (lifespan in main.py)

## Built by
- Ojulari Adeoluwa
- Nkemka Akah
- Ojulari Tobi