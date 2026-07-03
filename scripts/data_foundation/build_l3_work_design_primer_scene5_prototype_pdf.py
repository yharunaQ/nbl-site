from __future__ import annotations

import json
from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.enums import TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import mm
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import (
    BaseDocTemplate,
    Flowable,
    Frame,
    KeepTogether,
    ListFlowable,
    ListItem,
    PageBreak,
    PageTemplate,
    Paragraph,
    Spacer,
    Table,
    TableStyle,
)


ROOT = Path(__file__).resolve().parents[2]
OUT_DIR = ROOT / "references/derived/scima-fchma/stage1-production-v0-2026-05-18"
CONTENT_JSON = OUT_DIR / "stage1-production-l3-work-design-primer-scene5-prototype-content-v0-2026-05-26.json"
PDF_PATH = OUT_DIR / "stage1-production-l3-work-design-primer-scene5-prototype-v0-2026-05-26.pdf"

FONT_CANDIDATES = [
    Path("/Library/Fonts/Microsoft/MS PGothic.ttf"),
    Path("/Library/Fonts/Microsoft/MS Gothic.ttf"),
    Path("/System/Library/Fonts/Supplemental/AppleGothic.ttf"),
]


def register_font() -> str:
    for font_path in FONT_CANDIDATES:
        if font_path.exists():
            pdfmetrics.registerFont(TTFont("FalconJP", str(font_path)))
            pdfmetrics.registerFont(TTFont("FalconJP-Bold", str(font_path)))
            pdfmetrics.registerFontFamily(
                "FalconJP",
                normal="FalconJP",
                bold="FalconJP-Bold",
                italic="FalconJP",
                boldItalic="FalconJP-Bold",
            )
            return "FalconJP"
    raise FileNotFoundError("No Japanese-capable font found.")


FONT = register_font()
PAGE_W, PAGE_H = A4


def ptxt(value: str) -> str:
    return (
        str(value)
        .replace("&", "&amp;")
        .replace("<", "&lt;")
        .replace(">", "&gt;")
        .replace("\n", "<br/>")
    )


styles = getSampleStyleSheet()
styles.add(
    ParagraphStyle(
        "JPBody",
        fontName=FONT,
        fontSize=9.2,
        leading=15.2,
        textColor=colors.HexColor("#24221f"),
        wordWrap="CJK",
        spaceAfter=5,
    )
)
styles.add(
    ParagraphStyle(
        "JPLead",
        parent=styles["JPBody"],
        fontSize=11.2,
        leading=18,
        textColor=colors.HexColor("#3d3933"),
        spaceAfter=8,
    )
)
styles.add(
    ParagraphStyle(
        "JPTitle",
        fontName=FONT,
        fontSize=24,
        leading=32,
        alignment=TA_LEFT,
        textColor=colors.HexColor("#24221f"),
        wordWrap="CJK",
    )
)
styles.add(
    ParagraphStyle(
        "JPH1",
        fontName=FONT,
        fontSize=17,
        leading=24,
        textColor=colors.HexColor("#24221f"),
        wordWrap="CJK",
        spaceAfter=8,
    )
)
styles.add(
    ParagraphStyle(
        "JPH2",
        fontName=FONT,
        fontSize=12.4,
        leading=17,
        textColor=colors.HexColor("#2f403f"),
        wordWrap="CJK",
        spaceAfter=5,
    )
)
styles.add(
    ParagraphStyle(
        "JPSmall",
        parent=styles["JPBody"],
        fontSize=7.8,
        leading=11.5,
        textColor=colors.HexColor("#625d55"),
    )
)


class Boundary(Flowable):
    text = (
        "Internal Falcon Lab prototype / no source validity decision / no support validity decision / "
        "no public approval / no runtime approval / synthetic examples only"
    )

    def __init__(self):
        super().__init__()
        self.height = 16 * mm

    def wrap(self, avail_width, avail_height):
        self.width = avail_width
        return avail_width, self.height

    def draw(self):
        c = self.canv
        c.saveState()
        c.setFillColor(colors.HexColor("#f8f5ed"))
        c.setStrokeColor(colors.HexColor("#c9c0b0"))
        c.roundRect(0, 0, self.width, self.height, 3 * mm, stroke=1, fill=1)
        c.setFillColor(colors.HexColor("#4d4840"))
        c.setFont(FONT, 7.2)
        c.drawString(4 * mm, 6.1 * mm, self.text)
        c.restoreState()


class FlowDiagram(Flowable):
    def __init__(self):
        super().__init__()
        self.height = 68 * mm

    def wrap(self, avail_width, avail_height):
        self.width = avail_width
        return avail_width, self.height

    def draw(self):
        c = self.canv
        c.saveState()
        w, h = self.width, self.height
        c.setFillColor(colors.HexColor("#faf7ef"))
        c.setStrokeColor(colors.HexColor("#333333"))
        c.roundRect(0, 0, w, h, 6 * mm, stroke=1, fill=1)
        c.setFillColor(colors.HexColor("#24221f"))
        c.setFont(FONT, 12)
        c.drawString(8 * mm, h - 13 * mm, "職場断面図: 情報が仕事手順になるまで")
        steps = ["仕事要求", "情報形式", "作業手順", "確認回路", "評価・役割"]
        fills = ["#e7f2f0", "#f1e2d2", "#fff8d9", "#e4e9ce", "#f3edf5"]
        box_w = (w - 24 * mm) / 5
        y = 32 * mm
        for i, step in enumerate(steps):
            x = 8 * mm + i * (box_w + 2 * mm)
            c.setFillColor(colors.HexColor(fills[i]))
            c.setStrokeColor(colors.HexColor("#303030"))
            c.roundRect(x, y, box_w, 14 * mm, 3 * mm, stroke=1, fill=1)
            c.setFillColor(colors.HexColor("#24221f"))
            c.setFont(FONT, 8.4)
            c.drawCentredString(x + box_w / 2, y + 5 * mm, step)
            if i < 4:
                c.setStrokeColor(colors.HexColor("#5f5a52"))
                c.line(x + box_w + 0.8 * mm, y + 7 * mm, x + box_w + 2.0 * mm, y + 7 * mm)
        points = ["道具・座席", "会議・文書・音声", "指示・切替", "戻り方"]
        c.setStrokeColor(colors.HexColor("#8b867c"))
        c.setDash(4, 4)
        c.line(16 * mm, 17 * mm, w - 16 * mm, 17 * mm)
        c.setDash()
        for i, point in enumerate(points):
            x = 25 * mm + i * ((w - 50 * mm) / 3)
            c.setFillColor(colors.white)
            c.setStrokeColor(colors.HexColor("#25636f"))
            c.circle(x, 17 * mm, 10 * mm, stroke=1, fill=1)
            c.setFillColor(colors.HexColor("#24221f"))
            c.setFont(FONT, 7.2)
            c.drawCentredString(x, 16 * mm, point)
        c.restoreState()


def para(text: str, style: str = "JPBody"):
    return Paragraph(ptxt(text), styles[style])


def bullet_list(items: list[str]):
    return ListFlowable(
        [ListItem(para(item), bulletColor=colors.HexColor("#25636f")) for item in items],
        bulletType="bullet",
        start="circle",
        leftIndent=10 * mm,
    )


def heading(text: str):
    return Paragraph(ptxt(text), styles["JPH1"])


def subheading(text: str):
    return Paragraph(ptxt(text), styles["JPH2"])


def small_panel(title: str, body: str, width: float | None = None):
    table = Table(
        [[subheading(title)], [para(body)]],
        colWidths=[width] if width else None,
        style=[
            ("BACKGROUND", (0, 0), (-1, -1), colors.white),
            ("BOX", (0, 0), (-1, -1), 0.8, colors.HexColor("#d7d0c3")),
            ("LEFTPADDING", (0, 0), (-1, -1), 7),
            ("RIGHTPADDING", (0, 0), (-1, -1), 7),
            ("TOPPADDING", (0, 0), (-1, -1), 7),
            ("BOTTOMPADDING", (0, 0), (-1, -1), 7),
        ],
    )
    return table


def pattern_card(card: dict):
    rows = [
        [Paragraph(f"視点{card['n']:02d} / {ptxt(card['role'])}", styles["JPSmall"])],
        [Paragraph(ptxt(card["plainTitle"]), styles["JPH1"])],
        [Paragraph(ptxt(card["question"]), styles["JPLead"])],
        [para(card["core"])],
        [[subheading("合成例"), para(card["example"])]],
        [[subheading("別の読み"), para(card["alternate"])]],
        [[subheading("source lens"), bullet_list(card["sourceLens"])]],
        [[subheading("確認問い"), bullet_list(card["check"])]],
        [para(f"ここで立ち止まる: {card['stop']}")],
        [Paragraph(ptxt(f"つながる視点: {card['connected']}"), styles["JPSmall"])],
    ]
    table = Table(
        rows,
        colWidths=[165 * mm],
        style=[
            ("BOX", (0, 0), (-1, -1), 0.8, colors.HexColor("#d7d0c3")),
            ("BACKGROUND", (0, 0), (-1, 1), colors.HexColor("#f7f4ec")),
            ("BACKGROUND", (0, 8), (-1, 8), colors.HexColor("#fff7df")),
            ("LEFTPADDING", (0, 0), (-1, -1), 8),
            ("RIGHTPADDING", (0, 0), (-1, -1), 8),
            ("TOPPADDING", (0, 0), (-1, -1), 6),
            ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
        ],
    )
    return table


def on_page(canvas, doc):
    canvas.saveState()
    canvas.setFont(FONT, 7)
    canvas.setFillColor(colors.HexColor("#716a60"))
    canvas.drawString(18 * mm, 9 * mm, "Falcon Lab / Scene 5 prototype / boundaries unmoved")
    canvas.drawRightString(PAGE_W - 18 * mm, 9 * mm, str(canvas.getPageNumber()))
    canvas.restoreState()


def build() -> None:
    content = json.loads(CONTENT_JSON.read_text(encoding="utf-8"))
    doc = BaseDocTemplate(
        str(PDF_PATH),
        pagesize=A4,
        leftMargin=18 * mm,
        rightMargin=18 * mm,
        topMargin=18 * mm,
        bottomMargin=18 * mm,
        title=content["metadata"]["title"],
        author="Falcon Lab",
    )
    frame = Frame(
        doc.leftMargin,
        doc.bottomMargin + 6 * mm,
        doc.width,
        doc.height - 4 * mm,
        id="normal",
    )
    doc.addPageTemplates([PageTemplate(id="standard", frames=[frame], onPage=on_page)])

    story = []
    story.append(Paragraph("Falcon Lab / L3 Work Design Primer", styles["JPSmall"]))
    story.append(Spacer(1, 10 * mm))
    story.append(Paragraph(ptxt(content["metadata"]["title"]), styles["JPTitle"]))
    story.append(Paragraph(ptxt(content["metadata"]["subtitle"]), styles["JPLead"]))
    story.append(Spacer(1, 8 * mm))
    story.append(Boundary())
    story.append(Spacer(1, 9 * mm))
    story.append(heading("完成版の試験条件"))
    story.append(
        para(
            "7つの現場場面を主導線にしながら、背後の3x7知識地図と21視点カードを本文中で使えるようにする。第5章は、その統合が最も難しく、最も価値が見える章である。"
        )
    )
    story.append(PageBreak())

    story.append(Boundary())
    story.append(heading("この章で見ること"))
    story.append(para(content["chapter"]["readerPromise"], "JPLead"))
    story.append(
        Table(
            [[small_panel("合成場面", content["chapter"]["scene"], 78 * mm), small_panel("この章ではないもの", content["chapter"]["notThis"], 78 * mm)]],
            colWidths=[82 * mm, 82 * mm],
            style=[("VALIGN", (0, 0), (-1, -1), "TOP")],
        )
    )
    story.append(Spacer(1, 5 * mm))
    story.append(para("視点13は第4章の翻訳・支援容量に属するが、第5章では再登場させる。情報が共有されたことと、作業手順として使えることは同じではない。"))
    story.append(PageBreak())

    story.append(Boundary())
    story.append(heading("職場断面図と情報フロー"))
    story.append(para("本人の中に問題を置く前に、仕事の接点を順番に見る。仕事要求、情報形式、作業手順、確認回路、評価・役割のどこで自由度が閉じているかを見る。"))
    story.append(FlowDiagram())
    story.append(Spacer(1, 5 * mm))
    story.append(para("誤読ガード: 図解は正しい配慮手順ではない。観察、仮説、未確認文脈、別の読みを置くための作業台である。"))
    story.append(PageBreak())

    story.append(Boundary())
    story.append(heading("source lens: 見え方の差を残す"))
    lens_rows = []
    for i in range(0, len(content["sourceLens"]), 2):
        pair = content["sourceLens"][i : i + 2]
        lens_rows.append([small_panel(item["label"], item["text"], 78 * mm) for item in pair])
    story.append(Table(lens_rows, colWidths=[82 * mm, 82 * mm], style=[("VALIGN", (0, 0), (-1, -1), "TOP")]))
    story.append(Spacer(1, 5 * mm))
    story.append(para("source lensの差は、平均して一つの説明にしない。差があること自体が、次の問いを作る材料である。"))
    story.append(PageBreak())

    for card in content["cards"]:
        story.append(Boundary())
        story.append(pattern_card(card))
        story.append(PageBreak())

    story.append(Boundary())
    story.append(heading("読者別に、問いへ変える"))
    rows = []
    for i in range(0, len(content["readerQuestions"]), 2):
        pair = content["readerQuestions"][i : i + 2]
        rows.append([small_panel(item["role"], item["question"], 78 * mm) for item in pair])
    story.append(Table(rows, colWidths=[82 * mm, 82 * mm], style=[("VALIGN", (0, 0), (-1, -1), "TOP")]))
    story.append(Spacer(1, 6 * mm))
    story.append(heading("5-10分の演習"))
    story.append(bullet_list(content["exercise"]))
    story.append(PageBreak())

    story.append(Boundary())
    story.append(heading("Falconならどう返すか"))
    story.append(para("Falconが返してよいのは、構造仮説、反対仮説、欠落文脈、次の質問である。"))
    story.append(subheading("よい返し方"))
    story.append(bullet_list(content["falconExample"]["good"]))
    story.append(Spacer(1, 4 * mm))
    story.append(subheading("してはいけない返し方"))
    story.append(bullet_list(content["falconExample"]["bad"]))
    story.append(PageBreak())

    story.append(Boundary())
    story.append(heading(content["scene1ToneSample"]["title"]))
    story.append(para(content["scene1ToneSample"]["text"], "JPLead"))
    story.append(Spacer(1, 6 * mm))
    story.append(heading("レビューで見ること"))
    story.append(bullet_list(content["reviewChecklist"]))

    doc.build(story)
    print(f"Wrote {PDF_PATH.relative_to(ROOT)}")


if __name__ == "__main__":
    build()
