from __future__ import annotations

import json
from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import mm
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import (
    BaseDocTemplate,
    Flowable,
    Frame,
    ListFlowable,
    ListItem,
    PageBreak,
    PageTemplate,
    Paragraph,
    Spacer,
    Table,
)


ROOT = Path(__file__).resolve().parents[2]
OUT_DIR = ROOT / "references/derived/scima-fchma/stage1-production-v0-2026-05-18"
CONTENT_JSON = OUT_DIR / "stage1-production-l3-work-design-primer-scene5-reader-sample-content-v0-2026-05-26.json"
PDF_PATH = OUT_DIR / "stage1-production-l3-work-design-primer-scene5-reader-sample-v0-2026-05-26.pdf"

FONT_CANDIDATES = [
    Path("/Library/Fonts/Microsoft/MS PGothic.ttf"),
    Path("/Library/Fonts/Microsoft/MS Gothic.ttf"),
    Path("/System/Library/Fonts/Supplemental/AppleGothic.ttf"),
]


def register_font() -> str:
    for font_path in FONT_CANDIDATES:
        if font_path.exists():
            pdfmetrics.registerFont(TTFont("FalconReaderJP", str(font_path)))
            pdfmetrics.registerFont(TTFont("FalconReaderJP-Bold", str(font_path)))
            pdfmetrics.registerFontFamily(
                "FalconReaderJP",
                normal="FalconReaderJP",
                bold="FalconReaderJP-Bold",
                italic="FalconReaderJP",
                boldItalic="FalconReaderJP-Bold",
            )
            return "FalconReaderJP"
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
        "BodyJP",
        fontName=FONT,
        fontSize=10.2,
        leading=17,
        textColor=colors.HexColor("#25231f"),
        wordWrap="CJK",
        spaceAfter=7,
    )
)
styles.add(
    ParagraphStyle(
        "LeadJP",
        parent=styles["BodyJP"],
        fontSize=12.5,
        leading=21,
        textColor=colors.HexColor("#3b3833"),
        spaceAfter=10,
    )
)
styles.add(
    ParagraphStyle(
        "TitleJP",
        fontName=FONT,
        fontSize=27,
        leading=36,
        alignment=TA_LEFT,
        textColor=colors.HexColor("#25231f"),
        wordWrap="CJK",
    )
)
styles.add(
    ParagraphStyle(
        "H1JP",
        fontName=FONT,
        fontSize=18,
        leading=26,
        textColor=colors.HexColor("#25231f"),
        wordWrap="CJK",
        spaceAfter=9,
    )
)
styles.add(
    ParagraphStyle(
        "H2JP",
        fontName=FONT,
        fontSize=13.2,
        leading=18,
        textColor=colors.HexColor("#315f6c"),
        wordWrap="CJK",
        spaceAfter=5,
    )
)
styles.add(
    ParagraphStyle(
        "SmallJP",
        parent=styles["BodyJP"],
        fontSize=8.2,
        leading=12,
        textColor=colors.HexColor("#5b554c"),
    )
)
styles.add(
    ParagraphStyle(
        "ShiftLabelJP",
        parent=styles["SmallJP"],
        fontSize=7.2,
        leading=10,
        textColor=colors.HexColor("#5b554c"),
        spaceAfter=1.5,
    )
)
styles.add(
    ParagraphStyle(
        "ShiftOldJP",
        parent=styles["BodyJP"],
        fontSize=8.5,
        leading=13,
        textColor=colors.HexColor("#736c62"),
        spaceAfter=0,
    )
)
styles.add(
    ParagraphStyle(
        "ShiftArrowJP",
        parent=styles["SmallJP"],
        fontSize=10.5,
        leading=14,
        alignment=TA_CENTER,
        textColor=colors.HexColor("#315f6c"),
        spaceAfter=0,
    )
)
styles.add(
    ParagraphStyle(
        "ShiftNewJP",
        parent=styles["BodyJP"],
        fontSize=11.6,
        leading=17,
        textColor=colors.HexColor("#25231f"),
        spaceAfter=0,
    )
)


def para(text: str, style: str = "BodyJP") -> Paragraph:
    return Paragraph(ptxt(text), styles[style])


def heading(text: str) -> Paragraph:
    return Paragraph(ptxt(text), styles["H1JP"])


def subheading(text: str) -> Paragraph:
    return Paragraph(ptxt(text), styles["H2JP"])


def bullet_list(items: list[str]):
    return ListFlowable(
        [ListItem(para(item), bulletColor=colors.HexColor("#315f6c")) for item in items],
        bulletType="bullet",
        leftIndent=8 * mm,
    )


def panel(title: str, body: str, width: float | None = None):
    return Table(
        [[subheading(title)], [para(body)]],
        colWidths=[width] if width else None,
        style=[
            ("BOX", (0, 0), (-1, -1), 0.7, colors.HexColor("#d7d0c4")),
            ("BACKGROUND", (0, 0), (-1, -1), colors.white),
            ("LEFTPADDING", (0, 0), (-1, -1), 8),
            ("RIGHTPADDING", (0, 0), (-1, -1), 8),
            ("TOPPADDING", (0, 0), (-1, -1), 7),
            ("BOTTOMPADDING", (0, 0), (-1, -1), 7),
        ],
    )


def shift_panel(common: str, new_view: str, width: float | None = None):
    return Table(
        [
            [Paragraph("これまでの見方", styles["ShiftLabelJP"])],
            [Paragraph(ptxt(common), styles["ShiftOldJP"])],
            [Paragraph("↓ 見方を転換", styles["ShiftArrowJP"])],
            [Paragraph("この本の見方", styles["ShiftLabelJP"])],
            [Paragraph(ptxt(new_view), styles["ShiftNewJP"])],
        ],
        colWidths=[width] if width else None,
        style=[
            ("BOX", (0, 0), (-1, -1), 0.7, colors.HexColor("#d7d0c4")),
            ("BACKGROUND", (0, 0), (-1, 1), colors.HexColor("#f7f4ed")),
            ("BACKGROUND", (0, 2), (-1, 2), colors.white),
            ("BACKGROUND", (0, 3), (-1, 4), colors.HexColor("#f3f8f7")),
            ("LINEABOVE", (0, 3), (-1, 3), 2.4, colors.HexColor("#315f6c")),
            ("LEFTPADDING", (0, 0), (-1, -1), 8),
            ("RIGHTPADDING", (0, 0), (-1, -1), 8),
            ("TOPPADDING", (0, 0), (-1, -1), 5),
            ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
        ],
    )


class FlowMap(Flowable):
    def __init__(self, steps: list[list[str]]):
        super().__init__()
        self.steps = steps
        self.height = 60 * mm

    def wrap(self, avail_width, avail_height):
        self.width = avail_width
        return avail_width, self.height

    def draw(self):
        c = self.canv
        c.saveState()
        w, h = self.width, self.height
        c.setFillColor(colors.HexColor("#f4f0e8"))
        c.roundRect(0, 0, w, h, 4 * mm, stroke=0, fill=1)
        box_w = (w - 20 * mm) / 5
        for i, (number, title, _text) in enumerate(self.steps):
            x = 6 * mm + i * (box_w + 2 * mm)
            c.setFillColor(colors.white)
            c.setStrokeColor(colors.HexColor("#d7d0c4"))
            c.roundRect(x, 17 * mm, box_w, 29 * mm, 3 * mm, stroke=1, fill=1)
            c.setFillColor(colors.HexColor("#59663a"))
            c.circle(x + 7 * mm, 39 * mm, 4 * mm, stroke=0, fill=1)
            c.setFillColor(colors.white)
            c.setFont(FONT, 7)
            c.drawCentredString(x + 7 * mm, 36.7 * mm, number)
            c.setFillColor(colors.HexColor("#25231f"))
            c.setFont(FONT, 8.6)
            c.drawCentredString(x + box_w / 2, 29 * mm, title)
            if i < 4:
                c.setStrokeColor(colors.HexColor("#8b867c"))
                c.line(x + box_w + 0.6 * mm, 31 * mm, x + box_w + 1.8 * mm, 31 * mm)
        c.setFillColor(colors.HexColor("#5b554c"))
        c.setFont(FONT, 8.2)
        c.drawString(7 * mm, 8 * mm, "本人評価へ進む前に、情報が仕事になる流れを一度描く。")
        c.restoreState()


class ChapterMap(Flowable):
    def __init__(self, chapter_map: dict):
        super().__init__()
        self.chapter_map = chapter_map
        self.height = 50 * mm

    def wrap(self, avail_width, avail_height):
        self.width = avail_width
        return avail_width, self.height

    def draw(self):
        c = self.canv
        c.saveState()
        rows = self.chapter_map["rows"]
        hot = set(self.chapter_map["hot"])
        label_w = 42 * mm
        cell_w = (self.width - label_w - 14 * mm) / 7
        y = self.height - 14 * mm
        for row in rows:
            c.setFillColor(colors.HexColor("#5b554c"))
            c.setFont(FONT, 7.8)
            c.drawString(0, y + 2.8 * mm, row[0])
            for i, item in enumerate(row[1:]):
                x = label_w + i * (cell_w + 2 * mm)
                is_hot = item in hot
                c.setFillColor(colors.HexColor("#f3f8f7") if is_hot else colors.white)
                c.setStrokeColor(colors.HexColor("#315f6c") if is_hot else colors.HexColor("#d7d0c4"))
                c.rect(x, y, cell_w, 9 * mm, stroke=1, fill=1)
                c.setFillColor(colors.HexColor("#315f6c") if is_hot else colors.HexColor("#25231f"))
                c.setFont(FONT, 7.8)
                c.drawCentredString(x + cell_w / 2, y + 3 * mm, item)
            y -= 13 * mm
        c.restoreState()


def lens_box(lens: dict):
    rows = [
        [Paragraph(f"視点 {ptxt(lens['id'])}　{ptxt(lens['title'])}", styles["SmallJP"])],
        [Paragraph(ptxt(lens["readerTitle"]), styles["H1JP"])],
        [para(lens["body"])],
        [[subheading("見る問い"), para(lens["question"])]],
        [[subheading("ここで立ち止まる"), para(lens["not"])]],
    ]
    return Table(
        rows,
        colWidths=[165 * mm],
        style=[
            ("BOX", (0, 0), (-1, -1), 0.7, colors.HexColor("#d7d0c4")),
            ("BACKGROUND", (0, 0), (-1, 1), colors.HexColor("#f4f0e8")),
            ("BACKGROUND", (0, 3), (-1, 3), colors.HexColor("#f3f8f7")),
            ("BACKGROUND", (0, 4), (-1, 4), colors.HexColor("#fff3c7")),
            ("LEFTPADDING", (0, 0), (-1, -1), 8),
            ("RIGHTPADDING", (0, 0), (-1, -1), 8),
            ("TOPPADDING", (0, 0), (-1, -1), 7),
            ("BOTTOMPADDING", (0, 0), (-1, -1), 7),
        ],
    )


def on_page(canvas, doc):
    canvas.saveState()
    canvas.setFont(FONT, 7.5)
    canvas.setFillColor(colors.HexColor("#766f65"))
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
        title=content["meta"]["title"],
        author="Falcon",
    )
    frame = Frame(doc.leftMargin, doc.bottomMargin + 4 * mm, doc.width, doc.height - 2 * mm, id="normal")
    doc.addPageTemplates([PageTemplate(id="reader", frames=[frame], onPage=on_page)])

    story = []
    story.append(Paragraph(ptxt(content["meta"]["chapter"]), styles["SmallJP"]))
    story.append(Spacer(1, 10 * mm))
    story.append(Paragraph(ptxt(content["meta"]["title"]), styles["TitleJP"]))
    story.append(para(content["meta"]["subtitle"], "LeadJP"))
    story.append(PageBreak())

    story.append(heading(content["frameShift"]["title"]))
    story.append(para(content["frameShift"]["lead"], "LeadJP"))
    story.append(para(content["frameShift"]["core"]))
    shift_rows = []
    for i in range(0, len(content["frameShift"]["shifts"]), 2):
        pair = content["frameShift"]["shifts"][i : i + 2]
        shift_rows.append(
            [
                shift_panel(item["common"], item["newView"], 78 * mm)
                for item in pair
            ]
        )
    story.append(Table(shift_rows, colWidths=[82 * mm, 82 * mm], style=[("VALIGN", (0, 0), (-1, -1), "TOP")]))
    story.append(Spacer(1, 5 * mm))
    story.append(para(content["frameShift"]["bridge"]))
    story.append(PageBreak())

    story.append(heading("まず、場面から入る"))
    story.append(para(content["opening"]["lead"], "LeadJP"))
    story.append(para(content["opening"]["point"]))
    story.append(panel(content["scene"]["title"], content["scene"]["body"], 165 * mm))
    story.append(Spacer(1, 6 * mm))
    story.append(bullet_list(content["promise"]))
    story.append(PageBreak())

    story.append(heading("見え方を分ける"))
    story.append(para("同じ出来事でも、立場によって見えているものが違う。どれか一つを正解にする前に、まず分けて置く。"))
    rows = []
    for i in range(0, len(content["perspectives"]), 2):
        pair = content["perspectives"][i : i + 2]
        rows.append([panel(item["label"], item["text"], 78 * mm) for item in pair])
    story.append(Table(rows, colWidths=[82 * mm, 82 * mm], style=[("VALIGN", (0, 0), (-1, -1), "TOP")]))
    story.append(PageBreak())

    story.append(heading("仕事の流れを描く"))
    story.append(para("本人の能力や職場の理解へ進む前に、情報が仕事の中でどう流れているかを見る。"))
    story.append(FlowMap(content["flowSteps"]))
    story.append(Spacer(1, 6 * mm))
    for _number, title, text in content["flowSteps"]:
        story.append(subheading(title))
        story.append(para(text))
    story.append(PageBreak())

    story.append(heading("見直すための4つのレンズ"))
    story.append(para("専門用語を覚える必要はない。困った場面を見直すためのレンズとして使う。"))
    for lens in content["lenses"][:2]:
        story.append(lens_box(lens))
        story.append(Spacer(1, 5 * mm))
    story.append(PageBreak())
    for lens in content["lenses"][2:]:
        story.append(lens_box(lens))
        story.append(Spacer(1, 5 * mm))
    story.append(PageBreak())

    story.append(heading(content["exercise"]["title"]))
    story.append(bullet_list(content["exercise"]["items"]))
    story.append(Spacer(1, 8 * mm))
    story.append(heading(content["falconVoice"]["title"]))
    story.append(para(content["falconVoice"]["lead"], "LeadJP"))
    for item in content["falconVoice"]["points"]:
        story.append(panel(item["title"], item["text"], 165 * mm))
        story.append(Spacer(1, 4 * mm))
    story.append(para(content["falconVoice"]["closing"]))
    story.append(PageBreak())

    story.append(heading(content["chapterMap"]["title"]))
    story.append(para(content["chapterMap"]["text"]))
    story.append(ChapterMap(content["chapterMap"]))
    doc.build(story)
    print(f"Wrote {PDF_PATH.relative_to(ROOT)}")


if __name__ == "__main__":
    build()
