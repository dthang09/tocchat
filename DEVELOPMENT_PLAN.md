# DEVELOPMENT_PLAN.md

# Private Messenger / AI Chat Platform — Development Plan

This file tracks implementation status. Coding agents must read this file before starting a module and update it only after the module has passed required checks.

Status legend:

- [ ] Not started
- [~] In progress
- [x] Completed and pushed to GitHub
- [!] Blocked

For each completed module, record:

- Completion date
- Commit hash
- Branch
- Test/build status
- Known limitations

---

## Phase 1 — Foundation and Core Chat

- [ ] Module 01 — Project Foundation
- [ ] Module 02 — Core Database Schema
- [ ] Module 03 — Authentication
- [ ] Module 04 — User Profiles
- [ ] Module 05 — Conversations
- [ ] Module 06 — Messaging Database Schema
- [ ] Module 07 — Realtime Text Messaging
- [ ] Module 08 — Message Replies
- [ ] Module 09 — Message Reactions
- [ ] Module 10 — Read Receipts
- [ ] Module 11 — Typing Indicators and Presence

### Phase 1 acceptance milestone

At the end of Module 11, at least 2–3 accounts should be able to:

- register/login
- create/open a conversation
- send/receive realtime text
- reply
- react
- see read receipts
- see typing
- see online presence

Do a checkpoint and multi-account manual test before Phase 2.

---

## Phase 2 — Media and Conversation Utilities

- [ ] Module 12 — Image Messaging
- [ ] Module 13 — Video Messages
- [ ] Module 14 — Voice Messages
- [ ] Module 15 — File Attachments
- [ ] Module 16 — Pinned Messages
- [ ] Module 17 — Conversation Search
- [ ] Module 18 — Conversation Nicknames

### Phase 2 acceptance milestone

Users should be able to use the app as a practical private messenger with text, images, video, audio, files, search, pins, and nicknames.

Perform a checkpoint before Phase 3.

---

## Phase 3 — Customization and Rich Content

- [ ] Module 19 — Conversation Theme Engine
- [ ] Module 20 — Word Effect Engine
- [ ] Module 21 — Sticker Messaging
- [ ] Module 22 — Sticker Creator
- [ ] Module 23 — Link Preview System and TikTok

### Phase 3 acceptance milestone

Users should be able to customize conversations, use stickers, create stickers from images, trigger chat effects, and view rich links.

Perform a checkpoint before Phase 4.

---

## Phase 4 — Bots and AI

- [ ] Module 24 — Bot Database
- [ ] Module 25 — Bot Creator UI
- [ ] Module 26 — Secure AI Gateway
- [ ] Module 27 — Bot Invocation in Chat
- [ ] Module 28 — AI Vision
- [ ] Module 29 — Time-Aware AI
- [ ] Module 30 — Event-Based Conversation Search
- [ ] Module 31 — Advanced Bot Persona Runtime
- [ ] Module 32 — Structured Bot Memory
- [ ] Module 33 — AI Cost and Usage Control

### Phase 4 acceptance milestone

A user should be able to:

- create/configure a bot
- mention it in chat
- use OpenAI/Gemini through the server
- let it inspect explicitly allowed images
- summarize a specified time range
- use persona settings
- use explicit structured memory
- respect server-side quotas and permissions

Perform a security-focused checkpoint before calls.

---

## Phase 5 — Voice and Video Calls

- [ ] Module 34 — Call State and Database
- [ ] Module 35 — Voice Calling
- [ ] Module 36 — Group Video Calling
- [ ] Module 37 — Incoming Call Integration

### Phase 5 acceptance milestone

The group should be able to conduct stable voice and video calls. Voice calls must start with camera off. Video call architecture must use an SFU rather than a 12-user full mesh.

---

## Phase 6 — Voice and Video Effects

- [ ] Module 38 — Recorded Voice Effects
- [ ] Module 39 — Realtime Call Voice Changer
- [ ] Module 40 — Basic Camera Filters
- [ ] Module 41 — Face Landmark Effects
- [ ] Module 42 — Video Background Effects
- [ ] Module 43 — Synchronized Call Effects

### Phase 6 acceptance milestone

Effects should be optional, low-latency, and gracefully degrade on weaker devices.

---

## Phase 7 — Native Packaging and Platform Features

- [ ] Module 44 — Android Native Packaging / APK
- [ ] Module 45 — Android Conversation Bubbles
- [ ] Module 46 — iOS Native Integration

### Phase 7 acceptance milestone

Android should produce a testable APK. Android bubbles should use supported native APIs. iOS should use public APIs only and document limitations.

---

## Phase 8 — Offline, Notifications, Settings

- [ ] Module 47 — Offline Resilience
- [ ] Module 48 — Media Cache and Optimization
- [ ] Module 49 — Messaging Notifications
- [ ] Module 50 — Settings

---

## Phase 9 — Audit and Release Readiness

- [ ] Module 51 — Performance Audit
- [ ] Module 52 — Security and Privacy Audit
- [ ] Module 53 — Final End-to-End QA

---

# Checkpoint schedule

Perform a checkpoint after approximately every 4–6 implementation modules.

Recommended checkpoints:

- After Module 05
- After Module 11
- After Module 18
- After Module 23
- After Module 28
- After Module 33
- After Module 37
- After Module 43
- After Module 46
- After Module 50

Each checkpoint must:

- add no new product features
- run typecheck
- run lint
- run tests
- run production build
- inspect migrations/RLS
- inspect realtime cleanup
- inspect Git status
- fix only clear defects
- commit and push checkpoint fixes separately if any

---

# Completion record template

When completing a module, replace its checkbox with `[x]` and add an indented record:

    - Completed: YYYY-MM-DD
    - Commit: <hash>
    - Branch: <branch>
    - Checks: typecheck ✅ / lint ✅ / tests ✅ / build ✅
    - Known limitations: <none or description>

If GitHub push is blocked by external authentication/permissions, mark the module `[!]` until the push succeeds, even if a local commit exists.
