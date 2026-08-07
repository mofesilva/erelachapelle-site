# 07 — Server Actions & Validation

## Overview

The application uses Next.js **Server Actions** (React 19 `"use server"` directive) for form submissions. Each action:

1. Extracts raw data from `FormData`.
2. Checks for honeypot spam.
3. Validates with a **Zod schema**.
4. Returns a typed result object.

> **Phase 1:** All actions simulate success after validation. Phase 2 will add actual Cappuccino API persistence.

## Action Pattern

All server actions follow this signature pattern (compatible with `useActionState`):

```typescript
"use server";

export async function actionName(
  _prevState: ResultType | null,
  formData: FormData
): Promise<ResultType> {
  // 1. Extract raw fields
  // 2. Honeypot check → return spam error
  // 3. Zod parse → return validation error
  // 4. Business logic (Phase 2: API call)
  // 5. Return success
}
```

## Anti-Spam: Honeypot Pattern

Every form includes a hidden `honeypot` field that is:
- Hidden via `sr-only` class (visually hidden but in DOM).
- Set with `tabIndex={-1}` and `autoComplete="off"`.
- Validated as empty (`z.string().max(0).optional()`).

If a bot fills the honeypot, the action returns `{ success: false, message: "Spam detected." }` without further processing.

---

## Actions

### Contact Form (`src/app/actions/contact.ts`)

**Schema:** `contactSchema` from `src/lib/validations/contact.schema.ts`

| Field | Type | Validation |
|-------|------|------------|
| `name` | string | min 2, max 100 |
| `email` | string | valid email |
| `subject` | string | min 3, max 200 |
| `message` | string | min 10, max 2000 |
| `honeypot` | string | max 0, optional |

**Result type:** `ContactResult { success: boolean; message: string }`

**Used in:** `ContactForm` component on `/contact` page.

---

### Event Registration (`src/app/actions/events.ts`)

**Schema:** `eventRegistrationSchema` from `src/lib/validations/event.schema.ts`

| Field | Type | Validation |
|-------|------|------------|
| `eventId` | string | min 1 |
| `name` | string | min 2, max 100 |
| `email` | string | valid email |
| `phone` | string | optional |
| `attendees` | number | integer, min 1, max 20 |
| `honeypot` | string | max 0, optional |

**Result type:** `RegistrationResult { success: boolean; message: string }`

**Used in:** `EventRegistrationForm` on event detail pages.

---

### Group Interest (`src/app/actions/groups.ts`)

**Schema:** `groupInterestSchema` from `src/lib/validations/group.schema.ts`

| Field | Type | Validation |
|-------|------|------------|
| `groupId` | string | min 1 |
| `name` | string | min 2, max 100 |
| `email` | string | valid email |
| `message` | string | max 500, optional |
| `honeypot` | string | max 0, optional |

**Result type:** `GroupInterestResult { success: boolean; message: string }`

**Used in:** `JoinGroupForm` on group detail pages.

---

### Newsletter Subscription (`src/app/actions/newsletter.ts`)

**Schema:** `newsletterSchema` from `src/lib/validations/newsletter.schema.ts`

| Field | Type | Validation |
|-------|------|------------|
| `email` | string | valid email |
| `locale` | enum | `"fr" | "pt" | "en"` |
| `honeypot` | string | max 0, optional |

**Result type:** `NewsletterResult { success: boolean; message: string }`

**Used in:** `NewsletterSignup` component in the footer.

---

## Client-Side Integration

Actions are consumed using React 19's `useActionState` hook:

```typescript
"use client";
import { useActionState } from "react";

const [state, formAction, isPending] = useActionState(serverAction, null);

return (
  <form action={formAction}>
    {/* fields */}
    <button disabled={isPending}>Submit</button>
    {state?.success && <p>Success!</p>}
    {state && !state.success && <p>{state.message}</p>}
  </form>
);
```

Some forms also use **React Hook Form** with `@hookform/resolvers/zod` for client-side validation before the server action is invoked, providing instant feedback.

## Validation File Structure

```
src/lib/validations/
├── contact.schema.ts      → contactSchema + ContactInput type
├── event.schema.ts        → eventRegistrationSchema + EventRegistrationInput type  
├── group.schema.ts        → groupInterestSchema + GroupInterestInput type
└── newsletter.schema.ts   → newsletterSchema + NewsletterInput type
```

Each file exports:
1. A Zod schema object.
2. An inferred TypeScript type via `z.infer<typeof schema>`.
