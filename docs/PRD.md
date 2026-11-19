# Naajah — Product Requirements

**Tagline:** "Your University Journey, Made Easier." *Projects, Research, Technology & Academic Services — All in One Place.*

## 1. Problem

Students in Jordan (and beyond) find technical, research and tutoring help through scattered WhatsApp groups,
social media pages and word of mouth. That route has no quality signal, no payment protection, no project
tracking and no record of what was agreed. Providers (developers, analysts, researchers, tutors) have no
credible place to show verified expertise to students.

## 2. Users

| Persona | Goals | Key surfaces |
|---|---|---|
| **Student** (Bachelor, Master, PhD) | Find trustworthy help fast, agree on scope and price, track progress, get files, learn | Public site, `/student/*` |
| **Provider** (verified expert) | Publish services, win requests, deliver, get paid, build reputation | `/provider/*` |
| **Admin / staff** (Super admin, Moderator, Support, Finance) | Keep the marketplace safe and solvent | `/admin/*` with granular permissions |
| **Visitor** | Understand the offer, browse, use free tools | Public site |

## 3. Scope (v1)

1. Bilingual (AR/RTL, EN/LTR) public site: home, catalog, service details, public project board, library, academic tools, about, contact, FAQ, pricing, auth.
2. Service marketplace: 9 categories plus Academic Tools, with subcategories and services listed in the master spec. Services have packages (Basic/Standard/Premium), FAQ, deliverables, requirements, provider profile, portfolio and reviews.
3. Custom project requests → proposals → compare → accept → order.
4. Orders: milestones, deliverables with versions, revisions, status history, notes, chat, files and completion approval.
5. Payments: gateway abstraction plus a clearly labelled **sandbox** gateway, coupons, commission split, refunds, invoices and earnings.
6. Messaging (real-time) and notifications (in-app plus email).
7. Academic tools: text extraction, similarity analysis (internal scope), AI-writing *indicators*, citation checker and quality review, with downloadable reports.
8. Resource library of openly licensed educational material with license labels.
9. Admin: users, verification, catalog moderation, orders, payments, commissions, coupons, reviews, tools, resources, support, notifications, reports with CSV/PDF export, roles/permissions, settings and audit logs.

## 4. Academic integrity policy (product rule)

Naajah supports **learning, guidance, review and student-owned work**. Product copy, service templates and
provider terms frame services as tutoring, review, consultation, development assistance and documentation
support, and do not frame them as ghost-writing work to be submitted as the student's own. Concretely:

- Provider terms and request forms include an integrity acknowledgment checkbox.
- Admins can reject services or requests that ask for impersonation (e.g. "take my exam").
- **Academic tools never promise a "0% AI" or "undetectable" result.** Every AI indicator report carries a limitations notice:
  - indicators are probabilistic;
  - false positives and false negatives occur;
  - a result never proves authorship.
- **Similarity reports state their coverage explicitly.** Example: "Compared against: your previous uploads and 128 Naajah library resources. External academic databases: not configured." No source is invented. Turnitin and iThenticate are never mentioned as integrated.

## 5. Success metrics

- Visitor → registered: ≥ 8%
- Request → order: ≥ 35%
- Order completion without dispute: ≥ 95%
- Median provider first-proposal time: < 6 hours
- Student CSAT (review avg): ≥ 4.5

## 6. Non-functional requirements

- Performance: public pages have LCP < 2.5 s on 4G; API p95 < 300 ms for reads.
- Accessibility: WCAG 2.1 AA contrast, keyboard navigation, form labels, `lang`/`dir` attributes.
- Privacy: students never see each other's private data. Private files are served only after an authorization check.
- Every dashboard figure is computed from the database. No hard-coded metrics.

## 7. Out of scope for v1 (documented, adapter-ready)

- Live card processing. The Stripe/local gateway adapters are scaffolded and switch on once keys are configured.
- External AI-detection and plagiarism databases. Adapters exist and report `not_configured`.
- Native mobile apps.
- Video calls for tutoring. Sessions use external meeting links.
