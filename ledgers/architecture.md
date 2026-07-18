# Site Architecture — Pete's Plumbing (Westchester County, NY)

> Generated and approved in Phase 3. This is the permanent source of truth
> for every later phase (content drafting, schema, validation, and all
> Phase 14 post-launch edits). Update this file if the architecture ever
> changes (e.g., Phase 14b adding a new page) — do not let it go stale.
>
> **STATUS: PROPOSED (v2, geo-target corrected) — AWAITING PHASE 3 CHECKPOINT
> APPROVAL.** Do not begin Phase 4 against this file until the user approves.

## Geo-target decision

**Primary geo-target: Westchester County, NY** — *not* Armonk.

The intake's GBP city (Armonk) was taken literally in v1 of this architecture.
Multi-signal comparison shows that was wrong.

| Candidate | Volume/mo | Competition | AI mention data | Verdict |
|---|---|---|---|---|
| **Armonk** (literal intake city) | 10 | 92 HIGH | **empty — no data** | ❌ Rejected |
| **Westchester County** | 480 | 68 HIGH | **present — 203 AI search volume, 10 mentions** | ✅ **Selected** |
| **Yonkers** (largest service-area city) | 720 | 55 MEDIUM | not tested — rejected on fit | ❌ Rejected |

**Signal 1 — volume.** Westchester is 48× Armonk. Yonkers is higher still (720),
but see fit below.

**Signal 2 — natural head term.** Four separate phrasings — `plumber westchester`,
`westchester plumber`, `plumber westchester ny`, `plumbers in westchester county
ny` — all return *identical* volume (480), competition (68), and CPC ($8.89).
Google is clustering them as one demand pool. That is strong evidence "Westchester"
is how people actually name this market. By contrast `armonk plumber` returns **no
data at all** while `plumber armonk` returns 10 — no real term exists there.

**Signal 3 — competitive landscape.** The Westchester SERP is a *different
competitive set* from the Armonk SERP. Gleason (the Armonk incumbent that owns
both pack #1 and organic #1 locally) **does not appear at all** at county level.
Instead: ABS Plumbing, Westchester Plumbers, Mr Unclog in the pack; T. Webber and
Bleakley ranking organically with explicitly county-scoped pages
(`twebber.com/service-area/westchester-county/`). Competitor precedent confirms
county-level pages are the working pattern here. Escaping Gleason's exact-match
Armonk dominance is itself a reason to move up a level.

**Signal 4 — AI/LLM visibility.** This is the decisive signal.
`ai_opt_llm_ment_top_domains` returned **empty** for every Armonk query but
**returns real data** at county level. The county SERP also carries an **AI
Overview** at position 1; the Armonk SERP carries none. Since AI citation is this
build's core strategy (see `build-report.md` takeaway 4), targeting a geo where
AI surfaces don't exist would have undercut the entire plan.

**Why not Yonkers**, despite higher volume and lower competition:
- The business is physically in Armonk, ~20 miles north. A GBP cannot rank in the
  Yonkers local pack from an Armonk address — the volume is real but unreachable.
- Yonkers is one of six approved service areas. Targeting it sitewide would
  misrepresent a business headquartered elsewhere and conflict with the GBP NAP.
- Westchester County *contains* Yonkers, so county targeting captures that intent
  without the contradiction.
- Yonkers remains the strongest **Phase 14 location-page** candidate.

**Implementation — hybrid, not a wholesale swap.** Westchester County is the
target in URLs, titles, and H1s. **Armonk stays** in the NAP, `LocalBusiness`
schema `address`, homepage subhead, About, Contact, and body copy — it is the real
physical location and drives local-pack proximity. The site says *"a plumber based
in Armonk, serving Westchester County"* — accurate on both counts.

**New finding worth acting on:** the AI-mention domains for this market are almost
entirely **licensing and credential-verification sources** — `nyc.gov`,
`westchestergov.com`, `ny.gov`, `apps.labor.ny.gov`, `licensedcheck.com`,
`thecontractormatrix.com`. AI answers about Westchester plumbers lean on
license verification. The competitor ranking #9 organically leads with
"Westchester County Master Plumber License #1664." **The intake has no license
number** — this is now a materially more important gap than it appeared at Phase 0.
See checkpoint flag.

## Phase 1 output — cleaned category / service hierarchy

### CATEGORIES

- Plumber *(primary)*
- Drainage service
- Septic system service
- Gasfitter
- Bathroom remodeler
- Water damage restoration service

**Removed during cleanup:**

| Removed | Reason |
|---|---|
| Bathroom renovator | Not a valid US Google Business category — `bathroom_renovator` returns zero listings within 30km while `bathroom_remodeler` returns many. AU/UK category name. Duplicate. |
| Septic tank service *(as a category)* | Near-total overlap with Septic system service. Retained as a **service** under it. |

### Service merges applied

| Merged away | Into |
|---|---|
| Gas water heater installation | Water heater installation |
| Hot water system repair | Water heater repair |
| Clogged drain repair, Drain snaking, Rooter service | Drain cleaning |
| Video pipe inspection | Sewer camera inspection |
| Pipe replacement, Repiping | Repiping & pipe replacement |
| Water line replacement, Water main repair | Water main & water line repair |
| Outdoor faucet repair | Faucet installation & repair |
| Water leak sensor installation | Leak detection |
| Water softener installation, Water filtration system installation | Water treatment & filtration |
| Plumbing inspection, Plumbing maintenance | Plumbing inspection & maintenance |
| Appliance hook-up, Laundry room plumbing | Appliance hook-up & laundry plumbing |
| Urinal installation | Commercial plumbing services |
| Rainwater tank installation | **Dropped** — not a residential service in this market |

Hydro jetting kept separate from drain cleaning (distinct method/search). Toilet
repair and toilet installation kept separate (different intent). Burst and frozen
pipe repair kept separate from general pipe repair (emergency intent; both map to
stated USPs).

### CATEGORY / SERVICE HIERARCHY

```
Plumber  (primary — maps to homepage, no standalone page)
- Emergency plumbing repair          - Faucet installation & repair
- Water heater installation          - Sink installation
- Water heater repair                - Garbage disposal repair
- Tankless water heater installation - Fixture replacement
- Boiler installation                - Appliance hook-up & laundry plumbing
- Leak detection                     - Kitchen plumbing remodeling
- Slab leak repair                   - Water treatment & filtration
- Pipe repair                        - Backflow testing
- Repiping & pipe replacement        - Plumbing inspection & maintenance
- Burst pipe repair                  - Commercial plumbing services
- Frozen pipe repair
- Water main & water line repair
- Low water pressure repair
- Toilet repair

Drainage service
- Drain cleaning        - Sewer camera inspection
- Hydro jetting         - Sump pump installation
- Sewer line repair     - Grease trap cleaning

Septic system service        Gasfitter
- Septic tank service        - Gas line repair

Bathroom remodeler                   Water damage restoration service
- Bathroom plumbing remodeling       - (scoped to burst/frozen pipe repair;
- Shower installation                   no standalone service — approved)
- Bathtub installation
- Shower valve replacement
- Toilet installation
```

## Phase 2 output — priority selections

| # | Priority | Basis |
|---|---|---|
| 1 | Plumber *(primary category → homepage)* | Manual override + automatic |
| 2 | Drainage service | Manual override |
| 3 | Water heater installation | Manual override |
| 4 | Emergency plumbing repair | Data-backed |
| 5 | Drain cleaning | Data-backed |
| 6 | Sump pump installation | Data-backed (client-fit led) |

## Page strategy — why 46 pages

**Client-confirmed, 2026-07-18. Do not re-propose cutting this.**

The 37 service pages are **not** individually intended to rank on search volume.
Their job is to make the website's service list **fully mirror the GBP's service
list**, which helps Google connect the GBP to the site and build authority for the
premium pages — which are the pages actually meant to rank. Thin-but-complete
coverage is the intended strategy, not an oversight. A page with no measurable
exact-match volume is still doing its job if it completes the GBP mirror.

## Site map

- **Nav (fixed):** Home, Services, About, Contact + one header CTA (phone)
- **URL pattern:** `/[slug]-westchester-ny` for category/service pages;
  `/services`, `/about`, `/contact` for standard pages
- **No location/service-area pages in this build** (Phase 3 rule 5)
- **Tier 1** = priority, premium, homepage-linked · **Tier 2** = category page ·
  **Tier 3** = standard service page

### Standard pages

| URL | Title tag | Meta description | H1 | Parent | Schema | Tier |
|---|---|---|---|---|---|---|
| `/` | Plumber in Westchester County, NY \| Pete's Plumbing | Licensed, insured plumber based in Armonk, serving Westchester County. Same-day and emergency service, upfront pricing, 15+ years local experience. | Plumber in Westchester County, NY | — | LocalBusiness/Plumber, WebSite, BreadcrumbList | 1 |
| `/services` | Plumbing Services in Westchester County, NY \| Pete's Plumbing | Every plumbing service we offer across Westchester County — repairs, water heaters, drains, sewer lines, gas lines, and more. | Our Plumbing Services | `/` | CollectionPage, BreadcrumbList | 1 |
| `/about` | About Pete's Plumbing \| Westchester County Plumber | Locally owned, licensed and insured, based in Armonk with 15+ years serving Westchester homeowners. Honest recommendations, clean work. | About Pete's Plumbing | `/` | AboutPage, BreadcrumbList | 2 |
| `/contact` | Contact Pete's Plumbing \| Westchester County, NY | Call Pete's Plumbing or request a free estimate. Same-day and emergency plumbing across Westchester County. | Contact Pete's Plumbing | `/` | ContactPage, BreadcrumbList | 2 |

### Category pages

| URL | Title tag | Meta description | H1 | Parent | Schema | Tier |
|---|---|---|---|---|---|---|
| `/drainage-service-westchester-ny` | Drainage Services in Westchester County, NY \| Pete's Plumbing | Slow drains, backups, and sewer problems handled across Westchester County. Drain cleaning, hydro jetting, camera inspection, sump pumps. | Drainage Services in Westchester County, NY | `/services` | Service, BreadcrumbList, FAQPage | 1 |
| `/septic-system-service-westchester-ny` | Septic System Services in Westchester County, NY \| Pete's Plumbing | Septic-connected plumbing help for Westchester homes — line problems, backups, and the plumbing side of septic trouble. | Septic System Services in Westchester County, NY | `/services` | Service, BreadcrumbList | 2 |
| `/gasfitter-westchester-ny` | Gas Line Services in Westchester County, NY \| Pete's Plumbing | Licensed gas line repair and gas fitting for Westchester homes and small businesses. Careful, code-correct work. | Gas Line Services in Westchester County, NY | `/services` | Service, BreadcrumbList | 2 |
| `/bathroom-remodeler-westchester-ny` | Bathroom Plumbing & Remodeling in Westchester County, NY \| Pete's Plumbing | The plumbing side of your bathroom project — showers, tubs, toilets, and valve work for Westchester homes. | Bathroom Plumbing & Remodeling in Westchester County, NY | `/services` | Service, BreadcrumbList | 2 |
| `/water-damage-restoration-westchester-ny` | Water Damage Plumbing Repairs in Westchester County, NY \| Pete's Plumbing | Stopping the source of the water — burst pipes, frozen pipes, and leak repairs for Westchester homes. | Water Damage Plumbing Repairs in Westchester County, NY | `/services` | Service, BreadcrumbList | 2 |

### Service pages — under Plumber (primary)

| URL | Title tag | Meta description | H1 | Parent | Schema | Tier |
|---|---|---|---|---|---|---|
| `/emergency-plumbing-repair-westchester-ny` | Emergency Plumber in Westchester County, NY \| Pete's Plumbing | Emergency plumbing help across Westchester County. We answer, we show up, and we stop the problem fast. Licensed and insured. | Emergency Plumbing Repair in Westchester County, NY | `/services` | Service, BreadcrumbList, FAQPage | 1 |
| `/water-heater-installation-westchester-ny` | Water Heater Installation in Westchester County, NY \| Pete's Plumbing | New water heater installation for Westchester homes, sized correctly and installed right, with upfront pricing before we start. | Water Heater Installation in Westchester County, NY | `/services` | Service, BreadcrumbList, FAQPage | 1 |
| `/water-heater-repair-westchester-ny` | Water Heater Repair in Westchester County, NY \| Pete's Plumbing | No hot water? We diagnose and repair water heaters across Westchester County. | Water Heater Repair in Westchester County, NY | `/services` | Service, BreadcrumbList | 3 |
| `/tankless-water-heater-installation-westchester-ny` | Tankless Water Heater Installation in Westchester County, NY \| Pete's Plumbing | Considering tankless? We install tankless water heaters in Westchester homes and say honestly whether it fits yours. | Tankless Water Heater Installation in Westchester County, NY | `/services` | Service, BreadcrumbList | 3 |
| `/boiler-installation-westchester-ny` | Boiler Installation in Westchester County, NY \| Pete's Plumbing | Boiler installation for Westchester homes, including older systems and the quirks that come with them. | Boiler Installation in Westchester County, NY | `/services` | Service, BreadcrumbList | 3 |
| `/leak-detection-westchester-ny` | Leak Detection in Westchester County, NY \| Pete's Plumbing | Finding hidden leaks before they cause damage, in Westchester homes and small businesses. | Leak Detection in Westchester County, NY | `/services` | Service, BreadcrumbList | 3 |
| `/slab-leak-repair-westchester-ny` | Slab Leak Repair in Westchester County, NY \| Pete's Plumbing | Slab leak location and repair for Westchester properties, with as little disruption to your home as possible. | Slab Leak Repair in Westchester County, NY | `/services` | Service, BreadcrumbList | 3 |
| `/pipe-repair-westchester-ny` | Pipe Repair in Westchester County, NY \| Pete's Plumbing | Leaking, corroded, or damaged pipes repaired properly in Westchester homes. Clear explanation before any work starts. | Pipe Repair in Westchester County, NY | `/services` | Service, BreadcrumbList | 3 |
| `/repiping-westchester-ny` | Repiping & Pipe Replacement in Westchester County, NY \| Pete's Plumbing | Whole-home repiping and pipe replacement for older Westchester houses with failing plumbing. | Repiping & Pipe Replacement in Westchester County, NY | `/services` | Service, BreadcrumbList | 3 |
| `/burst-pipe-repair-westchester-ny` | Burst Pipe Repair in Westchester County, NY \| Pete's Plumbing | A burst pipe is an emergency. We stop the water and repair the line fast for Westchester homeowners. | Burst Pipe Repair in Westchester County, NY | `/services` | Service, BreadcrumbList | 3 |
| `/frozen-pipe-repair-westchester-ny` | Frozen Pipe Repair in Westchester County, NY \| Pete's Plumbing | Frozen and cracked pipes thawed and repaired across Westchester — a common problem in our winters. | Frozen Pipe Repair in Westchester County, NY | `/services` | Service, BreadcrumbList | 3 |
| `/water-main-repair-westchester-ny` | Water Main & Water Line Repair in Westchester County, NY \| Pete's Plumbing | Main line breaks, leaks, and replacements handled for Westchester homes and small businesses. | Water Main & Water Line Repair in Westchester County, NY | `/services` | Service, BreadcrumbList | 3 |
| `/low-water-pressure-repair-westchester-ny` | Low Water Pressure Repair in Westchester County, NY \| Pete's Plumbing | Weak water pressure has a cause. We find it and fix it in Westchester homes rather than guessing. | Low Water Pressure Repair in Westchester County, NY | `/services` | Service, BreadcrumbList | 3 |
| `/toilet-repair-westchester-ny` | Toilet Repair in Westchester County, NY \| Pete's Plumbing | Running, leaking, or clogged toilets repaired same-day where we can, for Westchester homeowners. | Toilet Repair in Westchester County, NY | `/services` | Service, BreadcrumbList | 3 |
| `/faucet-installation-westchester-ny` | Faucet Installation & Repair in Westchester County, NY \| Pete's Plumbing | Indoor and outdoor faucet installation and repair for Westchester homes, done cleanly. | Faucet Installation & Repair in Westchester County, NY | `/services` | Service, BreadcrumbList | 3 |
| `/sink-installation-westchester-ny` | Sink Installation in Westchester County, NY \| Pete's Plumbing | Kitchen and bathroom sink installation for Westchester homes, connected properly the first time. | Sink Installation in Westchester County, NY | `/services` | Service, BreadcrumbList | 3 |
| `/garbage-disposal-repair-westchester-ny` | Garbage Disposal Repair in Westchester County, NY \| Pete's Plumbing | Jammed, leaking, or dead disposals repaired or replaced for Westchester kitchens. | Garbage Disposal Repair in Westchester County, NY | `/services` | Service, BreadcrumbList | 3 |
| `/fixture-replacement-westchester-ny` | Plumbing Fixture Replacement in Westchester County, NY \| Pete's Plumbing | Swapping out old or failing plumbing fixtures in Westchester homes, with clean, careful work. | Plumbing Fixture Replacement in Westchester County, NY | `/services` | Service, BreadcrumbList | 3 |
| `/appliance-hook-up-westchester-ny` | Appliance Hook-Up & Laundry Plumbing in Westchester County, NY \| Pete's Plumbing | Washing machines, dishwashers, and laundry room plumbing connected safely in Westchester homes. | Appliance Hook-Up & Laundry Plumbing in Westchester County, NY | `/services` | Service, BreadcrumbList | 3 |
| `/kitchen-plumbing-remodeling-westchester-ny` | Kitchen Plumbing Remodeling in Westchester County, NY \| Pete's Plumbing | The plumbing side of a Westchester kitchen remodel — moving lines, new fixtures, and clean connections. | Kitchen Plumbing Remodeling in Westchester County, NY | `/services` | Service, BreadcrumbList | 3 |
| `/water-treatment-filtration-westchester-ny` | Water Treatment & Filtration in Westchester County, NY \| Pete's Plumbing | Water softeners and filtration systems installed for Westchester homes, matched to your actual water. | Water Treatment & Filtration in Westchester County, NY | `/services` | Service, BreadcrumbList | 3 |
| `/backflow-testing-westchester-ny` | Backflow Testing in Westchester County, NY \| Pete's Plumbing | Backflow testing for Westchester homes and small businesses, handled by a licensed plumber. | Backflow Testing in Westchester County, NY | `/services` | Service, BreadcrumbList | 3 |
| `/plumbing-inspection-westchester-ny` | Plumbing Inspection & Maintenance in Westchester County, NY \| Pete's Plumbing | Know the real condition of your plumbing before it fails. Inspections and maintenance for Westchester homes. | Plumbing Inspection & Maintenance in Westchester County, NY | `/services` | Service, BreadcrumbList | 3 |
| `/commercial-plumbing-westchester-ny` | Commercial Plumbing in Westchester County, NY \| Pete's Plumbing | Light commercial plumbing for Westchester small businesses — repairs, fixtures, and grease trap work. | Commercial Plumbing in Westchester County, NY | `/services` | Service, BreadcrumbList | 3 |

### Service pages — under Drainage service

| URL | Title tag | Meta description | H1 | Parent | Schema | Tier |
|---|---|---|---|---|---|---|
| `/drain-cleaning-westchester-ny` | Drain Cleaning in Westchester County, NY \| Pete's Plumbing | Slow or clogged drains cleared properly in Westchester homes — snaking, rootering, and a real look at the cause. | Drain Cleaning in Westchester County, NY | `/drainage-service-westchester-ny` | Service, BreadcrumbList, FAQPage | 1 |
| `/hydro-jetting-westchester-ny` | Hydro Jetting in Westchester County, NY \| Pete's Plumbing | High-pressure hydro jetting for Westchester drain and sewer lines that keep backing up. | Hydro Jetting in Westchester County, NY | `/drainage-service-westchester-ny` | Service, BreadcrumbList | 3 |
| `/sewer-line-repair-westchester-ny` | Sewer Line Repair in Westchester County, NY \| Pete's Plumbing | Sewer line breaks, root intrusion, and backups diagnosed and repaired for Westchester properties. | Sewer Line Repair in Westchester County, NY | `/drainage-service-westchester-ny` | Service, BreadcrumbList | 3 |
| `/sewer-camera-inspection-westchester-ny` | Sewer Camera Inspection in Westchester County, NY \| Pete's Plumbing | We put a camera down the line and show you what's actually happening before recommending any work. | Sewer Camera Inspection in Westchester County, NY | `/drainage-service-westchester-ny` | Service, BreadcrumbList | 3 |
| `/sump-pump-installation-westchester-ny` | Sump Pump Installation in Westchester County, NY \| Pete's Plumbing | Sump pump installation and replacement for Westchester basements, sized for how much water you actually get. | Sump Pump Installation in Westchester County, NY | `/drainage-service-westchester-ny` | Service, BreadcrumbList, FAQPage | 1 |
| `/grease-trap-cleaning-westchester-ny` | Grease Trap Cleaning in Westchester County, NY \| Pete's Plumbing | Grease trap cleaning for Westchester restaurants and small commercial kitchens. | Grease Trap Cleaning in Westchester County, NY | `/drainage-service-westchester-ny` | Service, BreadcrumbList | 3 |

### Service pages — under remaining categories

| URL | Title tag | Meta description | H1 | Parent | Schema | Tier |
|---|---|---|---|---|---|---|
| `/septic-tank-service-westchester-ny` | Septic Tank Services in Westchester County, NY \| Pete's Plumbing | The plumbing side of septic tank problems for Westchester homes — backups, line issues, and diagnosis. | Septic Tank Services in Westchester County, NY | `/septic-system-service-westchester-ny` | Service, BreadcrumbList | 3 |
| `/gas-line-repair-westchester-ny` | Gas Line Repair in Westchester County, NY \| Pete's Plumbing | Gas line repair for Westchester homes and small businesses, done carefully and to code. | Gas Line Repair in Westchester County, NY | `/gasfitter-westchester-ny` | Service, BreadcrumbList | 3 |
| `/bathroom-plumbing-remodeling-westchester-ny` | Bathroom Plumbing Remodeling in Westchester County, NY \| Pete's Plumbing | Rough-in, relocation, and fixture plumbing for Westchester bathroom remodels. | Bathroom Plumbing Remodeling in Westchester County, NY | `/bathroom-remodeler-westchester-ny` | Service, BreadcrumbList | 3 |
| `/shower-installation-westchester-ny` | Shower Installation in Westchester County, NY \| Pete's Plumbing | Shower plumbing and installation for Westchester bathrooms, sealed and connected correctly. | Shower Installation in Westchester County, NY | `/bathroom-remodeler-westchester-ny` | Service, BreadcrumbList | 3 |
| `/bathtub-installation-westchester-ny` | Bathtub Installation in Westchester County, NY \| Pete's Plumbing | Bathtub installation and replacement plumbing for Westchester homes. | Bathtub Installation in Westchester County, NY | `/bathroom-remodeler-westchester-ny` | Service, BreadcrumbList | 3 |
| `/shower-valve-replacement-westchester-ny` | Shower Valve Replacement in Westchester County, NY \| Pete's Plumbing | Failing or leaking shower valves replaced in Westchester bathrooms with minimal tile disruption. | Shower Valve Replacement in Westchester County, NY | `/bathroom-remodeler-westchester-ny` | Service, BreadcrumbList | 3 |
| `/toilet-installation-westchester-ny` | Toilet Installation in Westchester County, NY \| Pete's Plumbing | New toilet installation for Westchester homes, set properly and sealed right. | Toilet Installation in Westchester County, NY | `/bathroom-remodeler-westchester-ny` | Service, BreadcrumbList | 3 |

## Page count

| Type | Count |
|---|---|
| Standard pages | 4 |
| Category pages | 5 |
| Service pages | 37 |
| **Total** | **46** |

## Nav and footer

**Header nav (fixed, no dropdowns):** Home · Services · About · Contact
**Header CTA:** phone — `+1 855-597-5391`

**Footer:**
- Main nav: Home, Services, About, Contact
- Priority pages: Emergency Plumbing Repair, Water Heater Installation, Drain
  Cleaning, Sump Pump Installation
- All 5 secondary category pages
- Contact: 1234 Main Street, Armonk, NY 10504 · +1 855-597-5391 ·
  derek@hexorasystems.com
- Service areas *(plain text, not links — no location pages in this build)*:
  Armonk, Pleasantville, Mount Kisco, Yonkers, Bedford, Scarsdale

Footer and nav labels are plain and functional — navigation, not anchor strategy,
and **not** governed by `anchor-ledger.md`.
