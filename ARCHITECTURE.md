# PNRM Backend Architecture

## Protocolo Neuro Reconquista Masculina

---

## Folder Structure

```
supabase/
├── migrations/
│   ├── 001_initial.sql          # Base users, anamnese, task_completions (existing)
│   └── 002_pnrm_schema.sql      # PNRM: phases, profiles, diagnosis, tasks, progress
│
├── seed/
│   └── pnrm_phases_tasks.sql    # 5 phases + 35 daily tasks (7 per phase)
│
└── functions/
    ├── diagnosis/index.ts       # Questionnaire + analysis engine
    ├── tasks/index.ts           # Task CRUD + completion tracking
    ├── progress/index.ts        # Progress calculation
    ├── admin/index.ts           # Admin panel backend
    ├── kiwify-webhook/          # Payment webhooks (existing)
    ├── hotmart-webhook/         # Payment webhooks (existing)
    ├── stripe-webhook/          # Payment webhooks (existing)
    └── stripe-portal/           # Stripe portal (existing)

src/lib/pnrm/
├── types.ts                     # All shared TypeScript interfaces
└── api.ts                       # Client-side API helpers (typed fetch wrappers)
```

---

## Database Schema

```
auth.users (Supabase managed)
    │
    ├──► users (app profile, synced via trigger)
    │       ├──► profiles (PNRM context: age, breakup_time, etc.)
    │       ├──► diagnosis_results (emotional analysis, 1 per user)
    │       ├──► user_tasks (completion tracking)
    │       ├──► progress_tracking (cached per-phase %, auto-updated via trigger)
    │       └──► user_phase_access (which phases are unlocked)
    │
phases ──────► daily_tasks (content, managed by admin)
                    └──► user_tasks (joins to users)
```

---

## API Endpoints

### `/diagnosis`

| Method | Path                        | Description                          |
|--------|-----------------------------|--------------------------------------|
| GET    | `/diagnosis/questionnaire`  | Return questions (no scores exposed) |
| POST   | `/diagnosis/submit`         | Analyze answers, save result         |
| GET    | `/diagnosis/result`         | Get user's current diagnosis         |

### `/tasks`

| Method | Path                  | Description                            |
|--------|-----------------------|----------------------------------------|
| GET    | `/tasks/phase/:id`    | All tasks for a phase + user status    |
| GET    | `/tasks/today`        | Next incomplete task in active phase   |
| GET    | `/tasks/:id`          | Single task detail                     |
| POST   | `/tasks/complete`     | Mark task complete (+ notes, emotion)  |
| POST   | `/tasks/uncomplete`   | Undo completion                        |

### `/progress`

| Method | Path                      | Description                        |
|--------|---------------------------|------------------------------------|
| GET    | `/progress`               | Overall + all phases summary       |
| GET    | `/progress/phase/:id`     | Single phase progress              |
| POST   | `/progress/recalculate`   | Force recalc from source of truth  |

### `/admin` (admin role required)

| Method | Path                           | Description                     |
|--------|--------------------------------|---------------------------------|
| GET    | `/admin/tasks`                 | List tasks (filterable)         |
| POST   | `/admin/tasks`                 | Create task                     |
| PUT    | `/admin/tasks/:id`             | Update task                     |
| DELETE | `/admin/tasks/:id`             | Soft-delete (is_active = false) |
| GET    | `/admin/phases`                | List phases with task count     |
| PUT    | `/admin/phases/:id`            | Update phase metadata           |
| GET    | `/admin/users`                 | List users with progress        |
| GET    | `/admin/users/:id`             | Single user full detail         |
| POST   | `/admin/users/:id/grant-phase` | Manually unlock phase           |
| GET    | `/admin/stats`                 | Aggregate stats dashboard       |

---

## Progress Calculation

```
phase_progress   = completed_tasks_in_phase / total_tasks_in_phase × 100
overall_progress = Σ(completed tasks) / Σ(total tasks) × 100
```

**Automatic:** A PostgreSQL trigger (`trg_recalculate_progress`) fires on every
`INSERT/UPDATE/DELETE` on `user_tasks` and updates `progress_tracking` immediately.
Phase completion automatically unlocks the next phase via `user_phase_access`.

**Manual:** `POST /progress/recalculate` recalculates everything from scratch
(use after bulk admin operations or data migrations).

---

## Diagnosis Analysis Engine

The engine (`supabase/functions/diagnosis/index.ts`) scores 12 questions across 4 domains:

| Domain       | Weight | Measures                              |
|--------------|--------|---------------------------------------|
| Emotional    | 35%    | Current emotional state, sleep, focus |
| Behavior     | 30%    | Contact attempts, social media check  |
| Relationship | 25%    | Breakup reason, time apart, signals   |
| Attachment   | 10%    | Attachment style indicators           |

**Outputs:**
- `emotional_state`: critical / unstable / stable / recovering
- `probability_reconquest`: 0–100
- `attachment_style`: anxious / avoidant / secure / disorganized
- `recommended_phase`: 1–3 (where to start in the protocol)

---

## Phase Unlock Flow

```
User signs up
    → Phase 1 unlocked automatically (trigger)
    → User completes diagnosis
        → recommended_phase unlocked
    → User completes 100% of phase N
        → trigger auto-unlocks phase N+1
    → Admin can manually unlock any phase
        → POST /admin/users/:id/grant-phase
```

---

## Security

- **RLS** enabled on all tables
- **User data**: each user can only access their own rows
- **Content** (phases, tasks): all authenticated users can read
- **Admin routes**: verified via `admin_users` table lookup before any operation
- **Service role key**: only used inside Edge Functions (never exposed to client)
- **Client**: uses `anon` key + user JWT (Supabase Auth)

---

## Deployment

```bash
# Apply migrations
supabase db push

# Seed phases and tasks
supabase db execute --file supabase/seed/pnrm_phases_tasks.sql

# Deploy all Edge Functions
supabase functions deploy diagnosis
supabase functions deploy tasks
supabase functions deploy progress
supabase functions deploy admin

# Set environment variables (already set by Supabase automatically)
# SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, SUPABASE_ANON_KEY
```
