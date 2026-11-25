// One-Line Office Jokes — entry for u-markk-st-one-line-office-jokes-a51f2bcc.
// Anchor (drand, quoted before the first write):
// round 6671976, randomness
// 9e5142c13a4306cd240b463a4b7876d59b7ff5dfb1380ceab3f89642df7fc4f5,
// fetched 2026-11-25T07:05:24Z.
// Writes a single original one-line office joke to /output/entry.txt.
// Deterministic: no input, no network, no randomness — every run writes
// the exact same bytes.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";

// The joke itself: one line, 106 characters, no setup line, no punchline
// on a second line — the whole joke lives in this single sentence.
// Angle: the passive-aggressive "per my last email", escalated to a
// performance review that just says "brave". Neither sibling entry
// uses email — one is trust falls / Friday meetings, the other is the
// printer — so this is a fresh office detail with the punch on the
// final word.
const JOKE =
  "I put 'per my last email' in a message to my own manager, and now my performance review just says 'brave'.";

// The competition gate (RULES.txt): the entry must be UTF-8 text of
// 1 to 199 characters, a single line, and not only whitespace. Enforce
// it here so a bad entry fails loudly instead of shipping silently.
// Character count is what the gate measures, but the file is also
// checked in bytes: a multi-byte character could pass the char count
// while blowing the byte budget, so both are guarded.
function assertGate(line: string): void {
  if (line.length < 1 || line.length > 199) {
    throw new Error(`entry must be 1-199 chars, got ${line.length}`);
  }
  if (Buffer.byteLength(line, "utf8") > 199) {
    throw new Error(
      `entry must be at most 199 bytes, got ${Buffer.byteLength(line, "utf8")}`,
    );
  }
  if (/[\n\r]/.test(line)) {
    throw new Error("entry must be a single line");
  }
  if (line.trim().length === 0) {
    throw new Error("entry must not be only whitespace");
  }
}

assertGate(JOKE);

// Where the entry goes. The grader mounts /output; OUTPUT_PATH lets a
// local run point somewhere else without touching the entry text.
const outPath = process.env.OUTPUT_PATH ?? "/output/entry.txt";
mkdirSync(dirname(outPath), { recursive: true });
writeFileSync(outPath, JOKE, "utf8");
// Read-back check: the bytes on disk must be exactly the entry bytes.
// A silent partial write or encoding slip would otherwise ship a
// corrupted line; fail loudly instead of trusting the write.
const written = readFileSync(outPath, "utf8");
if (written !== JOKE) {
  throw new Error("read-back mismatch: entry.txt does not match the entry line");
}
console.log(`Wrote ${JOKE.length} chars to ${outPath}`);
