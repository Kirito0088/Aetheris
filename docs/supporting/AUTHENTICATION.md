# Authentication and Authorization Specification (Future Phase)

This document specifies the authentication architecture and user flow for the future production integration of Aetheris, as well as details about the active demo mode credentials.

---

## Active Demo Mode Credentials

During the current experience design phase, authentication is simulated locally on the client. 

### 1. Organizer Console Login
To authenticate as a Venue Organizer, access the login portal and use the following credentials:
* **Email:** `admin@aetheris.ai`
* **Password:** `testing123`

### 2. Fan Experience Entry
Fans enter the platform using a simple guest entry flow. Upon choosing the Fan portal:
* The user is automatically onboarded using a simulated Google Account (`spectator@aetheris.ai`).
* A ticket selection card prompts the user to select their ticket tier (**Standard** or **VIP**).
* An accessibility toggle configures the user's routing profile.

---

## Future Production Integration Plans

The following specifications detail the architecture for the upcoming production backend migration.

### 1. Google Cloud Console & OAuth Configuration
Production authentication will leverage Google OAuth 2.0. The setup requires configuring credentials in the Google Cloud Console:
* **OAuth Consent Screen**: Configured with the `aetheris.ai` domain, requesting `openid`, `email`, and `profile` scopes.
* **Credentials Type**: Web Application OAuth Client ID.
* **Authorized Javascript Origins**:
  * Development: `http://localhost:3000`
  * Production: `https://app.aetheris.ai`
* **Authorized Redirect URIs**:
  * Development: `http://localhost:3000/api/auth/callback`
  * Production: `https://app.aetheris.ai/api/auth/callback`

### 2. Google Login Flow & User Provisioning
When a user clicks "Sign In with Google":
1. The client redirects the user to the Google OAuth consent flow.
2. Upon successful authentication, Google returns a authorization code or ID Token.
3. The Next.js API route exchanges this token for a secure session (using Supabase Auth or NextAuth.js).
4. A trigger-based function in the database automatically provisions a new row in the `public.users` table:
   ```sql
   create function public.handle_new_user()
   returns trigger as $$
   begin
     insert into public.users (id, email, full_name, avatar_url)
     values (new.id, new.email, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
     return new;
   end;
   $$ language plpgsql security definer;
   ```

### 3. Ticket Validation Engine
For Fans, the authentication callback will trigger a lookup against the ticketing database (integrating with official ticket API providers like FIFA Ticketing API):
* **Verification API Hook**:
  * Request payload: `{ email: user.email }`
  * Response structure: `{ ticket_id: string, tier: 'standard' | 'vip', seat_block: string, seat_row: string, seat_number: string }`
* If no ticket is associated, the account is marked as a `guest` and prompts for demo ticket selection.
* If a ticket is detected, the database automatically populates the `public.tickets` registry, establishing seat coordinates for live stadium framing.

### 4. Role and Session Persistence
* **Role Registry**: A database table `public.user_roles` will map user IDs to roles (`fan`, `steward`, `organizer`, `admin`).
* **Session JWT**: The session token (JWT) signed by the backend will store the user's active role inside the token metadata to prevent client-side spoofing. The API middleware will check the JWT claim before serving database rows.
* **Route Guards**: Next.js middleware will inspect the JWT and redirect users attempting to access unauthorized workspaces (e.g. redirecting a fan attempting to access `/operations` back to `/live`).

### 5. VIP Entitlement Enforcement
Users verified with a `VIP` ticket will have the `vip` routing profile unlocked. The server-side routing calculations and API endpoints will inspect the user's active ticket type and refuse to compile path graphs containing VIP tunnels for standard users.

### 6. Accessibility Preference Persistence
Fan accessibility profiles (e.g. step-free requirement, high contrast preference, screen reader guides) will be persisted in `public.user_preferences`:
* Row Level Security (RLS) policies will enable users to read and update only their own preference records:
  ```sql
  create policy "Users can update their own preferences."
    on public.user_preferences for update
    using (auth.uid() = user_id);
  ```
* These preferences will be loaded on session initiation and automatically synchronized with the frontend Zustand store on mount.
