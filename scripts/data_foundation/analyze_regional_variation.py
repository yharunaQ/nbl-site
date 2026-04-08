"""
Regional variation analysis: prefecture-level differences in supporter quadrant distribution.

Uses 都道府県コード from toku18 attribute data joined with effectiveness features.
Identifies which regions have structural advantages/disadvantages for Q1 practice.
"""

import json
import pandas as pd
import numpy as np
from pathlib import Path

BASE = Path(__file__).parent.parent.parent
V0 = BASE / "data/analysis_ready/supporters/supporter_practice_toku18/v0"
V1 = BASE / "data/analysis_ready/supporters/supporter_practice_toku18/v1_effectiveness"
OUT_DIR = BASE / "data/analysis_ready/supporters/knowledge_network"
OUT_DIR.mkdir(parents=True, exist_ok=True)

# Prefecture code → name mapping (JIS X 0401)
PREF_NAMES = {
    1:"北海道",2:"青森",3:"岩手",4:"宮城",5:"秋田",6:"山形",7:"福島",
    8:"茨城",9:"栃木",10:"群馬",11:"埼玉",12:"千葉",13:"東京",14:"神奈川",
    15:"新潟",16:"富山",17:"石川",18:"福井",19:"山梨",20:"長野",
    21:"岐阜",22:"静岡",23:"愛知",24:"三重",25:"滋賀",26:"京都",
    27:"大阪",28:"兵庫",29:"奈良",30:"和歌山",31:"鳥取",32:"島根",
    33:"岡山",34:"広島",35:"山口",36:"徳島",37:"香川",38:"愛媛",39:"高知",
    40:"福岡",41:"佐賀",42:"長崎",43:"熊本",44:"大分",45:"宮崎",46:"鹿児島",47:"沖縄"
}

# Region grouping
REGIONS = {
    "北海道・東北": [1,2,3,4,5,6,7],
    "関東": [8,9,10,11,12,13,14],
    "中部": [15,16,17,18,19,20,21,22,23,24],
    "近畿": [25,26,27,28,29,30],
    "中国・四国": [31,32,33,34,35,36,37,38,39],
    "九州・沖縄": [40,41,42,43,44,45,46,47],
}
PREF_TO_REGION = {p: r for r, ps in REGIONS.items() for p in ps}


def load_data():
    # Load structured features for prefecture codes
    sf = pd.read_csv(V0 / "structured_features.csv")
    pref_data = sf[sf["raw_name"] == "都道府県コード"][["respondent_id", "raw_value_text"]].copy()
    pref_data.columns = ["supporter_id", "pref_code"]
    # Add tok_ prefix to match effectiveness features format
    pref_data["supporter_id"] = "tok_" + pref_data["supporter_id"].astype(str)
    pref_data["pref_code"] = pd.to_numeric(pref_data["pref_code"], errors="coerce")
    pref_data = pref_data.dropna(subset=["pref_code"])
    pref_data["pref_code"] = pref_data["pref_code"].astype(int)

    # Load quadrant features
    eff = pd.read_csv(V1 / "toku18_effectiveness_features.csv")

    # Merge
    merged = eff.merge(pref_data, on="supporter_id", how="left")
    merged["pref_name"] = merged["pref_code"].map(PREF_NAMES)
    merged["region"] = merged["pref_code"].map(PREF_TO_REGION)

    print(f"Total records: {len(merged)}")
    print(f"Records with prefecture: {merged['pref_code'].notna().sum()}")
    print(f"Missing prefecture: {merged['pref_code'].isna().sum()}")
    return merged


def analyze_regional_distribution(df):
    """Compute Q1/Q2 rates by prefecture and region."""

    # Prefecture-level
    pref_stats = []
    for pref_code, group in df.groupby("pref_code"):
        if pd.isna(pref_code):
            continue
        n = len(group)
        if n < 15:  # skip very small prefectures
            continue
        pref_code = int(pref_code)
        q1 = (group["quadrant"] == "Q1_true_expert").mean()
        q2 = (group["quadrant"] == "Q2_blocked").mean()
        q4 = (group["quadrant"] == "Q4_siloed").mean()

        # Key metric averages
        avg_boss = group["q14_internal_support"].mean()
        avg_mission = group["ideology_mandate"].mean()
        avg_practice = group["q5_experience"].mean()
        avg_coord = group["ideology_coord"].mean()

        pref_stats.append({
            "pref_code": pref_code,
            "pref_name": PREF_NAMES.get(pref_code, f"code_{pref_code}"),
            "region": PREF_TO_REGION.get(pref_code, "不明"),
            "n": n,
            "q1_rate": round(q1, 3),
            "q2_rate": round(q2, 3),
            "q4_rate": round(q4, 3),
            "avg_internal_support": round(avg_boss, 3),
            "avg_mission": round(avg_mission, 3),
            "avg_practice": round(avg_practice, 3),
            "avg_coord_ideology": round(avg_coord, 3),
        })

    pref_df = pd.DataFrame(pref_stats).sort_values("q1_rate", ascending=False)

    # Region-level
    region_stats = []
    for region, group in df.groupby("region"):
        if pd.isna(region):
            continue
        n = len(group)
        q1 = (group["quadrant"] == "Q1_true_expert").mean()
        q2 = (group["quadrant"] == "Q2_blocked").mean()

        region_stats.append({
            "region": region,
            "n": n,
            "q1_rate": round(q1, 3),
            "q2_rate": round(q2, 3),
            "avg_internal_support": round(group["q14_internal_support"].mean(), 3),
            "avg_mission": round(group["ideology_mandate"].mean(), 3),
            "avg_practice": round(group["q5_experience"].mean(), 3),
        })

    region_df = pd.DataFrame(region_stats).sort_values("q1_rate", ascending=False)

    return pref_df, region_df


def analyze_prefecture_barriers(df):
    """Identify key barriers by prefecture (top/bottom quartiles)."""

    valid = df.dropna(subset=["pref_code"])

    # Group by prefecture, compute mean barrier scores
    pref_barrier = valid.groupby("pref_code").agg(
        n=("supporter_id", "count"),
        q1_rate=("quadrant", lambda x: (x == "Q1_true_expert").mean()),
        internal_support=("q14_internal_support", "mean"),
        mission=("ideology_mandate", "mean"),
        experience=("q5_experience", "mean"),
        coord_ideology=("ideology_coord", "mean"),
    ).reset_index()
    pref_barrier = pref_barrier[pref_barrier["n"] >= 15]

    # Classify into top/bottom quartile by q1_rate
    q75 = pref_barrier["q1_rate"].quantile(0.75)
    q25 = pref_barrier["q1_rate"].quantile(0.25)

    top_prefs = pref_barrier[pref_barrier["q1_rate"] >= q75].copy()
    bot_prefs = pref_barrier[pref_barrier["q1_rate"] <= q25].copy()

    top_prefs["pref_name"] = top_prefs["pref_code"].map(PREF_NAMES)
    bot_prefs["pref_name"] = bot_prefs["pref_code"].map(PREF_NAMES)

    return top_prefs, bot_prefs, pref_barrier


def compute_regional_insight(pref_df, top_prefs, bot_prefs):
    """Generate interpretable insights from regional analysis."""

    insights = {}

    # Top vs bottom regions comparison
    top_means = top_prefs[["internal_support", "mission", "experience", "coord_ideology"]].mean()
    bot_means = bot_prefs[["internal_support", "mission", "experience", "coord_ideology"]].mean()

    insights["top_vs_bottom_comparison"] = {
        "top_quartile_prefs": top_prefs[["pref_name", "q1_rate", "n"]].to_dict("records"),
        "bottom_quartile_prefs": bot_prefs[["pref_name", "q1_rate", "n"]].to_dict("records"),
        "factor_differences": {
            "internal_support_diff": round(top_means["internal_support"] - bot_means["internal_support"], 3),
            "mission_diff": round(top_means["mission"] - bot_means["mission"], 3),
            "experience_diff": round(top_means["experience"] - bot_means["experience"], 3),
            "coord_ideology_diff": round(top_means["coord_ideology"] - bot_means["coord_ideology"], 3),
        },
        "interpretation": (
            "上位県と下位県の差は、連携志向理念（ideology）より「機関ミッション」「実践経験」の差が大きい可能性がある。"
            "地域差は個人の意欲の差ではなく、機関環境の差が主体。"
        )
    }

    # Find which factor explains most regional variation
    corr_q1_mission = pref_df["q1_rate"].corr(pref_df["avg_mission"])
    corr_q1_support = pref_df["q1_rate"].corr(pref_df["avg_internal_support"])
    corr_q1_practice = pref_df["q1_rate"].corr(pref_df["avg_practice"])
    corr_q1_ideology = pref_df["q1_rate"].corr(pref_df["avg_coord_ideology"])

    insights["correlation_with_q1_rate"] = {
        "mission_mandate": round(corr_q1_mission, 3),
        "internal_support_boss": round(corr_q1_support, 3),
        "practice_experience": round(corr_q1_practice, 3),
        "coord_ideology": round(corr_q1_ideology, 3),
        "strongest_predictor": max(
            [("mission_mandate", abs(corr_q1_mission)),
             ("internal_support_boss", abs(corr_q1_support)),
             ("practice_experience", abs(corr_q1_practice)),
             ("coord_ideology", abs(corr_q1_ideology))],
            key=lambda x: x[1]
        )[0]
    }

    return insights


def main():
    print("Loading data...")
    df = load_data()

    print("Analyzing regional distribution...")
    pref_df, region_df = analyze_regional_distribution(df)
    top_prefs, bot_prefs, pref_barrier = analyze_prefecture_barriers(df)

    print("Computing insights...")
    insights = compute_regional_insight(pref_df, top_prefs, bot_prefs)

    # Compile output
    output = {
        "summary": {
            "n_prefectures_analyzed": len(pref_df),
            "n_regions": len(region_df),
            "total_n": len(df),
            "pref_coverage": round(df["pref_code"].notna().mean(), 3),
        },
        "region_distribution": region_df.to_dict("records"),
        "prefecture_distribution": pref_df.to_dict("records"),
        "top_bottom_analysis": insights,
        "key_findings": {}
    }

    # Key findings
    if len(pref_df) > 0:
        output["key_findings"] = {
            "q1_rate_range": {
                "max": round(pref_df["q1_rate"].max(), 3),
                "min": round(pref_df["q1_rate"].min(), 3),
                "mean": round(pref_df["q1_rate"].mean(), 3),
                "std": round(pref_df["q1_rate"].std(), 3),
                "max_pref": pref_df.iloc[0]["pref_name"],
                "min_pref": pref_df.iloc[-1]["pref_name"],
            },
            "implication": (
                "地域差が大きければ「地域環境が支援者実践力を決定している」構造的証拠となる。"
                "差が小さければ「全国共通の機関構造問題」と解釈できる。"
            )
        }

    # Save
    out_path = OUT_DIR / "regional_variation_analysis.json"
    json.dump(output, open(out_path, "w", encoding="utf-8"), ensure_ascii=False, indent=2)
    print(f"Saved: {out_path}")

    # Print results
    print("\n=== Regional Variation Results ===")
    print(f"Prefectures analyzed: {output['summary']['n_prefectures_analyzed']}")
    print(f"Prefecture coverage: {output['summary']['pref_coverage']:.1%}")

    print("\n--- Region-level Q1 rates ---")
    for r in region_df.to_dict("records"):
        print(f"  {r['region']}: Q1={r['q1_rate']:.1%}, Q2={r['q2_rate']:.1%}, n={r['n']}")

    print("\n--- Q1 rate range by prefecture ---")
    kf = output["key_findings"]
    if kf:
        print(f"  Max: {kf['q1_rate_range']['max']:.1%} ({kf['q1_rate_range']['max_pref']})")
        print(f"  Min: {kf['q1_rate_range']['min']:.1%} ({kf['q1_rate_range']['min_pref']})")
        print(f"  Mean: {kf['q1_rate_range']['mean']:.1%}, SD: {kf['q1_rate_range']['std']:.3f}")

    print("\n--- Correlation of prefecture Q1 rate with key factors ---")
    corr = output["top_bottom_analysis"]["correlation_with_q1_rate"]
    for k, v in corr.items():
        if k != "strongest_predictor":
            print(f"  {k}: r={v}")
    print(f"  → Strongest predictor: {corr['strongest_predictor']}")

    print("\n--- Top/Bottom prefecture factor comparison ---")
    diff = output["top_bottom_analysis"]["top_vs_bottom_comparison"]["factor_differences"]
    for k, v in diff.items():
        print(f"  {k}: {v:+.3f}")


if __name__ == "__main__":
    main()
