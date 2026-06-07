import { fireEvent, render, screen } from '@testing-library/react';
import WorkConditionForumTextPage, {
  parseStructuredArticleMarkdown,
} from '@/pages/preview/work-condition-forum-text/[id]';
import { workConditionForumPresentations } from '@/lib/falconLab/workConditionForum';

describe('Work condition forum text page', () => {
  it('parses structured article markdown into page blocks', () => {
    const article = parseStructuredArticleMarkdown(`# VF-01: Sample

作成日: 2026-06-05
Status: public未承認

## 見出しだけで段落の趣旨が分かる

本文の一段落目です。

> 引用として強調する一文。

- 確認点A
- 確認点B
`);

    expect(article.title).toBe('VF-01: Sample');
    expect(article.metadata).toContain('作成日: 2026-06-05');
    expect(article.metadata).not.toContain('Status: public未承認');
    expect(article.sections).toHaveLength(1);
    expect(article.sections[0].heading).toBe('見出しだけで段落の趣旨が分かる');
    expect(article.sections[0].blocks).toEqual([
      { type: 'paragraph', text: '本文の一段落目です。' },
      { type: 'quote', text: '引用として強調する一文。' },
      { type: 'list', items: ['確認点A', '確認点B'] },
    ]);
  });

  it('renders the markdown source as a laid-out text article page', () => {
    const presentation = workConditionForumPresentations[0];
    const article = parseStructuredArticleMarkdown(`# VF-01: 雇用率の先へ

Status: public未承認

## 人数の先にある「働き続けられる条件」を見る

人数は入口を開く。だが、働き続けられるかどうかは入口の先で決まる。

> 人数は入口を開く。だが入口だけを成果語にすると、参加の質が沈黙する。

- 入口：採用や実習など、参加が始まる場所を見る。入口だけでは参加の質は分からない。
- 役割

## 動画・スライド・図解とあわせて読む

この節は記事ページでは独立表示しない。

## 公開・個別判断には別レビューが必要

この節はBOUNDARYへ統合する。
`);

    render(<WorkConditionForumTextPage presentation={presentation} article={article} />);

    expect(
      screen.getByRole('heading', {
        level: 1,
        name: '雇用率の先へ：人数管理から仕事設計へ',
      }),
    ).toBeInTheDocument();
    expect(screen.getByText('ARTICLE SUMMARY')).toBeInTheDocument();
    expect(screen.getByText(/雇用率や採用人数は入口として重要です/)).toBeInTheDocument();
    expect(
      screen.getByRole('heading', {
        level: 2,
        name: '人数の先にある「働き続けられる条件」を見る',
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByText('人数は入口を開く。だが、働き続けられるかどうかは入口の先で決まる。'),
    ).toBeInTheDocument();
    expect(screen.getByText(/参加の質が沈黙する/)).toBeInTheDocument();
    expect(screen.getByText('入口')).toHaveClass('font-semibold');
    expect(screen.getByText(/採用や実習など、参加が始まる場所を見る/)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /フォーラム一覧へ戻る/ })).toHaveAttribute(
      'href',
      '/preview/work-condition-forum-session-packages#session-1',
    );

    expect(screen.getByText('INFOGRAPHIC')).toBeInTheDocument();
    expect(
      screen.getByRole('button', {
        name: 'VF-01のインフォグラフィックを拡大表示する',
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('img', {
        name: 'VF-01 雇用率の先へ：人数管理から仕事設計へ のインフォグラフィック',
      }),
    ).toHaveAttribute('src', '/images/work-condition-forum-infographics/vf-01.webp');
    expect(screen.getByRole('link', { name: '動画へ' })).toHaveAttribute('href', '#forum-video');
    expect(screen.queryByRole('link', { name: 'スライドPDF' })).not.toBeInTheDocument();

    fireEvent.click(
      screen.getByRole('button', {
        name: 'VF-01のインフォグラフィックを拡大表示する',
      }),
    );
    expect(
      screen.getByRole('dialog', { name: 'VF-01 インフォグラフィック拡大表示' }),
    ).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /閉じる/ }));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

    expect(
      screen.getByTitle('VF-01 雇用率の先へ：人数管理から仕事設計へ 解説動画'),
    ).toHaveAttribute('src', 'https://www.youtube.com/embed/9kSy-qJtBpU');
    expect(screen.getByRole('link', { name: /NEXT PRESENTATION \/ VF-02/ })).toHaveAttribute(
      'href',
      '/preview/work-condition-forum-text/VF-02',
    );
    expect(
      screen.queryByRole('heading', { name: /動画・スライド・図解とあわせて読む/ }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole('heading', { name: /公開・個別判断には別レビューが必要/ }),
    ).not.toBeInTheDocument();
    expect(screen.getByText(/公式見解、査読済み論文/)).toBeInTheDocument();
    expect(screen.getByText(/現行制度、統計、助成金/)).toBeInTheDocument();
  });
});
