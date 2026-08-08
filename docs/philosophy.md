# Philosophy

Why this system is built the way it is, as opposed to `decisions/decisions.md`,
which records what individual calls ruled out.

Migrated from the About page of `matthewlew.github.io`, where it sat as an
interview-style Q&A. It was written as personal positioning; most of it is
really argument about design systems, and it belongs with the system it
describes.

## Why an AI-ready design system matters now

In the age of coding agents, a system that lacks structured context sheets or
token guardrails does not slow the agent down — it speeds up the production of
slop. The agent will emit *something* for every prompt; without boundaries what
it emits is fragmented UI at high velocity.

An AI-ready design system is the prompt layer. Give a model strict layout
parameters, semantic tokens and component boundaries and it generates
production-aligned UI repeatably. Give it none and it generates inconsistency,
faster than a human could.

This is the argument behind two choices elsewhere in this repo: components emit
class names and carry no styles, and every conditional custom property stays
conditional rather than being hoisted to `:root`. Both keep the boundary
legible to something that cannot see the rendered page.

## Brand-to-product drift

Brand marketing and product design usually operate in separate rooms, and the
handoff between them is where accessibility quietly dies.

At DoorDash the team selected a new brand red that was technically inaccessible
against digital UI contrast standards. The fix was not to reject the brand
colour or to ship the inaccessible one: it was a digital-compliant version of
DoorDash red that held the visual identity and cleared the contrast floor. That
token is still in production.

The general form: a design system should not only enforce layout rules, it
should carry brand identity into product without either side losing. That is
why this system separates the brand core from what a theme declares in order to
diverge from it — the two have to be able to move independently.

## Iconography is the last frontier

A 1,000-icon library drawn by hand teaches one thing conclusively: manual
vector craftsmanship does not scale in a high-velocity organisation. Every new
icon is a small negotiation with every icon already drawn, and the negotiation
is conducted by eye.

`@lew-ds/open-icons` treats iconography as a parametric system instead — stroke
weight axes, optical sizing, corner radii defined as rules rather than as
outcomes. A new icon then matches by construction rather than by hand, and
generation tools can produce contextually aligned symbols on demand.

The sprite ships with no dependency on LDS for the same reason: an app should
be able to take the icons without taking on the design system.

## The 80/90 rule

Startups burn months custom-building a component library before they know their
own product patterns, and that is precisely where system debt comes from — the
library encodes guesses, and the guesses harden.

Take native, off-the-shelf primitives to cover 80–90% of the operational
surface on day one. Establish layout rules and semantic token boundaries first.
Spend the months you saved on the cases that are genuinely unusual, which is
where design judgment actually pays.

## Where this is going

The horizon is multi-modal, agentic systems where a traditional GUI may not be
the primary output at all. A design system that only feeds pixels to a screen
is solving the smaller half of the problem.

The useful version streamlines content and structural parameters so that human
users and agents stay in sync — one source of truth serving both human and
machine interaction. That is the direction the token model here is pointed,
and the reason the components are plain ESM with no build step: they have to
load in Node, in a bundler and under SSR unchanged.

## The workflow this system is built with

Also migrated from the About page. Four tools, in the order work moves through
them:

| | Tool | Role |
|---|---|---|
| 01 | **Figma MCP** | Design context exposed as a live protocol — agents read variables, components and structure straight from the file. The source of truth. |
| 02 | **Claude Code** | The reasoning layer. Turns token specs and intent into production components, docs and tests. |
| 03 | **Cursor / vibe coding** | Prototype, critique, refine in a tight loop. Design and build collapse into one motion. |
| 04 | **Style Dictionary** | One token definition compiled to every platform — CSS, iOS, Android, docs. Machine-readable by default. |
