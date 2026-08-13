# 천일문 PFAL — PROJECT HANDOFF LATEST

- Repo: `kfcccpro/1001` / `main`
- Core: `0.9.3`; expansion: `0.9.3-batch6`
- Student PIN `8081`; Admin/Supervisor PIN `2007`
- Only student mode writes progress/review/session/active time. Supervisor stays read-only.

## Latest source audit
- U33: publisher Q01~Q03 verified; custom PFAL item replaced by source Q03 tasks → `source_aligned_batch_qa`.
- U34: publisher Q05~Q06 verified; custom `Without` item removed → `source_aligned_batch_qa`.
- U35: publisher Q01~Q03 verified; custom `not all` item removed → `source_aligned_batch_qa`.
- U36: publisher Q04~Q06 verified; source tasks now cover `be attributed to`, `be followed by`, `be preceded by` → `source_aligned_batch_qa`.
- U39: publisher Q01~Q04 verified; source tasks now cover `as well as`, `In addition`, `furthermore`, `as well` → `source_aligned_batch_qa`.
- U08 and U28 remain the only mixed units because additional exact publisher evidence was not sufficient for safe promotion.

## Batch workflow
- Group 2~3 work stages before one main checkpoint.
- Intermediate edits may be accumulated on a temporary branch so main is not redeployed after every micro-edit.
- Main is advanced once after the batch is complete.
- PWA cache: `chunilmun-pfal-t1-v093w`.

## Next priorities
1. U08/U28 final source decision: promote only with exact publisher source/answer evidence; otherwise retain mixed status.
2. PIN 2007 full-workbook visual sweep with screenshot/browser evidence.
3. Cloud diagnostic and multi-device round-trip QA.
4. Student-mode regression.
