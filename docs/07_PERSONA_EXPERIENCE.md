# 07 Persona Experience

> **Purpose**: Defines the tailored, role-specific experiences for all Aetheris users.
> **Audience**: Design, Product, and Engineering
> **Owner**: Product Team
> **Status**: Active
> **Version**: 3.0
> **Last Updated**: July 2026
> **Related Documents**: `03_SYSTEM_ARCHITECTURE.md`, `08_DEMO_STORY.md`

## Overview
Aetheris does not assume a "one size fits all" dashboard. Each persona experiences a completely isolated interface tailored to their specific operational reality. Intelligence is filtered, prioritized, and presented according to what that persona needs to act upon *right now*.

---

## 1. Fan
The end consumer of the tournament experience, seeking a memorable, stress-free journey.

- **Goals**: Arrive on time, find amenities easily, avoid crowds, enjoy the match.
- **Pain Points**: Getting lost, unexpected transit delays, language barriers, massive crowds at concessions/restrooms.
- **Mental Model**: "Guide me effortlessly from my hotel to my seat."
- **Permissions**: Read-only access to public venue data. Personal ticket data.
- **Screens**: Mobile-first interface. Ticketing Wallet, Smart Route Map, Concession/Amenity Locator.
- **Information Hierarchy**: 1. Next Action (e.g., "Board Train 4"), 2. Dynamic Routing Map, 3. Amenity suggestions.
- **AI Assistance**: Proactive rerouting based on live congestion; personalized recommendations for less crowded gates.
- **Notifications**: "High congestion at Gate B. Rerouting to Gate C for faster entry."
- **Primary Workflows**: Transit -> Security -> Seat -> Concession -> Exit.
- **Future Expansion**: Seat upgrades, in-seat ordering, localized AR experiences.

## 2. Volunteer
The frontline workforce executing operational tasks and assisting fans.

- **Goals**: Know exactly where to be and what to do; communicate effectively with diverse fans.
- **Pain Points**: Information silos, unclear priorities, language barriers when assisting fans, feeling disconnected from central command.
- **Mental Model**: "Tell me what my priority is right now and give me the tools to solve it."
- **Permissions**: Read access to assigned zone data. Write access to incident reporting and task completion.
- **Screens**: Mobile-first interface. Task Inbox, Zone Map, Real-time Translator, Incident Reporter.
- **Information Hierarchy**: 1. Active Priority Task, 2. Live Translation Tool, 3. Zone Map.
- **AI Assistance**: Real-time translation of fan inquiries; optimal routing to task locations.
- **Notifications**: "New Assignment: Assist crowd control at Gate B. (2 min walk)."
- **Primary Workflows**: Receive Task -> Navigate to Zone -> Assist/Translate -> Resolve Task.
- **Future Expansion**: Peer-to-peer volunteer communication, gamification of tasks.

## 3. Operations
The central nervous system managing the venue's overall flow and logistics.

- **Goals**: Maintain steady crowd flow, prevent bottlenecks, allocate resources efficiently.
- **Pain Points**: Reactive rather than proactive management, overwhelming data streams, coordinating multiple disparate teams.
- **Mental Model**: "Give me a god's-eye view of the venue's health and predict where the next issue will occur."
- **Permissions**: Full read/write access to venue state, volunteer deployment, and global messaging.
- **Screens**: Desktop-first control room. Venue Health Dashboard, Predictive Heatmaps, Resource Allocation Panel, Global Comms.
- **Information Hierarchy**: 1. Critical Anomalies/Incidents, 2. Venue Heatmap/Flow, 3. Resource Availability.
- **AI Assistance**: Congestion prediction; automated dispatch recommendations.
- **Notifications**: "Prediction: Concourse 3 will reach critical capacity in 10 mins. Recommend opening overflow gates."
- **Primary Workflows**: Monitor Venue -> Receive AI Prediction -> Approve Dispatch -> Monitor Resolution.
- **Future Expansion**: Automated vendor restocking integrations, transit authority data feeds.

## 4. Security
The protection force ensuring the safety of all attendees and staff.

- **Goals**: Prevent incidents, respond immediately to threats, maintain orderly access.
- **Pain Points**: Blind spots, slow incident reporting, difficulty locating specific incidents in massive crowds.
- **Mental Model**: "Show me threats instantly and coordinate my team's response."
- **Permissions**: High-level read/write. Access to secure feeds, incident logs, and override commands.
- **Screens**: Tablet/Mobile hybrid. Incident Feed, Secure Routing Map, Team Tracker.
- **Information Hierarchy**: 1. Active Incidents (Red), 2. Team Locations, 3. General Venue State.
- **AI Assistance**: Anomaly detection in crowd movement; optimal, secure routing to incident zones avoiding dense crowds.
- **Notifications**: "Priority: Medical incident at Section 112. Best route mapped."
- **Primary Workflows**: Receive Alert -> Review AI Route -> Arrive at Scene -> Log Resolution.
- **Future Expansion**: Integration with computer vision anomaly detection, biometric access control.

## 5. Future Admin
The overarching technical administrator configuring the platform.

- **Goals**: Ensure the platform is correctly configured for the specific match day.
- **Pain Points**: Complex configuration, ensuring all zones and permissions are correctly mapped before a match.
- **Mental Model**: "Let me build the rules and constraints the AI will operate within."
- **Permissions**: Root access.
- **Screens**: Desktop application. Rule Builder, Zone Configurator, Role Manager, System Health.
- **Information Hierarchy**: System Status, Configuration Panes, Audit Logs.
- **AI Assistance**: Recommendations on threshold settings based on historical match data.
- **Notifications**: "Warning: Gateway API latency high."
- **Primary Workflows**: Define Zones -> Set Congestion Rules -> Assign Roles -> Monitor System Health.
- **Future Expansion**: Multi-stadium global administration.
