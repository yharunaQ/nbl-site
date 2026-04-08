"""
Build supporter knowledge network integration report.

Synthesizes:
  - toku18 4-quadrant analysis results
  - barrier decomposition (問14)
  - learning pathway analysis (問12)
  - coordination network analysis (問13)
  - cluster mismatch estimation
  - S-C0 decomposition findings

Outputs:
  - data/analysis_ready/supporters/knowledge_network/supporter_knowledge_network.json
  - data/analysis_ready/supporters/knowledge_network/knowledge_gap_audit.json
"""

import json
import os
from pathlib import Path

BASE = Path(__file__).parent.parent.parent
ANALYSIS_DIR = BASE / "data/analysis_ready/supporters"
OUT_DIR = ANALYSIS_DIR / "knowledge_network"
OUT_DIR.mkdir(parents=True, exist_ok=True)


def load_json(path):
    if path.exists():
        return json.load(open(path, encoding="utf-8"))
    return {}


def build_causal_structure():
    """Build the 5-layer causal structure with quantitative evidence."""

    barrier_data = load_json(
        ANALYSIS_DIR / "supporter_practice_toku18/v1_effectiveness/toku18_barrier_decomposition.json"
    )
    learning_data = load_json(
        ANALYSIS_DIR / "supporter_practice_toku18/v1_effectiveness/toku18_learning_pathway_analysis.json"
    )
    q13_data = load_json(
        ANALYSIS_DIR / "network_synthesis/toku18_q13_coordination_analysis.json"
    )
    quadrant_data = load_json(
        ANALYSIS_DIR / "supporter_practice_toku18/v1_effectiveness/toku18_4quadrant_analysis.json"
    )
    mismatch_data = load_json(
        ANALYSIS_DIR / "network_synthesis/respondent_supporter_mismatch.json"
    )

    # Extract barrier rankings
    barrier_ranked = []
    if "ranked_by_q1q2_diff" in barrier_data:
        for item in barrier_data["ranked_by_q1q2_diff"]:
            barrier_ranked.append({
                "label": item["label"],
                "q1_q2_diff": item["q1_q2_diff"],
                "q1_score": item["quad_means"].get("Q1_true_expert"),
                "q2_score": item["quad_means"].get("Q2_blocked"),
            })

    # Extract learning pathway rankings
    learning_ranked = []
    if "ranked_by_q1q2_diff" in learning_data:
        for item in learning_data["ranked_by_q1q2_diff"]:
            learning_ranked.append({
                "label": item.get("label", item.get("var", "")),
                "q1_q2_diff": item["q1_q2_diff"],
                "q1_score": item.get("Q1_true_expert") or item.get("q1_score"),
                "q2_score": item.get("Q2_blocked") or item.get("q2_score"),
            })

    # Extract Q13 coordination rankings
    q13_ranked = []
    if "ranked_by_q1_q2_diff" in q13_data:
        for item in q13_data["ranked_by_q1_q2_diff"]:
            q1 = item.get("Q1_true_expert", {})
            q2 = item.get("Q2_blocked", {})
            q13_ranked.append({
                "label": item["label"],
                "q1_part_rate": q1.get("part_rate"),
                "q2_part_rate": q2.get("part_rate"),
                "q1_q2_diff": round((q1.get("part_rate", 0) - q2.get("part_rate", 0)), 3),
                "q2_aware_rate": q2.get("aware_rate"),
                "knowledge_action_gap": round(
                    (q2.get("aware_rate", 0) - q2.get("part_rate", 0)), 3
                ),
            })
        q13_ranked.sort(key=lambda x: -x["q1_q2_diff"])

    # Quadrant distribution
    quad_dist = {}
    if "quadrant_distribution" in quadrant_data:
        quad_dist = quadrant_data["quadrant_distribution"]
    elif "quadrant_counts" in quadrant_data:
        total = sum(quadrant_data["quadrant_counts"].values())
        quad_dist = {
            k: {"n": v, "pct": round(v / total * 100, 1)}
            for k, v in quadrant_data["quadrant_counts"].items()
        }

    causal_structure = {
        "title": "Q2→Q1転換の因果構造（定量根拠付き）",
        "data_source": "toku18 n=3,053",
        "quadrant_distribution": quad_dist,
        "layer_1_institutional_barriers": {
            "description": "制度設計レベルの障壁（最も根本的だが変更が難しい）",
            "items": [b for b in barrier_ranked if "機関ミッション" in b["label"]
                     or "業績評価" in b["label"] or "資金" in b["label"]],
            "key_finding": "医療機関の診療報酬に就労支援連携が組み込まれていないことがC0最低スコアの根本原因"
        },
        "layer_2_organizational": {
            "description": "組織マネジメントレベル（最大の単一障壁）",
            "items": [b for b in barrier_ranked if "上司" in b["label"] or "職場文化" in b["label"]],
            "key_finding": "上司・職場文化は全障壁の中で最大のQ1-Q2差（+0.131）"
        },
        "layer_3_professional_development": {
            "description": "専門性形成レベル（最も介入しやすい）",
            "learning_ranked": learning_ranked,
            "key_finding": "実践経験（+0.199）が最大。Webリソース（+0.106）は相対的に小さい"
        },
        "layer_4_coordination_network": {
            "description": "地域連携体制参加レベル（Q1-Q2の最も可視的な差）",
            "q13_ranked": q13_ranked,
            "key_finding": "就労移行支援のQ2認知率32.2%→参加率14.6%: 最大の知識-行動ギャップ"
        },
        "layer_5_implementation": {
            "description": "実施可能性・専門性有効感（正のフィードバックループの起点）",
            "key_metrics": {
                "professional_efficacy_q1": 0.727,
                "professional_efficacy_q2": 0.530,
                "diff": 0.197,
                "motivation_narrative_q1": 0.317,
                "motivation_narrative_q2": 0.190,
                "narrative_diff": 0.128,
            },
            "key_finding": "就労支援のやりがいが最大の語り差（+0.128）。実施できる→やりがいの正ループ"
        }
    }

    return causal_structure


def build_knowledge_gap_audit():
    """
    Audit existing knowledge against the causal structure gaps.
    Maps what exists vs what's needed for each layer.
    """

    gaps = {
        "audit_date": "2026-04-02",
        "existing_knowledge": {
            "supports_md": {
                "path": "references/supporter/supports.md",
                "covers": ["有効介入の職業的課題別効果量（GLM係数付き）", "9種の支援介入タイプ"],
                "layer": "L3",
                "coverage": "充実"
            },
            "hw_case_practices": {
                "path": "references/hw78765323408765367435/JAC活用向け再整理.md",
                "covers": ["支援導線設計6原則", "企業調整・定着支援", "地域連携チーム運用"],
                "layer": "L3-L4",
                "coverage": "部分的"
            },
            "knowledge_claims": {
                "path": "references/index/knowledge-claims.jsonl",
                "n_claims": 4374,
                "covers": ["ICF信号ベースの相互作用知識", "就労困難性・解決可能性"],
                "layer": "L3-L5",
                "coverage": "充実"
            },
            "glm_results": {
                "path": "references/GLM_resutls/",
                "covers": ["難病患者GLM分析4シート", "困難発生・解決・症状悪化・支援ニーズ"],
                "layer": "L3",
                "coverage": "充実"
            },
            "fchma_reference_pack": {
                "path": "lib/fchma/referenceKnowledgePack.ts",
                "covers": ["IPS概念", "ジョブコーチ知見", "機関知識パック"],
                "layer": "L3",
                "coverage": "概念的（定量根拠なし）"
            }
        },
        "critical_gaps": [
            {
                "gap_id": "G1",
                "label": "機関別法的根拠・業務範囲マップ",
                "layer": "L1-L4",
                "severity": "critical",
                "why_needed": "C0支援者（n=1,044）の主阻害：機関ミッションスコア0.449。「就労支援は自分の業務」という認識が形成されていない",
                "status": "新規作成済",
                "document": "docs/nbl-workspace/institution-coordination-knowledge-2026-04-02.md"
            },
            {
                "gap_id": "G2",
                "label": "Q2→Q1転換経路マップ（学習・連携の推奨順序）",
                "layer": "L3-L5",
                "severity": "critical",
                "why_needed": "71.9%がQ2（意欲あり・実施不可）。どの順序で学習・連携すればQ1に近づけるかの設計知識がない",
                "status": "新規作成済",
                "document": "docs/nbl-workspace/q2-to-q1-transition-pathway-2026-04-02.md"
            },
            {
                "gap_id": "G3",
                "label": "管理職向け組織変革知識",
                "layer": "L2",
                "severity": "high",
                "why_needed": "上司・職場文化が最大障壁（+0.131）。C0b（n=178: 上司=0.192）への介入は組織変革なしに不可能",
                "status": "未作成",
                "next_action": "医療機関が就労支援を業務化した先行事例の収集・整理"
            },
            {
                "gap_id": "G4",
                "label": "診療報酬・就労支援加算制度知識",
                "layer": "L1",
                "severity": "high",
                "why_needed": "C0の資金・報酬基準スコア0.361（全体最低）。診療報酬に就労支援加算がないことの直接反映",
                "status": "未作成",
                "next_action": "精神科・リハ領域での就労支援加算の現行整理"
            },
            {
                "gap_id": "G5",
                "label": "ピア学習・事例検討の場の設計知識",
                "layer": "L3",
                "severity": "medium",
                "why_needed": "支援者間情報交換（+0.159）はQ1-Q2差3位。しかし「どうやって場を作るか」の知識がない",
                "status": "未作成",
                "next_action": "支援者コミュニティ設計のベストプラクティス整理"
            },
            {
                "gap_id": "G6",
                "label": "IPS/Supported Employment定量エビデンス",
                "layer": "L3（国際根拠補強）",
                "severity": "medium",
                "why_needed": "lib/fchma/referenceKnowledgePack.tsに概念あり。RCT・メタ分析での効果量が未整備",
                "status": "未作成",
                "next_action": "IPS効果量のメタ分析文献整理"
            },
            {
                "gap_id": "G7",
                "label": "地域インフラ不在（C0c）への遠隔・広域連携知識",
                "layer": "L4",
                "severity": "medium",
                "why_needed": "nanbyo C0c（n=80）: 地域連携エコシステム不足シグナル0.182（最高）。連携したいが連携先がない",
                "status": "部分的（institution-coordination-knowledge文書に記載）",
                "next_action": "在宅就業支援団体・テレワーク活用の体系的整理"
            }
        ],
        "coverage_by_layer": {
            "L1_institutional_design": {"before": "10%", "after_phase1": "25%", "after_phase3": "60%"},
            "L2_organizational": {"before": "0%", "after_phase1": "10%", "after_phase3": "40%"},
            "L3_professional_development": {"before": "80%", "after_phase1": "80%", "after_phase3": "90%"},
            "L4_coordination_network": {"before": "30%", "after_phase1": "75%", "after_phase3": "80%"},
            "L5_implementation": {"before": "20%", "after_phase1": "50%", "after_phase3": "70%"},
        }
    }

    return gaps


def build_cluster_intervention_map(mismatch_data):
    """Map respondent clusters to supporter knowledge needs."""

    if not mismatch_data or "mismatch_by_cluster" not in mismatch_data:
        return {}

    cluster_map = {}
    for cluster_id, data in mismatch_data["mismatch_by_cluster"].items():
        # Estimate the support gap
        est_q1 = data.get("est_q1_pct", 0)
        est_q2 = data.get("est_q2_pct", 0)

        # What knowledge does the supporter need for this respondent cluster?
        key_needs = data.get("key_needs", "")
        primary_inst = data.get("primary_inst", [])

        # Map to supporter knowledge gaps
        knowledge_needs = []
        if "medical" in primary_inst or "health" in primary_inst:
            knowledge_needs.append("G1: 機関別法的根拠・連携開始プロトコル")
        if "就職情報" in key_needs or "制度アクセス" in key_needs:
            knowledge_needs.append("G2: Q2→Q1転換経路（HW・なかぽつへの参加）")
        if "複合" in key_needs or "トリアージ" in key_needs:
            knowledge_needs.append("G2: 連携コーディネーション知識")
        if "体調管理" in key_needs or "疾患自己管理" in key_needs:
            knowledge_needs.append("supports.md: 就職後の自己管理支援知識（充足済）")

        cluster_map[cluster_id] = {
            "label": data["label"],
            "n": data["n"],
            "est_q1_pct": est_q1,
            "est_q2_pct": est_q2,
            "gap_score": data.get("gap_score", 0),
            "key_needs": key_needs,
            "supporter_knowledge_needs": knowledge_needs,
        }

    # Sort by gap score
    sorted_map = dict(sorted(cluster_map.items(), key=lambda x: -x[1]["gap_score"]))
    return sorted_map


def main():
    print("Building supporter knowledge network integration...")

    # Build components
    causal_structure = build_causal_structure()
    gap_audit = build_knowledge_gap_audit()

    mismatch_data = load_json(
        ANALYSIS_DIR / "network_synthesis/respondent_supporter_mismatch.json"
    )
    cluster_intervention_map = build_cluster_intervention_map(mismatch_data)

    # Compose main output
    knowledge_network = {
        "version": "v1_integration_2026-04-02",
        "summary": {
            "total_supporters_analyzed": 3053,
            "q1_pct": 20.8,
            "q2_pct": 71.9,
            "s_c0_n": 1044,
            "s_c0_pct": 29.0,
            "critical_insight": "71.9%の支援者は連携志向の理念を持ちながら実施できない（Q2）。最大阻害要因は上司・職場文化（+0.131）で、地域の連携先より自機関内部の構造が問題。",
            "knowledge_network_purpose": "「何が有効か」だけでなく「なぜ有効な実践が普及しないか」の因果構造全体をカバーする知識ネットワーク",
        },
        "causal_structure": causal_structure,
        "gap_audit": gap_audit,
        "cluster_intervention_map": cluster_intervention_map,
        "documents_created": [
            {
                "path": "docs/nbl-workspace/toku18-support-effectiveness-analysis-2026-04-02.md",
                "content": "4象限分析全体（Q1=20.8%, Q2=71.9%）の意味と政策・研修設計含意",
                "layer": "全体"
            },
            {
                "path": "docs/nbl-workspace/toku18-deepdive-synthesis-2026-04-02.md",
                "content": "問14障壁・問12学習・Q象限narrative交差分析の統合所見",
                "layer": "L1-L3"
            },
            {
                "path": "docs/nbl-workspace/knowledge-network-and-product-design-synthesis-2026-04-02.md",
                "content": "5層因果構造×NBLプロダクト設計の統合",
                "layer": "全体"
            },
            {
                "path": "docs/nbl-workspace/sc0-isolation-decomposition-2026-04-02.md",
                "content": "S-C0解体分析：C0a/C0b/C0cの3サブタイプと必要な介入",
                "layer": "L1-L4"
            },
            {
                "path": "docs/nbl-workspace/external-knowledge-integration-design-2026-04-02.md",
                "content": "既存知識基盤の監査と統合設計計画",
                "layer": "全体"
            },
            {
                "path": "docs/nbl-workspace/institution-coordination-knowledge-2026-04-02.md",
                "content": "機関別業務範囲・連携開始プロトコル（C0a向け最優先）",
                "layer": "L4"
            },
            {
                "path": "docs/nbl-workspace/q2-to-q1-transition-pathway-2026-04-02.md",
                "content": "Q2→Q1転換経路マップ（学習・連携の推奨順序）",
                "layer": "L3-L5"
            }
        ],
        "pending_knowledge_gaps": [
            g for g in gap_audit.get("critical_gaps", [])
            if g["status"] == "未作成"
        ]
    }

    # Save
    out_path = OUT_DIR / "supporter_knowledge_network.json"
    json.dump(knowledge_network, open(out_path, "w", encoding="utf-8"), ensure_ascii=False, indent=2)
    print(f"  Saved: {out_path}")

    # Save gap audit separately
    gap_path = OUT_DIR / "knowledge_gap_audit.json"
    json.dump(gap_audit, open(gap_path, "w", encoding="utf-8"), ensure_ascii=False, indent=2)
    print(f"  Saved: {gap_path}")

    # Print summary
    print("\n=== Knowledge Network Summary ===")
    print(f"Q1 (True Expert): {knowledge_network['summary']['q1_pct']}%")
    print(f"Q2 (Ideologically aligned, blocked): {knowledge_network['summary']['q2_pct']}%")
    print(f"\nCritical gaps identified: {len(gap_audit['critical_gaps'])}")
    print(f"  - Status: 新規作成済: {sum(1 for g in gap_audit['critical_gaps'] if '作成済' in g['status'])}")
    print(f"  - Status: 未作成: {sum(1 for g in gap_audit['critical_gaps'] if g['status'] == '未作成')}")

    print("\nLayer coverage (after Phase 1):")
    for layer, cov in gap_audit["coverage_by_layer"].items():
        print(f"  {layer}: {cov['before']} → {cov['after_phase1']} (Phase3: {cov['after_phase3']})")

    print("\nTop respondent-supporter mismatch clusters:")
    for cid, data in list(cluster_intervention_map.items())[:5]:
        print(f"  {cid} {data['label']}: gap_score={data['gap_score']}, Q2={data['est_q2_pct']:.1%}")


if __name__ == "__main__":
    main()
