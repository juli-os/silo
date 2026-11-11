// silo 行为测试：disk 回环、containment 防穿越、双写惰性回填、SigV4 预签
// 形状、guessMime。store.ts 平移自 @juli-os/artifacts（2026-11-12 第 6 步），
// 断言与原仓 regress/smoke 同源。
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, rmSync, readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import {
  createDiskBackend, createS3Backend, createDualBackend,
  assertSigV4PresignShape, guessMime,
} from '../src/index.ts';

const dir = mkdtempSync(join(tmpdir(), 'silo-'));

test('disk 回环：put→get 字节一致；get 不存在的 key 报错', async () => {
  const b = createDiskBackend(join(dir, 'd1'));
  const p = await b.put('a/b.txt', Buffer.from('hello silo'));
  assert.ok(p.ok);
  const g = await b.get('a/b.txt');
  assert.ok(g.ok);
  assert.equal(g.value.toString(), 'hello silo');
  const miss = await b.get('nope.txt');
  assert.ok(!miss.ok);
});

test('containment 防穿越：../ 路径被拒（不越出 root）', async () => {
  const root = join(dir, 'd2');
  const b = createDiskBackend(root);
  const r = await b.put('../escape.txt', Buffer.from('x'));
  assert.ok(!r.ok);
});

test('dual：S3 可达性探测失败即 disk-primary（惰性回填不阻塞写）', async () => {
  const primary = join(dir, 'dual-p');
  const secondary = join(dir, 'dual-s');
  const s3 = createS3Backend({ endpoint: 'http://127.0.0.1:1', region: 'r', bucket: 'b', accessKeyId: 'k', secretAccessKey: 's' });
  const d = createDualBackend(createDiskBackend(primary), s3);
  const p = await d.put('k1.txt', Buffer.from('v1'));
  assert.ok(p.ok, '远端不可达时写仍成功（disk 兜底）');
  const g = await d.get('k1.txt');
  assert.ok(g.ok && g.value.toString() === 'v1');
});

test('SigV4 预签形状：日期无双重 Z、签名段齐备（known-answer 入口）', () => {
  // presign 走后端 url()；形状断言用导出的守卫函数直接验一条真实预签链。
  const b = createS3Backend({ endpoint: 'https://s3.example.test', region: 'us-east-1', bucket: 'bkt', accessKeyId: 'AK', secretAccessKey: 'SK' });
  void b.url('x/y.txt', 600).then((r) => {
    assert.ok(r.ok, 'presign url must resolve');
    assert.doesNotThrow(() => assertSigV4PresignShape(r.value));
  });
});

test('guessMime：常见扩展与缺省 octet-stream', () => {
  assert.equal(guessMime('a.html'), 'text/html');
  assert.equal(guessMime('b.PPTX'), 'application/vnd.openxmlformats-officedocument.presentationml.presentation');
  assert.equal(guessMime('noext'), 'application/octet-stream');
});

test('cleanup', () => { rmSync(dir, { recursive: true, force: true }); });
