#!/usr/bin/env python3
"""Audit local web-cache sources for Stage 1 SCIMA/FCHMA core completion.

This script keeps public/official web-cache material in source-readiness and
candidate-structure territory. It does not promote knowledge, decide legal or
support validity, or create current-policy claims.
"""

from __future__ import annotations

import json
import re
from collections import Counter, defaultdict
from pathlib import Path
from typing import Any


REPO_ROOT = Path(__file__).resolve().parents[2]
WEB_CACHE_DIR = REPO_ROOT / "references/web-cache"
STAGE1_DIR = REPO_ROOT / "references/derived/scima-fchma/stage1-production-v0-2026-05-18"

FRAGMENTARY_MAP_JSON = STAGE1_DIR / "stage1-production-fragmentary-source-structural-integration-map-v0-2026-05-18.json"
QUERY_INDEX_JSON = STAGE1_DIR / "stage1-production-codex-query-index-v0-2026-05-18.json"

OUTPUT_JSON = STAGE1_DIR / "stage1-production-web-cache-scima-fchma-source-audit-v0-2026-05-23.json"
OUTPUT_MD = STAGE1_DIR / "stage1-production-web-cache-scima-fchma-source-audit-v0-2026-05-23.md"
OUTPUT_JSONL = STAGE1_DIR / "stage1-production-web-cache-scima-fchma-source-cards-v0-2026-05-23.jsonl"


AXIS_DEFS: dict[str, dict[str, Any]] = {
    "C01-health-time": {
        "label": "健康時間",
        "routes": ["QR-01-health-time-work-design"],
        "keywords": [
            "health",
            "treatment",
            "symptom",
            "fatigue",
            "pain",
            "chronic",
            "mental health",
            "leave",
            "schedule",
            "flexible",
            "workload",
            "return to work",
            "wellbeing",
            "well-being",
            "通院",
            "治療",
            "症状",
            "疲労",
            "痛み",
            "体調",
            "健康",
            "勤務時間",
            "休憩",
            "休暇",
            "復職",
            "両立",
        ],
    },
    "C02-entry-translation": {
        "label": "入口相互翻訳",
        "routes": [
            "QR-05-entry-prework-translation",
            "QR-06-disclosure-boundary-and-mutual-translation",
        ],
        "keywords": [
            "recruit",
            "recruitment",
            "hiring",
            "hire",
            "interview",
            "application",
            "applicant",
            "onboarding",
            "internship",
            "pipeline",
            "disclosure",
            "job seeker",
            "transition",
            "採用",
            "求人",
            "求職",
            "就職",
            "入口",
            "面接",
            "応募",
            "開示",
            "説明",
            "職場実習",
        ],
    },
    "C03-support-continuity": {
        "label": "支援継続再翻訳",
        "routes": [
            "QR-06-disclosure-boundary-and-mutual-translation",
            "QR-01-health-time-work-design",
        ],
        "keywords": [
            "support",
            "service",
            "vocational rehabilitation",
            "rehabilitation",
            "job coach",
            "consultation",
            "counseling",
            "follow-up",
            "retention",
            "reasonable accommodation",
            "accommodation process",
            "相談",
            "支援",
            "援助",
            "定着",
            "継続",
            "ジョブコーチ",
            "職業リハ",
            "職業センター",
            "ナカポ",
        ],
    },
    "C04-information-participation": {
        "label": "情報参加同期",
        "routes": [
            "QR-02-information-work-procedure",
            "QR-06-disclosure-boundary-and-mutual-translation",
        ],
        "keywords": [
            "communication",
            "accessible ict",
            "information",
            "instructions",
            "hearing",
            "deaf",
            "sign language",
            "caption",
            "screen reader",
            "plain language",
            "cognitive",
            "情報",
            "コミュニケーション",
            "聴覚",
            "説明",
            "手順",
            "確認",
            "伝達",
            "相談",
            "読み上げ",
            "字幕",
        ],
    },
    "C05-worksite-contact": {
        "label": "仕事参加接触点",
        "routes": ["QR-03-worksite-contact-and-mobility"],
        "keywords": [
            "accessibility",
            "workplace",
            "worksite",
            "equipment",
            "mobility",
            "physical",
            "assistive technology",
            "ergonomic",
            "workstation",
            "transportation",
            "safety",
            "task",
            "job duties",
            "職場環境",
            "設備",
            "作業",
            "通勤",
            "移動",
            "物理",
            "安全",
            "配置",
            "職務",
            "補助具",
        ],
    },
    "C06-life-security": {
        "label": "生活保障制約",
        "routes": ["QR-04-life-security-sequencing"],
        "keywords": [
            "benefit",
            "benefits",
            "income",
            "insurance",
            "subsidy",
            "welfare",
            "living",
            "financial",
            "wage",
            "wages",
            "social security",
            "medical expense",
            "生活",
            "収入",
            "医療費",
            "制度",
            "障害年金",
            "給付",
            "助成金",
            "賃金",
            "家族",
            "生活費",
        ],
    },
    "C07-quality-participation": {
        "label": "上方向参加品質",
        "routes": ["QR-07-quality-career-and-value-translation"],
        "keywords": [
            "career",
            "advancement",
            "performance",
            "evaluation",
            "productivity",
            "inclusion",
            "culture",
            "retention",
            "engagement",
            "promotion",
            "role",
            "leadership",
            "belonging",
            "キャリア",
            "評価",
            "役割",
            "処遇",
            "働きがい",
            "生産性",
            "定着",
            "昇進",
            "活躍",
        ],
    },
    "C08-prework-participation": {
        "label": "入口以前参加",
        "routes": ["QR-05-entry-prework-translation"],
        "keywords": [
            "training",
            "preparation",
            "school",
            "education",
            "readiness",
            "youth",
            "life skills",
            "pre-employment",
            "supported education",
            "訓練",
            "移行",
            "学校",
            "教育",
            "生活リズム",
            "準備",
            "日中活動",
            "就労移行",
            "職業訓練",
        ],
    },
}


SOURCE_FAMILY_RULES: dict[str, dict[str, Any]] = {
    "askearn_employer_guidance": {
        "actor": "AskEARN",
        "jurisdiction": "US",
        "role": ["employer_practice", "public_guidance"],
        "layer": "source_readiness",
        "recency_risk": "medium",
        "jurisdiction_risk": "high_for_japan_current_claims",
    },
    "askearn_framework_process_trio": {
        "actor": "AskEARN",
        "jurisdiction": "US",
        "role": ["employer_practice", "public_guidance"],
        "layer": "candidate_structure_input",
        "recency_risk": "medium",
        "jurisdiction_risk": "high_for_japan_current_claims",
    },
    "askjan_website": {
        "actor": "Job Accommodation Network",
        "jurisdiction": "US",
        "role": ["service_navigation", "employer_practice", "public_guidance"],
        "layer": "source_family_boundary",
        "recency_risk": "medium",
        "jurisdiction_risk": "high_for_japan_current_claims",
    },
    "australia_jobaccess_guidance": {
        "actor": "JobAccess / Australian public guidance",
        "jurisdiction": "Australia",
        "role": ["service_navigation", "public_guidance", "employer_practice"],
        "layer": "source_readiness",
        "recency_risk": "medium",
        "jurisdiction_risk": "high_for_japan_current_claims",
    },
    "canada_duty_to_accommodate": {
        "actor": "Canadian public/legal guidance",
        "jurisdiction": "Canada",
        "role": ["legal_text", "public_guidance"],
        "layer": "source_family_boundary",
        "recency_risk": "medium",
        "jurisdiction_risk": "high_for_japan_current_claims",
    },
    "disabilityin_disability_index_guide": {
        "actor": "Disability:IN",
        "jurisdiction": "US / international employer benchmarking",
        "role": ["employer_practice", "advocacy_practice"],
        "layer": "source_readiness",
        "recency_risk": "medium",
        "jurisdiction_risk": "medium",
    },
    "egov_disabled_persons_employment_act": {
        "actor": "e-Gov",
        "jurisdiction": "Japan",
        "role": ["legal_text"],
        "layer": "source_family_boundary",
        "recency_risk": "high_without_live_verification",
        "jurisdiction_risk": "low_for_japan_but_legal_finality_risk",
    },
    "eu_reasonable_accommodation": {
        "actor": "EU public/legal guidance",
        "jurisdiction": "EU",
        "role": ["legal_text", "policy_discussion", "public_guidance"],
        "layer": "source_family_boundary",
        "recency_risk": "medium",
        "jurisdiction_risk": "high_for_japan_current_claims",
    },
    "germany_agg_legal": {
        "actor": "German public/legal source",
        "jurisdiction": "Germany",
        "role": ["legal_text"],
        "layer": "source_family_boundary",
        "recency_risk": "medium",
        "jurisdiction_risk": "high_for_japan_current_claims",
    },
    "germany_antidiscrimination_work": {
        "actor": "German public/legal source",
        "jurisdiction": "Germany",
        "role": ["legal_text", "public_guidance"],
        "layer": "source_family_boundary",
        "recency_risk": "medium",
        "jurisdiction_risk": "high_for_japan_current_claims",
    },
    "jeed_employer_q_and_a": {
        "actor": "JEED",
        "jurisdiction": "Japan",
        "role": ["employer_practice", "public_guidance"],
        "layer": "candidate_structure_input",
        "recency_risk": "before_public_use",
        "jurisdiction_risk": "low_for_japan_but_no_finality",
    },
    "jeed_hearing_manual": {
        "actor": "JEED",
        "jurisdiction": "Japan",
        "role": ["professional_practice", "employer_practice"],
        "layer": "candidate_structure_input",
        "recency_risk": "before_public_use",
        "jurisdiction_risk": "low_for_japan_but_no_finality",
    },
    "jeed_hokkaido_rework_center": {
        "actor": "JEED",
        "jurisdiction": "Japan",
        "role": ["service_navigation", "professional_practice"],
        "layer": "source_readiness",
        "recency_risk": "before_public_use",
        "jurisdiction_risk": "low_for_japan_but_no_finality",
    },
    "jeed_low_adoption_industry_casebook": {
        "actor": "JEED",
        "jurisdiction": "Japan",
        "role": ["employer_practice", "professional_practice"],
        "layer": "candidate_structure_input",
        "recency_risk": "before_public_use",
        "jurisdiction_risk": "low_for_japan_but_no_finality",
    },
    "jeed_reference": {
        "actor": "JEED",
        "jurisdiction": "Japan",
        "role": ["research_publication", "professional_practice", "public_guidance"],
        "layer": "candidate_structure_input",
        "recency_risk": "before_public_use",
        "jurisdiction_risk": "low_for_japan_but_no_finality",
    },
    "jeed_regional_vocational_centers": {
        "actor": "JEED",
        "jurisdiction": "Japan",
        "role": ["service_navigation", "professional_practice"],
        "layer": "source_readiness",
        "recency_risk": "before_public_use",
        "jurisdiction_risk": "low_for_japan_but_no_finality",
    },
    "jeed_regional_vocational_centers_exact_pair": {
        "actor": "JEED",
        "jurisdiction": "Japan",
        "role": ["service_navigation", "professional_practice"],
        "layer": "source_readiness",
        "recency_risk": "before_public_use",
        "jurisdiction_risk": "low_for_japan_but_no_finality",
    },
    "jeed_retention_utilization_casebook": {
        "actor": "JEED",
        "jurisdiction": "Japan",
        "role": ["employer_practice", "professional_practice"],
        "layer": "candidate_structure_input",
        "recency_risk": "before_public_use",
        "jurisdiction_risk": "low_for_japan_but_no_finality",
    },
    "mhlw_disability_employment_policy": {
        "actor": "MHLW",
        "jurisdiction": "Japan",
        "role": ["policy_discussion", "public_guidance"],
        "layer": "source_family_boundary",
        "recency_risk": "high_without_live_verification",
        "jurisdiction_risk": "low_for_japan_but_policy_finality_risk",
    },
    "mhlw_disability_welfare_work_support": {
        "actor": "MHLW",
        "jurisdiction": "Japan",
        "role": ["policy_discussion", "service_navigation", "public_guidance"],
        "layer": "source_family_boundary",
        "recency_risk": "high_without_live_verification",
        "jurisdiction_risk": "low_for_japan_but_policy_finality_risk",
    },
    "mhlw_employment_reasonable_accommodation": {
        "actor": "MHLW",
        "jurisdiction": "Japan",
        "role": ["public_guidance", "policy_discussion"],
        "layer": "source_family_boundary",
        "recency_risk": "high_without_live_verification",
        "jurisdiction_risk": "low_for_japan_but_accommodation_finality_risk",
    },
    "mhlw_long_term_treatment_job_support": {
        "actor": "MHLW",
        "jurisdiction": "Japan",
        "role": ["public_guidance", "professional_practice"],
        "layer": "candidate_structure_input",
        "recency_risk": "high_without_live_verification",
        "jurisdiction_risk": "low_for_japan_but_no_finality",
    },
    "mhlw_nakapo_centers": {
        "actor": "MHLW",
        "jurisdiction": "Japan",
        "role": ["service_navigation", "public_guidance"],
        "layer": "source_family_boundary",
        "recency_risk": "high_without_live_verification",
        "jurisdiction_risk": "low_for_japan_but_service_currentness_risk",
    },
    "mhlw_treatment_work_balance": {
        "actor": "MHLW",
        "jurisdiction": "Japan",
        "role": ["public_guidance", "professional_practice"],
        "layer": "candidate_structure_input",
        "recency_risk": "high_without_live_verification",
        "jurisdiction_risk": "low_for_japan_but_no_finality",
    },
    "mhlw_treatment_work_balance_navi": {
        "actor": "MHLW",
        "jurisdiction": "Japan",
        "role": ["service_navigation", "public_guidance"],
        "layer": "source_family_boundary",
        "recency_risk": "high_without_live_verification",
        "jurisdiction_risk": "low_for_japan_but_service_currentness_risk",
    },
    "mhlw_treatment_work_consultable_support": {
        "actor": "MHLW",
        "jurisdiction": "Japan",
        "role": ["service_navigation", "public_guidance"],
        "layer": "source_family_boundary",
        "recency_risk": "high_without_live_verification",
        "jurisdiction_risk": "low_for_japan_but_service_currentness_risk",
    },
    "mhlw_treatment_work_consultation_map": {
        "actor": "MHLW",
        "jurisdiction": "Japan",
        "role": ["service_navigation", "public_guidance"],
        "layer": "source_family_boundary",
        "recency_risk": "high_without_live_verification",
        "jurisdiction_risk": "low_for_japan_but_service_currentness_risk",
    },
    "mhlw_treatment_work_fee_subsidy": {
        "actor": "MHLW",
        "jurisdiction": "Japan",
        "role": ["public_guidance", "service_navigation"],
        "layer": "source_family_boundary",
        "recency_risk": "high_without_live_verification",
        "jurisdiction_risk": "low_for_japan_but_policy_finality_risk",
    },
    "nivr_publications": {
        "actor": "NIVR",
        "jurisdiction": "Japan",
        "role": ["research_publication"],
        "layer": "candidate_structure_input",
        "recency_risk": "medium",
        "jurisdiction_risk": "low_for_japan_but_research_not_guidance",
    },
    "nivr_rehadat_japanese_translations": {
        "actor": "NIVR / REHADAT translation",
        "jurisdiction": "Japan / Germany",
        "role": ["research_publication", "professional_practice"],
        "layer": "source_family_boundary",
        "recency_risk": "medium",
        "jurisdiction_risk": "medium_to_high",
    },
    "uk_gov_disability_employment": {
        "actor": "UK Government",
        "jurisdiction": "UK",
        "role": ["public_guidance", "policy_discussion"],
        "layer": "source_family_boundary",
        "recency_risk": "medium",
        "jurisdiction_risk": "high_for_japan_current_claims",
    },
    "uk_headway_brain_injury_work": {
        "actor": "Headway UK",
        "jurisdiction": "UK",
        "role": ["advocacy_practice", "public_guidance"],
        "layer": "source_readiness",
        "recency_risk": "medium",
        "jurisdiction_risk": "high_for_japan_current_claims",
    },
}


UNDERREAD_AXES = {
    "C05-worksite-contact",
    "C06-life-security",
    "C07-quality-participation",
    "C08-prework-participation",
}


def load_json(path: Path) -> dict[str, Any]:
    return json.loads(path.read_text(encoding="utf-8"))


def read_meta(path: Path) -> dict[str, Any]:
    meta_path = path.with_suffix(".meta.json")
    if not meta_path.exists():
        return {}
    return json.loads(meta_path.read_text(encoding="utf-8", errors="replace"))


def get_meta_value(meta: dict[str, Any], *keys: str) -> Any:
    for key in keys:
        if key in meta and meta[key]:
            return meta[key]
    return None


def normalize_space(text: str) -> str:
    return re.sub(r"\s+", " ", text).strip()


def count_keywords(text: str, keywords: list[str]) -> tuple[int, list[str]]:
    lowered = text.lower()
    hits: list[str] = []
    score = 0
    for kw in keywords:
        needle = kw.lower()
        count = lowered.count(needle)
        if count:
            hits.append(kw)
            score += min(count, 6)
    return score, hits[:10]


def axis_scores(title: str, text: str) -> list[dict[str, Any]]:
    combined = f"{title}\n{text}"
    scored: list[dict[str, Any]] = []
    for axis_id, axis in AXIS_DEFS.items():
        body_score, body_hits = count_keywords(combined, axis["keywords"])
        title_score, title_hits = count_keywords(title, axis["keywords"])
        score = body_score + (title_score * 2)
        if score:
            scored.append(
                {
                    "axis_id": axis_id,
                    "label": axis["label"],
                    "score": score,
                    "routes": axis["routes"],
                    "keyword_hits": sorted(set(title_hits + body_hits))[:12],
                }
            )
    return sorted(scored, key=lambda item: (-item["score"], item["axis_id"]))


def integration_path_from_source_id(source_id: str) -> str | None:
    if ":references/web-cache/" not in source_id:
        return None
    return source_id.split(":", 1)[1]


def load_existing_integrations() -> dict[str, dict[str, Any]]:
    data = load_json(FRAGMENTARY_MAP_JSON)
    by_path: dict[str, dict[str, Any]] = {}
    for item in data.get("source_integrations", []):
        path = integration_path_from_source_id(item.get("source_id", ""))
        if path:
            by_path[path] = item
    return by_path


def family_rule(family: str) -> dict[str, Any]:
    return SOURCE_FAMILY_RULES.get(
        family,
        {
            "actor": "unknown",
            "jurisdiction": "unknown",
            "role": ["mixed"],
            "layer": "source_readiness",
            "recency_risk": "unknown",
            "jurisdiction_risk": "unknown",
        },
    )


def source_priority(
    family: str,
    scores: list[dict[str, Any]],
    integrated: bool,
    rule: dict[str, Any],
) -> str:
    top_score = scores[0]["score"] if scores else 0
    axes = {item["axis_id"] for item in scores[:4]}
    japan_core = family.startswith(("jeed_", "mhlw_", "nivr_", "egov_"))
    underread_hit = bool(axes & UNDERREAD_AXES)
    if not integrated and japan_core and (top_score >= 10 or underread_hit):
        return "P0_unintegrated_japan_official_or_research_core"
    if not integrated and underread_hit and top_score >= 12:
        return "P1_unintegrated_underread_axis_candidate"
    if integrated and underread_hit:
        return "P2_existing_source_underread_axis_deepening"
    if not integrated and top_score >= 18:
        return "P2_unintegrated_high_signal_candidate"
    if "legal_text" in rule["role"] or "policy_discussion" in rule["role"]:
        return "P3_boundary_claim_hygiene"
    return "P4_inventory_or_hold"


def safe_use(rule: dict[str, Any], axes: list[str], integrated: bool) -> list[str]:
    uses = ["source-readiness row", "claim-hygiene pass", "expert-agent evidence input after boundary note"]
    if integrated:
        uses.append("Stage 1 fragmentary slot cross-check")
    if set(axes) & UNDERREAD_AXES:
        uses.append("underread-axis SCIMA/FCHMA deep-reading candidate")
    if "legal_text" in rule["role"] or "policy_discussion" in rule["role"]:
        uses.append("policy/legal context boundary note, not legal advice")
    return uses


def not_safe_use(rule: dict[str, Any]) -> list[str]:
    blocked = [
        "public copy without review",
        "final legal advice",
        "final accommodation decision",
        "current policy claim without live verification",
        "reviewed knowledge object promotion",
        "runtime-approved retrieval source",
    ]
    if "service_navigation" in rule["role"]:
        blocked.append("current service routing without live verification")
    return blocked


def build_source_cards() -> list[dict[str, Any]]:
    existing = load_existing_integrations()
    cards: list[dict[str, Any]] = []
    for txt_path in sorted(WEB_CACHE_DIR.glob("*/*.txt")):
        rel = txt_path.relative_to(REPO_ROOT).as_posix()
        family = txt_path.parent.name
        meta = read_meta(txt_path)
        title = get_meta_value(meta, "title") or txt_path.stem
        url = get_meta_value(meta, "url", "finalUrl", "source_url")
        fetched_at = get_meta_value(meta, "fetchedAt", "fetched_at", "retrieved_at")
        text = txt_path.read_text(encoding="utf-8", errors="replace")
        text_chars = len(text)
        text_for_scoring = text[:40000]
        scores = axis_scores(str(title), text_for_scoring)
        top_axes = [item["axis_id"] for item in scores[:4]]
        routes = sorted({route for item in scores[:4] for route in item["routes"]})
        rule = family_rule(family)
        existing_item = existing.get(rel)
        integrated = existing_item is not None
        priority = source_priority(family, scores, integrated, rule)
        card = {
            "source_card_id": f"stage1-web-cache:{family}:{txt_path.stem}",
            "status": "source_audit_unreviewed_no_promotion_no_runtime_approval",
            "source_path": rel,
            "source_family": family,
            "title": normalize_space(str(title))[:240],
            "url": url,
            "fetched_at": fetched_at,
            "actor": rule["actor"],
            "jurisdiction": rule["jurisdiction"],
            "source_roles": rule["role"],
            "safe_layer": rule["layer"],
            "why_not_higher": "not human-reviewed; no source/support validity decision; no live verification for current public/policy/legal use",
            "text_chars": text_chars,
            "stage1_fragmentary_map_integrated": integrated,
            "existing_stage1_top_axis": existing_item.get("top_axis") if existing_item else None,
            "existing_stage1_integration_status": existing_item.get("integration_status") if existing_item else None,
            "axis_scores": scores[:6],
            "top_axes": top_axes,
            "route_candidates": routes,
            "underread_axis_hit": bool(set(top_axes) & UNDERREAD_AXES),
            "deep_read_priority": priority,
            "recency_risk": rule["recency_risk"],
            "jurisdiction_risk": rule["jurisdiction_risk"],
            "live_verification_needed": "before_public_or_current_policy_use",
            "safe_candidate_uses": safe_use(rule, top_axes, integrated),
            "not_safe_uses": not_safe_use(rule),
            "claim_type_boundary": {
                "observation": "may describe guidance, practices, legal/policy text, research findings, or service navigation from the source actor",
                "inference": "SCIMA/FCHMA route placement is a candidate structural reading, not the source's own final claim",
                "normative": "policy or employer-practice recommendations stay source-bound and jurisdiction-bound",
                "recommendation": "no recommendation is treated as universal or current without review/live verification",
            },
            "raw_text_exported": False,
        }
        cards.append(card)
    return cards


def summarize(cards: list[dict[str, Any]]) -> dict[str, Any]:
    family_profiles: dict[str, dict[str, Any]] = {}
    axis_counts = Counter()
    route_counts = Counter()
    priority_counts = Counter(card["deep_read_priority"] for card in cards)
    integrated_count = sum(1 for card in cards if card["stage1_fragmentary_map_integrated"])

    for card in cards:
        family = card["source_family"]
        profile = family_profiles.setdefault(
            family,
            {
                "source_family": family,
                "source_count": 0,
                "integrated_count": 0,
                "unintegrated_count": 0,
                "actor": card["actor"],
                "jurisdiction": card["jurisdiction"],
                "source_roles": card["source_roles"],
                "safe_layer": card["safe_layer"],
                "priority_counts": Counter(),
                "axis_counts": Counter(),
                "route_counts": Counter(),
                "examples": [],
            },
        )
        profile["source_count"] += 1
        if card["stage1_fragmentary_map_integrated"]:
            profile["integrated_count"] += 1
        else:
            profile["unintegrated_count"] += 1
        profile["priority_counts"][card["deep_read_priority"]] += 1
        for axis in card["top_axes"]:
            profile["axis_counts"][axis] += 1
            axis_counts[axis] += 1
        for route in card["route_candidates"]:
            profile["route_counts"][route] += 1
            route_counts[route] += 1
        if len(profile["examples"]) < 5:
            profile["examples"].append(
                {
                    "source_path": card["source_path"],
                    "title": card["title"],
                    "top_axes": card["top_axes"][:3],
                    "deep_read_priority": card["deep_read_priority"],
                    "integrated": card["stage1_fragmentary_map_integrated"],
                }
            )

    normalized_profiles: list[dict[str, Any]] = []
    for profile in family_profiles.values():
        normalized = dict(profile)
        normalized["priority_counts"] = dict(profile["priority_counts"])
        normalized["axis_counts"] = dict(profile["axis_counts"])
        normalized["route_counts"] = dict(profile["route_counts"])
        normalized_profiles.append(normalized)

    priority_sources = sorted(
        cards,
        key=lambda card: (
            card["deep_read_priority"].replace("P", ""),
            not card["underread_axis_hit"],
            -sum(item["score"] for item in card["axis_scores"][:3]),
            card["source_path"],
        ),
    )[:80]

    return {
        "total_web_cache_sources": len(cards),
        "stage1_existing_integrated_sources": integrated_count,
        "not_yet_integrated_sources": len(cards) - integrated_count,
        "family_count": len(family_profiles),
        "axis_candidate_counts": dict(axis_counts),
        "route_candidate_counts": dict(route_counts),
        "deep_read_priority_counts": dict(priority_counts),
        "family_profiles": sorted(normalized_profiles, key=lambda item: item["source_family"]),
        "priority_read_queue": [
            {
                "source_path": card["source_path"],
                "source_family": card["source_family"],
                "title": card["title"],
                "actor": card["actor"],
                "jurisdiction": card["jurisdiction"],
                "integrated": card["stage1_fragmentary_map_integrated"],
                "top_axes": card["top_axes"][:4],
                "routes": card["route_candidates"],
                "priority": card["deep_read_priority"],
            }
            for card in priority_sources
        ],
    }


def write_json(data: dict[str, Any], cards: list[dict[str, Any]]) -> None:
    OUTPUT_JSON.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    with OUTPUT_JSONL.open("w", encoding="utf-8") as f:
        for card in cards:
            f.write(json.dumps(card, ensure_ascii=False, sort_keys=True) + "\n")


def md_table_row(values: list[Any]) -> str:
    return "| " + " | ".join(str(value) for value in values) + " |"


def write_markdown(data: dict[str, Any]) -> None:
    summary = data["summary"]
    lines: list[str] = [
        "# Stage 1 Web-Cache SCIMA/FCHMA Source Audit",
        "",
        "作成日: 2026-05-23",
        "Lane: Falcon / Falcon Lab",
        "状態: source audit / source-readiness / 未レビュー / 昇格なし / 公開不可 / runtime未承認",
        "本文引用: なし",
        "",
        "## Position",
        "",
        "この成果物は、local web-cacheをStage 1 Core完成に向けて再棚卸しし、SCIMA/FCHMAのsource-readiness、route候補、薄い軸の深読みに接続するための監査可能な入口である。",
        "",
        "web-cache資料は、支援妥当性、法的判断、現行政策判断、public copy、runtime検索承認の根拠ではない。ここでは、公式・準公式・専門実務・海外資料を、source family boundaryとcandidate structure inputとして扱う。",
        "",
        "## Scope",
        "",
        md_table_row(["item", "count"]),
        md_table_row(["---", "---:"]),
        md_table_row(["local web-cache txt sources", summary["total_web_cache_sources"]]),
        md_table_row(["already in Stage 1 fragmentary map", summary["stage1_existing_integrated_sources"]]),
        md_table_row(["not yet integrated in Stage 1 fragmentary map", summary["not_yet_integrated_sources"]]),
        md_table_row(["source families", summary["family_count"]]),
        "",
        "## Core Finding",
        "",
        "- 既存Stage 1のweb-cache統合は、手元のlocal web-cache全体を覆っていない。したがって、web-cacheはCore完成前の追加深読みに値する。",
        "- 既存統合ではC02/C03/C04が厚く、C05/C06/C07/C08は薄い。今回の棚卸しでは、未統合sourceの中にC05/C06/C07/C08へ接続しうる候補が残っている。",
        "- 法令・政策・海外guidanceは、構造比較には使えるが、現行制度・法的・配慮妥当性の主張には使わない。",
        "",
        "## Axis Candidate Coverage",
        "",
        md_table_row(["axis", "candidate sources"]),
        md_table_row(["---", "---:"]),
    ]
    for axis_id in sorted(AXIS_DEFS):
        lines.append(
            md_table_row(
                [
                    f"`{axis_id}` {AXIS_DEFS[axis_id]['label']}",
                    summary["axis_candidate_counts"].get(axis_id, 0),
                ]
            )
        )

    lines.extend(["", "## Route Candidate Coverage", "", md_table_row(["route", "candidate sources"]), md_table_row(["---", "---:"])])
    for route, count in sorted(summary["route_candidate_counts"].items()):
        lines.append(md_table_row([f"`{route}`", count]))

    lines.extend(
        [
            "",
            "## Deep-Read Priority Counts",
            "",
            md_table_row(["priority", "sources"]),
            md_table_row(["---", "---:"]),
        ]
    )
    for priority, count in sorted(summary["deep_read_priority_counts"].items()):
        lines.append(md_table_row([f"`{priority}`", count]))

    lines.extend(
        [
            "",
            "## Source Family Profiles",
            "",
            md_table_row(
                [
                    "family",
                    "sources",
                    "integrated",
                    "unintegrated",
                    "actor / jurisdiction",
                    "safe layer",
                    "top axes",
                    "top priority",
                ]
            ),
            md_table_row(["---", "---:", "---:", "---:", "---", "---", "---", "---"]),
        ]
    )
    for profile in summary["family_profiles"]:
        top_axes = ", ".join(
            f"`{axis}`:{count}"
            for axis, count in Counter(profile["axis_counts"]).most_common(4)
        )
        top_priority = ", ".join(
            f"`{priority}`:{count}"
            for priority, count in Counter(profile["priority_counts"]).most_common(2)
        )
        lines.append(
            md_table_row(
                [
                    f"`{profile['source_family']}`",
                    profile["source_count"],
                    profile["integrated_count"],
                    profile["unintegrated_count"],
                    f"{profile['actor']} / {profile['jurisdiction']}",
                    profile["safe_layer"],
                    top_axes,
                    top_priority,
                ]
            )
        )

    lines.extend(
        [
            "",
            "## Priority Read Queue",
            "",
            "次の80件は、Core完成前のweb-cache SCIMA/FCHMA深読みに優先して回す候補である。本文引用やsource/support validity判断はしない。",
            "",
            md_table_row(["priority", "source", "family", "top axes", "routes"]),
            md_table_row(["---", "---", "---", "---", "---"]),
        ]
    )
    for item in summary["priority_read_queue"]:
        axes = ", ".join(f"`{axis}`" for axis in item["top_axes"][:4])
        routes = ", ".join(f"`{route}`" for route in item["routes"][:3])
        lines.append(
            md_table_row(
                [
                    f"`{item['priority']}`",
                    f"`{item['source_path']}`",
                    f"`{item['source_family']}`",
                    axes,
                    routes,
                ]
            )
        )

    lines.extend(
        [
            "",
            "## SCIMA/FCHMA Use Rules",
            "",
            "- web-cacheを、調査recordのケース数や支持根拠として数えない。",
            "- まずsource identity、source role、jurisdiction、claim typeを分ける。",
            "- 次に、Stage 1 routeのどの接触点、翻訳機序、自由度、反対読みを厚くできるかだけを見る。",
            "- C05/C06/C07/C08は、薄い軸として優先深読みに回す。ただし薄さは欠落ではなく、資料に出にくい自由度として扱う。",
            "- 海外資料は同型探索・反対構造探索には使えるが、日本の現行制度・法的・配慮判断へ直結しない。",
            "- MHLW/e-Gov/JEED/NIVRも、public/current/legal claimへ使う前にはlive verificationとhuman reviewを必要とする。",
            "",
            "## Next Safe Core Action",
            "",
            "このauditを入力にして、P0/P1 sourceから順に本文引用なしのSCIMA/FCHMA web-cache deep-reading cardsを作る。出力は、Stage 1 Core Completion Packetへ接続するsource-family reading layerであり、runtimeやpublic承認ではない。",
            "",
            f"JSON: `{OUTPUT_JSON.relative_to(REPO_ROOT)}`",
            f"JSONL source cards: `{OUTPUT_JSONL.relative_to(REPO_ROOT)}`",
        ]
    )
    OUTPUT_MD.write_text("\n".join(lines) + "\n", encoding="utf-8")


def main() -> None:
    cards = build_source_cards()
    summary = summarize(cards)
    data = {
        "artifact_id": "stage1_production_web_cache_scima_fchma_source_audit_v0_2026_05_23",
        "lane": "Falcon / Falcon Lab",
        "status": "source_audit_unreviewed_no_promotion_no_runtime_approval",
        "review_status": "unreviewed",
        "promotion_status": "no_promotion",
        "runtime_status": "not_approved",
        "public_status": "not_public",
        "raw_text_exported": False,
        "source_artifacts": [
            str(FRAGMENTARY_MAP_JSON.relative_to(REPO_ROOT)),
            str(QUERY_INDEX_JSON.relative_to(REPO_ROOT)),
            "references/web-cache/",
        ],
        "method_boundary": {
            "web_cache_sources_are_not_cases": True,
            "no_source_validity_decision": True,
            "no_support_validity_judgment": True,
            "no_public_or_current_policy_claim": True,
            "no_knowledge_promotion": True,
            "no_runtime_approval": True,
        },
        "underread_axes": sorted(UNDERREAD_AXES),
        "axis_definitions": AXIS_DEFS,
        "summary": summary,
    }
    write_json(data, cards)
    write_markdown(data)
    print(
        json.dumps(
            {
                "sources": summary["total_web_cache_sources"],
                "integrated": summary["stage1_existing_integrated_sources"],
                "not_yet_integrated": summary["not_yet_integrated_sources"],
                "families": summary["family_count"],
                "json": str(OUTPUT_JSON.relative_to(REPO_ROOT)),
                "md": str(OUTPUT_MD.relative_to(REPO_ROOT)),
                "jsonl": str(OUTPUT_JSONL.relative_to(REPO_ROOT)),
            },
            ensure_ascii=False,
            indent=2,
        )
    )


if __name__ == "__main__":
    main()
