# College Sports Tournament Manager

Premium editorial multi-sport tournament portal built with React/Vite, Express, Node.js, and MongoDB Atlas. Includes administrator and standard-user authentication, role-protected server endpoints, team/player/event APIs, and optional SMTP announcements.

## Authentication
- Administrator is bootstrapped from `ADMIN_EMAIL` and `ADMIN_PASSWORD` in `server/.env` after MongoDB connects.
- Standard users can register from the sign-in screen. Public registration cannot assign admin role.
- Passwords are hashed with bcrypt; API sessions use signed JWTs.
- Admin-only writes are enforced by the backend, not merely hidden in the UI.

## Setup
Follow `START_HERE.txt` for MongoDB Atlas, environment variables, install commands, and first login. Copy `server/.env.example` to `server/.env` and fill in your own credentials. Never commit or share `.env`.

## Important data note
The existing frontend still stores some tournament-only records (such as team directory, attendance, and recorded results) in the current browser's local storage. The MongoDB-backed API persists user accounts, players, and events. For multi-computer college-wide use, the remaining records should be moved to MongoDB models and API routes as a follow-up step.


## Login and JWT sessions

- The React app starts on a login screen. Use the administrator credentials configured in `server/.env`, or select Register for a standard account.
- User accounts and password hashes are stored in MongoDB Atlas. Passwords are hashed with bcrypt; plain-text passwords are never stored.
- Login/register returns an 8-hour JWT. The browser sends it as a Bearer token. MongoDB stores only the SHA-256 hash of the token in `AuthSessions`, allowing server-side logout/revocation. The raw JWT is not stored in MongoDB.
- The first administrator is bootstrapped from `ADMIN_EMAIL` and `ADMIN_PASSWORD` after Atlas connects. Public registration cannot create an admin.
- Do not share `.env`, database credentials, or `JWT_SECRET`.
