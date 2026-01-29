# tile_test

## AGSP準拠

本プロジェクトは **AI General Staff Protocol (AGSP) v2.4** に準拠して運用される。

### 指揮系統

| 役職 | 担当 |
|------|------|
| 幕僚長 | User |
| 参謀総長 | Gemini |
| 方面軍参謀長 | Cline |
| 師団長 | Claude Code |
| 情報参謀 | Claude Desktop |

### ドキュメント

- 仕様書: `docs/SPECIFICATION.md`
- 規律: `docs/RULES.md`
- 技能目録: `docs/AGSP_SKILLS_CATALOG.md`

## プロジェクト概要

**初期目標**: クオータービュー床面生成テスト

（第一回作戦会議後に詳細記載）

## 環境構築

```bash
python -m venv .venv
source .venv/bin/activate  # Windows: .venv\Scripts\activate
pip install -r requirements.txt
```

## ライセンス

MIT License

---

*Created by Blitz-Setup (電撃設営) - AGSP v2.4*
