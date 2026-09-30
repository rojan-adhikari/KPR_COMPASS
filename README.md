# KPR Compass

An independent, mobile-first campus guide for KPR Institute of Engineering and Technology, Coimbatore.

## Map and guidance

The starting dataset identifies 46 numbered places on [KPRIET's published campus layout](https://www.kpriet.ac.in/asset/frontend/pdf/general/campusmap_kpriet-1.pdf). The in-app image comes from that official PDF and is cached for weak connectivity. Google Maps is available as an arrival view and external link. Events are empty until staff publish real venue details.

Live guidance watches the visitor's device GPS while an outdoor route is active. The blue marker, accuracy value, on-route prompts and optional speech update as the person moves. A three-point alignment places the GPS fix on the published layout. Initial anchors use public geographic coordinates and are **approximate**. An administrator can capture and verify the three anchors outdoors. Route connectors trace visible roads and need on-site checking before dependable turn-by-turn use. GPS does not determine an indoor room or floor; printed QR checkpoints set those starting locations.

Measured distances, walking times, ramps, lifts, indoor rooms and accessible routes are only shown after staff survey and publish them. A closure removes the affected edge from routing. The app does not invent missing campus details.

## Visitor flow

Search places or published events, select a destination, choose the approach/gate/parking or scan a checkpoint, and start live outdoor guidance. Save events and share a route. The English/Tamil interface works without a visitor account. The service worker caches the campus layout and the last fetched data for limited connectivity.

Published events show their verified venue, start/end status when staff have set exact times, description and entry instructions. Staff can open event participation per event. Guests register with name, college/organization and email after consent, then receive a reference. The roster is private to authorized admins; they can edit participant details, mark check-in or cancellation, export CSV, and delete entries. Registration records are stored in D1 and never included in offline caches. Each email can register once per event. Delete the roster after the event when it is no longer needed.

Staff can upload a JPEG, PNG or WebP event poster up to 10 MB. The image is kept private until the associated event is published; it then appears in Events, Saved and the destination card. Removing or replacing a published poster deletes the superseded image after publication. The floor-map and two-sided college ID image limits are also 10 MB per image. Guest controls, navigation prompts and staff views have English and Tamil UI translations. Staff can supply Tamil event title, time, description and entry instructions; otherwise the entered source text is shown unchanged. Official building names remain recognizable on signs.

The **Scan QR** dialog reads a printed location checkpoint; its manually entered code is a mapped point ID, not a student ID or event badge number. Camera QR scanning uses ZXing because the browser-native `BarcodeDetector` is experimental. A visitor can separately open **Visitor ID check-in**, take or choose photos of the front and back of a college/event ID, enter a name, consent, and upload. The form excludes government IDs. JPEG, PNG and WebP are accepted up to 10 MB per side. Phone camera permission is needed only for live QR/barcode scanning; the file input offers a camera capture option on supported phones.

## Admin flow

Publishing requires both the signed-in site owner account listed in `ADMIN_EMAIL` and the admin portal credentials (`admin` plus the configured `ADMIN_PASSWORD`). This keeps the requested simple login from becoming a public write key. The server stores a short-lived signed, HttpOnly session cookie using `ADMIN_SESSION_SECRET`. Visitors cannot publish changes.

The portal edits events, venues, verified departments and cabins, map points, paths and closures, facilities and alerts; imports/exports JSON; uploads approved floor images; generates checkpoint QR images; and lets staff calibrate GPS anchors. Its visitor check-in desk uses ZXing for event badge QR/barcodes and also supports manual entry. Staff can view both submitted college ID photos, mark a submission reviewed, and delete the photos. The images are private R2 objects served only through the authorized admin API; the public API returns no list or image. Mutations have origin checks, MIME signature and size validation, a per-connection upload limit, and ID image requests are excluded from service-worker caching. Remove ID submissions when check-in ends. It publishes campus JSON and check-in metadata in D1. Set deployment variables from `.env.example` before running a separate installation.

## Data and routing

`app/data.ts` contains the schema, initial graph and Dijkstra route finder. It skips closed edges. Once accessibility has been surveyed and enabled, step-free mode also skips stair edges. `app/geo.ts` aligns outdoor GPS with the image, snaps to a route, checks phone accuracy, and chooses straight/left/right or arrival prompts. `app/live-guide.ts` watches location and speaks changes when enabled.

Before an event, survey every active path and entrance, calibrate anchors at the mapped points, measure distances, confirm ramps/lifts and QR placements, then publish current venues and alerts. The institute layout alone cannot verify these details.

## Search and admin access

Search indexes mapped places, common department abbreviations (including CS/CSE, ECE, EEE, BME and Mech), verified rooms, published events and facilities. Search results appear directly below the field on phones. The small building icon opens `/admin`, which asks for the portal credentials after the site owner signs in. The portal does not display an already-open session without a fresh login on that page.

The **Live GPS** control works before selecting a destination and follows outdoor position on the campus map. Select a mapped destination for route prompts. Browser location permission and an outdoor phone fix are required; the initial geographic alignment remains approximate until staff calibrate it on campus. Indoor room position still requires a posted QR checkpoint.

## Campus corrections and venue assignment

The student supplied the on-campus naming corrections: map points 06 and 07 are shown as S&H Block 1 and 2, and 17 as Biomedical Block. Ragam Hall is listed above the Central Library and Thanam Hall inside the Mechanical Block. Their exact floor numbers and room numbers are intentionally blank. A route to either hall ends at its parent building unless staff add surveyed indoor checkpoints and paths. These corrections are applied to the legacy bundled dataset while preserving staff-added events.

Admin staff can assign an event to a building or a verified room/hall. Search and the campus map show published events at their routed building; venue names and entry instructions appear in the event card. Staff may edit location names and search aliases, add or remove map points, rooms, events, facilities, paths and alerts, and publish updates. Points with dependent paths or content must have those links removed first.
