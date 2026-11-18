# Sree Vardhan Reddy

Software engineer. I build product features end to end: React and TypeScript on the frontend, Go and Python services on the backend. Previously at [DevRev](https://devrev.ai), where I merged 168 pull requests across 10 repositories between January and November 2026.

**Open to full-time backend and full-stack software engineering roles, in India or remote.**

[Portfolio](https://sreevardhan-portfolio-mu.vercel.app) · [Resume](https://drive.google.com/file/d/12Bx3X4m747QFNTrk2zq8PwqXSHEK5yrS) · [LinkedIn](https://www.linkedin.com/in/sreevardhanreddy/) · [Email](mailto:itssreevardhan@gmail.com) · [LeetCode](https://leetcode.com/u/Vardhan1729/)

## Featured work

- **[ForgeDB](https://github.com/Sreevardhan1729/ForgeDB)** (C++17): a Redis-compatible in-memory database written from scratch. It speaks RESP2, so the standard `redis-cli` works against it. A single-threaded kqueue event loop serves many clients without locks, and data survives restarts through `fork()` copy-on-write snapshots and an append-only log. It also supports TTLs, lists, hashes, sets and Pub/Sub.
- **[AI Inference Gateway](https://github.com/Sreevardhan1729/ai-inference-gateway)** (Go): a reverse proxy for LLM APIs that uses only Go's standard library. It has smooth weighted round-robin with per-backend circuit breakers, per-key token-bucket rate limiting, a priority queue that sheds batch traffic first under load, SSE streaming and Prometheus metrics.
- **[Portfolio Lab](https://github.com/Sreevardhan1729/SreeVardhan-Portfolio)** (Next.js, WebAssembly): my [portfolio](https://sreevardhan-portfolio-mu.vercel.app) runs both projects above in the browser, ForgeDB compiled with Emscripten and the gateway compiled with TinyGo. You can type Redis commands, fail a backend and watch its breaker open, or burst an API key into 429s.
- **[Meerkat](https://github.com/devrev/meerkat)** (TypeScript, open source): 3 merged PRs to DevRev's SDK that turns Cube-style queries into DuckDB SQL: [join filters for links](https://github.com/devrev/meerkat/pull/293), [joins through aliased bridge tables](https://github.com/devrev/meerkat/pull/299) and [a dependency security fix](https://github.com/devrev/meerkat/pull/300).

## Experience

**Member of Technical Staff Intern, DevRev** · Jan – Nov 2026

Full-stack work on DevRev's dashboards and the data platform behind them.

- **Real-time export progress** across 6 repositories: a new server-streaming gRPC API, progress events relayed through Temporal, and a progress bar in the desktop app.
- **Per-table data freshness** in Go for the analytics query engine, tracking per-partition Kafka offsets so dashboards show when data was last refreshed.
- **Multi-tab dashboards** in React across 20 PRs, rolled out in 5 feature-flag stages from dev to production GA.
- **dev-instrument**, a build-time tracing loader built on rspack and the TypeScript compiler API. A companion Claude Code skill reads its traces, and it found the root cause of a crash that code review had missed.

**Software Engineer Intern, AlgoUniversity (YC S21)** · Jun – Aug 2025

- Unified scrapers with an auto-tagger that ingested about 2.5k coding problems from 100+ pages, and containerized services on AWS EC2.

**Research Intern, NIT Trichy** · Jun – Oct 2024

- Built a security analytics service whose alerts API reached 97% precision, and a Python ETL pipeline for 2M+ records.

## Stack

- **Languages:** Go, TypeScript, Python, C++, SQL
- **Backend and data:** Kafka, gRPC, Temporal, DuckDB, PostgreSQL, Redis, Django, FastAPI
- **Frontend:** React, Next.js, TanStack Query, Tailwind CSS
- **Infrastructure and testing:** Docker, AWS EC2, GitHub Actions, Prometheus, Playwright, Vitest, GoogleTest

## Competitive programming

[LeetCode](https://leetcode.com/u/Vardhan1729/) 2,077 (top 1.69%) · [CodeChef](https://www.codechef.com/users/sreevardhan26) 4★ (max 1,827) · [Codeforces](https://codeforces.com/profile/Vardhan1729) Specialist (max 1,545) · IICPC rank 565 of 47,000+

## Education

B.Tech in Computer Science and Engineering, IIIT Kottayam, 2026 · CGPA 9.36
