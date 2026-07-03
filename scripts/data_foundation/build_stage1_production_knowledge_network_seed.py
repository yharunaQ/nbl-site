#!/usr/bin/env python3
from __future__ import annotations

import json
import re
from pathlib import Path
from typing import Any


ROOT = Path(__file__).resolve().parents[2]
RUN_DIR = ROOT / "references/derived/scima-fchma/stage1-production-v0-2026-05-18"
REVIEW_UNITS_MD = RUN_DIR / "stage1-production-minimum-review-units-v0-2026-05-18.md"
RELATION_JSON = RUN_DIR / "stage1-production-deep-relation-map-v0-2026-05-18.json"
BRIDGE_JSON = RUN_DIR / "stage1-production-fragmentary-source-branch-bridge-v0-2026-05-18.json"
RELATION_CARDS_MD = RUN_DIR / "stage1-production-structural-relation-review-cards-v0-2026-05-18.md"
RELATION_CARDS_JSON = RUN_DIR / "stage1-production-structural-relation-review-cards-v0-2026-05-18.json"
C01_DEEP_MD = RUN_DIR / "stage1-production-c01-health-time-deep-reading-v0-2026-05-18.md"
C01_DEEP_JSON = RUN_DIR / "stage1-production-c01-health-time-deep-reading-v0-2026-05-18.json"
C02_DEEP_MD = RUN_DIR / "stage1-production-c02-translation-deep-reading-v0-2026-05-18.md"
C02_DEEP_JSON = RUN_DIR / "stage1-production-c02-translation-deep-reading-v0-2026-05-18.json"
C03_DEEP_MD = RUN_DIR / "stage1-production-c03-support-continuity-deep-reading-v0-2026-05-18.md"
C03_DEEP_JSON = RUN_DIR / "stage1-production-c03-support-continuity-deep-reading-v0-2026-05-18.json"
C04_DEEP_MD = RUN_DIR / "stage1-production-c04-information-participation-deep-reading-v0-2026-05-18.md"
C04_DEEP_JSON = RUN_DIR / "stage1-production-c04-information-participation-deep-reading-v0-2026-05-18.json"
C05_3_PURE_MD = RUN_DIR / "stage1-production-c05-3-pure-deep-reading-v0-2026-05-18.md"
C05_3_PURE_JSON = RUN_DIR / "stage1-production-c05-3-pure-deep-reading-v0-2026-05-18.json"
C06_DEEP_MD = RUN_DIR / "stage1-production-c06-life-security-deep-reading-v0-2026-05-18.md"
C06_DEEP_JSON = RUN_DIR / "stage1-production-c06-life-security-deep-reading-v0-2026-05-18.json"
C07_C08_DEEP_MD = RUN_DIR / "stage1-production-c07-c08-participation-deep-reading-v0-2026-05-18.md"
C07_C08_DEEP_JSON = RUN_DIR / "stage1-production-c07-c08-participation-deep-reading-v0-2026-05-18.json"
C04_DIRECT_ATTACK_MD = RUN_DIR / "stage1-production-c04-direct-information-participation-attack-v0-2026-05-18.md"
C04_DIRECT_ATTACK_JSON = RUN_DIR / "stage1-production-c04-direct-information-participation-attack-v0-2026-05-18.json"
C07_QUALITY_ATTACK_MD = RUN_DIR / "stage1-production-c07-quality-participation-attack-v0-2026-05-18.md"
C07_QUALITY_ATTACK_JSON = RUN_DIR / "stage1-production-c07-quality-participation-attack-v0-2026-05-18.json"
C08_PREWORK_ATTACK_MD = RUN_DIR / "stage1-production-c08-prework-participation-attack-v0-2026-05-18.md"
C08_PREWORK_ATTACK_JSON = RUN_DIR / "stage1-production-c08-prework-participation-attack-v0-2026-05-18.json"
C01_HEALTH_TIME_ATTACK_MD = RUN_DIR / "stage1-production-c01-health-time-attack-v0-2026-05-18.md"
C01_HEALTH_TIME_ATTACK_JSON = RUN_DIR / "stage1-production-c01-health-time-attack-v0-2026-05-18.json"
C06_LIFE_SECURITY_ATTACK_MD = RUN_DIR / "stage1-production-c06-life-security-attack-v0-2026-05-18.md"
C06_LIFE_SECURITY_ATTACK_JSON = RUN_DIR / "stage1-production-c06-life-security-attack-v0-2026-05-18.json"
C05_WORKSITE_ATTACK_MD = RUN_DIR / "stage1-production-c05-worksite-mobility-attack-v0-2026-05-18.md"
C05_WORKSITE_ATTACK_JSON = RUN_DIR / "stage1-production-c05-worksite-mobility-attack-v0-2026-05-18.json"
C02_DISCLOSURE_ATTACK_MD = RUN_DIR / "stage1-production-c02-disclosure-translation-attack-v0-2026-05-18.md"
C02_DISCLOSURE_ATTACK_JSON = RUN_DIR / "stage1-production-c02-disclosure-translation-attack-v0-2026-05-18.json"
C03_SUPPORT_ATTACK_MD = RUN_DIR / "stage1-production-c03-support-mediation-attack-v0-2026-05-18.md"
C03_SUPPORT_ATTACK_JSON = RUN_DIR / "stage1-production-c03-support-mediation-attack-v0-2026-05-18.json"
STRUCTURAL_FREEDOM_MAP_MD = RUN_DIR / "stage1-production-structural-freedom-working-map-v0-2026-05-18.md"
STRUCTURAL_FREEDOM_MAP_JSON = RUN_DIR / "stage1-production-structural-freedom-working-map-v0-2026-05-18.json"
STRUCTURAL_POLARITY_STRESS_MD = RUN_DIR / "stage1-production-structural-polarity-stress-test-v0-2026-05-18.md"
STRUCTURAL_POLARITY_STRESS_JSON = RUN_DIR / "stage1-production-structural-polarity-stress-test-v0-2026-05-18.json"
RECORD_STRUCTURE_INDEX_MD = RUN_DIR / "stage1-production-record-structure-index-v0-2026-05-18.md"
RECORD_STRUCTURE_INDEX_JSON = RUN_DIR / "stage1-production-record-structure-index-v0-2026-05-18.json"
FRAGMENTARY_STRUCTURAL_INTEGRATION_MD = RUN_DIR / "stage1-production-fragmentary-source-structural-integration-map-v0-2026-05-18.md"
FRAGMENTARY_STRUCTURAL_INTEGRATION_JSON = RUN_DIR / "stage1-production-fragmentary-source-structural-integration-map-v0-2026-05-18.json"
CODEX_QUERY_INDEX_MD = RUN_DIR / "stage1-production-codex-query-index-v0-2026-05-18.md"
CODEX_QUERY_INDEX_JSON = RUN_DIR / "stage1-production-codex-query-index-v0-2026-05-18.json"
CODEX_CHAT_KNOWLEDGE_NETWORK_MD = RUN_DIR / "stage1-production-codex-chat-knowledge-network-v0-2026-05-18.md"
CODEX_CHAT_KNOWLEDGE_NETWORK_JSON = RUN_DIR / "stage1-production-codex-chat-knowledge-network-v0-2026-05-18.json"
FRAGMENTARY_LLM_THIN_AXIS_BATCH1_MD = RUN_DIR / "stage1-production-fragmentary-llm-context-reading-batch1-thin-axis-v0-2026-05-18.md"
FRAGMENTARY_LLM_NIVR_LIFE_COURSE_BATCH2_MD = RUN_DIR / "stage1-production-fragmentary-llm-context-reading-batch2-nivr-life-course-quality-v0-2026-05-18.md"
C06_C07_C08_RECOMPRESSED_MD = RUN_DIR / "stage1-production-c06-c07-c08-recompressed-propositions-v0-2026-05-18.md"
RCP_RECORD_LATTICE_MD = RUN_DIR / "stage1-production-rcp-record-structure-lattice-v0-2026-05-18.md"
RCP_RECORD_LATTICE_JSON = RUN_DIR / "stage1-production-rcp-record-structure-lattice-v0-2026-05-18.json"
STRUCTURE_RESOLUTION_FINDINGS_MD = RUN_DIR / "stage1-production-structure-resolution-findings-v0-2026-05-18.md"
BUNDLE_A_PARTICIPATION_QUALITY_MD = RUN_DIR / "stage1-production-bundle-a-participation-quality-context-reading-v0-2026-05-18.md"
BUNDLE_B_ENTRY_ORDER_LIFE_SECURITY_MD = RUN_DIR / "stage1-production-bundle-b-entry-order-life-security-context-reading-v0-2026-05-18.md"
BUNDLE_C_HEALTH_TIME_LIFE_SECURITY_MD = RUN_DIR / "stage1-production-bundle-c-health-time-life-security-context-reading-v0-2026-05-18.md"
BUNDLE_D_DIVERSITY_CONDITIONED_STRUCTURE_MD = RUN_DIR / "stage1-production-bundle-d-diversity-conditioned-structure-context-reading-v0-2026-05-18.md"
BUNDLE_E_INFO_WORKSITE_DISCLOSURE_MD = RUN_DIR / "stage1-production-bundle-e-info-worksite-disclosure-polarity-context-reading-v0-2026-05-18.md"
RCP_STRUCTURAL_RENAMING_MD = RUN_DIR / "stage1-production-rcp-structural-renaming-v0-2026-05-18.md"
RECORD_STRUCTURAL_STATE_INDEX_MD = RUN_DIR / "stage1-production-record-structural-state-index-v0-2026-05-18.md"
RECORD_STRUCTURAL_STATE_INDEX_JSON = RUN_DIR / "stage1-production-record-structural-state-index-v0-2026-05-18.json"
STRUCTURAL_FAMILY_SCALE_RULES_MD = RUN_DIR / "stage1-production-structural-family-scale-rules-v0-2026-05-18.md"
STRUCTURAL_FAMILY_SCALE_RULES_JSON = RUN_DIR / "stage1-production-structural-family-scale-rules-v0-2026-05-18.json"
STRUCTURAL_FAMILY_PROPOSITION_CATALOG_MD = RUN_DIR / "stage1-production-structural-family-proposition-catalog-v0-2026-05-18.md"
STRUCTURAL_FAMILY_PROPOSITION_CATALOG_JSON = RUN_DIR / "stage1-production-structural-family-proposition-catalog-v0-2026-05-18.json"
STRUCTURAL_FAMILY_REVIEW_CARDS_MD = RUN_DIR / "stage1-production-structural-family-review-cards-v0-2026-05-18.md"
STRUCTURAL_FAMILY_REVIEW_CARDS_JSON = RUN_DIR / "stage1-production-structural-family-review-cards-v0-2026-05-18.json"
RECORD_FAMILY_ASSIGNMENT_INDEX_MD = RUN_DIR / "stage1-production-record-family-assignment-index-v0-2026-05-18.md"
RECORD_FAMILY_ASSIGNMENT_INDEX_JSON = RUN_DIR / "stage1-production-record-family-assignment-index-v0-2026-05-18.json"
STRUCTURAL_FAMILY_OVERLAP_MAP_MD = RUN_DIR / "stage1-production-structural-family-overlap-map-v0-2026-05-18.md"
STRUCTURAL_FAMILY_OVERLAP_MAP_JSON = RUN_DIR / "stage1-production-structural-family-overlap-map-v0-2026-05-18.json"
STRUCTURAL_OVERLAP_DISCOVERY_CANDIDATES_MD = RUN_DIR / "stage1-production-structural-overlap-discovery-candidates-v0-2026-05-18.md"
STRUCTURAL_OVERLAP_DISCOVERY_CANDIDATES_JSON = RUN_DIR / "stage1-production-structural-overlap-discovery-candidates-v0-2026-05-18.json"
STRUCTURAL_OVERLAP_DEEP_CONTEXT_READING_MD = RUN_DIR / "stage1-production-structural-overlap-deep-context-reading-v0-2026-05-18.md"
STRUCTURAL_OVERLAP_DEEP_CONTEXT_READING_JSON = RUN_DIR / "stage1-production-structural-overlap-deep-context-reading-v0-2026-05-18.json"
OVERLAP_DISCOVERY_RECORD_INDEX_MD = RUN_DIR / "stage1-production-overlap-discovery-record-index-v0-2026-05-18.md"
OVERLAP_DISCOVERY_RECORD_INDEX_JSON = RUN_DIR / "stage1-production-overlap-discovery-record-index-v0-2026-05-18.json"
OVERLAP_DISCOVERY_COOCCURRENCE_MAP_MD = RUN_DIR / "stage1-production-overlap-discovery-cooccurrence-map-v0-2026-05-18.md"
OVERLAP_DISCOVERY_COOCCURRENCE_MAP_JSON = RUN_DIR / "stage1-production-overlap-discovery-cooccurrence-map-v0-2026-05-18.json"
STRUCTURAL_DISCOVERY_GRAMMAR_MD = RUN_DIR / "stage1-production-structural-discovery-grammar-v0-2026-05-18.md"
STRUCTURAL_DISCOVERY_GRAMMAR_JSON = RUN_DIR / "stage1-production-structural-discovery-grammar-v0-2026-05-18.json"
FRAGMENTARY_SOURCE_GRAMMAR_SLOTS_MD = RUN_DIR / "stage1-production-fragmentary-source-grammar-slots-v0-2026-05-18.md"
FRAGMENTARY_SOURCE_GRAMMAR_SLOTS_JSON = RUN_DIR / "stage1-production-fragmentary-source-grammar-slots-v0-2026-05-18.json"
OPERATOR_SLOT_INDEX_MD = RUN_DIR / "stage1-production-operator-slot-index-v0-2026-05-18.md"
OPERATOR_SLOT_INDEX_JSON = RUN_DIR / "stage1-production-operator-slot-index-v0-2026-05-18.json"
CONTEXT_BRANCH_CARD_CANDIDATES_MD = RUN_DIR / "stage1-production-context-branch-card-candidates-v0-2026-05-18.md"
CONTEXT_BRANCH_CARD_CANDIDATES_JSON = RUN_DIR / "stage1-production-context-branch-card-candidates-v0-2026-05-18.json"
INFO_WORKSITE_DISCLOSURE_REWRITTEN_MD = RUN_DIR / "stage1-production-info-worksite-disclosure-rewritten-propositions-v0-2026-05-18.md"
INFO_WORKSITE_DISCLOSURE_REWRITTEN_JSON = RUN_DIR / "stage1-production-info-worksite-disclosure-rewritten-propositions-v0-2026-05-18.json"
STRUCTURE_HOLE_ATTACK_MD = RUN_DIR / "stage1-production-structure-hole-attack-map-v0-2026-05-18.md"
STRUCTURE_HOLE_ATTACK_JSON = RUN_DIR / "stage1-production-structure-hole-attack-map-v0-2026-05-18.json"
FIRST_PRINCIPLE_DISCOVERY_MD = RUN_DIR / "stage1-production-first-principle-discovery-candidates-v0-2026-05-18.md"
OUT_JSON = RUN_DIR / "stage1-production-knowledge-network-seed-v0-2026-05-18.json"
OUT_MD = RUN_DIR / "stage1-production-knowledge-network-seed-v0-2026-05-18.md"


def parse_review_units() -> list[dict[str, Any]]:
    rows: list[dict[str, Any]] = []
    for line in REVIEW_UNITS_MD.read_text(encoding="utf-8").splitlines():
        if not line.startswith("| `RU-"):
            continue
        cells = [cell.strip() for cell in line.strip().strip("|").split("|")]
        if len(cells) != 6:
            continue
        unit_label, status, proposition, key_ids, counter_risk, next_action = cells
        unit_match = re.match(r"`([^`]+)`\s*(.*)", unit_label)
        if not unit_match:
            continue
        rows.append(
            {
                "unit_id": unit_match.group(1),
                "title": unit_match.group(2).strip(),
                "status": status,
                "candidate_proposition": proposition,
                "representative_ids": re.findall(r"`([^`]+)`", key_ids),
                "counter_risk": counter_risk,
                "next_action": next_action,
                "review_status": "not_reviewed",
                "promotion_status": "no_promotion",
            }
        )
    return rows


def load_json(path: Path) -> dict[str, Any]:
    return json.loads(path.read_text(encoding="utf-8"))


def deep_subbranch_summary() -> dict[str, Any]:
    artifact_paths = {
        "C01-health-time": C01_DEEP_JSON,
        "C02-translation": C02_DEEP_JSON,
        "C03-support-continuity": C03_DEEP_JSON,
        "C04-information-participation": C04_DEEP_JSON,
        "C05-3-pure": C05_3_PURE_JSON,
        "C06-life-security": C06_DEEP_JSON,
        "C07-C08-participation": C07_C08_DEEP_JSON,
    }
    by_artifact: dict[str, dict[str, Any]] = {}
    total = 0
    for artifact_id, path in artifact_paths.items():
        if not path.exists():
            by_artifact[artifact_id] = {"count": 0, "ids": []}
            continue
        payload = load_json(path)
        branches = []
        if "subbranches" in payload:
            branches.extend(payload["subbranches"])
        if "c07_subbranches" in payload:
            branches.extend(payload["c07_subbranches"])
        if "c08_subbranches" in payload:
            branches.extend(payload["c08_subbranches"])
        ids = [branch["subbranch_id"] for branch in branches]
        by_artifact[artifact_id] = {"count": len(ids), "ids": ids}
        total += len(ids)
    return {"total": total, "by_artifact": by_artifact}


def build_seed() -> dict[str, Any]:
    review_units = parse_review_units()
    relation_map = load_json(RELATION_JSON)
    bridge = load_json(BRIDGE_JSON)
    fragmentary_integration = load_json(FRAGMENTARY_STRUCTURAL_INTEGRATION_JSON)
    codex_query_index = load_json(CODEX_QUERY_INDEX_JSON)
    codex_chat_knowledge_network = load_json(CODEX_CHAT_KNOWLEDGE_NETWORK_JSON)
    structural_freedom_map = load_json(STRUCTURAL_FREEDOM_MAP_JSON)
    deep_summary = deep_subbranch_summary()
    return {
        "run_id": "stage1-production-v0-2026-05-18",
        "status": "machine_generated_unreviewed_no_promotion",
        "review_status": "not_reviewed",
        "promotion_status": "no_promotion",
        "runtime_status": "not_approved",
        "public_status": "not_public",
        "raw_or_redacted_text_included": False,
        "seed_purpose": "CodexでSCIMA/FCHMA分析・批判・追加探索に使うための未レビュー構造ネットワークseed。最終知識ではない。",
        "review_unit_count": len(review_units),
        "deep_subbranch_count": deep_summary["total"],
        "deep_subbranches_by_artifact": deep_summary["by_artifact"],
        "relation_count": len(relation_map["relations"]),
        "fragmentary_source_link_count": bridge["fragmentary_source_link_count"],
        "fragmentary_source_family_counts": bridge["source_family_counts"],
        "relation_review_cards": {
            "markdown": str(RELATION_CARDS_MD.relative_to(ROOT)),
            "json": str(RELATION_CARDS_JSON.relative_to(ROOT)),
            "use": "Relation-level reviewable cards for structural freedom reading; unreviewed and not promoted.",
        },
        "deep_reading_artifacts": [
            {
                "id": "C01-health-time-deep-reading",
                "markdown": str(C01_DEEP_MD.relative_to(ROOT)),
                "json": str(C01_DEEP_JSON.relative_to(ROOT)),
                "use": "C01を医学的制約ではなく、健康時間・体調変動・治療継続が仕事設計へどう接続されるかとして読むための深読解。",
            },
            {
                "id": "C02-translation-deep-reading",
                "markdown": str(C02_DEEP_MD.relative_to(ROOT)),
                "json": str(C02_DEEP_JSON.relative_to(ROOT)),
                "use": "C02を本人説明問題ではなく、本人条件と求人・職務条件の相互翻訳構造として読むための深読解。",
            },
            {
                "id": "C03-support-continuity-deep-reading",
                "markdown": str(C03_DEEP_MD.relative_to(ROOT)),
                "json": str(C03_DEEP_JSON.relative_to(ROOT)),
                "use": "C03を支援資源の有無ではなく、相談入口、継続再翻訳、役割分担、サービス適合、仕事開拓の接続構造として読むための深読解。",
            },
            {
                "id": "C04-information-participation-deep-reading",
                "markdown": str(C04_DEEP_MD.relative_to(ROOT)),
                "json": str(C04_DEEP_JSON.relative_to(ROOT)),
                "use": "C04を本人のコミュニケーション能力問題ではなく、情報参加が仕事参加、評価、安全確認、支援役割へどう接続するかとして読むための深読解。",
            },
            {
                "id": "C05-3-pure-deep-reading",
                "markdown": str(C05_3_PURE_MD.relative_to(ROOT)),
                "json": str(C05_3_PURE_JSON.relative_to(ROOT)),
                "use": "C05-3を設備リストではなく、作業場所・設備と仕事参加接触点の接続として読むための深読解。",
            },
            {
                "id": "C06-life-security-deep-reading",
                "markdown": str(C06_DEEP_MD.relative_to(ROOT)),
                "json": str(C06_DEEP_JSON.relative_to(ROOT)),
                "use": "C06を生活困窮や意欲の問題ではなく、仕事選択、健康時間、支援接続、評価処遇を制約する生活保障面として読むための深読解。",
            },
            {
                "id": "C07-C08-participation-deep-reading",
                "markdown": str(C07_C08_DEEP_MD.relative_to(ROOT)),
                "json": str(C07_C08_DEEP_JSON.relative_to(ROOT)),
                "use": "C07/C08を、評価・役割・キャリア参加という上方向の参加自由度と、生活・体力・活動参加という入口以前の自由度として読むための深読解。",
            },
        ],
        "structure_attack_artifacts": [
            {
                "id": "structure-hole-attack-map",
                "markdown": str(STRUCTURE_HOLE_ATTACK_MD.relative_to(ROOT)),
                "json": str(STRUCTURE_HOLE_ATTACK_JSON.relative_to(ROOT)),
                "use": "未閉鎖の構造穴を次に潰す分析対象へ変換するための攻撃順。進捗表ではない。",
            },
            {
                "id": "C04-direct-information-participation-attack",
                "markdown": str(C04_DIRECT_ATTACK_MD.relative_to(ROOT)),
                "json": str(C04_DIRECT_ATTACK_JSON.relative_to(ROOT)),
                "use": "C04直接信号を、情報形式、確認可能性、責任所在、評価接続、役割接続、本人の依頼負荷へ割り直した構造穴攻撃。",
            },
            {
                "id": "C01-health-time-attack",
                "markdown": str(C01_HEALTH_TIME_ATTACK_MD.relative_to(ROOT)),
                "json": str(C01_HEALTH_TIME_ATTACK_JSON.relative_to(ROOT)),
                "use": "C01直接信号を、勤務時間、休暇・欠勤扱い、休憩、職務代替、職場内解釈、収入保障の健康時間構造へ割り直した構造穴攻撃。",
            },
            {
                "id": "C07-quality-participation-attack",
                "markdown": str(C07_QUALITY_ATTACK_MD.relative_to(ROOT)),
                "json": str(C07_QUALITY_ATTACK_JSON.relative_to(ROOT)),
                "use": "C07直接信号を、評価基準、役割拡大、技能習得、処遇、昇進、働きがい、定着の上方向参加品質へ割り直した構造穴攻撃。",
            },
            {
                "id": "C08-prework-participation-attack",
                "markdown": str(C08_PREWORK_ATTACK_MD.relative_to(ROOT)),
                "json": str(C08_PREWORK_ATTACK_JSON.relative_to(ROOT)),
                "use": "C08直接信号を、生活リズム、体力、日中活動、家族支援、地域生活、訓練、就労自信の入口以前参加へ割り直した構造穴攻撃。",
            },
            {
                "id": "C05-worksite-mobility-attack",
                "markdown": str(C05_WORKSITE_ATTACK_MD.relative_to(ROOT)),
                "json": str(C05_WORKSITE_ATTACK_JSON.relative_to(ROOT)),
                "use": "C05直接信号を、移動経路、通勤、姿勢、作業場所、設備、職務代替、安全確認の仕事参加接触点へ割り直した構造穴攻撃。",
            },
            {
                "id": "C06-life-security-attack",
                "markdown": str(C06_LIFE_SECURITY_ATTACK_MD.relative_to(ROOT)),
                "json": str(C06_LIFE_SECURITY_ATTACK_JSON.relative_to(ROOT)),
                "use": "C06直接信号を、収入保障、医療費、家計責任、雇用形態、制度対象、休業時保障、生活再建の制約面へ割り直した構造穴攻撃。",
            },
            {
                "id": "C02-disclosure-translation-attack",
                "markdown": str(C02_DISCLOSURE_ATTACK_MD.relative_to(ROOT)),
                "json": str(C02_DISCLOSURE_ATTACK_JSON.relative_to(ROOT)),
                "use": "C02開示範囲を、本人説明能力や開示量ではなく、相互翻訳の境界設計へ割り直した構造穴攻撃。",
            },
            {
                "id": "C03-support-mediation-attack",
                "markdown": str(C03_SUPPORT_ATTACK_MD.relative_to(ROOT)),
                "json": str(C03_SUPPORT_ATTACK_JSON.relative_to(ROOT)),
                "use": "C03軽減側信号を、支援有効性ではなく、翻訳・接続・役割分担の自由度へ割り直した構造穴攻撃。",
            },
        ],
        "first_principle_discovery_candidates": {
            "markdown": str(FIRST_PRINCIPLE_DISCOVERY_MD.relative_to(ROOT)),
            "use": "C01/C02/C03/C04/C05/C06/C07/C08深読解から見えた第一原理・科学的発見候補。未レビューであり、知識昇格ではない。",
        },
        "structural_freedom_working_map": {
            "markdown": str(STRUCTURAL_FREEDOM_MAP_MD.relative_to(ROOT)),
            "json": str(STRUCTURAL_FREEDOM_MAP_JSON.relative_to(ROOT)),
            "node_count": len(structural_freedom_map["nodes"]),
            "relation_count": len(structural_freedom_map["relations"]),
            "use": f"8つの構造自由度、{len(structural_freedom_map['nodes'])}ノード、{len(structural_freedom_map['relations'])} relationを、Falconが次の分析で検索・批判・同型探索するための未レビューworking map。",
        },
        "structural_polarity_stress_test": {
            "markdown": str(STRUCTURAL_POLARITY_STRESS_MD.relative_to(ROOT)),
            "json": str(STRUCTURAL_POLARITY_STRESS_JSON.relative_to(ROOT)),
            "use": "問題・軽減・残余・境界の四状態を検査し、問題中心読みや支援有効性の早合点を避けるための未レビューstress test。",
        },
        "record_structure_index": {
            "markdown": str(RECORD_STRUCTURE_INDEX_MD.relative_to(ROOT)),
            "json": str(RECORD_STRUCTURE_INDEX_JSON.relative_to(ROOT)),
            "use": "8241 record IDから構造自由度へ引くための未レビュー索引。本文引用・PII・判断結果は含めない。",
        },
        "fragmentary_source_structural_integration_map": {
            "markdown": str(FRAGMENTARY_STRUCTURAL_INTEGRATION_MD.relative_to(ROOT)),
            "json": str(FRAGMENTARY_STRUCTURAL_INTEGRATION_JSON.relative_to(ROOT)),
            "fragmentary_source_count": fragmentary_integration["fragmentary_source_count"],
            "structural_findings": fragmentary_integration["structural_findings"],
            "use": "394件のworkshop/NIVR/web-cache断片資料を、8つの構造自由度、軸ペア、候補枝、境界タグへ接続する未レビュー統合地図。断片資料はケースでも支援妥当性根拠でもない。",
        },
        "codex_query_index": {
            "markdown": str(CODEX_QUERY_INDEX_MD.relative_to(ROOT)),
            "json": str(CODEX_QUERY_INDEX_JSON.relative_to(ROOT)),
            "axis_query_card_count": codex_query_index["axis_query_card_count"],
            "relation_query_card_count": codex_query_index["relation_query_card_count"],
            "use": "Codexチャットで、8軸・14関係からrecord ID、source ID、代表/境界ID、反対読みへ引くための未レビューquery index。",
        },
        "codex_chat_knowledge_network": {
            "markdown": str(CODEX_CHAT_KNOWLEDGE_NETWORK_MD.relative_to(ROOT)),
            "json": str(CODEX_CHAT_KNOWLEDGE_NETWORK_JSON.relative_to(ROOT)),
            "query_route_count": len(codex_chat_knowledge_network["query_routes"]),
            "answer_mode_count": len(codex_chat_knowledge_network["answer_modes"]),
            "use": "Stage 1成果物を、Codex上のチャットでoperator、文脈枝、record ID、断片資料slotへ接続して使うための未レビュー実用入口。",
        },
        "fragmentary_llm_context_reading_batches": [
            {
                "id": "batch1-thin-axis-recovery",
                "markdown": str(FRAGMENTARY_LLM_THIN_AXIS_BATCH1_MD.relative_to(ROOT)),
                "source_count": 8,
                "focus_axes": [
                    "C05-worksite-contact",
                    "C06-life-security",
                    "C07-quality-participation",
                    "C08-prework-participation",
                ],
                "use": "C05/C06/C07/C08を中心に、断片資料を本文引用なしでLLM文脈読解し、主軸・副軸・relation・反対読みを保持した未レビュー分析バッチ。",
            },
            {
                "id": "batch2-nivr-life-course-quality",
                "markdown": str(FRAGMENTARY_LLM_NIVR_LIFE_COURSE_BATCH2_MD.relative_to(ROOT)),
                "source_count": 8,
                "focus_axes": [
                    "C01-health-time",
                    "C03-support-continuity",
                    "C06-life-security",
                    "C07-quality-participation",
                    "C08-prework-participation",
                ],
                "use": "NIVR系の断片資料を、健康時間、支援継続、生活保障、参加品質、入口以前参加のlife-course自由度として本文引用なしでLLM文脈読解した未レビュー分析バッチ。",
            },
        ],
        "recompressed_proposition_artifacts": [
            {
                "id": "c06-c07-c08-recompressed-propositions",
                "markdown": str(C06_C07_C08_RECOMPRESSED_MD.relative_to(ROOT)),
                "proposition_count": 6,
                "focus_axes": [
                    "C06-life-security",
                    "C07-quality-participation",
                    "C08-prework-participation",
                ],
                "use": "NIVR life-course / 参加品質バッチを踏まえ、C06/C07/C08の抽象命題をrecord ID・source ID付きの構造命題へ再圧縮した未レビュー成果物。",
            }
        ],
        "record_lattice_artifacts": [
            {
                "id": "rcp-record-structure-lattice",
                "markdown": str(RCP_RECORD_LATTICE_MD.relative_to(ROOT)),
                "json": str(RCP_RECORD_LATTICE_JSON.relative_to(ROOT)),
                "proposition_count": 6,
                "use": "C06/C07/C08再圧縮命題を8241 record索引へ戻し、共通構造と多様性条件ごとの自由度形状を同時に読むための未レビュー構造格子。",
            }
        ],
        "structure_resolution_findings": {
            "markdown": str(STRUCTURE_RESOLUTION_FINDINGS_MD.relative_to(ROOT)),
            "use": "RCP record latticeから、参加品質、生活保障、入口以前参加、情報同期を構造解像度として再読解するための未レビュー発見メモ。",
        },
        "llm_context_reading_bundles": [
            {
                "id": "bundle-a-participation-quality-context-reading",
                "markdown": str(BUNDLE_A_PARTICIPATION_QUALITY_MD.relative_to(ROOT)),
                "focus": "RCP-01/RCP-04/RCP-06から、C07へ復元するID、境界に留めるID、C07へ上げないIDを本文引用なしで分ける。",
                "read_record_count": 14,
            },
            {
                "id": "bundle-b-entry-order-life-security-context-reading",
                "markdown": str(BUNDLE_B_ENTRY_ORDER_LIFE_SECURITY_MD.relative_to(ROOT)),
                "focus": "RCP-02/RCP-05から、生活保障・健康時間・支援/訓練・情報開示が入口順序をどう変えるかを本文引用なしで分ける。",
                "read_record_count": 23,
            },
            {
                "id": "bundle-c-health-time-life-security-context-reading",
                "markdown": str(BUNDLE_C_HEALTH_TIME_LIFE_SECURITY_MD.relative_to(ROOT)),
                "focus": "RCP-03から、健康時間と生活保障が接した時の、続ける・休む・戻る・選び直す自由度を本文引用なしで分ける。",
                "read_record_count": 22,
            },
            {
                "id": "bundle-d-diversity-conditioned-structure-context-reading",
                "markdown": str(BUNDLE_D_DIVERSITY_CONDITIONED_STRUCTURE_MD.relative_to(ROOT)),
                "focus": "視覚、聴覚・音声、認知・発達・知的、内部障害・全身管理の条件窓で、同じ構造自由度がどう別形態を取るかを本文引用なしで分ける。",
                "read_record_count": 16,
            },
            {
                "id": "bundle-e-info-worksite-disclosure-polarity-context-reading",
                "markdown": str(BUNDLE_E_INFO_WORKSITE_DISCLOSURE_MD.relative_to(ROOT)),
                "focus": "SF-04情報同期、SF-07仕事接触点、SF-09開示境界を、支援・配慮の有無で切断せず、開閉・残余・境界状態として本文引用なしで分ける。",
                "read_record_count": 18,
            }
        ],
        "rcp_structural_renaming": {
            "markdown": str(RCP_STRUCTURAL_RENAMING_MD.relative_to(ROOT)),
            "use": "Bundle A/B/Cを受け、RCP-01からRCP-06を抽象命題ではなく、同型構造・条件窓・開閉状態として再命名した未レビュー成果物。",
        },
        "record_structural_state_index": {
            "markdown": str(RECORD_STRUCTURAL_STATE_INDEX_MD.relative_to(ROOT)),
            "json": str(RECORD_STRUCTURAL_STATE_INDEX_JSON.relative_to(ROOT)),
            "use": "Bundle A/B/C後の構造名を8241 recordへ戻し、同型構造・条件窓・開閉状態で検索するための未レビュー索引。",
        },
        "structural_family_scale_rules": {
            "markdown": str(STRUCTURAL_FAMILY_SCALE_RULES_MD.relative_to(ROOT)),
            "json": str(STRUCTURAL_FAMILY_SCALE_RULES_JSON.relative_to(ROOT)),
            "use": "Bundle A-Dの構造読解を、全件分析で使う分岐ルール、少数条件窓、開閉ペア、LLM読解パケットへ変換した未レビュー成果物。",
        },
        "structural_family_proposition_catalog": {
            "markdown": str(STRUCTURAL_FAMILY_PROPOSITION_CATALOG_MD.relative_to(ROOT)),
            "json": str(STRUCTURAL_FAMILY_PROPOSITION_CATALOG_JSON.relative_to(ROOT)),
            "use": "10 structural familyを、互いに重複しない候補命題・反対読み・識別子へ書き分けた未レビューcatalog。",
        },
        "structural_family_review_cards": {
            "markdown": str(STRUCTURAL_FAMILY_REVIEW_CARDS_MD.relative_to(ROOT)),
            "json": str(STRUCTURAL_FAMILY_REVIEW_CARDS_JSON.relative_to(ROOT)),
            "use": "10 structural familyを、候補命題、反対読み、識別点、多数窓、少数条件窓、開閉ペア、境界戻しIDまで含むFounder/Pro向け未レビュー構造カードへ展開した成果物。",
        },
        "record_family_assignment_index": {
            "markdown": str(RECORD_FAMILY_ASSIGNMENT_INDEX_MD.relative_to(ROOT)),
            "json": str(RECORD_FAMILY_ASSIGNMENT_INDEX_JSON.relative_to(ROOT)),
            "use": "8241 recordを10 structural family review cardへ接続し、主family・境界family・状態読みを本文なしで検索できるようにする未レビュー索引。",
        },
        "structural_family_overlap_map": {
            "markdown": str(STRUCTURAL_FAMILY_OVERLAP_MAP_MD.relative_to(ROOT)),
            "json": str(STRUCTURAL_FAMILY_OVERLAP_MAP_JSON.relative_to(ROOT)),
            "use": "recordを単一分類せず、複数structural familyが重なる場所を発見対象として扱うための未レビューoverlap map。",
        },
        "structural_overlap_discovery_candidates": {
            "markdown": str(STRUCTURAL_OVERLAP_DISCOVERY_CANDIDATES_MD.relative_to(ROOT)),
            "json": str(STRUCTURAL_OVERLAP_DISCOVERY_CANDIDATES_JSON.relative_to(ROOT)),
            "use": "structural family overlapを、次のLLM文脈読解とFounder/Proレビューに使える発見候補へ圧縮した未レビュー成果物。",
        },
        "structural_overlap_deep_context_reading": {
            "markdown": str(STRUCTURAL_OVERLAP_DEEP_CONTEXT_READING_MD.relative_to(ROOT)),
            "json": str(STRUCTURAL_OVERLAP_DEEP_CONTEXT_READING_JSON.relative_to(ROOT)),
            "use": "7つのoverlap discovery candidatesを、因果連鎖、自由度、条件窓による変形、開閉/残余状態として深読解した未レビュー成果物。",
        },
        "overlap_discovery_record_index": {
            "markdown": str(OVERLAP_DISCOVERY_RECORD_INDEX_MD.relative_to(ROOT)),
            "json": str(OVERLAP_DISCOVERY_RECORD_INDEX_JSON.relative_to(ROOT)),
            "use": "7つのoverlap discovery candidatesをrecord側へ戻し、primary一致とboundary一致を分けて検索可能にする未レビュー索引。",
        },
        "overlap_discovery_cooccurrence_map": {
            "markdown": str(OVERLAP_DISCOVERY_COOCCURRENCE_MAP_MD.relative_to(ROOT)),
            "json": str(OVERLAP_DISCOVERY_COOCCURRENCE_MAP_JSON.relative_to(ROOT)),
            "use": "overlap discovery同士の共起を見て、単独候補より深い循環・積層・結節を発見単位として扱うための未レビューmap。",
        },
        "structural_discovery_grammar": {
            "markdown": str(STRUCTURAL_DISCOVERY_GRAMMAR_MD.relative_to(ROOT)),
            "json": str(STRUCTURAL_DISCOVERY_GRAMMAR_JSON.relative_to(ROOT)),
            "use": "overlap discoveryとmeta candidatesを、次の調査データ・断片資料分析で再利用できるoperator文法へ圧縮した未レビュー成果物。",
        },
        "fragmentary_source_grammar_slots": {
            "markdown": str(FRAGMENTARY_SOURCE_GRAMMAR_SLOTS_MD.relative_to(ROOT)),
            "json": str(FRAGMENTARY_SOURCE_GRAMMAR_SLOTS_JSON.relative_to(ROOT)),
            "use": "workshop/NIVR/web-cache断片資料を、構造文法のfreedom slot、missing-axis slot、counter-structure slot、search-condition slotへ接続した未レビュー成果物。",
        },
        "operator_slot_index": {
            "markdown": str(OPERATOR_SLOT_INDEX_MD.relative_to(ROOT)),
            "json": str(OPERATOR_SLOT_INDEX_JSON.relative_to(ROOT)),
            "use": "構造文法をoperator単位で引き、record側・断片資料側・文法側を横断検索するための未レビュー索引。",
        },
        "context_branch_card_candidates": {
            "markdown": str(CONTEXT_BRANCH_CARD_CANDIDATES_MD.relative_to(ROOT)),
            "json": str(CONTEXT_BRANCH_CARD_CANDIDATES_JSON.relative_to(ROOT)),
            "use": "operator文法から、最低ケース数、境界例、反対構造候補、断片資料slotを持つ文脈枝カード候補を抽出した未レビュー成果物。",
        },
        "info_worksite_disclosure_rewritten_propositions": {
            "markdown": str(INFO_WORKSITE_DISCLOSURE_REWRITTEN_MD.relative_to(ROOT)),
            "json": str(INFO_WORKSITE_DISCLOSURE_REWRITTEN_JSON.relative_to(ROOT)),
            "use": "SF-04情報同期、SF-07仕事接触点、SF-09開示境界と重複RC命題を、構造名・条件窓・開閉/残余状態で書き分けた未レビュー成果物。",
        },
        "review_units": review_units,
        "relation_edges": relation_map["relations"],
    }


def write_markdown(seed: dict[str, Any]) -> None:
    lines = [
        "# Stage 1 Production Knowledge Network Seed",
        "",
        "作成日: 2026-05-18",
        "状態: 機械生成 / 未レビュー / 昇格なし",
        "本文引用: なし",
        "",
        "これは、調査データ、workshop、NIVR/web-cache系の断片資料を、SCIMA/FCHMAの構造的自由度としてCodex上で使うための未レビューseedである。レビュー済み知識ではなく、次の分析・批判・同型探索の作業台として使う。",
        "",
        f"review unit数: {seed['review_unit_count']}",
        f"deep subbranch数: {seed['deep_subbranch_count']}",
        f"relation edge数: {seed['relation_count']}",
        f"断片資料リンク数: {seed['fragmentary_source_link_count']}",
        f"関係カード: `{seed['relation_review_cards']['markdown']}`",
        "",
        "## Deep Reading Artifacts",
        "",
    ]
    for artifact in seed["deep_reading_artifacts"]:
        lines.append(f"- `{artifact['id']}`: `{artifact['markdown']}`")
    lines.extend(["", "## Structure Attack Artifacts", ""])
    for artifact in seed["structure_attack_artifacts"]:
        lines.append(f"- `{artifact['id']}`: `{artifact['markdown']}`")
    lines.extend(["", "## Deep Subbranch Coverage", "", "| artifact | subbranches |", "|---|---:|"])
    for artifact_id, item in seed["deep_subbranches_by_artifact"].items():
        lines.append(f"| `{artifact_id}` | {item['count']} |")
    lines.extend([
        "",
        f"第一原理・発見候補: `{seed['first_principle_discovery_candidates']['markdown']}`",
        f"構造自由度working map: `{seed['structural_freedom_working_map']['markdown']}`",
        f"構造polarity stress test: `{seed['structural_polarity_stress_test']['markdown']}`",
        f"record構造索引: `{seed['record_structure_index']['markdown']}`",
        f"断片資料構造統合地図: `{seed['fragmentary_source_structural_integration_map']['markdown']}`",
        f"Codex query index: `{seed['codex_query_index']['markdown']}`",
        f"Codex chat knowledge network: `{seed['codex_chat_knowledge_network']['markdown']}`",
        "",
        "## Fragmentary LLM Context Reading Batches",
        "",
    ])
    for batch in seed["fragmentary_llm_context_reading_batches"]:
        axes = ", ".join(f"`{axis}`" for axis in batch["focus_axes"])
        lines.append(f"- `{batch['id']}`: {batch['source_count']} sources / {axes} / `{batch['markdown']}`")

    lines.extend(["", "## Recompressed Proposition Artifacts", ""])
    for artifact in seed["recompressed_proposition_artifacts"]:
        axes = ", ".join(f"`{axis}`" for axis in artifact["focus_axes"])
        lines.append(f"- `{artifact['id']}`: {artifact['proposition_count']} propositions / {axes} / `{artifact['markdown']}`")

    lines.extend(["", "## Record Lattice Artifacts", ""])
    for artifact in seed["record_lattice_artifacts"]:
        lines.append(f"- `{artifact['id']}`: {artifact['proposition_count']} propositions / `{artifact['markdown']}` / `{artifact['json']}`")

    lines.extend([
        "",
        f"構造解像度 findings: `{seed['structure_resolution_findings']['markdown']}`",
        "",
        "## LLM Context Reading Bundles",
        "",
    ])
    for bundle in seed["llm_context_reading_bundles"]:
        lines.append(f"- `{bundle['id']}`: {bundle['read_record_count']} records / `{bundle['markdown']}`")

    lines.extend([
        "",
        f"RCP structural renaming: `{seed['rcp_structural_renaming']['markdown']}`",
        f"record structural state index: `{seed['record_structural_state_index']['markdown']}` / `{seed['record_structural_state_index']['json']}`",
        f"structural family scale rules: `{seed['structural_family_scale_rules']['markdown']}` / `{seed['structural_family_scale_rules']['json']}`",
        f"structural family proposition catalog: `{seed['structural_family_proposition_catalog']['markdown']}` / `{seed['structural_family_proposition_catalog']['json']}`",
        f"structural family review cards: `{seed['structural_family_review_cards']['markdown']}` / `{seed['structural_family_review_cards']['json']}`",
        f"record family assignment index: `{seed['record_family_assignment_index']['markdown']}` / `{seed['record_family_assignment_index']['json']}`",
        f"structural family overlap map: `{seed['structural_family_overlap_map']['markdown']}` / `{seed['structural_family_overlap_map']['json']}`",
        f"structural overlap discovery candidates: `{seed['structural_overlap_discovery_candidates']['markdown']}` / `{seed['structural_overlap_discovery_candidates']['json']}`",
        f"structural overlap deep context reading: `{seed['structural_overlap_deep_context_reading']['markdown']}` / `{seed['structural_overlap_deep_context_reading']['json']}`",
        f"overlap discovery record index: `{seed['overlap_discovery_record_index']['markdown']}` / `{seed['overlap_discovery_record_index']['json']}`",
        f"overlap discovery cooccurrence map: `{seed['overlap_discovery_cooccurrence_map']['markdown']}` / `{seed['overlap_discovery_cooccurrence_map']['json']}`",
        f"structural discovery grammar: `{seed['structural_discovery_grammar']['markdown']}` / `{seed['structural_discovery_grammar']['json']}`",
        f"fragmentary source grammar slots: `{seed['fragmentary_source_grammar_slots']['markdown']}` / `{seed['fragmentary_source_grammar_slots']['json']}`",
        f"operator slot index: `{seed['operator_slot_index']['markdown']}` / `{seed['operator_slot_index']['json']}`",
        f"context branch card candidates: `{seed['context_branch_card_candidates']['markdown']}` / `{seed['context_branch_card_candidates']['json']}`",
        f"info/worksite/disclosure rewritten propositions: `{seed['info_worksite_disclosure_rewritten_propositions']['markdown']}` / `{seed['info_worksite_disclosure_rewritten_propositions']['json']}`",
    ])

    lines.extend([
        "",
        "## Fragmentary Source Structural Integration",
        "",
        f"断片資料数: {seed['fragmentary_source_structural_integration_map']['fragmentary_source_count']}",
    ])
    for finding in seed["fragmentary_source_structural_integration_map"]["structural_findings"]:
        lines.append(f"- {finding}")

    lines.extend([
        "",
        "## Review Units",
        "",
        "| unit | status | representative IDs | candidate proposition |",
        "|---|---|---|---|",
    ])
    for item in seed["review_units"]:
        reps = ", ".join(f"`{record_id}`" for record_id in item["representative_ids"][:5])
        lines.append(f"| `{item['unit_id']}` {item['title']} | {item['status']} | {reps} | {item['candidate_proposition']} |")

    lines.extend(["", "## Relation Edges", "", "| edge | records | reading |", "|---|---:|---|"])
    for item in seed["relation_edges"]:
        lines.append(f"| `{item['relation_id']}` {item['title']} | {item['record_count']} | {item['reading']} |")

    lines.extend([
        "",
        "## Codexでの使い方",
        "",
        "- 単独カードの検索だけでなく、relation edgeをたどって、同じ構造の別自由度・境界・反対読みを確認する。",
        "- `RU-C05-3` は設備一般の候補命題として使わず、C04/C05・C01/C05・C05-1/2境界の再分類に使う。",
        "- `RU-C02-T` は本人説明能力ではなく、本人条件と求人条件の相互翻訳構造として使う。",
        "- `RU-C03-4` は支援が有効という読みではなく、変化局面で翻訳し直す自由度として使う。",
        "- `C04-information-participation` は本人の説明能力ではなく、仕事参加の確認可能性、責任、評価、安全確認への接続として使う。",
        "- `C06-life-security` は就労意欲や能力の判断ではなく、仕事選択、健康時間、支援接続、評価処遇を変える制約面として使う。",
        "- `C07/C08-participation` は、就職/定着の二点モデルから漏れる、上方向のキャリア参加と入口以前の生活参加の自由度として使う。",
        "- `rcp-record-structure-lattice` は、C06/C07/C08再圧縮命題をrecord側へ戻し、多数派条件に引きずられずに条件別の自由度形状を読むために使う。",
        "- `structural-discovery-grammar` は、支援有無・障害種類・就労有無ではなく、operatorの接続で次のrecord/sourceを読むために使う。",
        "- `fragmentary-source-grammar-slots` は、workshop/NIVR/web-cacheをケース数や支持根拠にせず、欠けたICF軸と同型探索条件として使う。",
        "- `operator-slot-index` は、質問や追加分析の入口語をoperatorへ変換し、record・source・grammarへ横断するために使う。",
        "- `context-branch-card-candidates` は、最低ケース数・境界例・反対構造候補がそろう文脈枝を、未レビュー候補として人間レビュー前段へ切り出すために使う。",
    ])

    OUT_MD.write_text("\n".join(lines).rstrip() + "\n", encoding="utf-8")


def main() -> None:
    seed = build_seed()
    OUT_JSON.write_text(json.dumps(seed, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    write_markdown(seed)
    print(f"wrote {OUT_JSON.relative_to(ROOT)}")
    print(f"wrote {OUT_MD.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
