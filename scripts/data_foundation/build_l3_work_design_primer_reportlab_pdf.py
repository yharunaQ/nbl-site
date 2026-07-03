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
CONTENT_JSON = OUT_DIR / "stage1-production-l3-work-design-primer-book-content-v1-2026-05-26.json"
PDF_PATH = OUT_DIR / "stage1-production-l3-work-design-primer-book-v1-2026-05-26.pdf"

FONT_CANDIDATES = [
    Path("/Library/Fonts/Microsoft/MS PGothic.ttf"),
    Path("/Library/Fonts/Microsoft/MS Gothic.ttf"),
    Path("/System/Library/Fonts/Supplemental/AppleGothic.ttf"),
]


def register_fonts() -> str:
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
    raise FileNotFoundError("No Japanese-capable font found for PDF generation.")


FONT = register_fonts()
PAGE_W, PAGE_H = A4


def hex_color(value: str) -> colors.Color:
    value = value.lstrip("#")
    return colors.HexColor(f"#{value}")


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
        fontSize=9.4,
        leading=15.6,
        textColor=colors.HexColor("#2b2925"),
        spaceAfter=5,
        wordWrap="CJK",
    )
)
styles.add(
    ParagraphStyle(
        "JPLead",
        parent=styles["JPBody"],
        fontSize=11.2,
        leading=18.5,
        textColor=colors.HexColor("#34312d"),
        spaceAfter=8,
    )
)
styles.add(
    ParagraphStyle(
        "JPTitle",
        fontName=FONT,
        fontSize=27,
        leading=36,
        alignment=TA_LEFT,
        textColor=colors.HexColor("#24221f"),
        wordWrap="CJK",
    )
)
styles.add(
    ParagraphStyle(
        "JPSubtitle",
        parent=styles["JPLead"],
        fontSize=13.5,
        leading=22,
        textColor=colors.HexColor("#514d45"),
    )
)
styles.add(
    ParagraphStyle(
        "JPH1",
        fontName=FONT,
        fontSize=18,
        leading=25,
        textColor=colors.HexColor("#24221f"),
        spaceAfter=8,
        wordWrap="CJK",
    )
)
styles.add(
    ParagraphStyle(
        "JPH2",
        fontName=FONT,
        fontSize=13,
        leading=18,
        textColor=colors.HexColor("#2f403f"),
        spaceBefore=4,
        spaceAfter=5,
        wordWrap="CJK",
    )
)
styles.add(
    ParagraphStyle(
        "JPSmall",
        parent=styles["JPBody"],
        fontSize=8.1,
        leading=12.2,
        textColor=colors.HexColor("#5f5a52"),
    )
)
styles.add(
    ParagraphStyle(
        "JPCenter",
        parent=styles["JPBody"],
        alignment=TA_CENTER,
    )
)


class CoverPage(Flowable):
    def __init__(self):
        super().__init__()
        self.width = PAGE_W - 28 * mm
        self.height = PAGE_H - 30 * mm

    def wrap(self, avail_width, avail_height):
        return avail_width, avail_height

    def draw(self):
        c = self.canv
        x0, y0 = 0, 0
        w, h = self.width, self.height
        c.saveState()
        c.setFillColor(colors.HexColor("#fffdf8"))
        c.rect(-16 * mm, -16 * mm, PAGE_W, PAGE_H, stroke=0, fill=1)
        c.setFillColor(colors.HexColor("#e7f2f0"))
        c.circle(w * 0.78, h * 0.78, 42 * mm, stroke=0, fill=1)
        c.setFillColor(colors.HexColor("#24221f"))
        c.setFont(FONT, 9)
        c.drawString(x0, h - 18 * mm, "Falcon仕事設計入門")
        c.setFont(FONT, 29)
        c.drawString(x0, h - 42 * mm, "働き方を、")
        c.drawString(x0, h - 57 * mm, "条件から設計する")
        c.setFont(FONT, 13)
        c.setFillColor(colors.HexColor("#514d45"))
        c.drawString(x0, h - 74 * mm, "病名別の答えを越えて、人・仕事・環境の接点を読む入門")

        cx, cy = w * 0.52, h * 0.42
        top = (cx, cy + 45 * mm)
        left = (cx - 68 * mm, cy - 38 * mm)
        right = (cx + 68 * mm, cy - 38 * mm)
        bottom = (cx, cy - 55 * mm)
        for pts, fill, stroke in [
            ([top, left, bottom], "#d9ece8", "#25636f"),
            ([top, right, bottom], "#ead7c4", "#7b5134"),
            ([left, right, bottom], "#e4e9ce", "#545f2f"),
        ]:
            path = c.beginPath()
            path.moveTo(*pts[0])
            for pt in pts[1:]:
                path.lineTo(*pt)
            path.close()
            c.setFillColor(colors.HexColor(fill))
            c.setStrokeColor(colors.HexColor(stroke))
            c.setLineWidth(1.4)
            c.drawPath(path, stroke=1, fill=1)
        c.setFillColor(colors.white)
        c.setStrokeColor(colors.HexColor("#2f2f2f"))
        c.circle(cx, cy - 8 * mm, 21 * mm, stroke=1, fill=1)
        c.setFillColor(colors.HexColor("#24221f"))
        c.setFont(FONT, 13)
        c.drawCentredString(cx, cy - 6 * mm, "参加の余地")
        c.setFont(FONT, 7.5)
        c.drawCentredString(cx, cy - 14 * mm, "続ける・試す・戻る・育つ")
        c.setFont(FONT, 8.7)
        c.drawCentredString(cx - 43 * mm, cy + 5 * mm, "体調・治療・生活時間")
        c.drawCentredString(cx + 43 * mm, cy + 5 * mm, "入口・相談・情報共有")
        c.drawCentredString(cx, cy - 45 * mm, "仕事・評価・将来")

        c.setFillColor(colors.HexColor("#f7f4ec"))
        c.rect(x0, 10 * mm, w, 24 * mm, stroke=0, fill=1)
        c.setFillColor(colors.HexColor("#3d3b37"))
        c.setFont(FONT, 8.5)
        c.drawString(x0 + 5 * mm, 26 * mm, "人間は、標準仕様ではない。できない人を探すのではなく、できる条件を設計する。")
        c.drawString(x0 + 5 * mm, 19 * mm, "2026-05-26 / Falcon Stage 1 L3 Principal Interaction Patterns")
        c.restoreState()


class DiagramBox(Flowable):
    def __init__(self, kind: str, accent: colors.Color):
        super().__init__()
        self.kind = kind
        self.accent = accent
        self.height = 62 * mm

    def wrap(self, avail_width, avail_height):
        self.width = avail_width
        return avail_width, self.height

    def draw(self):
        c = self.canv
        w, h = self.width, self.height
        c.saveState()
        c.setFillColor(colors.HexColor("#f7f4ec"))
        c.roundRect(0, 0, w, h, 7 * mm, stroke=0, fill=1)
        c.setStrokeColor(self.accent)
        c.setLineWidth(2)
        c.roundRect(2 * mm, 2 * mm, w - 4 * mm, h - 4 * mm, 5 * mm, stroke=1, fill=0)
        c.setFillColor(self.accent)
        c.setFont(FONT, 13)
        if self.kind == "time":
            c.drawString(10 * mm, h - 14 * mm, "時間の地形図")
            c.setStrokeColor(self.accent)
            c.setLineWidth(3)
            points = [
                (12 * mm, 22 * mm),
                (35 * mm, 45 * mm),
                (58 * mm, 25 * mm),
                (84 * mm, 43 * mm),
                (112 * mm, 18 * mm),
                (142 * mm, 35 * mm),
                (174 * mm, 24 * mm),
            ]
            path = c.beginPath()
            path.moveTo(*points[0])
            for p in points[1:]:
                path.lineTo(*p)
            c.drawPath(path, stroke=1, fill=0)
            labels = ["起床", "通勤", "山場", "休憩", "通院", "回復", "翌日"]
            c.setFont(FONT, 7.5)
            for (x, y), label in zip(points, labels):
                c.circle(x, y, 2.2 * mm, stroke=0, fill=1)
                c.drawCentredString(x, 8 * mm, label)
        elif self.kind == "bridge":
            c.drawString(10 * mm, h - 14 * mm, "翻訳橋")
            c.setFont(FONT, 9)
            c.setFillColor(colors.HexColor("#ffffff"))
            boxes = [(15 * mm, 28 * mm, "本人の生活語"), (125 * mm, 28 * mm, "職場の仕事語"), (70 * mm, 10 * mm, "支援・制度の言葉")]
            for x, y, label in boxes:
                c.roundRect(x, y, 48 * mm, 12 * mm, 3 * mm, stroke=1, fill=1)
                c.setFillColor(colors.HexColor("#333333"))
                c.drawCentredString(x + 24 * mm, y + 4 * mm, label)
                c.setFillColor(colors.HexColor("#ffffff"))
            c.setStrokeColor(self.accent)
            c.setLineWidth(3)
            c.line(63 * mm, 34 * mm, 125 * mm, 34 * mm)
            c.line(94 * mm, 22 * mm, 94 * mm, 28 * mm)
        elif self.kind == "freedom":
            c.drawString(10 * mm, h - 14 * mm, "待つ・休む・試す余地")
            c.setFont(FONT, 8.5)
            labels = ["待つ", "休む", "試す", "選び直す"]
            for i, label in enumerate(labels):
                x = 16 * mm + i * 45 * mm
                y = 25 * mm if i % 2 == 0 else 16 * mm
                c.setFillColor(colors.white)
                c.roundRect(x, y, 32 * mm, 15 * mm, 7 * mm, stroke=1, fill=1)
                c.setFillColor(colors.HexColor("#333333"))
                c.drawCentredString(x + 16 * mm, y + 5.5 * mm, label)
                if i < len(labels) - 1:
                    c.setStrokeColor(self.accent)
                    c.setLineWidth(1.5)
                    c.line(x + 32 * mm, y + 7 * mm, x + 45 * mm, (25 * mm if (i + 1) % 2 == 0 else 16 * mm) + 7 * mm)
            c.setFillColor(colors.HexColor("#555047"))
            c.setFont(FONT, 7.4)
            c.drawCentredString(w / 2, 8 * mm, "自由度は、本人だけでなく職場と制度の設計で増減する")
        elif self.kind == "implementation":
            c.drawString(10 * mm, h - 14 * mm, "実装条件の分解")
            c.setFont(FONT, 8.3)
            boxes = [
                (12 * mm, 34 * mm, "安全"),
                (55 * mm, 34 * mm, "顧客"),
                (98 * mm, 34 * mm, "人員余力"),
                (35 * mm, 15 * mm, "代替体制"),
                (80 * mm, 15 * mm, "地域資源"),
            ]
            for x, y, label in boxes:
                c.setFillColor(colors.white)
                c.roundRect(x, y, 35 * mm, 12 * mm, 3 * mm, stroke=1, fill=1)
                c.setFillColor(colors.HexColor("#333333"))
                c.drawCentredString(x + 17.5 * mm, y + 4 * mm, label)
            c.setStrokeColor(self.accent)
            c.setLineWidth(1.2)
            c.setDash(3, 3)
            c.line(47 * mm, 34 * mm, 52 * mm, 27 * mm)
            c.line(72 * mm, 34 * mm, 72 * mm, 27 * mm)
            c.line(115 * mm, 34 * mm, 97 * mm, 27 * mm)
            c.setDash()
        elif self.kind == "value":
            c.drawString(10 * mm, h - 14 * mm, "参加の質")
            c.setFont(FONT, 8.5)
            labels = ["役割", "評価", "学び", "将来"]
            for i, label in enumerate(labels):
                x = 16 * mm + i * 42 * mm
                c.setFillColor(colors.white)
                c.roundRect(x, 24 * mm, 30 * mm, 16 * mm, 3 * mm, stroke=1, fill=1)
                c.setFillColor(colors.HexColor("#333333"))
                c.drawCentredString(x + 15 * mm, 30 * mm, label)
                if i < len(labels) - 1:
                    c.setStrokeColor(self.accent)
                    c.setLineWidth(1.6)
                    c.line(x + 30 * mm, 32 * mm, x + 42 * mm, 32 * mm)
            c.setFillColor(colors.HexColor("#555047"))
            c.setFont(FONT, 7.4)
            c.drawCentredString(w / 2, 9 * mm, "雇用継続だけでなく、参加の厚みを見る")
        else:
            c.drawString(10 * mm, h - 14 * mm, "職場の断面図")
            c.setFont(FONT, 8.5)
            boxes = [
                (12 * mm, 25 * mm, 48 * mm, 17 * mm, "作業・道具"),
                (74 * mm, 34 * mm, 48 * mm, 17 * mm, "情報・指示"),
                (134 * mm, 19 * mm, 52 * mm, 18 * mm, "評価・学び"),
            ]
            for x, y, bw, bh, label in boxes:
                c.setFillColor(colors.white)
                c.roundRect(x, y, bw, bh, 3 * mm, stroke=1, fill=1)
                c.setFillColor(colors.HexColor("#333333"))
                c.drawCentredString(x + bw / 2, y + 6 * mm, label)
            c.setStrokeColor(self.accent)
            c.setLineWidth(1.4)
            c.line(60 * mm, 33 * mm, 74 * mm, 41 * mm)
            c.line(122 * mm, 42 * mm, 134 * mm, 30 * mm)
        c.restoreState()


def para(text: str, style: str = "JPBody"):
    return Paragraph(ptxt(text), styles[style])


def bullet_list(items: list[str]):
    return ListFlowable(
        [ListItem(para(item, "JPBody"), bulletColor=colors.HexColor("#25636f")) for item in items],
        bulletType="bullet",
        start="circle",
        leftIndent=12,
        bulletFontName=FONT,
        bulletFontSize=7,
    )


def box_table(title: str, body, fill: colors.Color, border: colors.Color, width):
    if isinstance(body, list):
        content = [para(title, "JPH2"), bullet_list(body)]
    else:
        content = [para(title, "JPH2"), para(body, "JPBody")]
    table = Table([[content]], colWidths=[width])
    table.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, -1), fill),
                ("BOX", (0, 0), (-1, -1), 0.75, border),
                ("LEFTPADDING", (0, 0), (-1, -1), 10),
                ("RIGHTPADDING", (0, 0), (-1, -1), 10),
                ("TOPPADDING", (0, 0), (-1, -1), 8),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 8),
            ]
        )
    )
    return table


def on_page(canvas, doc):
    if canvas.getPageNumber() == 1:
        return
    canvas.saveState()
    canvas.setFont(FONT, 7.5)
    canvas.setFillColor(colors.HexColor("#77736b"))
    canvas.drawString(doc.leftMargin, 8 * mm, "働き方を、条件から設計する")
    canvas.drawRightString(PAGE_W - doc.rightMargin, 8 * mm, f"{canvas.getPageNumber()}")
    canvas.restoreState()


def add_cover(story):
    story.append(CoverPage())
    story.append(PageBreak())


def add_intro(story, data):
    story.append(para("はじめに", "JPH1"))
    story.append(para("この本は、障害や難病のある人だけのための本ではない。障害・難病の就労支援で見えてくるのは、私たちの仕事や社会が、どんな人間像を前提に作られてきたのかという問いである。", "JPLead"))
    story.append(para("体調が変わる。集中できる時間が違う。移動や休息に条件がある。説明できることと、説明すると不利になることがある。情報の受け取り方や、評価される場面が人によって違う。"))
    story.append(para("こうした違いを「例外」として扱う限り、仕事は一部の人にしか合わないものになる。"))
    story.append(para("障害や病気のある人の就労支援では、よく「この病名なら、どんな配慮が必要ですか」と聞かれる。現場では時間が限られている。本人も、支援者も、企業も、早く手がかりを得たい。病名別の配慮リストや支援メニュー表が役に立つ場面もある。"))
    story.append(para("けれども、それだけでは見落とすことがある。同じ病名でも働きにくさは同じではない。仕事の内容、通勤、勤務時間、情報の伝わり方、上司との相談線、評価、収入、治療、家庭の事情によって、困りごとの形は変わる。"))
    story.append(para("反対に、違う病名や障害名でも、同じ場所で選択肢が狭まることがある。問題は、本人の中だけにあるとは限らない。"))
    story.append(box_table("この本の立場", "この本は、障害や病気のある人に「何ができないか」を尋ねる本ではない。仕事、体調、生活、職場、制度、支援がどこでかみ合い、どこで選択肢を狭めているのかを見るための本である。", colors.HexColor("#f3f0e8"), colors.HexColor("#25636f"), 166 * mm))
    story.append(Spacer(1, 5 * mm))
    story.append(para("必要なのは、病名から答えを引くことではなく、人と仕事の接点を丁寧に読むことである。"))

    story.append(PageBreak())
    story.append(para("この本でできるようになること", "JPH1"))
    story.append(para("この本が目指すのは、すぐに正解を出すことではなく、よい問いを立てることである。"))
    reader_rows = [
        ["本人・家族", "困りごとを能力不足や病名だけに閉じず、仕事・環境・時間・支援との関係で言葉にできる。"],
        ["支援者", "本人の話を、職場や制度で使える問いへ置き換えられる。"],
        ["企業・現場", "安全、評価、人員余力、作業手順を分けて考えられる。"],
        ["政策・サービス設計", "制度メニューの有無ではなく、つながりが切れる場所を見られる。"],
    ]
    table = Table([[para(a, "JPH2"), para(b)] for a, b in reader_rows], colWidths=[42 * mm, 124 * mm])
    table.setStyle(TableStyle([
        ("GRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#ded8ca")),
        ("BACKGROUND", (0, 0), (0, -1), colors.HexColor("#f0ece2")),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("LEFTPADDING", (0, 0), (-1, -1), 7),
        ("RIGHTPADDING", (0, 0), (-1, -1), 7),
        ("TOPPADDING", (0, 0), (-1, -1), 6),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
    ]))
    story.append(table)
    story.append(Spacer(1, 6 * mm))
    story.append(para("支援とは、本人を仕事に合わせることでも、職場に負担を押しつけることでもない。人の条件、仕事の条件、制度の条件が接する場所を読み、続ける・試す・戻る・成長する余地を設計することである。", "JPLead"))


def add_three_entries(story, data):
    story.append(PageBreak())
    story.append(para("仕事を読み解く三つの入口", "JPH1"))
    story.append(para("三分類は、就職前、就職時、就職後という時系列ではない。どの段階でも三つの入口は同時に関係する。"))
    rows = []
    for i, plane in enumerate(data["planes"]):
        rows.append([
            para(plane["label"], "JPH2"),
            para(f"{plane['title']}。{plane['lead']}", "JPBody"),
        ])
    table = Table(rows, colWidths=[52 * mm, 114 * mm])
    table.setStyle(TableStyle([
        ("GRID", (0, 0), (-1, -1), 0.55, colors.HexColor("#ded8ca")),
        ("BACKGROUND", (0, 0), (0, 0), colors.HexColor("#d9ece8")),
        ("BACKGROUND", (0, 1), (0, 1), colors.HexColor("#ead7c4")),
        ("BACKGROUND", (0, 2), (0, 2), colors.HexColor("#e4e9ce")),
        ("BACKGROUND", (1, 0), (1, -1), colors.HexColor("#fffdf8")),
        ("LEFTPADDING", (0, 0), (-1, -1), 7),
        ("RIGHTPADDING", (0, 0), (-1, -1), 7),
        ("TOPPADDING", (0, 0), (-1, -1), 7),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 7),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
    ]))
    story.append(table)

    story.append(PageBreak())
    story.append(para("この本を使うための六つの約束", "JPH1"))
    story.append(para("六つの約束は、倫理的な注意書きであると同時に、現場を読み間違えないための実務上の規律である。"))
    rows = []
    for title, body in data["principles"]:
        rows.append([para(title, "JPH2"), para(body, "JPBody")])
    table = Table(rows, colWidths=[52 * mm, 114 * mm])
    table.setStyle(TableStyle([
        ("GRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#ded8ca")),
        ("BACKGROUND", (0, 0), (0, -1), colors.HexColor("#f0ece2")),
        ("LEFTPADDING", (0, 0), (-1, -1), 7),
        ("RIGHTPADDING", (0, 0), (-1, -1), 7),
        ("TOPPADDING", (0, 0), (-1, -1), 6),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
    ]))
    story.append(table)


def add_frame_shift(story, data):
    story.append(PageBreak())
    story.append(para("この本の見方の転換", "JPH1"))
    story.append(para("障害や難病の就労支援で見えてくるのは、特別な人だけの問題ではない。標準的な働き方が暗黙に前提としてきた「同じ時間に、同じ場所で、同じ情報を、同じ速さで処理できる人」という仮定を見直す入口である。", "JPLead"))
    rows = []
    for item in data["frameShifts"]:
        rows.append([
            para(f"これまでの見方\n{item['common']}", "JPBody"),
            para("→ 見方を転換", "JPCenter"),
            para(f"この本の見方\n{item['newView']}", "JPLead"),
        ])
    table = Table(rows, colWidths=[45 * mm, 32 * mm, 88 * mm])
    table.setStyle(TableStyle([
        ("GRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#ded8ca")),
        ("BACKGROUND", (0, 0), (0, -1), colors.HexColor("#f6f2ea")),
        ("BACKGROUND", (1, 0), (1, -1), colors.white),
        ("BACKGROUND", (2, 0), (2, -1), colors.HexColor("#edf6f4")),
        ("LINEBEFORE", (2, 0), (2, -1), 2.0, colors.HexColor("#25636f")),
        ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
        ("LEFTPADDING", (0, 0), (-1, -1), 7),
        ("RIGHTPADDING", (0, 0), (-1, -1), 7),
        ("TOPPADDING", (0, 0), (-1, -1), 6),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
    ]))
    story.append(table)
    story.append(Spacer(1, 5 * mm))
    story.append(para("この転換が、七つの現場場面と21の視点を貫く芯である。支援を例外対応としてではなく、仕事と社会を人間の多様性に合わせて設計し直す技術として読む。"))


def add_matrix(story, data):
    story.append(PageBreak())
    story.append(para("3×7で見る、21の視点", "JPH1"))
    story.append(para("21項目は並列のリストではない。三つの設計面にそれぞれ七つの視点があり、どの場面でも組み合わせて使う。", "JPLead"))
    rows = []
    for i in range(7):
        row = []
        for plane_index, plane in enumerate(data["planes"]):
            pattern = [p for p in data["patterns"] if p["plane"] == plane_index][i]
            row.append(para(f"{pattern['n']:02d} {pattern['title']}", "JPBody"))
        rows.append(row)
    header = [[para(p["label"], "JPH2") for p in data["planes"]]]
    table = Table(header + rows, colWidths=[55 * mm, 55 * mm, 55 * mm])
    table.setStyle(TableStyle([
        ("GRID", (0, 0), (-1, -1), 0.45, colors.HexColor("#ded8ca")),
        ("BACKGROUND", (0, 0), (0, 0), colors.HexColor("#d9ece8")),
        ("BACKGROUND", (1, 0), (1, 0), colors.HexColor("#ead7c4")),
        ("BACKGROUND", (2, 0), (2, 0), colors.HexColor("#e4e9ce")),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("LEFTPADDING", (0, 0), (-1, -1), 6),
        ("RIGHTPADDING", (0, 0), (-1, -1), 6),
        ("TOPPADDING", (0, 0), (-1, -1), 6),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
    ]))
    story.append(table)


def reader_lane_table():
    rows = [
        ["本人・家族", "自分の努力不足として抱えている話ではないか。"],
        ["支援者", "本人の言葉を仕事で使える問いへどう置き換えるか。"],
        ["人事・上司", "安全、評価、人員余力、作業手順のどこに制約があるか。"],
        ["政策・サービス設計", "入口、生活保障、職場実装、評価のどこで接続が切れているか。"],
    ]
    table = Table([[para(a, "JPH2"), para(b, "JPSmall")] for a, b in rows], colWidths=[42 * mm, 124 * mm])
    table.setStyle(TableStyle([
        ("GRID", (0, 0), (-1, -1), 0.4, colors.HexColor("#ded8ca")),
        ("BACKGROUND", (0, 0), (0, -1), colors.HexColor("#f0ece2")),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("LEFTPADDING", (0, 0), (-1, -1), 6),
        ("RIGHTPADDING", (0, 0), (-1, -1), 6),
        ("TOPPADDING", (0, 0), (-1, -1), 4),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 4),
    ]))
    return table


def add_scenes(story, data):
    pattern_by_id = {p["n"]: p for p in data["patterns"]}
    for scene in data["scenes"]:
        story.append(PageBreak())
        story.append(para(f"第{scene['n']}章  {scene['title']}", "JPH1"))
        story.append(para(scene["short"], "JPLead"))
        shift = Table(
            [[para(f"よくある読み\n{scene['shift'][0]}", "JPBody"), para("→", "JPCenter"), para(f"Falconの読み\n{scene['shift'][1]}", "JPBody")]],
            colWidths=[64 * mm, 14 * mm, 88 * mm],
        )
        shift.setStyle(TableStyle([
            ("GRID", (0, 0), (-1, -1), 0.4, colors.HexColor("#ded8ca")),
            ("BACKGROUND", (0, 0), (0, 0), colors.HexColor("#f6f2ea")),
            ("BACKGROUND", (2, 0), (2, 0), colors.HexColor("#edf6f4")),
            ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
            ("LEFTPADDING", (0, 0), (-1, -1), 7),
            ("RIGHTPADDING", (0, 0), (-1, -1), 7),
            ("TOPPADDING", (0, 0), (-1, -1), 6),
            ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
        ]))
        story.append(shift)
        story.append(Spacer(1, 4 * mm))
        story.append(para(scene["lead"]))
        story.append(box_table("合成場面", scene["story"], colors.white, colors.HexColor("#ded8ca"), 166 * mm))
        story.append(Spacer(1, 4 * mm))
        diagram_kind = scene["diagram"]
        if diagram_kind == "translation":
            diagram_kind = "bridge"
        story.append(DiagramBox(diagram_kind, colors.HexColor("#25636f")))

        story.append(para("この場面で使う視点", "JPH2"))
        cards = []
        for pattern_id in scene["patternIds"]:
            p = pattern_by_id[pattern_id]
            cards.append([box_table(f"{p['n']:02d} {p['title']}", f"{p['question']}\n\n立ち止まる: {p['stop']}", colors.white, colors.HexColor("#ded8ca"), 78 * mm)])
        rows = []
        for i in range(0, len(cards), 2):
            left = cards[i][0]
            right = cards[i + 1][0] if i + 1 < len(cards) else ""
            rows.append([left, right])
        table = Table(rows, colWidths=[81 * mm, 81 * mm])
        table.setStyle(TableStyle([
            ("VALIGN", (0, 0), (-1, -1), "TOP"),
            ("LEFTPADDING", (0, 0), (-1, -1), 0),
            ("RIGHTPADDING", (0, 0), (-1, -1), 0),
            ("TOPPADDING", (0, 0), (-1, -1), 2),
            ("BOTTOMPADDING", (0, 0), (-1, -1), 2),
        ]))
        story.append(table)

        story.append(para("読者別に見る問い", "JPH2"))
        story.append(reader_lane_table())
        story.append(Spacer(1, 4 * mm))
        story.append(box_table("Falconの専門家コメント", [f"構造仮説: {scene['falcon']}", "足りない文脈: 本人、職場、支援者、制度・文書のどの見え方がまだ欠けているかを確認する。", "まだ決めないこと: 病名、障害名、支援名、職場不安から、配慮妥当性や就労可否を急いで決めない。"], colors.HexColor("#edf6f4"), colors.HexColor("#25636f"), 166 * mm))
        story.append(Spacer(1, 4 * mm))
        story.append(box_table("10分で書けるワークシート", [f"今すぐ決めないこと: ____________________", f"足りない視点: ____________________", f"次に聞く問い: {scene['exercise']}"], colors.HexColor("#fff8ed"), colors.HexColor("#7b5134"), 166 * mm))


def add_pattern_index(story, data):
    story.append(PageBreak())
    story.append(para("21視点索引", "JPH1"))
    story.append(para("困った場面から入り、必要に応じて視点へ戻る。視点は支援メニューではなく、仕事と人間の条件が接する場所を読むための道具である。", "JPLead"))
    rows = [[para(f"{p['n']:02d} {p['title']}", "JPH2"), para(p["question"], "JPBody")] for p in data["patterns"]]
    table = Table(rows, colWidths=[54 * mm, 112 * mm])
    table.setStyle(TableStyle([
        ("GRID", (0, 0), (-1, -1), 0.4, colors.HexColor("#ded8ca")),
        ("BACKGROUND", (0, 0), (0, -1), colors.HexColor("#f0ece2")),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("LEFTPADDING", (0, 0), (-1, -1), 5),
        ("RIGHTPADDING", (0, 0), (-1, -1), 5),
        ("TOPPADDING", (0, 0), (-1, -1), 4),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 4),
    ]))
    story.append(table)


def add_patterns(story, data):
    for plane_index, plane in enumerate(data["planes"]):
        accent = hex_color(plane["color"])
        story.append(PageBreak())
        story.append(para(f"Part {plane['id']}  {plane['label']}", "JPH1"))
        story.append(para(plane["title"], "JPLead"))
        story.append(para(plane["lead"]))
        story.append(DiagramBox(["time", "bridge", "worksite"][plane_index], accent))
        for pattern in [p for p in data["patterns"] if p["plane"] == plane_index]:
            story.append(PageBreak())
            story.append(para(f"{pattern['n']:02d}  {pattern['title']}", "JPH1"))
            story.append(para(pattern["question"], "JPLead"))
            story.append(para("考え方", "JPH2"))
            story.append(para(pattern["core"]))
            story.append(para(pattern["reading"]))
            story.append(Spacer(1, 2 * mm))
            story.append(box_table("合成例", pattern["example"], colors.HexColor("#f7f4ec"), accent, 166 * mm))
            story.append(Spacer(1, 4 * mm))
            two_cols = Table(
                [[
                    box_table("確認したいこと", pattern["check"], colors.HexColor("#f5faf8"), colors.HexColor("#cfddd9"), 78 * mm),
                    box_table("ここで立ち止まる", pattern["stop"], colors.HexColor("#fff7ec"), colors.HexColor("#e5d1b9"), 78 * mm),
                ]],
                colWidths=[81 * mm, 81 * mm],
            )
            two_cols.setStyle(TableStyle([
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
                ("LEFTPADDING", (0, 0), (-1, -1), 0),
                ("RIGHTPADDING", (0, 0), (-1, -1), 0),
                ("TOPPADDING", (0, 0), (-1, -1), 0),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 0),
            ]))
            story.append(two_cols)


def add_appendix(story, data):
    story.append(PageBreak())
    story.append(para("七つの現場場面で使う", "JPH1"))
    story.append(para("21の視点は暗記するリストではない。困っている場面に出会った時、どの場所を見落としていないかを確かめるための道具箱である。"))
    scenes = [
        ["体調が変わっても続けられるか", "働く力は勤務時間だけで決まらない。", "1, 2, 3, 4, 7"],
        ["生活と収入が選択肢を狭めていないか", "働き方の選択には、待てる余地が必要である。", "5, 6"],
        ["入口で仕事像をすり合わせられるか", "求人票と本人の生活条件は、翻訳しないとつながらない。", "8, 9, 10"],
        ["支援が現場に届く形になっているか", "支援は、つながるだけでなく、仕事に届く必要がある。", "11, 12, 14"],
        ["作業・情報・指示の接点が整っているか", "ミスや困難は、手順や情報形式からも生まれる。", "13, 15, 17, 18"],
        ["職場の実装条件を分解できているか", "現場の不安は、設計情報として分解できる。", "16, 21"],
        ["評価と将来につながっているか", "雇用継続だけでなく、役割・評価・学び・将来を見る。", "19, 20"],
    ]
    table = Table([[para(a, "JPH2"), para(b), para(c, "JPBody")] for a, b, c in scenes], colWidths=[58 * mm, 82 * mm, 25 * mm])
    table.setStyle(TableStyle([
        ("GRID", (0, 0), (-1, -1), 0.45, colors.HexColor("#ded8ca")),
        ("BACKGROUND", (0, 0), (0, -1), colors.HexColor("#f0ece2")),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("LEFTPADDING", (0, 0), (-1, -1), 6),
        ("RIGHTPADDING", (0, 0), (-1, -1), 6),
        ("TOPPADDING", (0, 0), (-1, -1), 5),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
    ]))
    story.append(table)

    story.append(PageBreak())
    story.append(para("AI / Falconが返してよいもの、返してはいけないもの", "JPH1"))
    allow = ["どの仕事との接点が関係していそうか。", "どの視点が足りないか。", "誰の視点から見た情報なのか。", "反対の読み方は何か。", "次に確認すべき問いは何か。"]
    deny = ["この人にはこの配慮が妥当だという最終判断。", "病名や障害名からの就労可否判断。", "医療、法律、雇用、人事、合理的配慮の最終判断。", "未レビュー内容を確定知識として扱うこと。"]
    two_cols = Table(
        [[
            box_table("返してよいもの", allow, colors.HexColor("#f5faf8"), colors.HexColor("#cfddd9"), 78 * mm),
            box_table("返してはいけないもの", deny, colors.HexColor("#fff7ec"), colors.HexColor("#e5d1b9"), 78 * mm),
        ]],
        colWidths=[81 * mm, 81 * mm],
    )
    two_cols.setStyle(TableStyle([
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("LEFTPADDING", (0, 0), (-1, -1), 0),
        ("RIGHTPADDING", (0, 0), (-1, -1), 0),
        ("TOPPADDING", (0, 0), (-1, -1), 0),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 0),
    ]))
    story.append(two_cols)
    story.append(Spacer(1, 8 * mm))
    story.append(box_table("境界", "このPDFはFalcon Labの内部教材プロトタイプであり、public_safe / public_approved、runtime_approved、source/support validityを動かさない。", colors.HexColor("#f2f2f0"), colors.HexColor("#3d3b37"), 166 * mm))


def build_pdf():
    data = json.loads(CONTENT_JSON.read_text(encoding="utf-8"))
    doc = BaseDocTemplate(
        str(PDF_PATH),
        pagesize=A4,
        leftMargin=15 * mm,
        rightMargin=15 * mm,
        topMargin=15 * mm,
        bottomMargin=18 * mm,
        title="働き方を、条件から設計する",
        author="Falcon Lab",
    )
    frame = Frame(doc.leftMargin, doc.bottomMargin, doc.width, doc.height, id="normal")
    doc.addPageTemplates([PageTemplate(id="all", frames=[frame], onPage=on_page)])

    story = []
    add_cover(story)
    add_intro(story, data)
    add_frame_shift(story, data)
    add_three_entries(story, data)
    add_matrix(story, data)
    add_scenes(story, data)
    add_pattern_index(story, data)
    story.append(PageBreak())
    story.append(para("終章 Falconと一緒に、仕事の前提を問い直す", "JPH1"))
    story.append(para("この本の使い方は、個別の正解を急ぐことではない。場面を分け、視点を重ね、誰の見え方が足りないかを確かめ、次に聞く問いを残すことである。", "JPLead"))
    story.append(para("Falconの専門性は、障害・難病就労支援を特殊な例外対応として閉じないことにある。一人の困りごとを丁寧に読むと、仕事や制度がどんな人間像を標準としてきたかが見えてくる。"))
    story.append(para("そこから始まるのは、できない人を探す支援ではない。できる条件を設計し、人間の幅に合わせて仕事と社会を作り直す実践である。", "JPLead"))
    doc.build(story)
    print(PDF_PATH)


if __name__ == "__main__":
    build_pdf()
