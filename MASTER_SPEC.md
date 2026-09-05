# MASTER_SPEC.md

# Private Messenger / AI Chat Platform

You are working on a private cross-platform messaging application for a small friend group of approximately 12 people.

Read this document completely before making architectural or code changes.

This file is the source of truth for the product. Do not silently change the architecture, remove requirements, weaken security, or replace difficult features with fake implementations.

---

## 1. Product vision

Build a private messaging application whose main experience feels familiar to modern Messenger-style chat, while providing deeper customization, programmable bots, shared AI providers, rich media, voice/video calls, realtime effects, and native Android/iOS integrations.

The app is primarily for approximately 12 friends.

Priorities, in order:

1. Smooth user experience.
2. Reliable realtime messaging.
3. Messenger-like chat interaction patterns.
4. Deep theme/sticker/effect customization.
5. Powerful AI bots with strict permission control.
6. Reliable voice/video communication.
7. Very low operating cost.
8. Cross-platform compatibility.
9. Maintainable code and database architecture.
10. Progressive enhancement from web/PWA to native Android/iOS.

Do not optimize prematurely for millions of users.

---

## 2. Platform strategy

Preferred architecture:

- React
- TypeScript
- Vite
- Capacitor
- Supabase
- PostgreSQL
- Supabase Auth
- Supabase Realtime
- Supabase Storage
- Server-side AI Gateway
- WebRTC with an SFU for group calls
- Native Android/iOS plugins only where required

One shared codebase should power:

- Web app
- PWA
- Android APK
- iOS Capacitor/native build

Most UI and business logic must be shared. Native code should be isolated behind platform interfaces.

---

## 3. Delivery strategy

Development starts as a web application for fast iteration.

The web/PWA version should support as much as technically possible.

Android should later be packaged as an APK so the private group can install it directly without Google Play.

iOS should support web/PWA as a fallback and a native Capacitor build where native features are required. iOS distribution/signing limitations must be documented accurately.

Do not claim that iOS supports Android-style global floating chat heads through normal public APIs.

---

## 4. Visual direction

The chat experience should use original assets while following familiar modern Messenger-style interaction patterns.

Do not copy proprietary Meta assets, logos, icons, stickers, or exact copyrighted artwork.

Main chat header:

- Back button
- Round avatar
- Conversation/group name
- Online status
- Voice call button
- Video call button
- Conversation information button

Message area:

- Left/right bubbles
- Sender avatars
- Reply previews
- Reactions
- Timestamps
- Read receipts
- Unread separator
- Typing indicator
- Date separators
- System messages
- Bot badge for bots

Composer:

- Attachment/add button
- Camera
- Image picker
- Microphone
- Text input
- Emoji
- Sticker
- Quick reaction

Design mobile-first. Support dark mode. Keep animations smooth and restrained.

---

## 5. Performance requirements

Aim for approximately 60 FPS where realistic on normal smartphones.

Use:

- Virtualized message lists
- Pagination
- Memoized message components
- Optimistic sending
- Stable realtime subscriptions
- Lazy media loading
- Thumbnail-first rendering
- Media compression
- Local cache
- Retry queues
- Background uploads where supported
- Efficient store partitioning
- Batched realtime state updates when useful

Do not load entire long conversations into memory.

---

## 6. Authentication

Use Supabase Auth initially with:

- Email/password registration
- Email/password login
- Persistent session
- Logout
- Protected routes

Never store passwords manually.

---

## 7. Profiles

Each profile should support:

- User ID
- Display name
- Avatar
- Status
- Created timestamp
- Updated timestamp

Users can edit name and avatar.

Architecture should support online status and last active.

---

## 8. Conversations

Support:

- Direct conversations
- Group conversations

Conversation metadata:

- ID
- Type
- Name
- Avatar
- Creator
- Members
- Created timestamp
- Updated timestamp

Primary expected usage: approximately 12 friends.

---

## 9. Conversation nicknames and aliases

Conversation nickname is separate from global profile name.

Name resolution priority should support:

1. Private local alias, if implemented
2. Shared conversation nickname
3. Global profile display name

Prepare for a private alias visible only to the current user.

---

## 10. Messages

Support message types:

- Text
- Image
- Multiple images
- Video
- Audio/voice
- File
- Sticker
- GIF
- Link preview
- TikTok embed/preview
- System event
- Bot message

Each message should support:

- ID
- Conversation ID
- Sender ID
- Type
- Text/content
- Reply target
- Created timestamp
- Edited timestamp
- Deleted timestamp
- Metadata

Store canonical timestamps consistently, preferably UTC.

Default display/conversation timezone:

Asia/Ho_Chi_Minh

---

## 11. Message interactions

Support:

- Send
- Edit
- Unsend/delete
- Reply
- Reaction
- Mention
- Pin
- Copy
- Search
- Read receipts
- Timestamps
- Jump-to-message

Group read receipts may show small avatars near recent messages.

---

## 12. Realtime strategy

Persistent messages:

- PostgreSQL + Supabase Realtime

Typing:

- Supabase Broadcast

Online presence:

- Supabase Presence

Temporary call/room effects:

- Realtime event/Broadcast

Do not continuously write typing state into PostgreSQL.

---

## 13. Typing indicators

Examples:

- "Nam đang nhập..."
- "Nam và Minh đang nhập..."
- "3 người đang nhập..."

Typing events must:

- Be debounced
- Expire automatically
- Avoid network spam

---

## 14. Media

Support sending:

- Images
- Multiple images
- Videos
- Audio
- Files

Uploads should support:

- MIME validation
- File-size validation
- Compression where reasonable
- Thumbnail generation
- Dimensions/duration metadata
- Progress
- Retry
- Cancellation where feasible
- Controlled storage access

Users outside a conversation must not access its private media.

---

## 15. Image viewer

Support:

- Fullscreen view
- Swipe
- Zoom
- Thumbnail-first loading
- Save/share where platform permissions allow

---

## 16. Video messaging

Support:

- Select video
- Preview
- Thumbnail
- Duration
- Inline playback
- Fullscreen playback
- Upload progress

Do not autoplay large video by default.

---

## 17. Voice messages

Support:

- Record
- Cancel
- Preview
- Duration
- Waveform
- Seek
- Playback speed 1x / 1.5x / 2x

Design the pipeline so voice effects can be inserted later.

---

## 18. Recorded voice effects

Optional effects:

- Original
- Chipmunk
- Deep
- Robot
- Old
- Helium
- Radio
- Echo
- Basic Autotune

Prefer local/on-device processing.

Keep the original until the user confirms the processed version.

---

## 19. Message search

Search results should support:

- Text snippet
- Sender
- Timestamp
- Message type
- Jump-to-message

Filters:

- All
- Text
- Image
- Video
- Audio
- File
- Link

Use pagination.

---

## 20. Pinned messages

Users should be able to:

- Pin
- Unpin
- View all pins
- Jump to original message

Prepare architecture for role-based pin permissions.

---

## 21. Themes

Conversation themes may include:

- Background image
- Background color
- Background gradient
- My bubble color/gradient
- Other bubble color
- Text colors
- Accent color
- Composer colors
- Emoji
- Fonts
- Reaction styling
- Subtle animation parameters

Support:

- Shared theme
- Personal override
- Save
- Edit
- Import/export JSON
- Share

Keep theme application efficient.

---

## 22. Word effects

Conversation-defined keyword effects.

Examples:

- "gg" -> confetti
- "đi ngủ" -> moon/stars
- "boom" -> shake/explosion
- "happy birthday" -> balloons

Configuration:

- Trigger
- Match mode
- Animation
- Emoji
- Optional sound
- Duration
- Local/fullscreen
- Enabled
- Creator

Use a reusable effect engine. Do not hardcode trigger logic inside message components.

---

## 23. Stickers

Support:

- Sticker picker
- Sticker packs
- Personal packs
- Shared packs
- Recent stickers
- Favorites

Sticker messages use the normal message architecture.

---

## 24. Sticker creator

Pipeline:

Image
-> subject detection
-> segmentation
-> background removal
-> transparent output
-> preview
-> optional white outline
-> optional shadow
-> crop/rotate/resize
-> save

Prefer local/on-device processing when practical.

Create a segmentation provider abstraction so implementation can later switch among browser, native, or server approaches.

---

## 25. Link previews and TikTok

Build a provider-based link preview system.

For TikTok:

- Detect URL
- Resolve officially available metadata
- Show thumbnail
- Show creator/caption where available
- Use official embed/player where available
- Gracefully fall back to link preview

Do not scrape protected video streams or illegally download TikTok content.

Backend URL fetching must be hardened against SSRF.

---

## 26. Bot platform

Users can create bots with:

- ID
- Owner
- Name
- Avatar
- Description
- Invocation name
- Provider
- Model
- Persona
- Permissions
- Commands
- Triggers
- Memory
- Enabled state

Invocation examples:

- @BotName explain this
- /ask
- /summary
- /remind
- /poll

Bot messages appear like regular messages with a BOT badge.

---

## 27. AI providers

Initially support:

- OpenAI
- Google Gemini

Create a provider abstraction such as:

- generateText()
- generateMultimodal()
- streamResponse()
- supportsVision()
- supportsTools()

Do not tightly couple the app to one provider.

---

## 28. Shared AI API

API credentials are shared by the app but must exist only on trusted server-side infrastructure.

Never expose server AI keys in:

- React source
- Web bundles
- PWA bundles
- APK JavaScript assets
- VITE_ variables

Flow:

Client -> AI Gateway -> Provider -> AI Gateway -> Conversation

---

## 29. AI Gateway

Responsibilities:

- Authenticate user
- Verify conversation membership
- Verify bot
- Check permissions
- Enforce rate limits and quotas
- Gather allowed context
- Retrieve allowed media/files
- Resolve time ranges
- Build provider request
- Call provider
- Normalize response
- Record usage
- Insert or return bot response safely

Never trust client-side authorization.

---

## 30. AI context permissions

Depending on permissions, bots may receive:

- Current user message
- Replied message
- Recent N messages
- Selected history
- Timestamps
- Sender names
- Conversation nicknames
- Explicitly attached images
- Image from replied message
- Files if allowed
- Bot memory

Never send the entire conversation automatically.

---

## 31. AI vision

When the selected provider/model supports vision, bots may inspect relevant images.

Example:

User attaches a circuit image and asks:

@Gemini xem mạch này lỗi ở đâu?

Only send:

- Current request
- Relevant image
- Allowed replied message
- Allowed nearby context
- Relevant timestamps

Never send unrelated private images.

---

## 32. Time-aware AI

Support Vietnamese time queries such as:

- "tóm tắt tin nhắn từ 5h đến 8h"
- "tối qua nói gì?"
- "sáng nay ai nhắn đầu tiên?"
- "lúc 19h nhóm bàn gì?"
- "2 tiếng trước"
- "tuần trước"

Flow:

User request
-> time parser
-> exact timestamps
-> database query
-> chronological messages
-> AI

Resolve time ranges before sending context to the LLM when possible.

---

## 33. Event-based AI history

Support queries such as:

- "từ lúc Nam gửi ảnh đến lúc Minh nói đi ngủ"
- "sau khi Huy gửi link TikTok"
- "trước khi mọi người bắt đầu call"

Pipeline:

- Parse event boundaries
- Search candidate events/messages
- Score candidates
- Resolve interval
- Fetch messages in interval
- Send selected context

If ambiguous, ask for clarification instead of guessing.

---

## 34. Bot persona

Persona settings:

- Role/personality
- Tone
- Humor
- Seriousness
- Friendliness
- Answer length
- Emoji frequency
- Speaking style
- Pronouns
- Preferred language
- Roleplay strength
- Custom system instructions

Persona affects style only.

Persona must never grant itself more data permissions or bypass platform rules.

---

## 35. Bot memory

Explicit structured memory only.

Example:

@bot nhớ deadline đồ án là 25/10

Memory must be:

- Bot-scoped
- Conversation-scoped
- Viewable
- Editable
- Deletable
- Disableable
- Auditable

Do not silently store all chat as permanent memory.

---

## 36. AI privacy UI

Users should be able to inspect context being sent.

Example:

Bot will receive:

- current request
- 18 recent messages
- 1 image

Not shared:

- unrelated images
- other conversations

---

## 37. AI cost control

Enforce server-side configurable limits:

- Requests/user/day
- Image requests/day
- Long summaries/day
- Max context messages
- Max context tokens
- Cooldown
- Concurrent requests
- Model restrictions

Track usage by:

- User
- Bot
- Provider
- Model
- Timestamp
- Input/output tokens where available
- Image count
- Success/failure

---

## 38. Voice calls

Dedicated voice-call button.

Critical requirement:

Voice calls start with camera OFF.

Initial state:

- Microphone enabled unless user preference says otherwise
- Camera disabled

Controls:

- Mute/unmute
- Speaker
- Bluetooth where supported
- Enable camera manually
- Participant list
- Network status
- End call

---

## 39. Video calls

Dedicated video calls.

Target:

- Up to approximately 12 participants

Use an SFU.

Do not implement a 12-user full-mesh topology.

Dynamic layouts:

- 1
- 2
- 4
- 6
- 9
- 12

Optimize remote video quality based on tile size and active speaker.

---

## 40. Native call integration

Where appropriate:

iOS:

- CallKit
- Public notification APIs

Android:

- Native incoming-call notification/integration

Handle foreground/background and terminated state where platform APIs permit.

Document limitations.

---

## 41. Video filters

Initial effects:

- Brightness
- Contrast
- Saturation
- Warm/cool
- Beauty/smoothing
- Blur
- Background blur
- Background replacement

Advanced later:

- Glasses
- Cat ears
- Face masks
- Hearts
- Sparkles
- Animated overlays

Pipeline:

Camera -> processing -> GPU rendering -> outgoing WebRTC track

Allow low-end devices to disable effects.

---

## 42. Realtime voice changer

Effects:

- Original
- Chipmunk
- Deep
- Robot
- Old
- Helium
- Radio
- Echo
- Basic Autotune

Pipeline:

Microphone -> noise processing -> DSP -> outgoing WebRTC audio

Prioritize low latency and call stability.

---

## 43. Synchronized room effects

Support:

- Confetti
- Hearts
- Snow
- Emoji rain
- Party mode

Broadcast event metadata only. Each client renders locally.

---

## 44. Android chat bubbles

Use supported Android native conversation/bubble APIs where possible.

Goals:

- Floating conversation avatar
- Unread badge
- Compact conversation
- Deep link to full chat
- Dismiss bubble

Prefer official Bubble APIs over unnecessary overlay permissions.

Keep Android code behind a platform adapter.

---

## 45. iOS conversation experience

Do not use private APIs or hacks.

Use supported public equivalents:

- Rich notifications
- Quick reply where available
- Deep links
- Fast conversation opening
- Live Activities where appropriate
- Dynamic Island where appropriate
- CallKit for calls
- In-app floating mini-chat only inside the app

Do not claim global Android-style chat heads are available on iOS.

---

## 46. Database

Expected core tables:

- profiles
- conversations
- conversation_members
- messages
- message_reads
- message_reactions
- attachments
- pinned_messages
- conversation_nicknames
- conversation_themes
- word_effects
- sticker_packs
- stickers
- sticker_pack_items
- bots
- bot_personas
- bot_permissions
- bot_commands
- bot_triggers
- bot_memories
- bot_usage
- calls
- call_participants
- notifications

Use migrations for every schema change.

---

## 47. Security

Enable Supabase RLS where appropriate.

Rules:

- Users cannot read conversations they do not belong to.
- Users cannot access private media from unrelated conversations.
- Users cannot edit another person's global profile.
- AI endpoints verify membership server-side.
- Bot permissions cannot be bypassed from the client.
- Storage access must be controlled.
- Link preview fetching must prevent SSRF.
- File uploads must be validated.
- Secrets must never be committed.

Frontend visibility is not security.

---

## 48. Offline behavior

Prepare for:

- Recent conversation cache
- Recent message cache
- Offline state
- Queued outgoing text
- Retry
- Deduplication

Do not attempt full offline-first synchronization initially.

---

## 49. Project structure

Prefer feature-oriented structure:

src/
  app/
  components/
  features/
    auth/
    profiles/
    conversations/
    chat/
    media/
    search/
    themes/
    effects/
    stickers/
    bots/
    calls/
    settings/
  hooks/
  lib/
  services/
  stores/
  types/
  utils/

supabase/
  migrations/
  functions/

android/
ios/

Avoid giant App.tsx and giant global stores.

---

## 50. Error handling

Never silently suppress errors.

Provide:

- User-friendly failures
- Developer logs where appropriate
- Retry for transient errors
- Clear broken states

Do not fake success.

---

## 51. Code quality

Use:

- TypeScript strict mode
- Explicit types
- Reusable services/hooks
- Modular components
- Consistent naming
- Tests for critical behavior

Avoid:

- unnecessary any
- giant files
- duplicated API logic
- duplicated schemas
- hardcoded secrets
- scattered magic values

---

## 52. Git/GitHub workflow

After every successfully completed module:

1. Run typecheck.
2. Run lint.
3. Run relevant tests.
4. Run a production build where practical.
5. Fix errors introduced by the module.
6. Review `git diff`.
7. Ensure `.env`, API keys, credentials, build artifacts, caches, and unrelated files are not accidentally staged.
8. Update `DEVELOPMENT_PLAN.md`.
9. Commit only the completed module.
10. Push to the configured GitHub remote.
11. Verify the push succeeded.

Preferred commit format:

- feat(module-XX): short description
- fix(module-XX): short description
- refactor(module-XX): short description
- test(module-XX): short description
- chore(module-XX): short description

Never force-push unless explicitly instructed.

Never rewrite published history without explicit approval.

If push fails:

- Preserve the local commit.
- Report the exact Git error.
- Do not falsely claim delivery succeeded.
- Provide the exact command or action needed to fix authentication/remote/branch issues.

A module is not considered fully delivered until its validated commit is pushed, unless the only blocker is external GitHub authentication/permissions.

---

## 53. Development discipline

Do not implement the whole app at once.

Each task must implement only one requested module and required integration changes.

After each module:

- Validate
- Update development plan
- Commit
- Push
- Report
- Stop

Every 4–6 modules, perform a checkpoint review before continuing.

---

## 54. Tradeoff priority

When tradeoffs are necessary, prefer:

1. Reliability
2. Security/privacy
3. Smooth UX
4. Maintainability
5. Low cost
6. Feature richness

The app is primarily for approximately 12 friends. Build something that works exceptionally well for them first.
