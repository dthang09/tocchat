# MODULE_PROMPTS.md

# How to use

Each module below already contains the mandatory pre-task Git/GitHub instructions. Copy one whole module prompt at a time into your coding agent. Do not combine multiple modules into one request.

---

# MODULE 01 — Project Foundation

```text
## Mandatory pre-task instructions

Read `MASTER_SPEC.md` completely before touching the codebase.

Read `DEVELOPMENT_PLAN.md`.

Inspect the current repository before making changes, including:

- current branch
- `git status`
- configured Git remotes
- current project structure
- existing database migrations
- existing tests
- existing architecture patterns

Rules:

- Implement ONLY this requested module.
- Do not start future modules.
- Do not rewrite stable architecture without a concrete technical reason.
- Do not remove working functionality.
- Do not modify unrelated modules unless required for integration.
- Keep TypeScript strict.
- Follow existing conventions.
- Reuse existing services, hooks, components, stores, and types.
- Avoid duplicated logic.
- Never expose secrets or server-side API keys.
- Never commit `.env`, API keys, tokens, credentials, or private certificates.
- Use migrations for every database schema change.
- Preserve RLS and authorization.
- Do not silently suppress errors.
- Do not fake successful functionality.
- Clearly mark unavoidable future work with TODO comments.
- Preserve backward compatibility unless the module explicitly requires a migration or breaking change.

Before finishing this module:

1. Run TypeScript typecheck.
2. Run lint.
3. Run relevant automated tests.
4. Run a production build where practical.
5. Fix all errors introduced by this module.
6. Review `git diff`.
7. Verify no secret, unrelated file, cache, build output, or accidental generated file is staged.
8. Update `DEVELOPMENT_PLAN.md` with the module status and known limitations.
9. Create one focused Git commit for this module.
10. Push the commit to the configured GitHub remote.
11. Verify that the push succeeded.

Preferred commit format:

`feat(module-XX): short description`

Use `fix`, `refactor`, `test`, or `chore` instead of `feat` when more appropriate.

Never force-push.

If GitHub push fails because of authentication, permissions, missing remote, protected branch, or network failure:

- preserve the local commit
- report the exact Git error
- do not reset or delete completed work
- do not claim the module was fully delivered
- provide the exact corrective command/action needed

At the end report:

- implementation summary
- files created
- files modified
- database migrations
- dependencies added
- environment variables added
- tests performed
- build result
- commit hash
- commit message
- branch pushed
- GitHub push status
- known limitations
- manual testing instructions

Then STOP.

## Task: MODULE 01 — Project Foundation

Create the initial app using:

- React
- TypeScript
- Vite
- Capacitor
- Supabase client

Requirements:

- Strict TypeScript
- Routing
- Environment configuration
- `.env.example`
- Global error boundary
- Basic loading-state foundation
- Lightweight toast/notification foundation
- Mobile-first application shell
- Dark-mode-ready styling structure
- Feature-based architecture

Create at least:

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

Prepare client environment variables:

- VITE_SUPABASE_URL
- VITE_SUPABASE_ANON_KEY

Never commit actual credentials.

Initialize Capacitor configuration but do not implement native-only features yet.

Do not implement authentication or database tables.

Acceptance:

- dev server runs
- typecheck passes
- lint passes
- production build passes

Use a focused commit message such as:
`feat(module-01): project foundation`

Then STOP.
```

---

# MODULE 02 — Core Database Schema

```text
## Mandatory pre-task instructions

Read `MASTER_SPEC.md` completely before touching the codebase.

Read `DEVELOPMENT_PLAN.md`.

Inspect the current repository before making changes, including:

- current branch
- `git status`
- configured Git remotes
- current project structure
- existing database migrations
- existing tests
- existing architecture patterns

Rules:

- Implement ONLY this requested module.
- Do not start future modules.
- Do not rewrite stable architecture without a concrete technical reason.
- Do not remove working functionality.
- Do not modify unrelated modules unless required for integration.
- Keep TypeScript strict.
- Follow existing conventions.
- Reuse existing services, hooks, components, stores, and types.
- Avoid duplicated logic.
- Never expose secrets or server-side API keys.
- Never commit `.env`, API keys, tokens, credentials, or private certificates.
- Use migrations for every database schema change.
- Preserve RLS and authorization.
- Do not silently suppress errors.
- Do not fake successful functionality.
- Clearly mark unavoidable future work with TODO comments.
- Preserve backward compatibility unless the module explicitly requires a migration or breaking change.

Before finishing this module:

1. Run TypeScript typecheck.
2. Run lint.
3. Run relevant automated tests.
4. Run a production build where practical.
5. Fix all errors introduced by this module.
6. Review `git diff`.
7. Verify no secret, unrelated file, cache, build output, or accidental generated file is staged.
8. Update `DEVELOPMENT_PLAN.md` with the module status and known limitations.
9. Create one focused Git commit for this module.
10. Push the commit to the configured GitHub remote.
11. Verify that the push succeeded.

Preferred commit format:

`feat(module-XX): short description`

Use `fix`, `refactor`, `test`, or `chore` instead of `feat` when more appropriate.

Never force-push.

If GitHub push fails because of authentication, permissions, missing remote, protected branch, or network failure:

- preserve the local commit
- report the exact Git error
- do not reset or delete completed work
- do not claim the module was fully delivered
- provide the exact corrective command/action needed

At the end report:

- implementation summary
- files created
- files modified
- database migrations
- dependencies added
- environment variables added
- tests performed
- build result
- commit hash
- commit message
- branch pushed
- GitHub push status
- known limitations
- manual testing instructions

Then STOP.

## Task: MODULE 02 — Core Database Schema

Create Supabase migrations for:

- profiles
- conversations
- conversation_members

profiles:

- id linked to auth.users
- display_name
- avatar_url
- status
- created_at
- updated_at

conversations:

- id
- type: direct | group
- name
- avatar_url
- created_by
- created_at
- updated_at

conversation_members:

- conversation_id
- user_id
- nickname nullable
- role
- joined_at

Requirements:

- UUIDs where appropriate
- primary keys
- foreign keys
- uniqueness constraints
- useful indexes
- safe delete behavior
- timestamps
- RLS enabled

Policies:

- Users may update their own profile.
- Users may read conversations only when they are members.
- Members may read membership information only for conversations they belong to.
- Profiles needed for shared conversations should be readable to those members.

Do not create message tables yet.

Use a focused commit message such as:
`feat(module-02): core database schema`

Then STOP.
```

---

# MODULE 03 — Authentication

```text
## Mandatory pre-task instructions

Read `MASTER_SPEC.md` completely before touching the codebase.

Read `DEVELOPMENT_PLAN.md`.

Inspect the current repository before making changes, including:

- current branch
- `git status`
- configured Git remotes
- current project structure
- existing database migrations
- existing tests
- existing architecture patterns

Rules:

- Implement ONLY this requested module.
- Do not start future modules.
- Do not rewrite stable architecture without a concrete technical reason.
- Do not remove working functionality.
- Do not modify unrelated modules unless required for integration.
- Keep TypeScript strict.
- Follow existing conventions.
- Reuse existing services, hooks, components, stores, and types.
- Avoid duplicated logic.
- Never expose secrets or server-side API keys.
- Never commit `.env`, API keys, tokens, credentials, or private certificates.
- Use migrations for every database schema change.
- Preserve RLS and authorization.
- Do not silently suppress errors.
- Do not fake successful functionality.
- Clearly mark unavoidable future work with TODO comments.
- Preserve backward compatibility unless the module explicitly requires a migration or breaking change.

Before finishing this module:

1. Run TypeScript typecheck.
2. Run lint.
3. Run relevant automated tests.
4. Run a production build where practical.
5. Fix all errors introduced by this module.
6. Review `git diff`.
7. Verify no secret, unrelated file, cache, build output, or accidental generated file is staged.
8. Update `DEVELOPMENT_PLAN.md` with the module status and known limitations.
9. Create one focused Git commit for this module.
10. Push the commit to the configured GitHub remote.
11. Verify that the push succeeded.

Preferred commit format:

`feat(module-XX): short description`

Use `fix`, `refactor`, `test`, or `chore` instead of `feat` when more appropriate.

Never force-push.

If GitHub push fails because of authentication, permissions, missing remote, protected branch, or network failure:

- preserve the local commit
- report the exact Git error
- do not reset or delete completed work
- do not claim the module was fully delivered
- provide the exact corrective command/action needed

At the end report:

- implementation summary
- files created
- files modified
- database migrations
- dependencies added
- environment variables added
- tests performed
- build result
- commit hash
- commit message
- branch pushed
- GitHub push status
- known limitations
- manual testing instructions

Then STOP.

## Task: MODULE 03 — Authentication

Use Supabase Auth.

Features:

- Email/password registration
- Email/password login
- Persistent session
- Logout
- Auth loading state
- Protected application routes
- Redirect authenticated users away from auth pages
- Friendly errors

After registration, ensure a profile row exists.

Create reusable:

- auth service
- auth hook/store
- LoginScreen
- RegisterScreen

Never store passwords manually.

Do not implement conversations yet.

Acceptance includes session persistence after reload.

Use a focused commit message such as:
`feat(module-03): authentication`

Then STOP.
```

---

# MODULE 04 — User Profiles

```text
## Mandatory pre-task instructions

Read `MASTER_SPEC.md` completely before touching the codebase.

Read `DEVELOPMENT_PLAN.md`.

Inspect the current repository before making changes, including:

- current branch
- `git status`
- configured Git remotes
- current project structure
- existing database migrations
- existing tests
- existing architecture patterns

Rules:

- Implement ONLY this requested module.
- Do not start future modules.
- Do not rewrite stable architecture without a concrete technical reason.
- Do not remove working functionality.
- Do not modify unrelated modules unless required for integration.
- Keep TypeScript strict.
- Follow existing conventions.
- Reuse existing services, hooks, components, stores, and types.
- Avoid duplicated logic.
- Never expose secrets or server-side API keys.
- Never commit `.env`, API keys, tokens, credentials, or private certificates.
- Use migrations for every database schema change.
- Preserve RLS and authorization.
- Do not silently suppress errors.
- Do not fake successful functionality.
- Clearly mark unavoidable future work with TODO comments.
- Preserve backward compatibility unless the module explicitly requires a migration or breaking change.

Before finishing this module:

1. Run TypeScript typecheck.
2. Run lint.
3. Run relevant automated tests.
4. Run a production build where practical.
5. Fix all errors introduced by this module.
6. Review `git diff`.
7. Verify no secret, unrelated file, cache, build output, or accidental generated file is staged.
8. Update `DEVELOPMENT_PLAN.md` with the module status and known limitations.
9. Create one focused Git commit for this module.
10. Push the commit to the configured GitHub remote.
11. Verify that the push succeeded.

Preferred commit format:

`feat(module-XX): short description`

Use `fix`, `refactor`, `test`, or `chore` instead of `feat` when more appropriate.

Never force-push.

If GitHub push fails because of authentication, permissions, missing remote, protected branch, or network failure:

- preserve the local commit
- report the exact Git error
- do not reset or delete completed work
- do not claim the module was fully delivered
- provide the exact corrective command/action needed

At the end report:

- implementation summary
- files created
- files modified
- database migrations
- dependencies added
- environment variables added
- tests performed
- build result
- commit hash
- commit message
- branch pushed
- GitHub push status
- known limitations
- manual testing instructions

Then STOP.

## Task: MODULE 04 — User Profiles

Implement:

- Profile screen
- Edit profile screen
- Change display name
- Upload/change avatar
- Display avatar
- Status field

Avatar pipeline:

select image
-> validate
-> resize/compress when reasonable
-> upload to Supabase Storage
-> update profile.avatar_url

Requirements:

- progress state
- failure state
- loading state
- Storage policies
- reusable Avatar component

Do not implement realtime presence yet.

Use a focused commit message such as:
`feat(module-04): user profiles`

Then STOP.
```

---

# MODULE 05 — Conversations

```text
## Mandatory pre-task instructions

Read `MASTER_SPEC.md` completely before touching the codebase.

Read `DEVELOPMENT_PLAN.md`.

Inspect the current repository before making changes, including:

- current branch
- `git status`
- configured Git remotes
- current project structure
- existing database migrations
- existing tests
- existing architecture patterns

Rules:

- Implement ONLY this requested module.
- Do not start future modules.
- Do not rewrite stable architecture without a concrete technical reason.
- Do not remove working functionality.
- Do not modify unrelated modules unless required for integration.
- Keep TypeScript strict.
- Follow existing conventions.
- Reuse existing services, hooks, components, stores, and types.
- Avoid duplicated logic.
- Never expose secrets or server-side API keys.
- Never commit `.env`, API keys, tokens, credentials, or private certificates.
- Use migrations for every database schema change.
- Preserve RLS and authorization.
- Do not silently suppress errors.
- Do not fake successful functionality.
- Clearly mark unavoidable future work with TODO comments.
- Preserve backward compatibility unless the module explicitly requires a migration or breaking change.

Before finishing this module:

1. Run TypeScript typecheck.
2. Run lint.
3. Run relevant automated tests.
4. Run a production build where practical.
5. Fix all errors introduced by this module.
6. Review `git diff`.
7. Verify no secret, unrelated file, cache, build output, or accidental generated file is staged.
8. Update `DEVELOPMENT_PLAN.md` with the module status and known limitations.
9. Create one focused Git commit for this module.
10. Push the commit to the configured GitHub remote.
11. Verify that the push succeeded.

Preferred commit format:

`feat(module-XX): short description`

Use `fix`, `refactor`, `test`, or `chore` instead of `feat` when more appropriate.

Never force-push.

If GitHub push fails because of authentication, permissions, missing remote, protected branch, or network failure:

- preserve the local commit
- report the exact Git error
- do not reset or delete completed work
- do not claim the module was fully delivered
- provide the exact corrective command/action needed

At the end report:

- implementation summary
- files created
- files modified
- database migrations
- dependencies added
- environment variables added
- tests performed
- build result
- commit hash
- commit message
- branch pushed
- GitHub push status
- known limitations
- manual testing instructions

Then STOP.

## Task: MODULE 05 — Conversations

Implement:

- Conversation list
- Create group conversation
- Group name
- Group avatar
- Member selection
- Open conversation route

Conversation row UI:

- circular avatar
- name
- secondary preview area
- timestamp area
- touch-friendly modern Messenger-inspired layout

Messages do not exist yet, so do not invent fake last-message data.

Target a small private group of approximately 12 users.

Use a focused commit message such as:
`feat(module-05): conversations`

Then STOP.
```

---

# MODULE 06 — Messaging Database Schema

```text
## Mandatory pre-task instructions

Read `MASTER_SPEC.md` completely before touching the codebase.

Read `DEVELOPMENT_PLAN.md`.

Inspect the current repository before making changes, including:

- current branch
- `git status`
- configured Git remotes
- current project structure
- existing database migrations
- existing tests
- existing architecture patterns

Rules:

- Implement ONLY this requested module.
- Do not start future modules.
- Do not rewrite stable architecture without a concrete technical reason.
- Do not remove working functionality.
- Do not modify unrelated modules unless required for integration.
- Keep TypeScript strict.
- Follow existing conventions.
- Reuse existing services, hooks, components, stores, and types.
- Avoid duplicated logic.
- Never expose secrets or server-side API keys.
- Never commit `.env`, API keys, tokens, credentials, or private certificates.
- Use migrations for every database schema change.
- Preserve RLS and authorization.
- Do not silently suppress errors.
- Do not fake successful functionality.
- Clearly mark unavoidable future work with TODO comments.
- Preserve backward compatibility unless the module explicitly requires a migration or breaking change.

Before finishing this module:

1. Run TypeScript typecheck.
2. Run lint.
3. Run relevant automated tests.
4. Run a production build where practical.
5. Fix all errors introduced by this module.
6. Review `git diff`.
7. Verify no secret, unrelated file, cache, build output, or accidental generated file is staged.
8. Update `DEVELOPMENT_PLAN.md` with the module status and known limitations.
9. Create one focused Git commit for this module.
10. Push the commit to the configured GitHub remote.
11. Verify that the push succeeded.

Preferred commit format:

`feat(module-XX): short description`

Use `fix`, `refactor`, `test`, or `chore` instead of `feat` when more appropriate.

Never force-push.

If GitHub push fails because of authentication, permissions, missing remote, protected branch, or network failure:

- preserve the local commit
- report the exact Git error
- do not reset or delete completed work
- do not claim the module was fully delivered
- provide the exact corrective command/action needed

At the end report:

- implementation summary
- files created
- files modified
- database migrations
- dependencies added
- environment variables added
- tests performed
- build result
- commit hash
- commit message
- branch pushed
- GitHub push status
- known limitations
- manual testing instructions

Then STOP.

## Task: MODULE 06 — Messaging Database Schema

Create migrations for:

- messages
- attachments
- message_reactions
- message_reads
- pinned_messages

messages:

- id
- conversation_id
- sender_id
- type
- content/text
- reply_to_message_id nullable
- created_at
- edited_at nullable
- deleted_at nullable
- metadata if justified

Supported message architecture:

- text
- image
- video
- audio
- file
- sticker
- link
- system
- bot

attachments:

- id
- message_id
- storage_path
- thumbnail_path
- file_name
- mime_type
- file_size
- width
- height
- duration
- metadata
- created_at

message_reactions:

- message_id
- user_id
- emoji
- created_at

message_reads:

- message_id
- user_id
- read_at

pinned_messages:

- conversation_id
- message_id
- pinned_by
- pinned_at

Add timeline/search-supporting indexes.

Enable RLS.

Only members of a conversation may access its messages and related metadata.

Do not implement chat UI yet.

Use a focused commit message such as:
`feat(module-06): messaging database schema`

Then STOP.
```

---

# MODULE 07 — Realtime Text Messaging

```text
## Mandatory pre-task instructions

Read `MASTER_SPEC.md` completely before touching the codebase.

Read `DEVELOPMENT_PLAN.md`.

Inspect the current repository before making changes, including:

- current branch
- `git status`
- configured Git remotes
- current project structure
- existing database migrations
- existing tests
- existing architecture patterns

Rules:

- Implement ONLY this requested module.
- Do not start future modules.
- Do not rewrite stable architecture without a concrete technical reason.
- Do not remove working functionality.
- Do not modify unrelated modules unless required for integration.
- Keep TypeScript strict.
- Follow existing conventions.
- Reuse existing services, hooks, components, stores, and types.
- Avoid duplicated logic.
- Never expose secrets or server-side API keys.
- Never commit `.env`, API keys, tokens, credentials, or private certificates.
- Use migrations for every database schema change.
- Preserve RLS and authorization.
- Do not silently suppress errors.
- Do not fake successful functionality.
- Clearly mark unavoidable future work with TODO comments.
- Preserve backward compatibility unless the module explicitly requires a migration or breaking change.

Before finishing this module:

1. Run TypeScript typecheck.
2. Run lint.
3. Run relevant automated tests.
4. Run a production build where practical.
5. Fix all errors introduced by this module.
6. Review `git diff`.
7. Verify no secret, unrelated file, cache, build output, or accidental generated file is staged.
8. Update `DEVELOPMENT_PLAN.md` with the module status and known limitations.
9. Create one focused Git commit for this module.
10. Push the commit to the configured GitHub remote.
11. Verify that the push succeeded.

Preferred commit format:

`feat(module-XX): short description`

Use `fix`, `refactor`, `test`, or `chore` instead of `feat` when more appropriate.

Never force-push.

If GitHub push fails because of authentication, permissions, missing remote, protected branch, or network failure:

- preserve the local commit
- report the exact Git error
- do not reset or delete completed work
- do not claim the module was fully delivered
- provide the exact corrective command/action needed

At the end report:

- implementation summary
- files created
- files modified
- database migrations
- dependencies added
- environment variables added
- tests performed
- build result
- commit hash
- commit message
- branch pushed
- GitHub push status
- known limitations
- manual testing instructions

Then STOP.

## Task: MODULE 07 — Realtime Text Messaging

Implement:

- ChatScreen
- Load latest messages
- Backward pagination
- Send text
- Receive new messages realtime
- Optimistic sending
- Sending state
- Failed state
- Retry
- Date separators
- Message timestamps
- Auto-scroll behavior
- Preserve scroll position while loading older history

Layout:

Current user:
- right aligned

Other users:
- left aligned
- avatar when appropriate

Performance:

- virtualized list
- memoized message row
- stable keys
- avoid rerendering the full history when one message changes

Do not implement reply, reaction, read receipts, or typing yet.

Use a focused commit message such as:
`feat(module-07): realtime text messaging`

Then STOP.
```

---

# MODULE 08 — Message Replies

```text
## Mandatory pre-task instructions

Read `MASTER_SPEC.md` completely before touching the codebase.

Read `DEVELOPMENT_PLAN.md`.

Inspect the current repository before making changes, including:

- current branch
- `git status`
- configured Git remotes
- current project structure
- existing database migrations
- existing tests
- existing architecture patterns

Rules:

- Implement ONLY this requested module.
- Do not start future modules.
- Do not rewrite stable architecture without a concrete technical reason.
- Do not remove working functionality.
- Do not modify unrelated modules unless required for integration.
- Keep TypeScript strict.
- Follow existing conventions.
- Reuse existing services, hooks, components, stores, and types.
- Avoid duplicated logic.
- Never expose secrets or server-side API keys.
- Never commit `.env`, API keys, tokens, credentials, or private certificates.
- Use migrations for every database schema change.
- Preserve RLS and authorization.
- Do not silently suppress errors.
- Do not fake successful functionality.
- Clearly mark unavoidable future work with TODO comments.
- Preserve backward compatibility unless the module explicitly requires a migration or breaking change.

Before finishing this module:

1. Run TypeScript typecheck.
2. Run lint.
3. Run relevant automated tests.
4. Run a production build where practical.
5. Fix all errors introduced by this module.
6. Review `git diff`.
7. Verify no secret, unrelated file, cache, build output, or accidental generated file is staged.
8. Update `DEVELOPMENT_PLAN.md` with the module status and known limitations.
9. Create one focused Git commit for this module.
10. Push the commit to the configured GitHub remote.
11. Verify that the push succeeded.

Preferred commit format:

`feat(module-XX): short description`

Use `fix`, `refactor`, `test`, or `chore` instead of `feat` when more appropriate.

Never force-push.

If GitHub push fails because of authentication, permissions, missing remote, protected branch, or network failure:

- preserve the local commit
- report the exact Git error
- do not reset or delete completed work
- do not claim the module was fully delivered
- provide the exact corrective command/action needed

At the end report:

- implementation summary
- files created
- files modified
- database migrations
- dependencies added
- environment variables added
- tests performed
- build result
- commit hash
- commit message
- branch pushed
- GitHub push status
- known limitations
- manual testing instructions

Then STOP.

## Task: MODULE 08 — Message Replies

Implement:

- Long-press or swipe-to-reply
- Reply preview above composer
- Cancel reply
- Save reply_to_message_id
- Quoted message preview inside reply bubble
- Tap quote to jump to original
- Brief highlight after jump

Handle:

- deleted original message
- unavailable media
- original message not loaded yet

Do not implement reactions.

Use a focused commit message such as:
`feat(module-08): message replies`

Then STOP.
```

---

# MODULE 09 — Message Reactions

```text
## Mandatory pre-task instructions

Read `MASTER_SPEC.md` completely before touching the codebase.

Read `DEVELOPMENT_PLAN.md`.

Inspect the current repository before making changes, including:

- current branch
- `git status`
- configured Git remotes
- current project structure
- existing database migrations
- existing tests
- existing architecture patterns

Rules:

- Implement ONLY this requested module.
- Do not start future modules.
- Do not rewrite stable architecture without a concrete technical reason.
- Do not remove working functionality.
- Do not modify unrelated modules unless required for integration.
- Keep TypeScript strict.
- Follow existing conventions.
- Reuse existing services, hooks, components, stores, and types.
- Avoid duplicated logic.
- Never expose secrets or server-side API keys.
- Never commit `.env`, API keys, tokens, credentials, or private certificates.
- Use migrations for every database schema change.
- Preserve RLS and authorization.
- Do not silently suppress errors.
- Do not fake successful functionality.
- Clearly mark unavoidable future work with TODO comments.
- Preserve backward compatibility unless the module explicitly requires a migration or breaking change.

Before finishing this module:

1. Run TypeScript typecheck.
2. Run lint.
3. Run relevant automated tests.
4. Run a production build where practical.
5. Fix all errors introduced by this module.
6. Review `git diff`.
7. Verify no secret, unrelated file, cache, build output, or accidental generated file is staged.
8. Update `DEVELOPMENT_PLAN.md` with the module status and known limitations.
9. Create one focused Git commit for this module.
10. Push the commit to the configured GitHub remote.
11. Verify that the push succeeded.

Preferred commit format:

`feat(module-XX): short description`

Use `fix`, `refactor`, `test`, or `chore` instead of `feat` when more appropriate.

Never force-push.

If GitHub push fails because of authentication, permissions, missing remote, protected branch, or network failure:

- preserve the local commit
- report the exact Git error
- do not reset or delete completed work
- do not claim the module was fully delivered
- provide the exact corrective command/action needed

At the end report:

- implementation summary
- files created
- files modified
- database migrations
- dependencies added
- environment variables added
- tests performed
- build result
- commit hash
- commit message
- branch pushed
- GitHub push status
- known limitations
- manual testing instructions

Then STOP.

## Task: MODULE 09 — Message Reactions

Default quick reactions:

❤️ 😂 👍 😢 😡 😮

Implement:

- Long-press reaction picker
- Add reaction
- Remove own reaction
- Change own reaction
- Grouped counts
- Show users who reacted
- Realtime updates

Avoid rerendering unrelated message rows.

Use a focused commit message such as:
`feat(module-09): message reactions`

Then STOP.
```

---

# MODULE 10 — Read Receipts

```text
## Mandatory pre-task instructions

Read `MASTER_SPEC.md` completely before touching the codebase.

Read `DEVELOPMENT_PLAN.md`.

Inspect the current repository before making changes, including:

- current branch
- `git status`
- configured Git remotes
- current project structure
- existing database migrations
- existing tests
- existing architecture patterns

Rules:

- Implement ONLY this requested module.
- Do not start future modules.
- Do not rewrite stable architecture without a concrete technical reason.
- Do not remove working functionality.
- Do not modify unrelated modules unless required for integration.
- Keep TypeScript strict.
- Follow existing conventions.
- Reuse existing services, hooks, components, stores, and types.
- Avoid duplicated logic.
- Never expose secrets or server-side API keys.
- Never commit `.env`, API keys, tokens, credentials, or private certificates.
- Use migrations for every database schema change.
- Preserve RLS and authorization.
- Do not silently suppress errors.
- Do not fake successful functionality.
- Clearly mark unavoidable future work with TODO comments.
- Preserve backward compatibility unless the module explicitly requires a migration or breaking change.

Before finishing this module:

1. Run TypeScript typecheck.
2. Run lint.
3. Run relevant automated tests.
4. Run a production build where practical.
5. Fix all errors introduced by this module.
6. Review `git diff`.
7. Verify no secret, unrelated file, cache, build output, or accidental generated file is staged.
8. Update `DEVELOPMENT_PLAN.md` with the module status and known limitations.
9. Create one focused Git commit for this module.
10. Push the commit to the configured GitHub remote.
11. Verify that the push succeeded.

Preferred commit format:

`feat(module-XX): short description`

Use `fix`, `refactor`, `test`, or `chore` instead of `feat` when more appropriate.

Never force-push.

If GitHub push fails because of authentication, permissions, missing remote, protected branch, or network failure:

- preserve the local commit
- report the exact Git error
- do not reset or delete completed work
- do not claim the module was fully delivered
- provide the exact corrective command/action needed

At the end report:

- implementation summary
- files created
- files modified
- database migrations
- dependencies added
- environment variables added
- tests performed
- build result
- commit hash
- commit message
- branch pushed
- GitHub push status
- known limitations
- manual testing instructions

Then STOP.

## Task: MODULE 10 — Read Receipts

Implement:

- Mark visible/new messages as read
- Avoid one database request per message
- Batch updates where practical
- Never mark messages read when the conversation is not actively visible

UI:

- Messenger-like read state
- Group chat may show tiny avatars near recent messages

Create reusable read-state logic.

Use a focused commit message such as:
`feat(module-10): read receipts`

Then STOP.
```

---

# MODULE 11 — Typing Indicators and Presence

```text
## Mandatory pre-task instructions

Read `MASTER_SPEC.md` completely before touching the codebase.

Read `DEVELOPMENT_PLAN.md`.

Inspect the current repository before making changes, including:

- current branch
- `git status`
- configured Git remotes
- current project structure
- existing database migrations
- existing tests
- existing architecture patterns

Rules:

- Implement ONLY this requested module.
- Do not start future modules.
- Do not rewrite stable architecture without a concrete technical reason.
- Do not remove working functionality.
- Do not modify unrelated modules unless required for integration.
- Keep TypeScript strict.
- Follow existing conventions.
- Reuse existing services, hooks, components, stores, and types.
- Avoid duplicated logic.
- Never expose secrets or server-side API keys.
- Never commit `.env`, API keys, tokens, credentials, or private certificates.
- Use migrations for every database schema change.
- Preserve RLS and authorization.
- Do not silently suppress errors.
- Do not fake successful functionality.
- Clearly mark unavoidable future work with TODO comments.
- Preserve backward compatibility unless the module explicitly requires a migration or breaking change.

Before finishing this module:

1. Run TypeScript typecheck.
2. Run lint.
3. Run relevant automated tests.
4. Run a production build where practical.
5. Fix all errors introduced by this module.
6. Review `git diff`.
7. Verify no secret, unrelated file, cache, build output, or accidental generated file is staged.
8. Update `DEVELOPMENT_PLAN.md` with the module status and known limitations.
9. Create one focused Git commit for this module.
10. Push the commit to the configured GitHub remote.
11. Verify that the push succeeded.

Preferred commit format:

`feat(module-XX): short description`

Use `fix`, `refactor`, `test`, or `chore` instead of `feat` when more appropriate.

Never force-push.

If GitHub push fails because of authentication, permissions, missing remote, protected branch, or network failure:

- preserve the local commit
- report the exact Git error
- do not reset or delete completed work
- do not claim the module was fully delivered
- provide the exact corrective command/action needed

At the end report:

- implementation summary
- files created
- files modified
- database migrations
- dependencies added
- environment variables added
- tests performed
- build result
- commit hash
- commit message
- branch pushed
- GitHub push status
- known limitations
- manual testing instructions

Then STOP.

## Task: MODULE 11 — Typing Indicators and Presence

Use:

- Supabase Broadcast for typing
- Supabase Presence for online state

Do not store typing events in PostgreSQL.

Typing must:

- debounce outgoing events
- automatically expire
- avoid network spam

Examples:

- Nam đang nhập...
- Nam và Minh đang nhập...
- 3 người đang nhập...

Presence:

- online indicator
- offline
- last active if practical

Use a focused commit message such as:
`feat(module-11): typing indicators and presence`

Then STOP.
```

---

# MODULE 12 — Image Messaging

```text
## Mandatory pre-task instructions

Read `MASTER_SPEC.md` completely before touching the codebase.

Read `DEVELOPMENT_PLAN.md`.

Inspect the current repository before making changes, including:

- current branch
- `git status`
- configured Git remotes
- current project structure
- existing database migrations
- existing tests
- existing architecture patterns

Rules:

- Implement ONLY this requested module.
- Do not start future modules.
- Do not rewrite stable architecture without a concrete technical reason.
- Do not remove working functionality.
- Do not modify unrelated modules unless required for integration.
- Keep TypeScript strict.
- Follow existing conventions.
- Reuse existing services, hooks, components, stores, and types.
- Avoid duplicated logic.
- Never expose secrets or server-side API keys.
- Never commit `.env`, API keys, tokens, credentials, or private certificates.
- Use migrations for every database schema change.
- Preserve RLS and authorization.
- Do not silently suppress errors.
- Do not fake successful functionality.
- Clearly mark unavoidable future work with TODO comments.
- Preserve backward compatibility unless the module explicitly requires a migration or breaking change.

Before finishing this module:

1. Run TypeScript typecheck.
2. Run lint.
3. Run relevant automated tests.
4. Run a production build where practical.
5. Fix all errors introduced by this module.
6. Review `git diff`.
7. Verify no secret, unrelated file, cache, build output, or accidental generated file is staged.
8. Update `DEVELOPMENT_PLAN.md` with the module status and known limitations.
9. Create one focused Git commit for this module.
10. Push the commit to the configured GitHub remote.
11. Verify that the push succeeded.

Preferred commit format:

`feat(module-XX): short description`

Use `fix`, `refactor`, `test`, or `chore` instead of `feat` when more appropriate.

Never force-push.

If GitHub push fails because of authentication, permissions, missing remote, protected branch, or network failure:

- preserve the local commit
- report the exact Git error
- do not reset or delete completed work
- do not claim the module was fully delivered
- provide the exact corrective command/action needed

At the end report:

- implementation summary
- files created
- files modified
- database migrations
- dependencies added
- environment variables added
- tests performed
- build result
- commit hash
- commit message
- branch pushed
- GitHub push status
- known limitations
- manual testing instructions

Then STOP.

## Task: MODULE 12 — Image Messaging

Implement:

- Image picker
- Camera input where supported
- Multiple-image selection
- Preview before sending
- Resize/compress
- Thumbnail generation
- Supabase Storage upload
- Progress
- Retry
- Cancellation where feasible
- Inline rendering
- Fullscreen viewer
- Zoom

Security:

- validate MIME
- validate max size
- secure Storage policies
- only conversation members can access media

Do not implement video yet.

Use a focused commit message such as:
`feat(module-12): image messaging`

Then STOP.
```

---

# MODULE 13 — Video Messages

```text
## Mandatory pre-task instructions

Read `MASTER_SPEC.md` completely before touching the codebase.

Read `DEVELOPMENT_PLAN.md`.

Inspect the current repository before making changes, including:

- current branch
- `git status`
- configured Git remotes
- current project structure
- existing database migrations
- existing tests
- existing architecture patterns

Rules:

- Implement ONLY this requested module.
- Do not start future modules.
- Do not rewrite stable architecture without a concrete technical reason.
- Do not remove working functionality.
- Do not modify unrelated modules unless required for integration.
- Keep TypeScript strict.
- Follow existing conventions.
- Reuse existing services, hooks, components, stores, and types.
- Avoid duplicated logic.
- Never expose secrets or server-side API keys.
- Never commit `.env`, API keys, tokens, credentials, or private certificates.
- Use migrations for every database schema change.
- Preserve RLS and authorization.
- Do not silently suppress errors.
- Do not fake successful functionality.
- Clearly mark unavoidable future work with TODO comments.
- Preserve backward compatibility unless the module explicitly requires a migration or breaking change.

Before finishing this module:

1. Run TypeScript typecheck.
2. Run lint.
3. Run relevant automated tests.
4. Run a production build where practical.
5. Fix all errors introduced by this module.
6. Review `git diff`.
7. Verify no secret, unrelated file, cache, build output, or accidental generated file is staged.
8. Update `DEVELOPMENT_PLAN.md` with the module status and known limitations.
9. Create one focused Git commit for this module.
10. Push the commit to the configured GitHub remote.
11. Verify that the push succeeded.

Preferred commit format:

`feat(module-XX): short description`

Use `fix`, `refactor`, `test`, or `chore` instead of `feat` when more appropriate.

Never force-push.

If GitHub push fails because of authentication, permissions, missing remote, protected branch, or network failure:

- preserve the local commit
- report the exact Git error
- do not reset or delete completed work
- do not claim the module was fully delivered
- provide the exact corrective command/action needed

At the end report:

- implementation summary
- files created
- files modified
- database migrations
- dependencies added
- environment variables added
- tests performed
- build result
- commit hash
- commit message
- branch pushed
- GitHub push status
- known limitations
- manual testing instructions

Then STOP.

## Task: MODULE 13 — Video Messages

Implement:

- Select video
- Preview
- Duration
- Dimensions
- Size
- Thumbnail
- Upload progress
- Retry
- Cancellation
- Inline playback
- Fullscreen playback

Avoid automatically downloading full videos.

Do not implement video calling.

Use a focused commit message such as:
`feat(module-13): video messages`

Then STOP.
```

---

# MODULE 14 — Voice Messages

```text
## Mandatory pre-task instructions

Read `MASTER_SPEC.md` completely before touching the codebase.

Read `DEVELOPMENT_PLAN.md`.

Inspect the current repository before making changes, including:

- current branch
- `git status`
- configured Git remotes
- current project structure
- existing database migrations
- existing tests
- existing architecture patterns

Rules:

- Implement ONLY this requested module.
- Do not start future modules.
- Do not rewrite stable architecture without a concrete technical reason.
- Do not remove working functionality.
- Do not modify unrelated modules unless required for integration.
- Keep TypeScript strict.
- Follow existing conventions.
- Reuse existing services, hooks, components, stores, and types.
- Avoid duplicated logic.
- Never expose secrets or server-side API keys.
- Never commit `.env`, API keys, tokens, credentials, or private certificates.
- Use migrations for every database schema change.
- Preserve RLS and authorization.
- Do not silently suppress errors.
- Do not fake successful functionality.
- Clearly mark unavoidable future work with TODO comments.
- Preserve backward compatibility unless the module explicitly requires a migration or breaking change.

Before finishing this module:

1. Run TypeScript typecheck.
2. Run lint.
3. Run relevant automated tests.
4. Run a production build where practical.
5. Fix all errors introduced by this module.
6. Review `git diff`.
7. Verify no secret, unrelated file, cache, build output, or accidental generated file is staged.
8. Update `DEVELOPMENT_PLAN.md` with the module status and known limitations.
9. Create one focused Git commit for this module.
10. Push the commit to the configured GitHub remote.
11. Verify that the push succeeded.

Preferred commit format:

`feat(module-XX): short description`

Use `fix`, `refactor`, `test`, or `chore` instead of `feat` when more appropriate.

Never force-push.

If GitHub push fails because of authentication, permissions, missing remote, protected branch, or network failure:

- preserve the local commit
- report the exact Git error
- do not reset or delete completed work
- do not claim the module was fully delivered
- provide the exact corrective command/action needed

At the end report:

- implementation summary
- files created
- files modified
- database migrations
- dependencies added
- environment variables added
- tests performed
- build result
- commit hash
- commit message
- branch pushed
- GitHub push status
- known limitations
- manual testing instructions

Then STOP.

## Task: MODULE 14 — Voice Messages

Implement:

- Microphone permission
- Record
- Timer
- Cancel
- Preview before sending
- Waveform
- Duration
- Upload
- Playback
- Seeking
- Playback speed 1x / 1.5x / 2x

Design recording/playback architecture so DSP effects can be inserted later.

Document differences between web, Android, and iOS.

Do not implement voice effects yet.

Use a focused commit message such as:
`feat(module-14): voice messages`

Then STOP.
```

---

# MODULE 15 — File Attachments

```text
## Mandatory pre-task instructions

Read `MASTER_SPEC.md` completely before touching the codebase.

Read `DEVELOPMENT_PLAN.md`.

Inspect the current repository before making changes, including:

- current branch
- `git status`
- configured Git remotes
- current project structure
- existing database migrations
- existing tests
- existing architecture patterns

Rules:

- Implement ONLY this requested module.
- Do not start future modules.
- Do not rewrite stable architecture without a concrete technical reason.
- Do not remove working functionality.
- Do not modify unrelated modules unless required for integration.
- Keep TypeScript strict.
- Follow existing conventions.
- Reuse existing services, hooks, components, stores, and types.
- Avoid duplicated logic.
- Never expose secrets or server-side API keys.
- Never commit `.env`, API keys, tokens, credentials, or private certificates.
- Use migrations for every database schema change.
- Preserve RLS and authorization.
- Do not silently suppress errors.
- Do not fake successful functionality.
- Clearly mark unavoidable future work with TODO comments.
- Preserve backward compatibility unless the module explicitly requires a migration or breaking change.

Before finishing this module:

1. Run TypeScript typecheck.
2. Run lint.
3. Run relevant automated tests.
4. Run a production build where practical.
5. Fix all errors introduced by this module.
6. Review `git diff`.
7. Verify no secret, unrelated file, cache, build output, or accidental generated file is staged.
8. Update `DEVELOPMENT_PLAN.md` with the module status and known limitations.
9. Create one focused Git commit for this module.
10. Push the commit to the configured GitHub remote.
11. Verify that the push succeeded.

Preferred commit format:

`feat(module-XX): short description`

Use `fix`, `refactor`, `test`, or `chore` instead of `feat` when more appropriate.

Never force-push.

If GitHub push fails because of authentication, permissions, missing remote, protected branch, or network failure:

- preserve the local commit
- report the exact Git error
- do not reset or delete completed work
- do not claim the module was fully delivered
- provide the exact corrective command/action needed

At the end report:

- implementation summary
- files created
- files modified
- database migrations
- dependencies added
- environment variables added
- tests performed
- build result
- commit hash
- commit message
- branch pushed
- GitHub push status
- known limitations
- manual testing instructions

Then STOP.

## Task: MODULE 15 — File Attachments

Implement:

- File picker
- Upload
- Progress
- Retry
- File name
- File size
- MIME type
- Type icon
- Download/open action

Use configurable maximum file size.

Do not attempt to preview every file type inline.

Maintain private conversation access controls.

Use a focused commit message such as:
`feat(module-15): file attachments`

Then STOP.
```

---

# MODULE 16 — Pinned Messages

```text
## Mandatory pre-task instructions

Read `MASTER_SPEC.md` completely before touching the codebase.

Read `DEVELOPMENT_PLAN.md`.

Inspect the current repository before making changes, including:

- current branch
- `git status`
- configured Git remotes
- current project structure
- existing database migrations
- existing tests
- existing architecture patterns

Rules:

- Implement ONLY this requested module.
- Do not start future modules.
- Do not rewrite stable architecture without a concrete technical reason.
- Do not remove working functionality.
- Do not modify unrelated modules unless required for integration.
- Keep TypeScript strict.
- Follow existing conventions.
- Reuse existing services, hooks, components, stores, and types.
- Avoid duplicated logic.
- Never expose secrets or server-side API keys.
- Never commit `.env`, API keys, tokens, credentials, or private certificates.
- Use migrations for every database schema change.
- Preserve RLS and authorization.
- Do not silently suppress errors.
- Do not fake successful functionality.
- Clearly mark unavoidable future work with TODO comments.
- Preserve backward compatibility unless the module explicitly requires a migration or breaking change.

Before finishing this module:

1. Run TypeScript typecheck.
2. Run lint.
3. Run relevant automated tests.
4. Run a production build where practical.
5. Fix all errors introduced by this module.
6. Review `git diff`.
7. Verify no secret, unrelated file, cache, build output, or accidental generated file is staged.
8. Update `DEVELOPMENT_PLAN.md` with the module status and known limitations.
9. Create one focused Git commit for this module.
10. Push the commit to the configured GitHub remote.
11. Verify that the push succeeded.

Preferred commit format:

`feat(module-XX): short description`

Use `fix`, `refactor`, `test`, or `chore` instead of `feat` when more appropriate.

Never force-push.

If GitHub push fails because of authentication, permissions, missing remote, protected branch, or network failure:

- preserve the local commit
- report the exact Git error
- do not reset or delete completed work
- do not claim the module was fully delivered
- provide the exact corrective command/action needed

At the end report:

- implementation summary
- files created
- files modified
- database migrations
- dependencies added
- environment variables added
- tests performed
- build result
- commit hash
- commit message
- branch pushed
- GitHub push status
- known limitations
- manual testing instructions

Then STOP.

## Task: MODULE 16 — Pinned Messages

Implement:

- Pin
- Unpin
- Multiple pinned messages
- Pinned banner/indicator
- Pinned messages screen
- Tap a pin to jump to the original message

Prepare future role-based pin permissions but allow members initially.

Use a focused commit message such as:
`feat(module-16): pinned messages`

Then STOP.
```

---

# MODULE 17 — Conversation Search

```text
## Mandatory pre-task instructions

Read `MASTER_SPEC.md` completely before touching the codebase.

Read `DEVELOPMENT_PLAN.md`.

Inspect the current repository before making changes, including:

- current branch
- `git status`
- configured Git remotes
- current project structure
- existing database migrations
- existing tests
- existing architecture patterns

Rules:

- Implement ONLY this requested module.
- Do not start future modules.
- Do not rewrite stable architecture without a concrete technical reason.
- Do not remove working functionality.
- Do not modify unrelated modules unless required for integration.
- Keep TypeScript strict.
- Follow existing conventions.
- Reuse existing services, hooks, components, stores, and types.
- Avoid duplicated logic.
- Never expose secrets or server-side API keys.
- Never commit `.env`, API keys, tokens, credentials, or private certificates.
- Use migrations for every database schema change.
- Preserve RLS and authorization.
- Do not silently suppress errors.
- Do not fake successful functionality.
- Clearly mark unavoidable future work with TODO comments.
- Preserve backward compatibility unless the module explicitly requires a migration or breaking change.

Before finishing this module:

1. Run TypeScript typecheck.
2. Run lint.
3. Run relevant automated tests.
4. Run a production build where practical.
5. Fix all errors introduced by this module.
6. Review `git diff`.
7. Verify no secret, unrelated file, cache, build output, or accidental generated file is staged.
8. Update `DEVELOPMENT_PLAN.md` with the module status and known limitations.
9. Create one focused Git commit for this module.
10. Push the commit to the configured GitHub remote.
11. Verify that the push succeeded.

Preferred commit format:

`feat(module-XX): short description`

Use `fix`, `refactor`, `test`, or `chore` instead of `feat` when more appropriate.

Never force-push.

If GitHub push fails because of authentication, permissions, missing remote, protected branch, or network failure:

- preserve the local commit
- report the exact Git error
- do not reset or delete completed work
- do not claim the module was fully delivered
- provide the exact corrective command/action needed

At the end report:

- implementation summary
- files created
- files modified
- database migrations
- dependencies added
- environment variables added
- tests performed
- build result
- commit hash
- commit message
- branch pushed
- GitHub push status
- known limitations
- manual testing instructions

Then STOP.

## Task: MODULE 17 — Conversation Search

Implement search with:

Results:

- snippet
- sender
- timestamp
- message type
- jump to message

Filters:

- all
- text
- image
- video
- audio
- file
- link

Support pagination.

Create/adjust database indexes as needed.

Avoid media downloads during search.

Use a focused commit message such as:
`feat(module-17): conversation search`

Then STOP.
```

---

# MODULE 18 — Conversation Nicknames

```text
## Mandatory pre-task instructions

Read `MASTER_SPEC.md` completely before touching the codebase.

Read `DEVELOPMENT_PLAN.md`.

Inspect the current repository before making changes, including:

- current branch
- `git status`
- configured Git remotes
- current project structure
- existing database migrations
- existing tests
- existing architecture patterns

Rules:

- Implement ONLY this requested module.
- Do not start future modules.
- Do not rewrite stable architecture without a concrete technical reason.
- Do not remove working functionality.
- Do not modify unrelated modules unless required for integration.
- Keep TypeScript strict.
- Follow existing conventions.
- Reuse existing services, hooks, components, stores, and types.
- Avoid duplicated logic.
- Never expose secrets or server-side API keys.
- Never commit `.env`, API keys, tokens, credentials, or private certificates.
- Use migrations for every database schema change.
- Preserve RLS and authorization.
- Do not silently suppress errors.
- Do not fake successful functionality.
- Clearly mark unavoidable future work with TODO comments.
- Preserve backward compatibility unless the module explicitly requires a migration or breaking change.

Before finishing this module:

1. Run TypeScript typecheck.
2. Run lint.
3. Run relevant automated tests.
4. Run a production build where practical.
5. Fix all errors introduced by this module.
6. Review `git diff`.
7. Verify no secret, unrelated file, cache, build output, or accidental generated file is staged.
8. Update `DEVELOPMENT_PLAN.md` with the module status and known limitations.
9. Create one focused Git commit for this module.
10. Push the commit to the configured GitHub remote.
11. Verify that the push succeeded.

Preferred commit format:

`feat(module-XX): short description`

Use `fix`, `refactor`, `test`, or `chore` instead of `feat` when more appropriate.

Never force-push.

If GitHub push fails because of authentication, permissions, missing remote, protected branch, or network failure:

- preserve the local commit
- report the exact Git error
- do not reset or delete completed work
- do not claim the module was fully delivered
- provide the exact corrective command/action needed

At the end report:

- implementation summary
- files created
- files modified
- database migrations
- dependencies added
- environment variables added
- tests performed
- build result
- commit hash
- commit message
- branch pushed
- GitHub push status
- known limitations
- manual testing instructions

Then STOP.

## Task: MODULE 18 — Conversation Nicknames

Members may assign conversation-specific nicknames.

Requirements:

- Stored separately from global profile name
- Chat UI resolves nickname before global display name
- Member list uses conversation nickname
- Nickname updates realtime

Prepare architecture placeholder for private aliases visible only to the current user.

Do not implement private aliases unless trivial.

Use a focused commit message such as:
`feat(module-18): conversation nicknames`

Then STOP.
```

---

# MODULE 19 — Conversation Theme Engine

```text
## Mandatory pre-task instructions

Read `MASTER_SPEC.md` completely before touching the codebase.

Read `DEVELOPMENT_PLAN.md`.

Inspect the current repository before making changes, including:

- current branch
- `git status`
- configured Git remotes
- current project structure
- existing database migrations
- existing tests
- existing architecture patterns

Rules:

- Implement ONLY this requested module.
- Do not start future modules.
- Do not rewrite stable architecture without a concrete technical reason.
- Do not remove working functionality.
- Do not modify unrelated modules unless required for integration.
- Keep TypeScript strict.
- Follow existing conventions.
- Reuse existing services, hooks, components, stores, and types.
- Avoid duplicated logic.
- Never expose secrets or server-side API keys.
- Never commit `.env`, API keys, tokens, credentials, or private certificates.
- Use migrations for every database schema change.
- Preserve RLS and authorization.
- Do not silently suppress errors.
- Do not fake successful functionality.
- Clearly mark unavoidable future work with TODO comments.
- Preserve backward compatibility unless the module explicitly requires a migration or breaking change.

Before finishing this module:

1. Run TypeScript typecheck.
2. Run lint.
3. Run relevant automated tests.
4. Run a production build where practical.
5. Fix all errors introduced by this module.
6. Review `git diff`.
7. Verify no secret, unrelated file, cache, build output, or accidental generated file is staged.
8. Update `DEVELOPMENT_PLAN.md` with the module status and known limitations.
9. Create one focused Git commit for this module.
10. Push the commit to the configured GitHub remote.
11. Verify that the push succeeded.

Preferred commit format:

`feat(module-XX): short description`

Use `fix`, `refactor`, `test`, or `chore` instead of `feat` when more appropriate.

Never force-push.

If GitHub push fails because of authentication, permissions, missing remote, protected branch, or network failure:

- preserve the local commit
- report the exact Git error
- do not reset or delete completed work
- do not claim the module was fully delivered
- provide the exact corrective command/action needed

At the end report:

- implementation summary
- files created
- files modified
- database migrations
- dependencies added
- environment variables added
- tests performed
- build result
- commit hash
- commit message
- branch pushed
- GitHub push status
- known limitations
- manual testing instructions

Then STOP.

## Task: MODULE 19 — Conversation Theme Engine

Create a reusable theme schema.

Properties:

- background color
- background image
- background gradient
- my bubble color/gradient
- other bubble color
- text colors
- accent
- composer colors
- emoji
- font settings
- reaction appearance

Support:

- default theme
- shared theme
- personal override

Create:

- ThemeProvider
- ThemeEditorScreen
- ThemePreview

Themes must serialize to JSON.

Keep theme application efficient and avoid unnecessary message rerenders.

Use a focused commit message such as:
`feat(module-19): conversation theme engine`

Then STOP.
```

---

# MODULE 20 — Word Effect Engine

```text
## Mandatory pre-task instructions

Read `MASTER_SPEC.md` completely before touching the codebase.

Read `DEVELOPMENT_PLAN.md`.

Inspect the current repository before making changes, including:

- current branch
- `git status`
- configured Git remotes
- current project structure
- existing database migrations
- existing tests
- existing architecture patterns

Rules:

- Implement ONLY this requested module.
- Do not start future modules.
- Do not rewrite stable architecture without a concrete technical reason.
- Do not remove working functionality.
- Do not modify unrelated modules unless required for integration.
- Keep TypeScript strict.
- Follow existing conventions.
- Reuse existing services, hooks, components, stores, and types.
- Avoid duplicated logic.
- Never expose secrets or server-side API keys.
- Never commit `.env`, API keys, tokens, credentials, or private certificates.
- Use migrations for every database schema change.
- Preserve RLS and authorization.
- Do not silently suppress errors.
- Do not fake successful functionality.
- Clearly mark unavoidable future work with TODO comments.
- Preserve backward compatibility unless the module explicitly requires a migration or breaking change.

Before finishing this module:

1. Run TypeScript typecheck.
2. Run lint.
3. Run relevant automated tests.
4. Run a production build where practical.
5. Fix all errors introduced by this module.
6. Review `git diff`.
7. Verify no secret, unrelated file, cache, build output, or accidental generated file is staged.
8. Update `DEVELOPMENT_PLAN.md` with the module status and known limitations.
9. Create one focused Git commit for this module.
10. Push the commit to the configured GitHub remote.
11. Verify that the push succeeded.

Preferred commit format:

`feat(module-XX): short description`

Use `fix`, `refactor`, `test`, or `chore` instead of `feat` when more appropriate.

Never force-push.

If GitHub push fails because of authentication, permissions, missing remote, protected branch, or network failure:

- preserve the local commit
- report the exact Git error
- do not reset or delete completed work
- do not claim the module was fully delivered
- provide the exact corrective command/action needed

At the end report:

- implementation summary
- files created
- files modified
- database migrations
- dependencies added
- environment variables added
- tests performed
- build result
- commit hash
- commit message
- branch pushed
- GitHub push status
- known limitations
- manual testing instructions

Then STOP.

## Task: MODULE 20 — Word Effect Engine

Word effect model:

- conversation
- trigger string
- matching rule
- animation type
- emoji
- optional sound
- duration
- local/fullscreen
- enabled
- creator

Initial effects:

- confetti
- hearts
- emoji rain
- screen shake
- explosion animation
- moon/stars

Effects should trigger for newly received matching messages and not replay all historical effects when reopening a chat.

Create a lightweight reusable animation architecture.

Use a focused commit message such as:
`feat(module-20): word effect engine`

Then STOP.
```

---

# MODULE 21 — Sticker Messaging

```text
## Mandatory pre-task instructions

Read `MASTER_SPEC.md` completely before touching the codebase.

Read `DEVELOPMENT_PLAN.md`.

Inspect the current repository before making changes, including:

- current branch
- `git status`
- configured Git remotes
- current project structure
- existing database migrations
- existing tests
- existing architecture patterns

Rules:

- Implement ONLY this requested module.
- Do not start future modules.
- Do not rewrite stable architecture without a concrete technical reason.
- Do not remove working functionality.
- Do not modify unrelated modules unless required for integration.
- Keep TypeScript strict.
- Follow existing conventions.
- Reuse existing services, hooks, components, stores, and types.
- Avoid duplicated logic.
- Never expose secrets or server-side API keys.
- Never commit `.env`, API keys, tokens, credentials, or private certificates.
- Use migrations for every database schema change.
- Preserve RLS and authorization.
- Do not silently suppress errors.
- Do not fake successful functionality.
- Clearly mark unavoidable future work with TODO comments.
- Preserve backward compatibility unless the module explicitly requires a migration or breaking change.

Before finishing this module:

1. Run TypeScript typecheck.
2. Run lint.
3. Run relevant automated tests.
4. Run a production build where practical.
5. Fix all errors introduced by this module.
6. Review `git diff`.
7. Verify no secret, unrelated file, cache, build output, or accidental generated file is staged.
8. Update `DEVELOPMENT_PLAN.md` with the module status and known limitations.
9. Create one focused Git commit for this module.
10. Push the commit to the configured GitHub remote.
11. Verify that the push succeeded.

Preferred commit format:

`feat(module-XX): short description`

Use `fix`, `refactor`, `test`, or `chore` instead of `feat` when more appropriate.

Never force-push.

If GitHub push fails because of authentication, permissions, missing remote, protected branch, or network failure:

- preserve the local commit
- report the exact Git error
- do not reset or delete completed work
- do not claim the module was fully delivered
- provide the exact corrective command/action needed

At the end report:

- implementation summary
- files created
- files modified
- database migrations
- dependencies added
- environment variables added
- tests performed
- build result
- commit hash
- commit message
- branch pushed
- GitHub push status
- known limitations
- manual testing instructions

Then STOP.

## Task: MODULE 21 — Sticker Messaging

Implement:

- Sticker pack list
- Personal packs
- Shared conversation packs
- Sticker picker
- Favorites
- Recent stickers
- Send sticker

Sticker messages use the existing message system.

Do not implement background removal yet.

Use a focused commit message such as:
`feat(module-21): sticker messaging`

Then STOP.
```

---

# MODULE 22 — Sticker Creator

```text
## Mandatory pre-task instructions

Read `MASTER_SPEC.md` completely before touching the codebase.

Read `DEVELOPMENT_PLAN.md`.

Inspect the current repository before making changes, including:

- current branch
- `git status`
- configured Git remotes
- current project structure
- existing database migrations
- existing tests
- existing architecture patterns

Rules:

- Implement ONLY this requested module.
- Do not start future modules.
- Do not rewrite stable architecture without a concrete technical reason.
- Do not remove working functionality.
- Do not modify unrelated modules unless required for integration.
- Keep TypeScript strict.
- Follow existing conventions.
- Reuse existing services, hooks, components, stores, and types.
- Avoid duplicated logic.
- Never expose secrets or server-side API keys.
- Never commit `.env`, API keys, tokens, credentials, or private certificates.
- Use migrations for every database schema change.
- Preserve RLS and authorization.
- Do not silently suppress errors.
- Do not fake successful functionality.
- Clearly mark unavoidable future work with TODO comments.
- Preserve backward compatibility unless the module explicitly requires a migration or breaking change.

Before finishing this module:

1. Run TypeScript typecheck.
2. Run lint.
3. Run relevant automated tests.
4. Run a production build where practical.
5. Fix all errors introduced by this module.
6. Review `git diff`.
7. Verify no secret, unrelated file, cache, build output, or accidental generated file is staged.
8. Update `DEVELOPMENT_PLAN.md` with the module status and known limitations.
9. Create one focused Git commit for this module.
10. Push the commit to the configured GitHub remote.
11. Verify that the push succeeded.

Preferred commit format:

`feat(module-XX): short description`

Use `fix`, `refactor`, `test`, or `chore` instead of `feat` when more appropriate.

Never force-push.

If GitHub push fails because of authentication, permissions, missing remote, protected branch, or network failure:

- preserve the local commit
- report the exact Git error
- do not reset or delete completed work
- do not claim the module was fully delivered
- provide the exact corrective command/action needed

At the end report:

- implementation summary
- files created
- files modified
- database migrations
- dependencies added
- environment variables added
- tests performed
- build result
- commit hash
- commit message
- branch pushed
- GitHub push status
- known limitations
- manual testing instructions

Then STOP.

## Task: MODULE 22 — Sticker Creator

Flow:

select photo
-> identify subject
-> remove background
-> transparent preview
-> optional white outline
-> outline thickness
-> optional shadow
-> crop
-> rotate
-> scale
-> save sticker

Prefer local processing.

Create a SegmentationProvider interface so implementations can later include:

- BrowserSegmentationProvider
- NativeSegmentationProvider
- ServerSegmentationProvider

Output transparent PNG or WebP where supported.

Keep segmentation logic separate from chat components.

Use a focused commit message such as:
`feat(module-22): sticker creator`

Then STOP.
```

---

# MODULE 23 — Link Preview System and TikTok

```text
## Mandatory pre-task instructions

Read `MASTER_SPEC.md` completely before touching the codebase.

Read `DEVELOPMENT_PLAN.md`.

Inspect the current repository before making changes, including:

- current branch
- `git status`
- configured Git remotes
- current project structure
- existing database migrations
- existing tests
- existing architecture patterns

Rules:

- Implement ONLY this requested module.
- Do not start future modules.
- Do not rewrite stable architecture without a concrete technical reason.
- Do not remove working functionality.
- Do not modify unrelated modules unless required for integration.
- Keep TypeScript strict.
- Follow existing conventions.
- Reuse existing services, hooks, components, stores, and types.
- Avoid duplicated logic.
- Never expose secrets or server-side API keys.
- Never commit `.env`, API keys, tokens, credentials, or private certificates.
- Use migrations for every database schema change.
- Preserve RLS and authorization.
- Do not silently suppress errors.
- Do not fake successful functionality.
- Clearly mark unavoidable future work with TODO comments.
- Preserve backward compatibility unless the module explicitly requires a migration or breaking change.

Before finishing this module:

1. Run TypeScript typecheck.
2. Run lint.
3. Run relevant automated tests.
4. Run a production build where practical.
5. Fix all errors introduced by this module.
6. Review `git diff`.
7. Verify no secret, unrelated file, cache, build output, or accidental generated file is staged.
8. Update `DEVELOPMENT_PLAN.md` with the module status and known limitations.
9. Create one focused Git commit for this module.
10. Push the commit to the configured GitHub remote.
11. Verify that the push succeeded.

Preferred commit format:

`feat(module-XX): short description`

Use `fix`, `refactor`, `test`, or `chore` instead of `feat` when more appropriate.

Never force-push.

If GitHub push fails because of authentication, permissions, missing remote, protected branch, or network failure:

- preserve the local commit
- report the exact Git error
- do not reset or delete completed work
- do not claim the module was fully delivered
- provide the exact corrective command/action needed

At the end report:

- implementation summary
- files created
- files modified
- database migrations
- dependencies added
- environment variables added
- tests performed
- build result
- commit hash
- commit message
- branch pushed
- GitHub push status
- known limitations
- manual testing instructions

Then STOP.

## Task: MODULE 23 — Link Preview System and TikTok

Build generic provider architecture.

Initial providers:

- GenericOpenGraphProvider
- TikTokProvider

For TikTok:

- detect URL
- obtain officially available metadata
- show thumbnail
- show caption/creator where possible
- use official embed/player where available
- fallback gracefully

Do not scrape protected media streams.
Do not download TikTok videos.

Backend URL fetching must defend against SSRF.

Make architecture extensible to YouTube and other services.

Use a focused commit message such as:
`feat(module-23): link preview system and tiktok`

Then STOP.
```

---

# MODULE 24 — Bot Database

```text
## Mandatory pre-task instructions

Read `MASTER_SPEC.md` completely before touching the codebase.

Read `DEVELOPMENT_PLAN.md`.

Inspect the current repository before making changes, including:

- current branch
- `git status`
- configured Git remotes
- current project structure
- existing database migrations
- existing tests
- existing architecture patterns

Rules:

- Implement ONLY this requested module.
- Do not start future modules.
- Do not rewrite stable architecture without a concrete technical reason.
- Do not remove working functionality.
- Do not modify unrelated modules unless required for integration.
- Keep TypeScript strict.
- Follow existing conventions.
- Reuse existing services, hooks, components, stores, and types.
- Avoid duplicated logic.
- Never expose secrets or server-side API keys.
- Never commit `.env`, API keys, tokens, credentials, or private certificates.
- Use migrations for every database schema change.
- Preserve RLS and authorization.
- Do not silently suppress errors.
- Do not fake successful functionality.
- Clearly mark unavoidable future work with TODO comments.
- Preserve backward compatibility unless the module explicitly requires a migration or breaking change.

Before finishing this module:

1. Run TypeScript typecheck.
2. Run lint.
3. Run relevant automated tests.
4. Run a production build where practical.
5. Fix all errors introduced by this module.
6. Review `git diff`.
7. Verify no secret, unrelated file, cache, build output, or accidental generated file is staged.
8. Update `DEVELOPMENT_PLAN.md` with the module status and known limitations.
9. Create one focused Git commit for this module.
10. Push the commit to the configured GitHub remote.
11. Verify that the push succeeded.

Preferred commit format:

`feat(module-XX): short description`

Use `fix`, `refactor`, `test`, or `chore` instead of `feat` when more appropriate.

Never force-push.

If GitHub push fails because of authentication, permissions, missing remote, protected branch, or network failure:

- preserve the local commit
- report the exact Git error
- do not reset or delete completed work
- do not claim the module was fully delivered
- provide the exact corrective command/action needed

At the end report:

- implementation summary
- files created
- files modified
- database migrations
- dependencies added
- environment variables added
- tests performed
- build result
- commit hash
- commit message
- branch pushed
- GitHub push status
- known limitations
- manual testing instructions

Then STOP.

## Task: MODULE 24 — Bot Database

Create migrations for:

- bots
- bot_personas
- bot_permissions
- bot_commands
- bot_triggers
- bot_memories
- bot_usage

Bots include:

- id
- owner
- name
- avatar
- description
- provider
- model
- invocation_name
- enabled
- timestamps

Persona fields:

- personality
- tone
- humor
- seriousness
- response length
- emoji frequency
- speaking style
- pronouns
- language
- roleplay strength
- custom system instructions

Permissions:

- read replied message
- read recent messages
- recent message count
- search history
- read images
- read files
- use memory

Add RLS.

Do not call AI yet.

Use a focused commit message such as:
`feat(module-24): bot database`

Then STOP.
```

---

# MODULE 25 — Bot Creator UI

```text
## Mandatory pre-task instructions

Read `MASTER_SPEC.md` completely before touching the codebase.

Read `DEVELOPMENT_PLAN.md`.

Inspect the current repository before making changes, including:

- current branch
- `git status`
- configured Git remotes
- current project structure
- existing database migrations
- existing tests
- existing architecture patterns

Rules:

- Implement ONLY this requested module.
- Do not start future modules.
- Do not rewrite stable architecture without a concrete technical reason.
- Do not remove working functionality.
- Do not modify unrelated modules unless required for integration.
- Keep TypeScript strict.
- Follow existing conventions.
- Reuse existing services, hooks, components, stores, and types.
- Avoid duplicated logic.
- Never expose secrets or server-side API keys.
- Never commit `.env`, API keys, tokens, credentials, or private certificates.
- Use migrations for every database schema change.
- Preserve RLS and authorization.
- Do not silently suppress errors.
- Do not fake successful functionality.
- Clearly mark unavoidable future work with TODO comments.
- Preserve backward compatibility unless the module explicitly requires a migration or breaking change.

Before finishing this module:

1. Run TypeScript typecheck.
2. Run lint.
3. Run relevant automated tests.
4. Run a production build where practical.
5. Fix all errors introduced by this module.
6. Review `git diff`.
7. Verify no secret, unrelated file, cache, build output, or accidental generated file is staged.
8. Update `DEVELOPMENT_PLAN.md` with the module status and known limitations.
9. Create one focused Git commit for this module.
10. Push the commit to the configured GitHub remote.
11. Verify that the push succeeded.

Preferred commit format:

`feat(module-XX): short description`

Use `fix`, `refactor`, `test`, or `chore` instead of `feat` when more appropriate.

Never force-push.

If GitHub push fails because of authentication, permissions, missing remote, protected branch, or network failure:

- preserve the local commit
- report the exact Git error
- do not reset or delete completed work
- do not claim the module was fully delivered
- provide the exact corrective command/action needed

At the end report:

- implementation summary
- files created
- files modified
- database migrations
- dependencies added
- environment variables added
- tests performed
- build result
- commit hash
- commit message
- branch pushed
- GitHub push status
- known limitations
- manual testing instructions

Then STOP.

## Task: MODULE 25 — Bot Creator UI

Implement:

- Create bot
- Edit bot
- Delete bot
- Enable/disable bot

Basic fields:

- name
- avatar
- description
- invocation name
- AI provider
- model

Persona editor:

- personality description
- tone
- humor
- seriousness
- response length
- emoji frequency
- speaking style
- pronouns
- language
- roleplay strength
- custom prompt

Permission editor:

- replied message
- recent messages
- recent count
- historical search
- images
- files
- memory

Do not call real AI APIs yet.

Use a focused commit message such as:
`feat(module-25): bot creator ui`

Then STOP.
```

---

# MODULE 26 — Secure AI Gateway

```text
## Mandatory pre-task instructions

Read `MASTER_SPEC.md` completely before touching the codebase.

Read `DEVELOPMENT_PLAN.md`.

Inspect the current repository before making changes, including:

- current branch
- `git status`
- configured Git remotes
- current project structure
- existing database migrations
- existing tests
- existing architecture patterns

Rules:

- Implement ONLY this requested module.
- Do not start future modules.
- Do not rewrite stable architecture without a concrete technical reason.
- Do not remove working functionality.
- Do not modify unrelated modules unless required for integration.
- Keep TypeScript strict.
- Follow existing conventions.
- Reuse existing services, hooks, components, stores, and types.
- Avoid duplicated logic.
- Never expose secrets or server-side API keys.
- Never commit `.env`, API keys, tokens, credentials, or private certificates.
- Use migrations for every database schema change.
- Preserve RLS and authorization.
- Do not silently suppress errors.
- Do not fake successful functionality.
- Clearly mark unavoidable future work with TODO comments.
- Preserve backward compatibility unless the module explicitly requires a migration or breaking change.

Before finishing this module:

1. Run TypeScript typecheck.
2. Run lint.
3. Run relevant automated tests.
4. Run a production build where practical.
5. Fix all errors introduced by this module.
6. Review `git diff`.
7. Verify no secret, unrelated file, cache, build output, or accidental generated file is staged.
8. Update `DEVELOPMENT_PLAN.md` with the module status and known limitations.
9. Create one focused Git commit for this module.
10. Push the commit to the configured GitHub remote.
11. Verify that the push succeeded.

Preferred commit format:

`feat(module-XX): short description`

Use `fix`, `refactor`, `test`, or `chore` instead of `feat` when more appropriate.

Never force-push.

If GitHub push fails because of authentication, permissions, missing remote, protected branch, or network failure:

- preserve the local commit
- report the exact Git error
- do not reset or delete completed work
- do not claim the module was fully delivered
- provide the exact corrective command/action needed

At the end report:

- implementation summary
- files created
- files modified
- database migrations
- dependencies added
- environment variables added
- tests performed
- build result
- commit hash
- commit message
- branch pushed
- GitHub push status
- known limitations
- manual testing instructions

Then STOP.

## Task: MODULE 26 — Secure AI Gateway

Implement a server-side AI Gateway.

Initial providers:

- OpenAI
- Gemini

Create provider abstraction with normalized request/response.

Gateway must:

1. authenticate user
2. verify conversation membership
3. validate bot
4. load bot configuration
5. validate permissions
6. enforce rate limits
7. gather authorized context
8. call provider
9. record usage
10. return normalized result

Server environment variables:

- OPENAI_API_KEY
- GEMINI_API_KEY

Never expose these through VITE_ variables or client bundles.

Add tests for unauthorized access.

Acceptance: secure text-only AI calls work.

Use a focused commit message such as:
`feat(module-26): secure ai gateway`

Then STOP.
```

---

# MODULE 27 — Bot Invocation in Chat

```text
## Mandatory pre-task instructions

Read `MASTER_SPEC.md` completely before touching the codebase.

Read `DEVELOPMENT_PLAN.md`.

Inspect the current repository before making changes, including:

- current branch
- `git status`
- configured Git remotes
- current project structure
- existing database migrations
- existing tests
- existing architecture patterns

Rules:

- Implement ONLY this requested module.
- Do not start future modules.
- Do not rewrite stable architecture without a concrete technical reason.
- Do not remove working functionality.
- Do not modify unrelated modules unless required for integration.
- Keep TypeScript strict.
- Follow existing conventions.
- Reuse existing services, hooks, components, stores, and types.
- Avoid duplicated logic.
- Never expose secrets or server-side API keys.
- Never commit `.env`, API keys, tokens, credentials, or private certificates.
- Use migrations for every database schema change.
- Preserve RLS and authorization.
- Do not silently suppress errors.
- Do not fake successful functionality.
- Clearly mark unavoidable future work with TODO comments.
- Preserve backward compatibility unless the module explicitly requires a migration or breaking change.

Before finishing this module:

1. Run TypeScript typecheck.
2. Run lint.
3. Run relevant automated tests.
4. Run a production build where practical.
5. Fix all errors introduced by this module.
6. Review `git diff`.
7. Verify no secret, unrelated file, cache, build output, or accidental generated file is staged.
8. Update `DEVELOPMENT_PLAN.md` with the module status and known limitations.
9. Create one focused Git commit for this module.
10. Push the commit to the configured GitHub remote.
11. Verify that the push succeeded.

Preferred commit format:

`feat(module-XX): short description`

Use `fix`, `refactor`, `test`, or `chore` instead of `feat` when more appropriate.

Never force-push.

If GitHub push fails because of authentication, permissions, missing remote, protected branch, or network failure:

- preserve the local commit
- report the exact Git error
- do not reset or delete completed work
- do not claim the module was fully delivered
- provide the exact corrective command/action needed

At the end report:

- implementation summary
- files created
- files modified
- database migrations
- dependencies added
- environment variables added
- tests performed
- build result
- commit hash
- commit message
- branch pushed
- GitHub push status
- known limitations
- manual testing instructions

Then STOP.

## Task: MODULE 27 — Bot Invocation in Chat

Support:

- @BotName question
- command architecture such as /ask and /summary

Flow:

user message
-> detect explicit bot invocation
-> backend request
-> validation
-> AI Gateway
-> insert bot message
-> realtime display

Bot messages show:

- avatar
- name
- BOT badge

Requirements:

- idempotency
- no duplicate responses
- prevent bot-to-bot infinite loops
- bot loading/typing state
- failure state

Do not implement vision yet.

Use a focused commit message such as:
`feat(module-27): bot invocation in chat`

Then STOP.
```

---

# MODULE 28 — AI Vision

```text
## Mandatory pre-task instructions

Read `MASTER_SPEC.md` completely before touching the codebase.

Read `DEVELOPMENT_PLAN.md`.

Inspect the current repository before making changes, including:

- current branch
- `git status`
- configured Git remotes
- current project structure
- existing database migrations
- existing tests
- existing architecture patterns

Rules:

- Implement ONLY this requested module.
- Do not start future modules.
- Do not rewrite stable architecture without a concrete technical reason.
- Do not remove working functionality.
- Do not modify unrelated modules unless required for integration.
- Keep TypeScript strict.
- Follow existing conventions.
- Reuse existing services, hooks, components, stores, and types.
- Avoid duplicated logic.
- Never expose secrets or server-side API keys.
- Never commit `.env`, API keys, tokens, credentials, or private certificates.
- Use migrations for every database schema change.
- Preserve RLS and authorization.
- Do not silently suppress errors.
- Do not fake successful functionality.
- Clearly mark unavoidable future work with TODO comments.
- Preserve backward compatibility unless the module explicitly requires a migration or breaking change.

Before finishing this module:

1. Run TypeScript typecheck.
2. Run lint.
3. Run relevant automated tests.
4. Run a production build where practical.
5. Fix all errors introduced by this module.
6. Review `git diff`.
7. Verify no secret, unrelated file, cache, build output, or accidental generated file is staged.
8. Update `DEVELOPMENT_PLAN.md` with the module status and known limitations.
9. Create one focused Git commit for this module.
10. Push the commit to the configured GitHub remote.
11. Verify that the push succeeded.

Preferred commit format:

`feat(module-XX): short description`

Use `fix`, `refactor`, `test`, or `chore` instead of `feat` when more appropriate.

Never force-push.

If GitHub push fails because of authentication, permissions, missing remote, protected branch, or network failure:

- preserve the local commit
- report the exact Git error
- do not reset or delete completed work
- do not claim the module was fully delivered
- provide the exact corrective command/action needed

At the end report:

- implementation summary
- files created
- files modified
- database migrations
- dependencies added
- environment variables added
- tests performed
- build result
- commit hash
- commit message
- branch pushed
- GitHub push status
- known limitations
- manual testing instructions

Then STOP.

## Task: MODULE 28 — AI Vision

Bot can receive an image when:

- image is attached to the bot request
or
- user replies to an image and invokes the bot

Only when:

- provider supports vision
- bot has image permission
- requesting user can access the image

Allowed context may include:

- current question
- relevant image
- replied message
- allowed nearby messages
- timestamps

Create normalized multimodal provider format.

Limit:

- number of images
- image dimensions/file size

Show a context preview UI indicating what is being sent to AI.

Use a focused commit message such as:
`feat(module-28): ai vision`

Then STOP.
```

---

# MODULE 29 — Time-Aware AI

```text
## Mandatory pre-task instructions

Read `MASTER_SPEC.md` completely before touching the codebase.

Read `DEVELOPMENT_PLAN.md`.

Inspect the current repository before making changes, including:

- current branch
- `git status`
- configured Git remotes
- current project structure
- existing database migrations
- existing tests
- existing architecture patterns

Rules:

- Implement ONLY this requested module.
- Do not start future modules.
- Do not rewrite stable architecture without a concrete technical reason.
- Do not remove working functionality.
- Do not modify unrelated modules unless required for integration.
- Keep TypeScript strict.
- Follow existing conventions.
- Reuse existing services, hooks, components, stores, and types.
- Avoid duplicated logic.
- Never expose secrets or server-side API keys.
- Never commit `.env`, API keys, tokens, credentials, or private certificates.
- Use migrations for every database schema change.
- Preserve RLS and authorization.
- Do not silently suppress errors.
- Do not fake successful functionality.
- Clearly mark unavoidable future work with TODO comments.
- Preserve backward compatibility unless the module explicitly requires a migration or breaking change.

Before finishing this module:

1. Run TypeScript typecheck.
2. Run lint.
3. Run relevant automated tests.
4. Run a production build where practical.
5. Fix all errors introduced by this module.
6. Review `git diff`.
7. Verify no secret, unrelated file, cache, build output, or accidental generated file is staged.
8. Update `DEVELOPMENT_PLAN.md` with the module status and known limitations.
9. Create one focused Git commit for this module.
10. Push the commit to the configured GitHub remote.
11. Verify that the push succeeded.

Preferred commit format:

`feat(module-XX): short description`

Use `fix`, `refactor`, `test`, or `chore` instead of `feat` when more appropriate.

Never force-push.

If GitHub push fails because of authentication, permissions, missing remote, protected branch, or network failure:

- preserve the local commit
- report the exact Git error
- do not reset or delete completed work
- do not claim the module was fully delivered
- provide the exact corrective command/action needed

At the end report:

- implementation summary
- files created
- files modified
- database migrations
- dependencies added
- environment variables added
- tests performed
- build result
- commit hash
- commit message
- branch pushed
- GitHub push status
- known limitations
- manual testing instructions

Then STOP.

## Task: MODULE 29 — Time-Aware AI

Default display timezone:

Asia/Ho_Chi_Minh

Store canonical timestamps consistently.

Support Vietnamese time expressions such as:

- "từ 5h đến 8h"
- "từ 17h tới 20h"
- "tối qua"
- "sáng nay"
- "trưa nay"
- "2 tiếng trước"
- "lúc 19h"
- "hôm qua"
- "tuần trước"

Flow:

user request
-> detect time intent
-> resolve exact start/end timestamps
-> query database
-> format chronological messages
-> AI

Do not ask the LLM to infer dates from huge message histories when backend can resolve them.

Add automated tests for Vietnamese date/time expressions and boundary cases.

Use a focused commit message such as:
`feat(module-29): time-aware ai`

Then STOP.
```

---

# MODULE 30 — Event-Based Conversation Search

```text
## Mandatory pre-task instructions

Read `MASTER_SPEC.md` completely before touching the codebase.

Read `DEVELOPMENT_PLAN.md`.

Inspect the current repository before making changes, including:

- current branch
- `git status`
- configured Git remotes
- current project structure
- existing database migrations
- existing tests
- existing architecture patterns

Rules:

- Implement ONLY this requested module.
- Do not start future modules.
- Do not rewrite stable architecture without a concrete technical reason.
- Do not remove working functionality.
- Do not modify unrelated modules unless required for integration.
- Keep TypeScript strict.
- Follow existing conventions.
- Reuse existing services, hooks, components, stores, and types.
- Avoid duplicated logic.
- Never expose secrets or server-side API keys.
- Never commit `.env`, API keys, tokens, credentials, or private certificates.
- Use migrations for every database schema change.
- Preserve RLS and authorization.
- Do not silently suppress errors.
- Do not fake successful functionality.
- Clearly mark unavoidable future work with TODO comments.
- Preserve backward compatibility unless the module explicitly requires a migration or breaking change.

Before finishing this module:

1. Run TypeScript typecheck.
2. Run lint.
3. Run relevant automated tests.
4. Run a production build where practical.
5. Fix all errors introduced by this module.
6. Review `git diff`.
7. Verify no secret, unrelated file, cache, build output, or accidental generated file is staged.
8. Update `DEVELOPMENT_PLAN.md` with the module status and known limitations.
9. Create one focused Git commit for this module.
10. Push the commit to the configured GitHub remote.
11. Verify that the push succeeded.

Preferred commit format:

`feat(module-XX): short description`

Use `fix`, `refactor`, `test`, or `chore` instead of `feat` when more appropriate.

Never force-push.

If GitHub push fails because of authentication, permissions, missing remote, protected branch, or network failure:

- preserve the local commit
- report the exact Git error
- do not reset or delete completed work
- do not claim the module was fully delivered
- provide the exact corrective command/action needed

At the end report:

- implementation summary
- files created
- files modified
- database migrations
- dependencies added
- environment variables added
- tests performed
- build result
- commit hash
- commit message
- branch pushed
- GitHub push status
- known limitations
- manual testing instructions

Then STOP.

## Task: MODULE 30 — Event-Based Conversation Search

Support:

- "từ lúc Nam gửi ảnh đến lúc Minh nói đi ngủ"
- "sau khi Huy gửi link TikTok"
- "trước khi mọi người bắt đầu call"

Pipeline:

1. parse boundary descriptions
2. search candidate messages/events
3. score candidate matches
4. resolve start/end
5. fetch messages within interval
6. send only that interval to AI

When multiple plausible boundaries exist:

- return/select candidates or request clarification
- never silently choose a weak match

Keep event search separate from generic message search.

Use a focused commit message such as:
`feat(module-30): event-based conversation search`

Then STOP.
```

---

# MODULE 31 — Advanced Bot Persona Runtime

```text
## Mandatory pre-task instructions

Read `MASTER_SPEC.md` completely before touching the codebase.

Read `DEVELOPMENT_PLAN.md`.

Inspect the current repository before making changes, including:

- current branch
- `git status`
- configured Git remotes
- current project structure
- existing database migrations
- existing tests
- existing architecture patterns

Rules:

- Implement ONLY this requested module.
- Do not start future modules.
- Do not rewrite stable architecture without a concrete technical reason.
- Do not remove working functionality.
- Do not modify unrelated modules unless required for integration.
- Keep TypeScript strict.
- Follow existing conventions.
- Reuse existing services, hooks, components, stores, and types.
- Avoid duplicated logic.
- Never expose secrets or server-side API keys.
- Never commit `.env`, API keys, tokens, credentials, or private certificates.
- Use migrations for every database schema change.
- Preserve RLS and authorization.
- Do not silently suppress errors.
- Do not fake successful functionality.
- Clearly mark unavoidable future work with TODO comments.
- Preserve backward compatibility unless the module explicitly requires a migration or breaking change.

Before finishing this module:

1. Run TypeScript typecheck.
2. Run lint.
3. Run relevant automated tests.
4. Run a production build where practical.
5. Fix all errors introduced by this module.
6. Review `git diff`.
7. Verify no secret, unrelated file, cache, build output, or accidental generated file is staged.
8. Update `DEVELOPMENT_PLAN.md` with the module status and known limitations.
9. Create one focused Git commit for this module.
10. Push the commit to the configured GitHub remote.
11. Verify that the push succeeded.

Preferred commit format:

`feat(module-XX): short description`

Use `fix`, `refactor`, `test`, or `chore` instead of `feat` when more appropriate.

Never force-push.

If GitHub push fails because of authentication, permissions, missing remote, protected branch, or network failure:

- preserve the local commit
- report the exact Git error
- do not reset or delete completed work
- do not claim the module was fully delivered
- provide the exact corrective command/action needed

At the end report:

- implementation summary
- files created
- files modified
- database migrations
- dependencies added
- environment variables added
- tests performed
- build result
- commit hash
- commit message
- branch pushed
- GitHub push status
- known limitations
- manual testing instructions

Then STOP.

## Task: MODULE 31 — Advanced Bot Persona Runtime

Ensure structured persona settings actually affect AI requests.

Compose system instructions from:

- platform rules
- security/context rules
- bot persona
- conversation context
- user request

Persona includes:

- role
- personality
- tone
- humor
- seriousness
- friendliness
- answer length
- emoji frequency
- language
- pronouns
- speaking style
- roleplay strength
- owner custom instructions

Security:

Persona must never override platform security rules or grant additional permissions.

Use a focused commit message such as:
`feat(module-31): advanced bot persona runtime`

Then STOP.
```

---

# MODULE 32 — Structured Bot Memory

```text
## Mandatory pre-task instructions

Read `MASTER_SPEC.md` completely before touching the codebase.

Read `DEVELOPMENT_PLAN.md`.

Inspect the current repository before making changes, including:

- current branch
- `git status`
- configured Git remotes
- current project structure
- existing database migrations
- existing tests
- existing architecture patterns

Rules:

- Implement ONLY this requested module.
- Do not start future modules.
- Do not rewrite stable architecture without a concrete technical reason.
- Do not remove working functionality.
- Do not modify unrelated modules unless required for integration.
- Keep TypeScript strict.
- Follow existing conventions.
- Reuse existing services, hooks, components, stores, and types.
- Avoid duplicated logic.
- Never expose secrets or server-side API keys.
- Never commit `.env`, API keys, tokens, credentials, or private certificates.
- Use migrations for every database schema change.
- Preserve RLS and authorization.
- Do not silently suppress errors.
- Do not fake successful functionality.
- Clearly mark unavoidable future work with TODO comments.
- Preserve backward compatibility unless the module explicitly requires a migration or breaking change.

Before finishing this module:

1. Run TypeScript typecheck.
2. Run lint.
3. Run relevant automated tests.
4. Run a production build where practical.
5. Fix all errors introduced by this module.
6. Review `git diff`.
7. Verify no secret, unrelated file, cache, build output, or accidental generated file is staged.
8. Update `DEVELOPMENT_PLAN.md` with the module status and known limitations.
9. Create one focused Git commit for this module.
10. Push the commit to the configured GitHub remote.
11. Verify that the push succeeded.

Preferred commit format:

`feat(module-XX): short description`

Use `fix`, `refactor`, `test`, or `chore` instead of `feat` when more appropriate.

Never force-push.

If GitHub push fails because of authentication, permissions, missing remote, protected branch, or network failure:

- preserve the local commit
- report the exact Git error
- do not reset or delete completed work
- do not claim the module was fully delivered
- provide the exact corrective command/action needed

At the end report:

- implementation summary
- files created
- files modified
- database migrations
- dependencies added
- environment variables added
- tests performed
- build result
- commit hash
- commit message
- branch pushed
- GitHub push status
- known limitations
- manual testing instructions

Then STOP.

## Task: MODULE 32 — Structured Bot Memory

Allow explicit memory commands such as:

@bot nhớ deadline đồ án là 25/10

Memory fields:

- bot
- conversation
- key/topic
- value
- created_by
- timestamps

Features:

- add
- view
- edit
- delete
- disable

Only use memory when bot permission allows it.

Do not automatically store every conversation turn.

Provide memory management UI.

Use a focused commit message such as:
`feat(module-32): structured bot memory`

Then STOP.
```

---

# MODULE 33 — AI Cost and Usage Control

```text
## Mandatory pre-task instructions

Read `MASTER_SPEC.md` completely before touching the codebase.

Read `DEVELOPMENT_PLAN.md`.

Inspect the current repository before making changes, including:

- current branch
- `git status`
- configured Git remotes
- current project structure
- existing database migrations
- existing tests
- existing architecture patterns

Rules:

- Implement ONLY this requested module.
- Do not start future modules.
- Do not rewrite stable architecture without a concrete technical reason.
- Do not remove working functionality.
- Do not modify unrelated modules unless required for integration.
- Keep TypeScript strict.
- Follow existing conventions.
- Reuse existing services, hooks, components, stores, and types.
- Avoid duplicated logic.
- Never expose secrets or server-side API keys.
- Never commit `.env`, API keys, tokens, credentials, or private certificates.
- Use migrations for every database schema change.
- Preserve RLS and authorization.
- Do not silently suppress errors.
- Do not fake successful functionality.
- Clearly mark unavoidable future work with TODO comments.
- Preserve backward compatibility unless the module explicitly requires a migration or breaking change.

Before finishing this module:

1. Run TypeScript typecheck.
2. Run lint.
3. Run relevant automated tests.
4. Run a production build where practical.
5. Fix all errors introduced by this module.
6. Review `git diff`.
7. Verify no secret, unrelated file, cache, build output, or accidental generated file is staged.
8. Update `DEVELOPMENT_PLAN.md` with the module status and known limitations.
9. Create one focused Git commit for this module.
10. Push the commit to the configured GitHub remote.
11. Verify that the push succeeded.

Preferred commit format:

`feat(module-XX): short description`

Use `fix`, `refactor`, `test`, or `chore` instead of `feat` when more appropriate.

Never force-push.

If GitHub push fails because of authentication, permissions, missing remote, protected branch, or network failure:

- preserve the local commit
- report the exact Git error
- do not reset or delete completed work
- do not claim the module was fully delivered
- provide the exact corrective command/action needed

At the end report:

- implementation summary
- files created
- files modified
- database migrations
- dependencies added
- environment variables added
- tests performed
- build result
- commit hash
- commit message
- branch pushed
- GitHub push status
- known limitations
- manual testing instructions

Then STOP.

## Task: MODULE 33 — AI Cost and Usage Control

Enforce server-side configurable:

- requests per user/day
- image requests/day
- long summaries/day
- max context messages
- max estimated context tokens
- cooldown seconds
- max concurrent requests
- model restrictions

Record:

- user
- bot
- provider
- model
- timestamp
- input token count when returned
- output token count when returned
- image count
- status
- error category

Build a simple usage UI.

Never rely only on frontend enforcement.

Use a focused commit message such as:
`feat(module-33): ai cost and usage control`

Then STOP.
```

---

# MODULE 34 — Call State and Database

```text
## Mandatory pre-task instructions

Read `MASTER_SPEC.md` completely before touching the codebase.

Read `DEVELOPMENT_PLAN.md`.

Inspect the current repository before making changes, including:

- current branch
- `git status`
- configured Git remotes
- current project structure
- existing database migrations
- existing tests
- existing architecture patterns

Rules:

- Implement ONLY this requested module.
- Do not start future modules.
- Do not rewrite stable architecture without a concrete technical reason.
- Do not remove working functionality.
- Do not modify unrelated modules unless required for integration.
- Keep TypeScript strict.
- Follow existing conventions.
- Reuse existing services, hooks, components, stores, and types.
- Avoid duplicated logic.
- Never expose secrets or server-side API keys.
- Never commit `.env`, API keys, tokens, credentials, or private certificates.
- Use migrations for every database schema change.
- Preserve RLS and authorization.
- Do not silently suppress errors.
- Do not fake successful functionality.
- Clearly mark unavoidable future work with TODO comments.
- Preserve backward compatibility unless the module explicitly requires a migration or breaking change.

Before finishing this module:

1. Run TypeScript typecheck.
2. Run lint.
3. Run relevant automated tests.
4. Run a production build where practical.
5. Fix all errors introduced by this module.
6. Review `git diff`.
7. Verify no secret, unrelated file, cache, build output, or accidental generated file is staged.
8. Update `DEVELOPMENT_PLAN.md` with the module status and known limitations.
9. Create one focused Git commit for this module.
10. Push the commit to the configured GitHub remote.
11. Verify that the push succeeded.

Preferred commit format:

`feat(module-XX): short description`

Use `fix`, `refactor`, `test`, or `chore` instead of `feat` when more appropriate.

Never force-push.

If GitHub push fails because of authentication, permissions, missing remote, protected branch, or network failure:

- preserve the local commit
- report the exact Git error
- do not reset or delete completed work
- do not claim the module was fully delivered
- provide the exact corrective command/action needed

At the end report:

- implementation summary
- files created
- files modified
- database migrations
- dependencies added
- environment variables added
- tests performed
- build result
- commit hash
- commit message
- branch pushed
- GitHub push status
- known limitations
- manual testing instructions

Then STOP.

## Task: MODULE 34 — Call State and Database

Create:

- calls
- call_participants

Call types:

- voice
- video

States:

- ringing
- active
- ended
- missed
- declined
- failed

Call metadata:

- conversation
- starter
- type
- start time
- answer time
- end time

Participants:

- user
- join time
- leave time
- microphone state
- camera state

Build a deterministic call state machine.

Do not implement WebRTC transport yet.

Use a focused commit message such as:
`feat(module-34): call state and database`

Then STOP.
```

---

# MODULE 35 — Voice Calling

```text
## Mandatory pre-task instructions

Read `MASTER_SPEC.md` completely before touching the codebase.

Read `DEVELOPMENT_PLAN.md`.

Inspect the current repository before making changes, including:

- current branch
- `git status`
- configured Git remotes
- current project structure
- existing database migrations
- existing tests
- existing architecture patterns

Rules:

- Implement ONLY this requested module.
- Do not start future modules.
- Do not rewrite stable architecture without a concrete technical reason.
- Do not remove working functionality.
- Do not modify unrelated modules unless required for integration.
- Keep TypeScript strict.
- Follow existing conventions.
- Reuse existing services, hooks, components, stores, and types.
- Avoid duplicated logic.
- Never expose secrets or server-side API keys.
- Never commit `.env`, API keys, tokens, credentials, or private certificates.
- Use migrations for every database schema change.
- Preserve RLS and authorization.
- Do not silently suppress errors.
- Do not fake successful functionality.
- Clearly mark unavoidable future work with TODO comments.
- Preserve backward compatibility unless the module explicitly requires a migration or breaking change.

Before finishing this module:

1. Run TypeScript typecheck.
2. Run lint.
3. Run relevant automated tests.
4. Run a production build where practical.
5. Fix all errors introduced by this module.
6. Review `git diff`.
7. Verify no secret, unrelated file, cache, build output, or accidental generated file is staged.
8. Update `DEVELOPMENT_PLAN.md` with the module status and known limitations.
9. Create one focused Git commit for this module.
10. Push the commit to the configured GitHub remote.
11. Verify that the push succeeded.

Preferred commit format:

`feat(module-XX): short description`

Use `fix`, `refactor`, `test`, or `chore` instead of `feat` when more appropriate.

Never force-push.

If GitHub push fails because of authentication, permissions, missing remote, protected branch, or network failure:

- preserve the local commit
- report the exact Git error
- do not reset or delete completed work
- do not claim the module was fully delivered
- provide the exact corrective command/action needed

At the end report:

- implementation summary
- files created
- files modified
- database migrations
- dependencies added
- environment variables added
- tests performed
- build result
- commit hash
- commit message
- branch pushed
- GitHub push status
- known limitations
- manual testing instructions

Then STOP.

## Task: MODULE 35 — Voice Calling

Use an SFU-compatible architecture.

Features:

- initiate call
- ringing state
- accept
- decline
- end
- microphone mute
- speaker selection
- Bluetooth where platform allows
- participant list
- call timer
- network state

CRITICAL:

A voice call must start with camera OFF.

cameraEnabled = false

The user may manually enable camera later.

Keep media engine abstraction ready for web/native differences.

Use a focused commit message such as:
`feat(module-35): voice calling`

Then STOP.
```

---

# MODULE 36 — Group Video Calling

```text
## Mandatory pre-task instructions

Read `MASTER_SPEC.md` completely before touching the codebase.

Read `DEVELOPMENT_PLAN.md`.

Inspect the current repository before making changes, including:

- current branch
- `git status`
- configured Git remotes
- current project structure
- existing database migrations
- existing tests
- existing architecture patterns

Rules:

- Implement ONLY this requested module.
- Do not start future modules.
- Do not rewrite stable architecture without a concrete technical reason.
- Do not remove working functionality.
- Do not modify unrelated modules unless required for integration.
- Keep TypeScript strict.
- Follow existing conventions.
- Reuse existing services, hooks, components, stores, and types.
- Avoid duplicated logic.
- Never expose secrets or server-side API keys.
- Never commit `.env`, API keys, tokens, credentials, or private certificates.
- Use migrations for every database schema change.
- Preserve RLS and authorization.
- Do not silently suppress errors.
- Do not fake successful functionality.
- Clearly mark unavoidable future work with TODO comments.
- Preserve backward compatibility unless the module explicitly requires a migration or breaking change.

Before finishing this module:

1. Run TypeScript typecheck.
2. Run lint.
3. Run relevant automated tests.
4. Run a production build where practical.
5. Fix all errors introduced by this module.
6. Review `git diff`.
7. Verify no secret, unrelated file, cache, build output, or accidental generated file is staged.
8. Update `DEVELOPMENT_PLAN.md` with the module status and known limitations.
9. Create one focused Git commit for this module.
10. Push the commit to the configured GitHub remote.
11. Verify that the push succeeded.

Preferred commit format:

`feat(module-XX): short description`

Use `fix`, `refactor`, `test`, or `chore` instead of `feat` when more appropriate.

Never force-push.

If GitHub push fails because of authentication, permissions, missing remote, protected branch, or network failure:

- preserve the local commit
- report the exact Git error
- do not reset or delete completed work
- do not claim the module was fully delivered
- provide the exact corrective command/action needed

At the end report:

- implementation summary
- files created
- files modified
- database migrations
- dependencies added
- environment variables added
- tests performed
- build result
- commit hash
- commit message
- branch pushed
- GitHub push status
- known limitations
- manual testing instructions

Then STOP.

## Task: MODULE 36 — Group Video Calling

Target up to approximately 12 users.

Use an SFU.

Do not implement a 12-user full-mesh topology.

Features:

- initiate video call
- accept/decline
- local preview
- mute
- camera toggle
- front/rear camera
- active speaker
- speaker output
- participant grid

Dynamic layouts:

- 1
- 2
- 4
- 6
- 9
- 12

Optimize remote video quality based on tile size.

Prepare effect-processing hooks but do not implement effects yet.

Use a focused commit message such as:
`feat(module-36): group video calling`

Then STOP.
```

---

# MODULE 37 — Incoming Call Integration

```text
## Mandatory pre-task instructions

Read `MASTER_SPEC.md` completely before touching the codebase.

Read `DEVELOPMENT_PLAN.md`.

Inspect the current repository before making changes, including:

- current branch
- `git status`
- configured Git remotes
- current project structure
- existing database migrations
- existing tests
- existing architecture patterns

Rules:

- Implement ONLY this requested module.
- Do not start future modules.
- Do not rewrite stable architecture without a concrete technical reason.
- Do not remove working functionality.
- Do not modify unrelated modules unless required for integration.
- Keep TypeScript strict.
- Follow existing conventions.
- Reuse existing services, hooks, components, stores, and types.
- Avoid duplicated logic.
- Never expose secrets or server-side API keys.
- Never commit `.env`, API keys, tokens, credentials, or private certificates.
- Use migrations for every database schema change.
- Preserve RLS and authorization.
- Do not silently suppress errors.
- Do not fake successful functionality.
- Clearly mark unavoidable future work with TODO comments.
- Preserve backward compatibility unless the module explicitly requires a migration or breaking change.

Before finishing this module:

1. Run TypeScript typecheck.
2. Run lint.
3. Run relevant automated tests.
4. Run a production build where practical.
5. Fix all errors introduced by this module.
6. Review `git diff`.
7. Verify no secret, unrelated file, cache, build output, or accidental generated file is staged.
8. Update `DEVELOPMENT_PLAN.md` with the module status and known limitations.
9. Create one focused Git commit for this module.
10. Push the commit to the configured GitHub remote.
11. Verify that the push succeeded.

Preferred commit format:

`feat(module-XX): short description`

Use `fix`, `refactor`, `test`, or `chore` instead of `feat` when more appropriate.

Never force-push.

If GitHub push fails because of authentication, permissions, missing remote, protected branch, or network failure:

- preserve the local commit
- report the exact Git error
- do not reset or delete completed work
- do not claim the module was fully delivered
- provide the exact corrective command/action needed

At the end report:

- implementation summary
- files created
- files modified
- database migrations
- dependencies added
- environment variables added
- tests performed
- build result
- commit hash
- commit message
- branch pushed
- GitHub push status
- known limitations
- manual testing instructions

Then STOP.

## Task: MODULE 37 — Incoming Call Integration

Android:

- incoming call notification
- native call presentation where supported
- open the correct call

iOS:

- CallKit where native build supports it
- correct call lifecycle integration

Handle:

- foreground
- background
- terminated state where platform APIs permit

Do not use private APIs.

Document what works in:

- browser
- PWA
- Android APK
- native iOS

Use a focused commit message such as:
`feat(module-37): incoming call integration`

Then STOP.
```

---

# MODULE 38 — Recorded Voice Effects

```text
## Mandatory pre-task instructions

Read `MASTER_SPEC.md` completely before touching the codebase.

Read `DEVELOPMENT_PLAN.md`.

Inspect the current repository before making changes, including:

- current branch
- `git status`
- configured Git remotes
- current project structure
- existing database migrations
- existing tests
- existing architecture patterns

Rules:

- Implement ONLY this requested module.
- Do not start future modules.
- Do not rewrite stable architecture without a concrete technical reason.
- Do not remove working functionality.
- Do not modify unrelated modules unless required for integration.
- Keep TypeScript strict.
- Follow existing conventions.
- Reuse existing services, hooks, components, stores, and types.
- Avoid duplicated logic.
- Never expose secrets or server-side API keys.
- Never commit `.env`, API keys, tokens, credentials, or private certificates.
- Use migrations for every database schema change.
- Preserve RLS and authorization.
- Do not silently suppress errors.
- Do not fake successful functionality.
- Clearly mark unavoidable future work with TODO comments.
- Preserve backward compatibility unless the module explicitly requires a migration or breaking change.

Before finishing this module:

1. Run TypeScript typecheck.
2. Run lint.
3. Run relevant automated tests.
4. Run a production build where practical.
5. Fix all errors introduced by this module.
6. Review `git diff`.
7. Verify no secret, unrelated file, cache, build output, or accidental generated file is staged.
8. Update `DEVELOPMENT_PLAN.md` with the module status and known limitations.
9. Create one focused Git commit for this module.
10. Push the commit to the configured GitHub remote.
11. Verify that the push succeeded.

Preferred commit format:

`feat(module-XX): short description`

Use `fix`, `refactor`, `test`, or `chore` instead of `feat` when more appropriate.

Never force-push.

If GitHub push fails because of authentication, permissions, missing remote, protected branch, or network failure:

- preserve the local commit
- report the exact Git error
- do not reset or delete completed work
- do not claim the module was fully delivered
- provide the exact corrective command/action needed

At the end report:

- implementation summary
- files created
- files modified
- database migrations
- dependencies added
- environment variables added
- tests performed
- build result
- commit hash
- commit message
- branch pushed
- GitHub push status
- known limitations
- manual testing instructions

Then STOP.

## Task: MODULE 38 — Recorded Voice Effects

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

Features:

- choose effect
- preview
- switch effect
- confirm
- send processed audio
- keep original until confirmation

Build reusable DSP abstractions.

Prefer local processing.

Do not implement realtime call processing yet.

Use a focused commit message such as:
`feat(module-38): recorded voice effects`

Then STOP.
```

---

# MODULE 39 — Realtime Call Voice Changer

```text
## Mandatory pre-task instructions

Read `MASTER_SPEC.md` completely before touching the codebase.

Read `DEVELOPMENT_PLAN.md`.

Inspect the current repository before making changes, including:

- current branch
- `git status`
- configured Git remotes
- current project structure
- existing database migrations
- existing tests
- existing architecture patterns

Rules:

- Implement ONLY this requested module.
- Do not start future modules.
- Do not rewrite stable architecture without a concrete technical reason.
- Do not remove working functionality.
- Do not modify unrelated modules unless required for integration.
- Keep TypeScript strict.
- Follow existing conventions.
- Reuse existing services, hooks, components, stores, and types.
- Avoid duplicated logic.
- Never expose secrets or server-side API keys.
- Never commit `.env`, API keys, tokens, credentials, or private certificates.
- Use migrations for every database schema change.
- Preserve RLS and authorization.
- Do not silently suppress errors.
- Do not fake successful functionality.
- Clearly mark unavoidable future work with TODO comments.
- Preserve backward compatibility unless the module explicitly requires a migration or breaking change.

Before finishing this module:

1. Run TypeScript typecheck.
2. Run lint.
3. Run relevant automated tests.
4. Run a production build where practical.
5. Fix all errors introduced by this module.
6. Review `git diff`.
7. Verify no secret, unrelated file, cache, build output, or accidental generated file is staged.
8. Update `DEVELOPMENT_PLAN.md` with the module status and known limitations.
9. Create one focused Git commit for this module.
10. Push the commit to the configured GitHub remote.
11. Verify that the push succeeded.

Preferred commit format:

`feat(module-XX): short description`

Use `fix`, `refactor`, `test`, or `chore` instead of `feat` when more appropriate.

Never force-push.

If GitHub push fails because of authentication, permissions, missing remote, protected branch, or network failure:

- preserve the local commit
- report the exact Git error
- do not reset or delete completed work
- do not claim the module was fully delivered
- provide the exact corrective command/action needed

At the end report:

- implementation summary
- files created
- files modified
- database migrations
- dependencies added
- environment variables added
- tests performed
- build result
- commit hash
- commit message
- branch pushed
- GitHub push status
- known limitations
- manual testing instructions

Then STOP.

## Task: MODULE 39 — Realtime Call Voice Changer

Reuse voice DSP architecture where appropriate.

Pipeline:

microphone
-> noise processing
-> voice effect
-> outgoing WebRTC track

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

Requirements:

- switch during call
- low latency
- fallback to original
- CPU monitoring where practical
- allow disabling effects on weak devices

Measure processing latency where tooling allows.

Prioritize call stability.

Use a focused commit message such as:
`feat(module-39): realtime call voice changer`

Then STOP.
```

---

# MODULE 40 — Basic Camera Filters

```text
## Mandatory pre-task instructions

Read `MASTER_SPEC.md` completely before touching the codebase.

Read `DEVELOPMENT_PLAN.md`.

Inspect the current repository before making changes, including:

- current branch
- `git status`
- configured Git remotes
- current project structure
- existing database migrations
- existing tests
- existing architecture patterns

Rules:

- Implement ONLY this requested module.
- Do not start future modules.
- Do not rewrite stable architecture without a concrete technical reason.
- Do not remove working functionality.
- Do not modify unrelated modules unless required for integration.
- Keep TypeScript strict.
- Follow existing conventions.
- Reuse existing services, hooks, components, stores, and types.
- Avoid duplicated logic.
- Never expose secrets or server-side API keys.
- Never commit `.env`, API keys, tokens, credentials, or private certificates.
- Use migrations for every database schema change.
- Preserve RLS and authorization.
- Do not silently suppress errors.
- Do not fake successful functionality.
- Clearly mark unavoidable future work with TODO comments.
- Preserve backward compatibility unless the module explicitly requires a migration or breaking change.

Before finishing this module:

1. Run TypeScript typecheck.
2. Run lint.
3. Run relevant automated tests.
4. Run a production build where practical.
5. Fix all errors introduced by this module.
6. Review `git diff`.
7. Verify no secret, unrelated file, cache, build output, or accidental generated file is staged.
8. Update `DEVELOPMENT_PLAN.md` with the module status and known limitations.
9. Create one focused Git commit for this module.
10. Push the commit to the configured GitHub remote.
11. Verify that the push succeeded.

Preferred commit format:

`feat(module-XX): short description`

Use `fix`, `refactor`, `test`, or `chore` instead of `feat` when more appropriate.

Never force-push.

If GitHub push fails because of authentication, permissions, missing remote, protected branch, or network failure:

- preserve the local commit
- report the exact Git error
- do not reset or delete completed work
- do not claim the module was fully delivered
- provide the exact corrective command/action needed

At the end report:

- implementation summary
- files created
- files modified
- database migrations
- dependencies added
- environment variables added
- tests performed
- build result
- commit hash
- commit message
- branch pushed
- GitHub push status
- known limitations
- manual testing instructions

Then STOP.

## Task: MODULE 40 — Basic Camera Filters

Initial effects:

- brightness
- contrast
- saturation
- grayscale
- warm
- cool
- simple blur

Provide:

- effect picker
- intensity control
- disable button

Use GPU/WebGL/native acceleration where appropriate.

Insert the effect pipeline between camera capture and outgoing video track.

Do not implement face AR yet.

Use a focused commit message such as:
`feat(module-40): basic camera filters`

Then STOP.
```

---

# MODULE 41 — Face Landmark Effects

```text
## Mandatory pre-task instructions

Read `MASTER_SPEC.md` completely before touching the codebase.

Read `DEVELOPMENT_PLAN.md`.

Inspect the current repository before making changes, including:

- current branch
- `git status`
- configured Git remotes
- current project structure
- existing database migrations
- existing tests
- existing architecture patterns

Rules:

- Implement ONLY this requested module.
- Do not start future modules.
- Do not rewrite stable architecture without a concrete technical reason.
- Do not remove working functionality.
- Do not modify unrelated modules unless required for integration.
- Keep TypeScript strict.
- Follow existing conventions.
- Reuse existing services, hooks, components, stores, and types.
- Avoid duplicated logic.
- Never expose secrets or server-side API keys.
- Never commit `.env`, API keys, tokens, credentials, or private certificates.
- Use migrations for every database schema change.
- Preserve RLS and authorization.
- Do not silently suppress errors.
- Do not fake successful functionality.
- Clearly mark unavoidable future work with TODO comments.
- Preserve backward compatibility unless the module explicitly requires a migration or breaking change.

Before finishing this module:

1. Run TypeScript typecheck.
2. Run lint.
3. Run relevant automated tests.
4. Run a production build where practical.
5. Fix all errors introduced by this module.
6. Review `git diff`.
7. Verify no secret, unrelated file, cache, build output, or accidental generated file is staged.
8. Update `DEVELOPMENT_PLAN.md` with the module status and known limitations.
9. Create one focused Git commit for this module.
10. Push the commit to the configured GitHub remote.
11. Verify that the push succeeded.

Preferred commit format:

`feat(module-XX): short description`

Use `fix`, `refactor`, `test`, or `chore` instead of `feat` when more appropriate.

Never force-push.

If GitHub push fails because of authentication, permissions, missing remote, protected branch, or network failure:

- preserve the local commit
- report the exact Git error
- do not reset or delete completed work
- do not claim the module was fully delivered
- provide the exact corrective command/action needed

At the end report:

- implementation summary
- files created
- files modified
- database migrations
- dependencies added
- environment variables added
- tests performed
- build result
- commit hash
- commit message
- branch pushed
- GitHub push status
- known limitations
- manual testing instructions

Then STOP.

## Task: MODULE 41 — Face Landmark Effects

Add face landmark tracking.

Initial effects:

- glasses
- cat ears
- simple face mask
- hearts around head
- sparkles

Requirements:

- follow translation
- rotation
- scale
- stop tracking when disabled
- quality settings
- graceful fallback on low-end phones

Keep face tracking and rendering as separate abstractions.

Use a focused commit message such as:
`feat(module-41): face landmark effects`

Then STOP.
```

---

# MODULE 42 — Video Background Effects

```text
## Mandatory pre-task instructions

Read `MASTER_SPEC.md` completely before touching the codebase.

Read `DEVELOPMENT_PLAN.md`.

Inspect the current repository before making changes, including:

- current branch
- `git status`
- configured Git remotes
- current project structure
- existing database migrations
- existing tests
- existing architecture patterns

Rules:

- Implement ONLY this requested module.
- Do not start future modules.
- Do not rewrite stable architecture without a concrete technical reason.
- Do not remove working functionality.
- Do not modify unrelated modules unless required for integration.
- Keep TypeScript strict.
- Follow existing conventions.
- Reuse existing services, hooks, components, stores, and types.
- Avoid duplicated logic.
- Never expose secrets or server-side API keys.
- Never commit `.env`, API keys, tokens, credentials, or private certificates.
- Use migrations for every database schema change.
- Preserve RLS and authorization.
- Do not silently suppress errors.
- Do not fake successful functionality.
- Clearly mark unavoidable future work with TODO comments.
- Preserve backward compatibility unless the module explicitly requires a migration or breaking change.

Before finishing this module:

1. Run TypeScript typecheck.
2. Run lint.
3. Run relevant automated tests.
4. Run a production build where practical.
5. Fix all errors introduced by this module.
6. Review `git diff`.
7. Verify no secret, unrelated file, cache, build output, or accidental generated file is staged.
8. Update `DEVELOPMENT_PLAN.md` with the module status and known limitations.
9. Create one focused Git commit for this module.
10. Push the commit to the configured GitHub remote.
11. Verify that the push succeeded.

Preferred commit format:

`feat(module-XX): short description`

Use `fix`, `refactor`, `test`, or `chore` instead of `feat` when more appropriate.

Never force-push.

If GitHub push fails because of authentication, permissions, missing remote, protected branch, or network failure:

- preserve the local commit
- report the exact Git error
- do not reset or delete completed work
- do not claim the module was fully delivered
- provide the exact corrective command/action needed

At the end report:

- implementation summary
- files created
- files modified
- database migrations
- dependencies added
- environment variables added
- tests performed
- build result
- commit hash
- commit message
- branch pushed
- GitHub push status
- known limitations
- manual testing instructions

Then STOP.

## Task: MODULE 42 — Video Background Effects

Support:

- background blur
- solid background color
- background image replacement

Perform segmentation locally where practical.

Quality levels:

- Low
- Medium
- High

Allow dynamic quality reduction if processing cannot maintain frame rate.

Do not upload raw camera frames to a server for segmentation.

Use a focused commit message such as:
`feat(module-42): video background effects`

Then STOP.
```

---

# MODULE 43 — Synchronized Call Effects

```text
## Mandatory pre-task instructions

Read `MASTER_SPEC.md` completely before touching the codebase.

Read `DEVELOPMENT_PLAN.md`.

Inspect the current repository before making changes, including:

- current branch
- `git status`
- configured Git remotes
- current project structure
- existing database migrations
- existing tests
- existing architecture patterns

Rules:

- Implement ONLY this requested module.
- Do not start future modules.
- Do not rewrite stable architecture without a concrete technical reason.
- Do not remove working functionality.
- Do not modify unrelated modules unless required for integration.
- Keep TypeScript strict.
- Follow existing conventions.
- Reuse existing services, hooks, components, stores, and types.
- Avoid duplicated logic.
- Never expose secrets or server-side API keys.
- Never commit `.env`, API keys, tokens, credentials, or private certificates.
- Use migrations for every database schema change.
- Preserve RLS and authorization.
- Do not silently suppress errors.
- Do not fake successful functionality.
- Clearly mark unavoidable future work with TODO comments.
- Preserve backward compatibility unless the module explicitly requires a migration or breaking change.

Before finishing this module:

1. Run TypeScript typecheck.
2. Run lint.
3. Run relevant automated tests.
4. Run a production build where practical.
5. Fix all errors introduced by this module.
6. Review `git diff`.
7. Verify no secret, unrelated file, cache, build output, or accidental generated file is staged.
8. Update `DEVELOPMENT_PLAN.md` with the module status and known limitations.
9. Create one focused Git commit for this module.
10. Push the commit to the configured GitHub remote.
11. Verify that the push succeeded.

Preferred commit format:

`feat(module-XX): short description`

Use `fix`, `refactor`, `test`, or `chore` instead of `feat` when more appropriate.

Never force-push.

If GitHub push fails because of authentication, permissions, missing remote, protected branch, or network failure:

- preserve the local commit
- report the exact Git error
- do not reset or delete completed work
- do not claim the module was fully delivered
- provide the exact corrective command/action needed

At the end report:

- implementation summary
- files created
- files modified
- database migrations
- dependencies added
- environment variables added
- tests performed
- build result
- commit hash
- commit message
- branch pushed
- GitHub push status
- known limitations
- manual testing instructions

Then STOP.

## Task: MODULE 43 — Synchronized Call Effects

Effects:

- confetti
- hearts
- snow
- emoji rain
- party mode

Do not bake these into video streams.

Broadcast:

- effect_type
- triggered_by
- start_timestamp
- duration
- parameters

Each client renders locally.

Prevent duplicate replay of the same event.

Use a focused commit message such as:
`feat(module-43): synchronized call effects`

Then STOP.
```

---

# MODULE 44 — Android Native Packaging / APK

```text
## Mandatory pre-task instructions

Read `MASTER_SPEC.md` completely before touching the codebase.

Read `DEVELOPMENT_PLAN.md`.

Inspect the current repository before making changes, including:

- current branch
- `git status`
- configured Git remotes
- current project structure
- existing database migrations
- existing tests
- existing architecture patterns

Rules:

- Implement ONLY this requested module.
- Do not start future modules.
- Do not rewrite stable architecture without a concrete technical reason.
- Do not remove working functionality.
- Do not modify unrelated modules unless required for integration.
- Keep TypeScript strict.
- Follow existing conventions.
- Reuse existing services, hooks, components, stores, and types.
- Avoid duplicated logic.
- Never expose secrets or server-side API keys.
- Never commit `.env`, API keys, tokens, credentials, or private certificates.
- Use migrations for every database schema change.
- Preserve RLS and authorization.
- Do not silently suppress errors.
- Do not fake successful functionality.
- Clearly mark unavoidable future work with TODO comments.
- Preserve backward compatibility unless the module explicitly requires a migration or breaking change.

Before finishing this module:

1. Run TypeScript typecheck.
2. Run lint.
3. Run relevant automated tests.
4. Run a production build where practical.
5. Fix all errors introduced by this module.
6. Review `git diff`.
7. Verify no secret, unrelated file, cache, build output, or accidental generated file is staged.
8. Update `DEVELOPMENT_PLAN.md` with the module status and known limitations.
9. Create one focused Git commit for this module.
10. Push the commit to the configured GitHub remote.
11. Verify that the push succeeded.

Preferred commit format:

`feat(module-XX): short description`

Use `fix`, `refactor`, `test`, or `chore` instead of `feat` when more appropriate.

Never force-push.

If GitHub push fails because of authentication, permissions, missing remote, protected branch, or network failure:

- preserve the local commit
- report the exact Git error
- do not reset or delete completed work
- do not claim the module was fully delivered
- provide the exact corrective command/action needed

At the end report:

- implementation summary
- files created
- files modified
- database migrations
- dependencies added
- environment variables added
- tests performed
- build result
- commit hash
- commit message
- branch pushed
- GitHub push status
- known limitations
- manual testing instructions

Then STOP.

## Task: MODULE 44 — Android Native Packaging / APK

Configure Capacitor Android properly.

Requirements:

- Android project builds
- app icon configuration
- splash
- permissions
- deep links
- media permissions
- microphone/camera permissions
- notification readiness

Generate a debug APK suitable for private testing.

Do not implement Play Store publishing.

Document:

- how to build APK
- exact APK output path
- how friends install it
- how to update the APK safely

Use a focused commit message such as:
`feat(module-44): android native packaging / apk`

Then STOP.
```

---

# MODULE 45 — Android Conversation Bubbles

```text
## Mandatory pre-task instructions

Read `MASTER_SPEC.md` completely before touching the codebase.

Read `DEVELOPMENT_PLAN.md`.

Inspect the current repository before making changes, including:

- current branch
- `git status`
- configured Git remotes
- current project structure
- existing database migrations
- existing tests
- existing architecture patterns

Rules:

- Implement ONLY this requested module.
- Do not start future modules.
- Do not rewrite stable architecture without a concrete technical reason.
- Do not remove working functionality.
- Do not modify unrelated modules unless required for integration.
- Keep TypeScript strict.
- Follow existing conventions.
- Reuse existing services, hooks, components, stores, and types.
- Avoid duplicated logic.
- Never expose secrets or server-side API keys.
- Never commit `.env`, API keys, tokens, credentials, or private certificates.
- Use migrations for every database schema change.
- Preserve RLS and authorization.
- Do not silently suppress errors.
- Do not fake successful functionality.
- Clearly mark unavoidable future work with TODO comments.
- Preserve backward compatibility unless the module explicitly requires a migration or breaking change.

Before finishing this module:

1. Run TypeScript typecheck.
2. Run lint.
3. Run relevant automated tests.
4. Run a production build where practical.
5. Fix all errors introduced by this module.
6. Review `git diff`.
7. Verify no secret, unrelated file, cache, build output, or accidental generated file is staged.
8. Update `DEVELOPMENT_PLAN.md` with the module status and known limitations.
9. Create one focused Git commit for this module.
10. Push the commit to the configured GitHub remote.
11. Verify that the push succeeded.

Preferred commit format:

`feat(module-XX): short description`

Use `fix`, `refactor`, `test`, or `chore` instead of `feat` when more appropriate.

Never force-push.

If GitHub push fails because of authentication, permissions, missing remote, protected branch, or network failure:

- preserve the local commit
- report the exact Git error
- do not reset or delete completed work
- do not claim the module was fully delivered
- provide the exact corrective command/action needed

At the end report:

- implementation summary
- files created
- files modified
- database migrations
- dependencies added
- environment variables added
- tests performed
- build result
- commit hash
- commit message
- branch pushed
- GitHub push status
- known limitations
- manual testing instructions

Then STOP.

## Task: MODULE 45 — Android Conversation Bubbles

Use official Android conversation/bubble APIs where available.

Requirements:

- conversation bubble
- avatar
- unread count
- opening compact conversation
- deep link to full chat
- dismissal
- notification integration

Avoid global overlay permission if standard Bubble APIs are sufficient.

Create a native bridge only where required.

Keep shared frontend behind a PlatformBubbleService or equivalent interface.

Use a focused commit message such as:
`feat(module-45): android conversation bubbles`

Then STOP.
```

---

# MODULE 46 — iOS Native Integration

```text
## Mandatory pre-task instructions

Read `MASTER_SPEC.md` completely before touching the codebase.

Read `DEVELOPMENT_PLAN.md`.

Inspect the current repository before making changes, including:

- current branch
- `git status`
- configured Git remotes
- current project structure
- existing database migrations
- existing tests
- existing architecture patterns

Rules:

- Implement ONLY this requested module.
- Do not start future modules.
- Do not rewrite stable architecture without a concrete technical reason.
- Do not remove working functionality.
- Do not modify unrelated modules unless required for integration.
- Keep TypeScript strict.
- Follow existing conventions.
- Reuse existing services, hooks, components, stores, and types.
- Avoid duplicated logic.
- Never expose secrets or server-side API keys.
- Never commit `.env`, API keys, tokens, credentials, or private certificates.
- Use migrations for every database schema change.
- Preserve RLS and authorization.
- Do not silently suppress errors.
- Do not fake successful functionality.
- Clearly mark unavoidable future work with TODO comments.
- Preserve backward compatibility unless the module explicitly requires a migration or breaking change.

Before finishing this module:

1. Run TypeScript typecheck.
2. Run lint.
3. Run relevant automated tests.
4. Run a production build where practical.
5. Fix all errors introduced by this module.
6. Review `git diff`.
7. Verify no secret, unrelated file, cache, build output, or accidental generated file is staged.
8. Update `DEVELOPMENT_PLAN.md` with the module status and known limitations.
9. Create one focused Git commit for this module.
10. Push the commit to the configured GitHub remote.
11. Verify that the push succeeded.

Preferred commit format:

`feat(module-XX): short description`

Use `fix`, `refactor`, `test`, or `chore` instead of `feat` when more appropriate.

Never force-push.

If GitHub push fails because of authentication, permissions, missing remote, protected branch, or network failure:

- preserve the local commit
- report the exact Git error
- do not reset or delete completed work
- do not claim the module was fully delivered
- provide the exact corrective command/action needed

At the end report:

- implementation summary
- files created
- files modified
- database migrations
- dependencies added
- environment variables added
- tests performed
- build result
- commit hash
- commit message
- branch pushed
- GitHub push status
- known limitations
- manual testing instructions

Then STOP.

## Task: MODULE 46 — iOS Native Integration

Configure Capacitor iOS.

Integrate public Apple APIs only.

Prepare:

- notification handling
- conversation deep links
- microphone/camera permissions
- native call integration
- CallKit where appropriate
- Live Activities architecture where useful
- Dynamic Island presentation where applicable

Do not implement fake Android-style system-wide floating chat heads.

An in-app floating mini-chat is allowed.

Document:

- web/PWA features
- native-only features
- signing/distribution requirements

Use a focused commit message such as:
`feat(module-46): ios native integration`

Then STOP.
```

---

# MODULE 47 — Offline Resilience

```text
## Mandatory pre-task instructions

Read `MASTER_SPEC.md` completely before touching the codebase.

Read `DEVELOPMENT_PLAN.md`.

Inspect the current repository before making changes, including:

- current branch
- `git status`
- configured Git remotes
- current project structure
- existing database migrations
- existing tests
- existing architecture patterns

Rules:

- Implement ONLY this requested module.
- Do not start future modules.
- Do not rewrite stable architecture without a concrete technical reason.
- Do not remove working functionality.
- Do not modify unrelated modules unless required for integration.
- Keep TypeScript strict.
- Follow existing conventions.
- Reuse existing services, hooks, components, stores, and types.
- Avoid duplicated logic.
- Never expose secrets or server-side API keys.
- Never commit `.env`, API keys, tokens, credentials, or private certificates.
- Use migrations for every database schema change.
- Preserve RLS and authorization.
- Do not silently suppress errors.
- Do not fake successful functionality.
- Clearly mark unavoidable future work with TODO comments.
- Preserve backward compatibility unless the module explicitly requires a migration or breaking change.

Before finishing this module:

1. Run TypeScript typecheck.
2. Run lint.
3. Run relevant automated tests.
4. Run a production build where practical.
5. Fix all errors introduced by this module.
6. Review `git diff`.
7. Verify no secret, unrelated file, cache, build output, or accidental generated file is staged.
8. Update `DEVELOPMENT_PLAN.md` with the module status and known limitations.
9. Create one focused Git commit for this module.
10. Push the commit to the configured GitHub remote.
11. Verify that the push succeeded.

Preferred commit format:

`feat(module-XX): short description`

Use `fix`, `refactor`, `test`, or `chore` instead of `feat` when more appropriate.

Never force-push.

If GitHub push fails because of authentication, permissions, missing remote, protected branch, or network failure:

- preserve the local commit
- report the exact Git error
- do not reset or delete completed work
- do not claim the module was fully delivered
- provide the exact corrective command/action needed

At the end report:

- implementation summary
- files created
- files modified
- database migrations
- dependencies added
- environment variables added
- tests performed
- build result
- commit hash
- commit message
- branch pushed
- GitHub push status
- known limitations
- manual testing instructions

Then STOP.

## Task: MODULE 47 — Offline Resilience

Support:

- cached conversation list
- cached recent messages
- offline indicator
- queue outgoing text messages
- resend when connection returns
- deduplication
- failed-send state

Do not attempt full offline synchronization for all media or call features.

Keep reconciliation predictable.

Use a focused commit message such as:
`feat(module-47): offline resilience`

Then STOP.
```

---

# MODULE 48 — Media Cache and Optimization

```text
## Mandatory pre-task instructions

Read `MASTER_SPEC.md` completely before touching the codebase.

Read `DEVELOPMENT_PLAN.md`.

Inspect the current repository before making changes, including:

- current branch
- `git status`
- configured Git remotes
- current project structure
- existing database migrations
- existing tests
- existing architecture patterns

Rules:

- Implement ONLY this requested module.
- Do not start future modules.
- Do not rewrite stable architecture without a concrete technical reason.
- Do not remove working functionality.
- Do not modify unrelated modules unless required for integration.
- Keep TypeScript strict.
- Follow existing conventions.
- Reuse existing services, hooks, components, stores, and types.
- Avoid duplicated logic.
- Never expose secrets or server-side API keys.
- Never commit `.env`, API keys, tokens, credentials, or private certificates.
- Use migrations for every database schema change.
- Preserve RLS and authorization.
- Do not silently suppress errors.
- Do not fake successful functionality.
- Clearly mark unavoidable future work with TODO comments.
- Preserve backward compatibility unless the module explicitly requires a migration or breaking change.

Before finishing this module:

1. Run TypeScript typecheck.
2. Run lint.
3. Run relevant automated tests.
4. Run a production build where practical.
5. Fix all errors introduced by this module.
6. Review `git diff`.
7. Verify no secret, unrelated file, cache, build output, or accidental generated file is staged.
8. Update `DEVELOPMENT_PLAN.md` with the module status and known limitations.
9. Create one focused Git commit for this module.
10. Push the commit to the configured GitHub remote.
11. Verify that the push succeeded.

Preferred commit format:

`feat(module-XX): short description`

Use `fix`, `refactor`, `test`, or `chore` instead of `feat` when more appropriate.

Never force-push.

If GitHub push fails because of authentication, permissions, missing remote, protected branch, or network failure:

- preserve the local commit
- report the exact Git error
- do not reset or delete completed work
- do not claim the module was fully delivered
- provide the exact corrective command/action needed

At the end report:

- implementation summary
- files created
- files modified
- database migrations
- dependencies added
- environment variables added
- tests performed
- build result
- commit hash
- commit message
- branch pushed
- GitHub push status
- known limitations
- manual testing instructions

Then STOP.

## Task: MODULE 48 — Media Cache and Optimization

Implement:

- image thumbnail cache
- full image cache with limits
- video poster cache
- lazy media fetching
- cache cleanup
- configurable cache maximum

Do not automatically cache full large videos.

Measure memory/disk usage where possible.

Optimize media-heavy conversation scrolling.

Use a focused commit message such as:
`feat(module-48): media cache and optimization`

Then STOP.
```

---

# MODULE 49 — Messaging Notifications

```text
## Mandatory pre-task instructions

Read `MASTER_SPEC.md` completely before touching the codebase.

Read `DEVELOPMENT_PLAN.md`.

Inspect the current repository before making changes, including:

- current branch
- `git status`
- configured Git remotes
- current project structure
- existing database migrations
- existing tests
- existing architecture patterns

Rules:

- Implement ONLY this requested module.
- Do not start future modules.
- Do not rewrite stable architecture without a concrete technical reason.
- Do not remove working functionality.
- Do not modify unrelated modules unless required for integration.
- Keep TypeScript strict.
- Follow existing conventions.
- Reuse existing services, hooks, components, stores, and types.
- Avoid duplicated logic.
- Never expose secrets or server-side API keys.
- Never commit `.env`, API keys, tokens, credentials, or private certificates.
- Use migrations for every database schema change.
- Preserve RLS and authorization.
- Do not silently suppress errors.
- Do not fake successful functionality.
- Clearly mark unavoidable future work with TODO comments.
- Preserve backward compatibility unless the module explicitly requires a migration or breaking change.

Before finishing this module:

1. Run TypeScript typecheck.
2. Run lint.
3. Run relevant automated tests.
4. Run a production build where practical.
5. Fix all errors introduced by this module.
6. Review `git diff`.
7. Verify no secret, unrelated file, cache, build output, or accidental generated file is staged.
8. Update `DEVELOPMENT_PLAN.md` with the module status and known limitations.
9. Create one focused Git commit for this module.
10. Push the commit to the configured GitHub remote.
11. Verify that the push succeeded.

Preferred commit format:

`feat(module-XX): short description`

Use `fix`, `refactor`, `test`, or `chore` instead of `feat` when more appropriate.

Never force-push.

If GitHub push fails because of authentication, permissions, missing remote, protected branch, or network failure:

- preserve the local commit
- report the exact Git error
- do not reset or delete completed work
- do not claim the module was fully delivered
- provide the exact corrective command/action needed

At the end report:

- implementation summary
- files created
- files modified
- database migrations
- dependencies added
- environment variables added
- tests performed
- build result
- commit hash
- commit message
- branch pushed
- GitHub push status
- known limitations
- manual testing instructions

Then STOP.

## Task: MODULE 49 — Messaging Notifications

Support:

- new message notification
- sender
- conversation
- avatar where supported
- message preview
- hide-preview privacy option
- tap opens exact conversation

Avoid notifying when:

- the current user sent the message
- the conversation is already visible and active where practical

Prepare:

- mute forever
- mute duration
- mentions-only mode

Document differences for:

- web/PWA
- Android APK
- native iOS

Use a focused commit message such as:
`feat(module-49): messaging notifications`

Then STOP.
```

---

# MODULE 50 — Settings

```text
## Mandatory pre-task instructions

Read `MASTER_SPEC.md` completely before touching the codebase.

Read `DEVELOPMENT_PLAN.md`.

Inspect the current repository before making changes, including:

- current branch
- `git status`
- configured Git remotes
- current project structure
- existing database migrations
- existing tests
- existing architecture patterns

Rules:

- Implement ONLY this requested module.
- Do not start future modules.
- Do not rewrite stable architecture without a concrete technical reason.
- Do not remove working functionality.
- Do not modify unrelated modules unless required for integration.
- Keep TypeScript strict.
- Follow existing conventions.
- Reuse existing services, hooks, components, stores, and types.
- Avoid duplicated logic.
- Never expose secrets or server-side API keys.
- Never commit `.env`, API keys, tokens, credentials, or private certificates.
- Use migrations for every database schema change.
- Preserve RLS and authorization.
- Do not silently suppress errors.
- Do not fake successful functionality.
- Clearly mark unavoidable future work with TODO comments.
- Preserve backward compatibility unless the module explicitly requires a migration or breaking change.

Before finishing this module:

1. Run TypeScript typecheck.
2. Run lint.
3. Run relevant automated tests.
4. Run a production build where practical.
5. Fix all errors introduced by this module.
6. Review `git diff`.
7. Verify no secret, unrelated file, cache, build output, or accidental generated file is staged.
8. Update `DEVELOPMENT_PLAN.md` with the module status and known limitations.
9. Create one focused Git commit for this module.
10. Push the commit to the configured GitHub remote.
11. Verify that the push succeeded.

Preferred commit format:

`feat(module-XX): short description`

Use `fix`, `refactor`, `test`, or `chore` instead of `feat` when more appropriate.

Never force-push.

If GitHub push fails because of authentication, permissions, missing remote, protected branch, or network failure:

- preserve the local commit
- report the exact Git error
- do not reset or delete completed work
- do not claim the module was fully delivered
- provide the exact corrective command/action needed

At the end report:

- implementation summary
- files created
- files modified
- database migrations
- dependencies added
- environment variables added
- tests performed
- build result
- commit hash
- commit message
- branch pushed
- GitHub push status
- known limitations
- manual testing instructions

Then STOP.

## Task: MODULE 50 — Settings

Create sections:

ACCOUNT
- profile
- logout

CHAT
- personal theme override
- animation intensity
- autoplay video
- text size

NOTIFICATIONS
- preview
- sound
- vibration
- mute configuration

CALLS
- default microphone behavior
- default camera behavior
- call quality
- disable heavy video effects

AI
- AI enabled/disabled
- usage view
- AI privacy/context preview

STORAGE
- cache size
- clear cache

ACCESSIBILITY
- reduced motion
- larger text support

Do not duplicate configuration state across unrelated stores.

Use a focused commit message such as:
`feat(module-50): settings`

Then STOP.
```

---

# MODULE 51 — Performance Audit

```text
## Mandatory pre-task instructions

Read `MASTER_SPEC.md` completely before touching the codebase.

Read `DEVELOPMENT_PLAN.md`.

Inspect the current repository before making changes, including:

- current branch
- `git status`
- configured Git remotes
- current project structure
- existing database migrations
- existing tests
- existing architecture patterns

Rules:

- Implement ONLY this requested module.
- Do not start future modules.
- Do not rewrite stable architecture without a concrete technical reason.
- Do not remove working functionality.
- Do not modify unrelated modules unless required for integration.
- Keep TypeScript strict.
- Follow existing conventions.
- Reuse existing services, hooks, components, stores, and types.
- Avoid duplicated logic.
- Never expose secrets or server-side API keys.
- Never commit `.env`, API keys, tokens, credentials, or private certificates.
- Use migrations for every database schema change.
- Preserve RLS and authorization.
- Do not silently suppress errors.
- Do not fake successful functionality.
- Clearly mark unavoidable future work with TODO comments.
- Preserve backward compatibility unless the module explicitly requires a migration or breaking change.

Before finishing this module:

1. Run TypeScript typecheck.
2. Run lint.
3. Run relevant automated tests.
4. Run a production build where practical.
5. Fix all errors introduced by this module.
6. Review `git diff`.
7. Verify no secret, unrelated file, cache, build output, or accidental generated file is staged.
8. Update `DEVELOPMENT_PLAN.md` with the module status and known limitations.
9. Create one focused Git commit for this module.
10. Push the commit to the configured GitHub remote.
11. Verify that the push succeeded.

Preferred commit format:

`feat(module-XX): short description`

Use `fix`, `refactor`, `test`, or `chore` instead of `feat` when more appropriate.

Never force-push.

If GitHub push fails because of authentication, permissions, missing remote, protected branch, or network failure:

- preserve the local commit
- report the exact Git error
- do not reset or delete completed work
- do not claim the module was fully delivered
- provide the exact corrective command/action needed

At the end report:

- implementation summary
- files created
- files modified
- database migrations
- dependencies added
- environment variables added
- tests performed
- build result
- commit hash
- commit message
- branch pushed
- GitHub push status
- known limitations
- manual testing instructions

Then STOP.

## Task: MODULE 51 — Performance Audit

Do not add new product features.

Profile:

- conversation list
- 1000+ message conversation
- rapid realtime messages
- reactions
- typing
- image-heavy chat
- voice playback
- video playback
- call screen

Investigate:

- unnecessary rerenders
- memory leaks
- duplicate subscriptions
- N+1 requests
- unindexed SQL
- oversized media
- main-thread blocking
- excessive realtime state changes

Fix only high-impact measurable issues.

Provide before/after measurements where practical.

Do not rewrite architecture for stylistic preference.

Use a focused commit message such as:
`feat(module-51): performance audit`

Then STOP.
```

---

# MODULE 52 — Security and Privacy Audit

```text
## Mandatory pre-task instructions

Read `MASTER_SPEC.md` completely before touching the codebase.

Read `DEVELOPMENT_PLAN.md`.

Inspect the current repository before making changes, including:

- current branch
- `git status`
- configured Git remotes
- current project structure
- existing database migrations
- existing tests
- existing architecture patterns

Rules:

- Implement ONLY this requested module.
- Do not start future modules.
- Do not rewrite stable architecture without a concrete technical reason.
- Do not remove working functionality.
- Do not modify unrelated modules unless required for integration.
- Keep TypeScript strict.
- Follow existing conventions.
- Reuse existing services, hooks, components, stores, and types.
- Avoid duplicated logic.
- Never expose secrets or server-side API keys.
- Never commit `.env`, API keys, tokens, credentials, or private certificates.
- Use migrations for every database schema change.
- Preserve RLS and authorization.
- Do not silently suppress errors.
- Do not fake successful functionality.
- Clearly mark unavoidable future work with TODO comments.
- Preserve backward compatibility unless the module explicitly requires a migration or breaking change.

Before finishing this module:

1. Run TypeScript typecheck.
2. Run lint.
3. Run relevant automated tests.
4. Run a production build where practical.
5. Fix all errors introduced by this module.
6. Review `git diff`.
7. Verify no secret, unrelated file, cache, build output, or accidental generated file is staged.
8. Update `DEVELOPMENT_PLAN.md` with the module status and known limitations.
9. Create one focused Git commit for this module.
10. Push the commit to the configured GitHub remote.
11. Verify that the push succeeded.

Preferred commit format:

`feat(module-XX): short description`

Use `fix`, `refactor`, `test`, or `chore` instead of `feat` when more appropriate.

Never force-push.

If GitHub push fails because of authentication, permissions, missing remote, protected branch, or network failure:

- preserve the local commit
- report the exact Git error
- do not reset or delete completed work
- do not claim the module was fully delivered
- provide the exact corrective command/action needed

At the end report:

- implementation summary
- files created
- files modified
- database migrations
- dependencies added
- environment variables added
- tests performed
- build result
- commit hash
- commit message
- branch pushed
- GitHub push status
- known limitations
- manual testing instructions

Then STOP.

## Task: MODULE 52 — Security and Privacy Audit

Audit:

- Supabase RLS
- Storage policies
- conversation authorization
- profile permissions
- IDOR
- bot permissions
- AI Gateway authentication
- API key exposure
- AI rate limiting
- file upload validation
- malicious filenames
- link preview SSRF
- XSS
- HTML sanitization
- deep links
- notification payload privacy
- bot command injection
- server input validation

Create security tests for critical paths.

Fix critical/high issues.

Provide a prioritized report.

Use a focused commit message such as:
`feat(module-52): security and privacy audit`

Then STOP.
```

---

# MODULE 53 — Final End-to-End QA

```text
## Mandatory pre-task instructions

Read `MASTER_SPEC.md` completely before touching the codebase.

Read `DEVELOPMENT_PLAN.md`.

Inspect the current repository before making changes, including:

- current branch
- `git status`
- configured Git remotes
- current project structure
- existing database migrations
- existing tests
- existing architecture patterns

Rules:

- Implement ONLY this requested module.
- Do not start future modules.
- Do not rewrite stable architecture without a concrete technical reason.
- Do not remove working functionality.
- Do not modify unrelated modules unless required for integration.
- Keep TypeScript strict.
- Follow existing conventions.
- Reuse existing services, hooks, components, stores, and types.
- Avoid duplicated logic.
- Never expose secrets or server-side API keys.
- Never commit `.env`, API keys, tokens, credentials, or private certificates.
- Use migrations for every database schema change.
- Preserve RLS and authorization.
- Do not silently suppress errors.
- Do not fake successful functionality.
- Clearly mark unavoidable future work with TODO comments.
- Preserve backward compatibility unless the module explicitly requires a migration or breaking change.

Before finishing this module:

1. Run TypeScript typecheck.
2. Run lint.
3. Run relevant automated tests.
4. Run a production build where practical.
5. Fix all errors introduced by this module.
6. Review `git diff`.
7. Verify no secret, unrelated file, cache, build output, or accidental generated file is staged.
8. Update `DEVELOPMENT_PLAN.md` with the module status and known limitations.
9. Create one focused Git commit for this module.
10. Push the commit to the configured GitHub remote.
11. Verify that the push succeeded.

Preferred commit format:

`feat(module-XX): short description`

Use `fix`, `refactor`, `test`, or `chore` instead of `feat` when more appropriate.

Never force-push.

If GitHub push fails because of authentication, permissions, missing remote, protected branch, or network failure:

- preserve the local commit
- report the exact Git error
- do not reset or delete completed work
- do not claim the module was fully delivered
- provide the exact corrective command/action needed

At the end report:

- implementation summary
- files created
- files modified
- database migrations
- dependencies added
- environment variables added
- tests performed
- build result
- commit hash
- commit message
- branch pushed
- GitHub push status
- known limitations
- manual testing instructions

Then STOP.

## Task: MODULE 53 — Final End-to-End QA

Do not add new features.

Test major journeys:

1. registration
2. login
3. avatar
4. create group
5. text messaging
6. reply
7. reactions
8. read receipts
9. typing
10. images
11. videos
12. voice messages
13. files
14. pin
15. search
16. nickname
17. theme
18. word effects
19. stickers
20. custom sticker
21. TikTok link
22. create AI bot
23. bot text question
24. bot image question
25. time-range summary
26. persona
27. memory
28. quota
29. voice call
30. video call
31. voice effect
32. camera effect
33. room effect
34. offline behavior
35. notifications

Test with multiple concurrent accounts.

Record:

- passed
- failed
- partially working
- platform limitation

Fix regression bugs only.

Produce a release-readiness report.

Use a focused commit message such as:
`feat(module-53): final end-to-end qa`

Then STOP.
```


# CHECKPOINT PROMPT

Use this after approximately every 4–6 modules.

```text
Read MASTER_SPEC.md completely.

Read DEVELOPMENT_PLAN.md.

Inspect the entire current repository.

This is a CHECKPOINT REVIEW.

Do not add new product features.

Check:

- TypeScript correctness
- architecture consistency
- duplicated logic
- database migrations
- RLS policies
- Storage policies
- realtime subscription cleanup
- React cleanup/memory leaks
- stale TODOs
- broken imports
- race conditions
- unnecessary rerenders
- unsafe error handling
- missing loading/error states
- Git status
- accidental secrets
- dependency health

Run:

- typecheck
- lint
- available unit/integration tests
- production build

Fix only clear defects or technical debt likely to break upcoming modules.

Do not refactor stable architecture simply because you prefer another style.

If changes are made:

1. update DEVELOPMENT_PLAN.md with a checkpoint note
2. create a focused checkpoint commit
3. push to GitHub
4. verify push

Never force-push.

At the end report:

- repository health
- problems found
- problems fixed
- remaining risks
- tests performed
- commit hash if changes were made
- GitHub push status

Then STOP.
```
