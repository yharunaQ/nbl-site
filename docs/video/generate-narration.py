#!/usr/bin/env python3
"""
配慮設計アシスト 紹介動画 ナレーション音声生成スクリプト
VOICEVOX ずんだもん（ノーマル / speaker_id=3）
"""

import json
import urllib.request
import urllib.parse
import sys
from pathlib import Path

VOICEVOX_URL = "http://localhost:50021"
SPEAKER_ID = 3  # ずんだもん ノーマル
OUTPUT_DIR = Path(__file__).parent / "audio"

SCENES = {
    "scene_01_問題提起": """\
就労支援の相談が終わったあと、何をしていますか。

「この人には、どんな調整が必要だろう。」
「職場に、どう伝えればいいか。」

整理しなければならないことは多いのに、手を動かし始めるまでに時間がかかる。

経験を積んだ支援員でも、相談のたびに一から考える。
支援員によって、整理の深さにばらつきが出る。

そこに、AIの補助を入れられないか。
それが、配慮設計アシストの出発点です。\
""",

    "scene_02_思想": """\
このツールには、一つの前提があります。

「配慮」を、特別な気遣いとして見るのではなく、仕事・環境・支援・時間の条件を調整することとして読み替える、という前提です。

同じ診断名でも、業務の内容、職場の環境、使える支援が違えば、必要な調整はまったく違います。

診断名から答えを決め打ちするのではなく、その人の条件から考える。

配慮設計アシストは、そのための整理を速くする道具です。\
""",

    "scene_03_ツール概要": """\
配慮設計アシストは、就労支援員、ジョブコーチ、障害者職業生活相談員が、相談後の整理に使うAI補助ツールです。

相談内容を入力すると、職業的課題の仮見立てと、配慮候補の優先順位をドラフトします。

操作は4ステップ。慣れれば1件あたり、10分から15分です。\
""",

    "scene_04_操作デモ": """\
まず、相談内容を自由に入力します。

診断名がなくても、整理しきれていなくても大丈夫です。

「疲れやすいと言っている。」
「通院が週2回ある。」
「前職で、指示の受け方が難しかった。」

気になっていることを、そのまま書いてください。

次に、AIが課題カテゴリを候補として提示します。

これは、26の職場課題フレームと照合した結果です。

「この項目は当てはまらない。」
「これは優先度が高い。」

実態に合わせて、選び直せます。AIの提案はあくまで候補です。最終的な選択は、支援員が判断します。

続いて、見立てを確定するために、いくつか補足を聞きます。

就労前の段階か、就労後か。職場環境の特徴。使えそうな支援体制など。

わかる範囲で答えるだけで、十分です。

最後に、配慮候補のドラフトが出ます。

職業的課題の仮見立て、優先順位の高い調整項目、合意文書のドラフト。これらが、一つの流れで出力されます。

そのままコピーして、記録や、職場との合意形成に使えます。\
""",

    "scene_05_出力の読み方": """\
出力されたドラフトは、「答え」ではなく「叩き台」です。

「この調整項目は、この職場では難しいかもしれない。」
「本人はこう言っていたが、優先順位は変えた方がいい。」

支援員が確認・修正する前提で作られています。

AIが整理の土台を作り、人が文脈と判断を加える。この役割分担が、このツールの使い方です。

1076件の職場課題データと、就労支援の実践事例をもとに整理しているため、一人で一から考えるより、見落としが減ります。\
""",

    "scene_06_境界の明示": """\
二つのことを、はっきりお伝えします。

一つ目。最終判断は、必ず支援者と本人が行います。このツールは判断を代替しません。

二つ目。入力内容はNBLのサーバーに保存されません。ただし、AI処理のためOpenAIに送信されます。個人を特定できる情報は、入力しないでください。\
""",

    "scene_07_フィードバック": """\
配慮設計アシストは、使う人のフィードバックで育てていくツールです。

「この見立ては、実態と違った。」
「この調整項目は、現場では難しい。」

そういった声を、NBLがまとめ直し、フレームの精度を上げていきます。

AIが整理の土台を作り、支援員が現場の判断を加え、そのフィードバックが次のバージョンに戻る。

支援員とAIが一緒に学んでいく。それが、NBLの考え方です。

だから最初は、招待制・無償で提供しています。まず使ってもらい、現場の声を聞かせてください。\
""",

    "scene_08_クロージング": """\
申込フォームから、職種とメールアドレスをお送りください。確認のうえ、数日以内にアクセストークンをお送りします。\
""",
}


def audio_query(text: str, speaker: int) -> dict:
    params = urllib.parse.urlencode({"text": text, "speaker": speaker})
    url = f"{VOICEVOX_URL}/audio_query?{params}"
    req = urllib.request.Request(url, method="POST")
    with urllib.request.urlopen(req) as res:
        return json.loads(res.read())


def synthesis(query: dict, speaker: int) -> bytes:
    params = urllib.parse.urlencode({"speaker": speaker})
    url = f"{VOICEVOX_URL}/synthesis?{params}"
    body = json.dumps(query).encode("utf-8")
    req = urllib.request.Request(
        url, data=body, method="POST",
        headers={"Content-Type": "application/json"}
    )
    with urllib.request.urlopen(req) as res:
        return res.read()


def main():
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    total = len(SCENES)

    for i, (name, text) in enumerate(SCENES.items(), 1):
        out_path = OUTPUT_DIR / f"{name}.wav"
        print(f"[{i}/{total}] {name} ...", end=" ", flush=True)

        try:
            query = audio_query(text, SPEAKER_ID)
            wav = synthesis(query, SPEAKER_ID)
            out_path.write_bytes(wav)
            size_kb = len(wav) // 1024
            print(f"OK ({size_kb} KB) → {out_path.name}")
        except Exception as e:
            print(f"ERROR: {e}", file=sys.stderr)
            sys.exit(1)

    print(f"\n完了: {OUTPUT_DIR}")


if __name__ == "__main__":
    main()
