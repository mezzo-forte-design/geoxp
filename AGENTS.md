# AGENTS.md — GeoXp

> **Single source of truth** for AI agents and humans working in this repo.
> GeoXp maps media contents to geographic locations and emits playback events based on
> configurable rules.
>
> Last verified against the codebase: 2026-08-14 (branch `main`, `v1.2.2`).

---

## 1. What GeoXp is

A **cross-platform, cross-environment JS library that automates a multimedia geolocated tour**.
Given a configuration of *patterns* (sets of *spots*, optionally ordered) and a stream of
geolocation updates, it decides **what should play, when, and in which order**, and emits
events accordingly.

It is deliberately **not** a player: the core knows nothing about audio, video, or the DOM.
Playback is the job of plugins — or of your own code listening to core events.

Apache-2.0, published on npm as `@geoxp/*`, developed on GitHub
(`mezzo-forte-design/geoxp`).

> ⚠️ **Assume consumers are already in the field.** The packages are used by browser apps and
> by React Native apps that ship through the stores and run **fully offline**. A published
> behaviour change reaches installed builds that may be months old and cannot be hotfixed
> while someone is out walking a tour.

## 2. Repo layout

```
geoxp/
├── packages/
│   ├── core/              @geoxp/core             — the engine (738-line class + utils)
│   ├── utils/             @geoxp/utils            — shared helpers/types, zero deps
│   ├── web/               @geoxp/web              — browser wrapper: core + the 3 web plugins
│   ├── web-audio/         @geoxp/web-audio        — playback via howler.js
│   ├── web-geolocation/   @geoxp/web-geolocation  — navigator.geolocation wrapper
│   ├── web-storage/       @geoxp/web-storage      — visited-spots persistence (cookies)
│   └── eslint-config/     @geoxp/eslint-config    — shared lint config (private)
├── examples/              node · web · web-typescript · guides (runnable samples)
├── docs/                  generated typedoc output (do not hand-edit)
├── CHANGELOG.md           hand-written, Keep a Changelog format
└── lerna.json             single version for all packages (currently 1.2.2)
```

Yarn workspaces + **Lerna** (with Nx caching). All packages ship **ESM + CJS + types**
(rollup); `@geoxp/web` also ships a minified browser bundle.

Native platforms (React Native and similar) are expected to pair `@geoxp/core` with their own
audio / geolocation / storage plugins — **only the web plugins live here**.

## 3. Stack & commands

| Layer | Choice |
|---|---|
| Language | TypeScript 5 (`tsc --emitDeclarationOnly` for typecheck) |
| Build | Rollup per package (`dist/esm`, `dist/cjs`, `.d.ts`) |
| Tests | **Vitest** |
| Lint / format | ESLint 9 (flat config) + Prettier |
| Commits | **Conventional Commits**, enforced by commitlint + husky |
| Versioning | Lerna, single shared version, Semantic Versioning |
| Docs | TypeDoc → published at `geoxp.mezzoforte.design` (Netlify) |

```bash
yarn                    # install (workspaces)
yarn build              # build every package (lerna run build)
yarn dev                # watch + rebuild changed packages
yarn dev:example-web    # watch + run the web example app
yarn test               # vitest, all packages
yarn typecheck          # tsc across packages
yarn lint / lint:test   # fix / check
yarn prettify           # format
yarn docs               # build + typecheck + typedoc

yarn prepare:commit     # typecheck + prettify + lint — run before committing
yarn prepare:release    # prepare:commit + test + build
yarn new:version        # lerna version (bumps every public package)
yarn new:release        # prepare:release + lerna publish
```

## 4. Architecture

```
   geolocation source              GeoXpCore                    playback
  ┌───────────────────┐      ┌───────────────────────┐    ┌──────────────────┐
  │ web-geolocation   │─────▶│ patterns + spots      │───▶│ web-audio        │
  │ (or your own      │ loc  │ radius / deadband     │evt │ (or your own     │
  │  platform plugin) │      │ ordering rules        │    │  platform plugin)│
  └───────────────────┘      │ visited bookkeeping   │    └──────────────────┘
                             └──────────┬────────────┘
                                        │ last / complete
                                        ▼
                              ┌───────────────────────┐
                              │ web-storage (cookies) │
                              └───────────────────────┘
```

- **`GeoXpCore`** holds a `Map` of patterns. You feed it locations (`geolocationUpdate()`);
  it emits spot lifecycle events. It **never touches media**.
- **Plugins attach to a core instance** (they take it in their constructor) and either feed it
  (geolocation) or react to it (audio, storage).
- **`GeoXpWeb`** is a convenience wrapper that instantiates core + the three web plugins and
  re-exports a merged event surface, exposing them as `.core`, `.audio`, `.geolocation`,
  `.storage`.
- **Storage is cookie-based** in `web-storage`, and hooks the core's `last` / `complete` events
  to clear visited state (`deleteOnLastSpot`, `deleteOnCompletion`).

### Configuration model

```ts
GeoXpCoreConfig {
  patterns: [{ id, label?, disabled?, replay?, spots: GeoXpSpot[] }]
  options?: { defaultRadius, defaultDeadband, defaultFetch, accuracy, visitedFilter }
}

GeoXpSpot { id, label?, position?, after?, notAfter?, last? }
GeoXpSpotPosition { lat, lon, radius?, deadband?, fetch? }
```

Defaults (`packages/core/src/constants.ts`): radius **20 m**, deadband **10 m**, fetch **×1**,
accuracy **25 m**, visited filter **5000 ms**, force accuracy **100 m**.

- `after` / `notAfter` express ordering constraints between spots; `last` marks the end of a
  pattern (drives the `last` event).
- **`position` is optional** — a spot without a position can only be activated manually
  (`forceSpot`), which is how short-code / NFC / QR triggering is built on top of the library.
- Config is deep-cloned and sanitised on load (`sanitiseConfig`); missing values are filled
  from the defaults above.

### Key core methods

`run()` · `pause()` · `running` · `reload(config)` · `enablePattern(id)` / `disablePattern(id)` ·
`geolocationUpdate(location)` · `getSpot(ref)` · `getVisitedSpots(patternId?)` ·
`replaySpot(ref)` · `canForceSpot(ref)` / `forceSpot(ref)` / `stopForcedSpot()` ·
`spotActivated(ref)` / `spotDeactivated(ref)` · `on` / `once` / `off`.

`forceSpot()` is gated by accuracy: it refuses when the last known fix is worse than
`FORCE_ACCURACY` (100 m). `canForceSpot()` returns the reason it would refuse.

## 5. Events

Typed in `src/types/module.ts` of each package. **Verified against the code, 2026-08-14.**

| Package | Event | Payload |
|---|---|---|
| `@geoxp/core` | `incoming` | `GeoXpSpot` — entering the prefetch radius |
| | `active` | `GeoXpSpot` — spot activated |
| | `inactive` | `GeoXpSpot` — spot deactivated |
| | `visited` | `GeoXpSpot` — spot marked visited (after `visitedFilter`) |
| | `last` | `patternId` — the spot flagged `last` was reached |
| | `complete` | `patternId` — every spot in the pattern was visited |
| `@geoxp/web-audio` | `ready` · `playing` · `stopped` · `ended` | `GeoXpWebAudioSound` |
| `@geoxp/web-geolocation` | `location` | `GeoXpGeolocation` |
| `@geoxp/web` | union of the three above | — |

Note that `last` and `complete` carry a **pattern id**, not a spot — unlike every other core
event.

> ⚠️ **Renaming or removing an event is a breaking change**, and it fails **silently**: a
> listener registered on a name that no longer exists throws nothing, it just never fires.
> Deprecate, ship both names for a release, then remove.

## 6. Release workflow

1. Branch off `main` (`feat/`, `fix/`, `chore/`, `docs/`), Conventional Commits (commitlint
   runs on commit via husky).
2. Open a PR on GitHub (template in `.github/`).
3. `yarn prepare:release` — typecheck, format, lint, test, build.
4. `yarn new:version` → Lerna bumps **all** public packages to the same version and tags.
5. **Update `CHANGELOG.md` by hand** — it is not generated. Group entries by
   `➕ Added` / `🪛 Changed` / `🩹 Fixed` / `➖ Removed`, and prefix with the package
   (`[core]`, `[web-audio]`).
6. `yarn new:release` publishes to npm.

Downstream apps upgrade on their own schedule — nothing here bumps them.

## 7. Gotchas

1. **There is no CI.** `.github/` holds only issue and PR templates — no workflows. Nothing
   runs tests or lint on a PR; `yarn prepare:commit` and the husky hooks are the only gate.
   Don't assume a green PR means anything was checked.

2. **Test coverage is one file.** `packages/core/__tests__/base.test.ts` is the only test in
   the repo. The plugins and the web wrapper are untested. Treat any change outside core as
   manually-verified-only, and prefer adding a test to arguing about it.

3. **Single version across packages.** Lerna bumps everything together, so `@geoxp/web-audio`
   gets a new version even when only core changed. Version numbers do **not** tell you which
   package actually changed — the changelog does.

4. **`GeoXpCore.sum(a, b)`** is scaffolding left in the public class (it logs ASCII art of a
   calculator). Marked `@hidden` for typedoc, but it is still a public method on a published
   API. Don't build on it; removing it is a breaking change on paper.

5. **`docs/` is generated.** Regenerate with `yarn docs`; never hand-edit.

6. **Several unmerged feature branches** exist on the remote (`feat/spots-without-position`,
   `feat/optional-autoplay`, `chore/docs`, …). Check them before starting work that might
   already be in flight.

7. **Trigger bugs surface where you cannot debug them** — outdoors, offline, mid-tour, with no
   console. Behaviour changes deserve a paranoid review, and it is worth asking whether configs
   generated under the *old* assumptions still behave once cached on a device.

## 8. Where to go next

- Per-package usage docs → each `packages/*/README.md`; generated API docs → `yarn docs`
  or [geoxp.mezzoforte.design](https://geoxp.mezzoforte.design/).
- Runnable samples → `examples/` (`node`, `web`, `web-typescript`, plus `guides/` snippets
  on patterns, ordering and audio interaction).
- History of behaviour changes → `CHANGELOG.md`.
