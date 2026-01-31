# Capacity-Adaptive UI framework

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/vsm1996s-projects/v0-harmonia-ui)
[![Built with v0](https://img.shields.io/badge/Built%20with-v0.app-black?style=for-the-badge)](https://v0.app/chat/gi41jHWBCv4)

## Harmonia UI

Harmonia UI is a capacity-adaptive UI framework that allows interfaces to respond to a user’s current cognitive, temporal, and emotional capacity through explicit inputs. Instead of inferring or profiling users, Harmonia treats human state as a first-class field and derives coherent interface modes that affect layout, content density, motion, and choice load in a consistent, accessible way.

## Core Principles

Inputs over inference
Human state is provided explicitly (Phase 1), not guessed or extracted.

Capacity, not preference
The system adapts to what a user can handle, not what they “like.”

Field → Mode → Tokens → Components
Raw inputs are never mapped directly to styles. Inputs derive modes; modes produce tokens; components consume tokens.

Distributed, local adaptation
Components respond to shared context without relying on global god-state.

Accessibility as a constraint
Semantic structure, keyboard navigation, contrast, and motion preferences are never compromised by adaptation.

Identity is stable, expression adapts
Font families, semantics, and meaning remain fixed; density, spacing, motion, and emphasis change.

## Running Locally

``
  npm install
  npm run dev
``

Then open:
http://localhost:3000

## Intentionally Not Included

No biometric or wearable integrations

No emotional inference or profiling

No AI-driven prediction systems

No opinionated component library

No universal claims about “natural law” or harmony

## MIT License

Copyright (c) 2026 Vanessa Martin

This project introduces a capacity-adaptive interface framework 
based on explicit human-state inputs and distributed UI adaptation.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
