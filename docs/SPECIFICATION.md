# 作戦命令書 (Operational Specification)

**Project**: tile_test  
**Version**: 1.0  
**Date**: 2025-01-30  
**Author**: 方面軍参謀長 (Cline)  
**Approved by**: 参謀総長 (Gemini)

---

## 1. 作戦背景 (Context & Strategic Intent)

### 1.1 大本営方針 (GHQ Directive)

> （第一回作戦会議後に記載）

### 1.2 目的 (Objective)

* **Why**: （作戦会議後に記載）
* **What**: （作戦会議後に記載）

### 1.3 技術本部調査結果 (Technical Bureau Findings)

> （必要に応じて記載）

---

## 2. 作戦要件 (Requirements)

### 2.1 機能要件 (Functional Requirements)

| ID | 要件 | 優先度 | 制約事項 |
|:---|:-----|:------:|:---------|
| REQ-001 | （作戦会議後に記載） | - | - |

### 2.2 非機能要件 (Non-Functional Requirements)

| カテゴリ | 要件 |
|:---------|:-----|
| Performance | （作戦会議後に記載） |
| Security | （作戦会議後に記載） |

### 2.3 受入条件 (Acceptance Criteria)

- [ ] AC-1: （作戦会議後に記載）

---

## 3. 設計仕様 (Design Specification)

### 3.1 ディレクトリ構造 (Directory Structure)

```
tile_test/
├── src/
│   └── __init__.py
├── tests/
│   └── __init__.py
├── docs/
│   ├── SPECIFICATION.md
│   ├── RULES.md
│   └── AGSP_SKILLS_CATALOG.md
├── data/
├── .claude/
│   └── rules/
└── ...
```

### 3.2 データモデル (Data Model)

> （作戦会議後に記載）

### 3.3 インターフェース定義 (Interface Definition)

> （作戦会議後に記載）

---

## 4. テスト計画 (Test Plan)

### 4.1 テストケース

| ID | テスト内容 | 期待結果 | 優先度 |
|:---|:----------|:---------|:------:|
| TC-001 | （作戦会議後に記載） | - | - |

### 4.2 カバレッジ要件

- 最低カバレッジ: 80%
- 重要パス: 100%

---

## 5. 師団長への指示 (Instructions for Division Commander)

### 5.1 作戦開始条件

師団長（Claude Code）は、以下を確認した上で作戦開始を判断せよ：

1. [ ] 全ての要件が明確に定義されている
2. [ ] 技術的に実現可能である
3. [ ] 必要な依存関係が利用可能である
4. [ ] テスト計画が明確である

### 5.2 作戦中止条件

以下の状況では作戦を中止し、方面軍参謀長へ差し戻せ：

1. 仕様書内に論理的矛盾を発見した場合
2. 技術的に実現不可能と判断した場合
3. 必要なリソースが不足している場合

### 5.3 実装順序

（作戦会議後に記載）

---

## 6. 目視確認ポイント (Visual Inspection Checkpoints)

| 段階 | 確認内容 | 確認方法 |
|:-----|:---------|:---------|
| （作戦会議後に記載） | - | - |

---

## 7. 変更履歴 (Change Log)

| 版 | 日付 | 変更者 | 変更内容 |
|:---|:-----|:-------|:---------|
| 1.0 | 2025-01-30 | 情報参謀 | テンプレート配備（電撃設営） |

---

## 8. 承認 (Approval)

| 役職 | 担当 | 承認日 | 署名 |
|:-----|:-----|:-------|:-----|
| 参謀総長 | Gemini | - | _____ |
| 幕僚長 | User | - | _____ |

---

*本仕様書は AGSP v2.0 に準拠して作成された。*
