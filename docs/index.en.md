<!-- 手写翻译：本页是 README（即 docs/index.md）的英文手写翻译，不参与 docs:gen 生成；README 变更时需人工同步更新本页。 -->

# @juli-os/silo

juli-os infrastructure: a byte-storage foundation (zero npm dependencies).

silo ships general-purpose capability only: disk / S3 / dual-write backends, fetching bytes by key, S3 presigned links (hand-signed SigV4 + OSS V1), and MIME inferred from the file name. It carries no juli business concepts (registration ownership and the ledger live in [@juli-os/artifacts](https://github.com/juli-os/artifacts), which depends on this package internally and re-exports it outward without changing the interface).

## Why it exists

Storage is pure capability; registration is business. After the split (step 6 of the 2026-11-12 architecture adjustment):

- Anyone can use silo (people who only want to store bytes do not have to drag in registration semantics);
- artifacts focuses on registration ownership (ArtifactLedger / sweepCaseInbox / parseEnvelope).

## Usage

```ts
import { createDiskBackend, createS3Backend, createDualBackend, guessMime } from '@juli-os/silo';

const disk = createDiskBackend('/data/store');          // local disk (path traversal guarded)
const s3 = createS3Backend({ endpoint, region, bucket, accessKeyId, secretAccessKey });
const dual = createDualBackend(disk, s3);               // disk as the floor, remote best-effort

await dual.put('a/b.txt', Buffer.from('hello'));
const got = await dual.get('a/b.txt');                  // Result<Buffer>
const url = await s3.url('a/b.txt', 3600);              // presigned link (Result<string>)
```

Backends return `Result` — errors are values, not exceptions. Callers at the port boundary decide how to degrade.

## CLI

```
silo put --backend=disk --root=DIR --key=a/b.txt --data=hello   # store (round trip)
silo get --backend=disk --root=DIR --key=a/b.txt                # fetch (round trip)
silo sign --endpoint=URL --key-id=AK --secret=SK --bucket=B --key=K  # S3 signing link
```

One command, one action. Every command calls the package's own exported functions.

## Docs

This repo's docs are generated passively: `npm run docs:gen` (README mirror + architecture diagram + typedoc API). CI checks that the generated output does not drift.

License: Apache-2.0
