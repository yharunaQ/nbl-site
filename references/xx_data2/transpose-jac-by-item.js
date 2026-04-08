const fs = require('fs');
const path = require('path');

const DATA2_DIR = __dirname;
const CHISHIKI_SRC_DIR = path.join(DATA2_DIR, 'chishikiOut_jac');
const KIJUTSU_SRC_DIR = path.join(DATA2_DIR, 'kijutsuOut_jac');
const CHISHIKI_OUT_DIR = path.join(DATA2_DIR, 'chishikiByItem_jac');
const KIJUTSU_OUT_DIR = path.join(DATA2_DIR, 'kijutsuByItem_jac');

function readText(filePath) {
  return fs.readFileSync(filePath, 'utf8').replace(/\r\n?/g, '\n');
}

function listTextFiles(dirPath) {
  return fs
    .readdirSync(dirPath)
    .filter((name) => name.endsWith('.txt'))
    .sort((a, b) => a.localeCompare(b, 'en', { numeric: true }));
}

function ensureDir(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true });
}

function extractRequired(text, regex, label, filePath) {
  const match = text.match(regex);
  if (!match) {
    throw new Error(`Missing ${label} in ${filePath}`);
  }
  return match[1].trim();
}

function extractBlocks(text, headingRegex) {
  const matches = Array.from(text.matchAll(headingRegex));
  return matches.map((match, index) => {
    const title = match[1].trim();
    const bodyStart = match.index + match[0].length;
    const bodyEnd = index + 1 < matches.length ? matches[index + 1].index : text.length;
    const body = text.slice(bodyStart, bodyEnd).trim();
    return { title, body };
  });
}

function parseChishikiFile(filePath, sourceFileName) {
  const text = readText(filePath);
  const disabilityNumber = extractRequired(
    text,
    /^##障害種類番号:\s*(.+)$/m,
    'disability number',
    sourceFileName
  );
  const disabilityName = extractRequired(
    text,
    /^##機能障害・疾病:\s*「(.+)」$/m,
    'disability name',
    sourceFileName
  );
  const items = extractBlocks(text, /^###\s+\d+\.\s*課題:\s*(.+)$/gm);
  return {
    disabilityNumber: Number(disabilityNumber),
    disabilityName,
    sourceFileName,
    items: items.filter((item) => item.body.length > 0),
  };
}

function parseKijutsuFile(filePath, sourceFileName) {
  const text = readText(filePath);
  const disabilityName = extractRequired(
    text,
    /^#「(.+)」$/m,
    'disability name',
    sourceFileName
  );
  const sections = extractBlocks(text, /^##([^#\n].+)$/gm);
  return {
    disabilityName,
    sourceFileName,
    sections: sections.filter((section) => section.body.length > 0),
  };
}

function writeFile(filePath, content) {
  fs.writeFileSync(filePath, `${content.replace(/\s+$/, '')}\n`, 'utf8');
}

function buildChishikiOutputs(records) {
  const itemOrder = [];
  const itemMap = new Map();
  const disabilityIndex = [];

  for (const record of records) {
    disabilityIndex.push({
      disabilityNumber: record.disabilityNumber,
      disabilityName: record.disabilityName,
    });
    for (const item of record.items) {
      if (!itemMap.has(item.title)) {
        itemMap.set(item.title, []);
        itemOrder.push(item.title);
      }
      itemMap.get(item.title).push({
        disabilityNumber: record.disabilityNumber,
        disabilityName: record.disabilityName,
        sourceFileName: record.sourceFileName,
        body: item.body,
      });
    }
  }

  ensureDir(CHISHIKI_OUT_DIR);

  const readme = `# chishikiByItem_jac

- Source: \`data2/chishikiOut_jac\`
- Reorganized by: exact task title in each disability-specific file
- Policy:
  - Similar-looking task names are kept separate unless they match exactly.
  - Each entry remains a context-bound hypothesis from the original source; do not generalize by diagnosis alone.
  - Disabilities not shown in a task file were not matched to that exact task title in the source file.
`;
  writeFile(path.join(CHISHIKI_OUT_DIR, 'README.md'), readme);

  const disabilityIndexRows = ['disability_number\tdisability_name'];
  for (const entry of disabilityIndex.sort((a, b) => a.disabilityNumber - b.disabilityNumber)) {
    disabilityIndexRows.push(`${entry.disabilityNumber}\t${entry.disabilityName}`);
  }
  writeFile(path.join(CHISHIKI_OUT_DIR, 'disability-index.tsv'), disabilityIndexRows.join('\n'));

  const itemIndexRows = ['file_name\tentry_count\titem_title'];
  itemOrder.forEach((title, index) => {
    const fileName = `${String(index + 1).padStart(2, '0')}.txt`;
    const entries = itemMap
      .get(title)
      .slice()
      .sort((a, b) => a.disabilityNumber - b.disabilityNumber);
    itemIndexRows.push(`${fileName}\t${entries.length}\t${title}`);

    const parts = [
      '# JAC活用向け再整理（項目別）',
      `##項目番号: ${String(index + 1).padStart(2, '0')}`,
      `##課題: 「${title}」`,
      '',
      '##位置づけ',
      '- 元の障害種類別ファイルから、この課題に該当する記載だけを集約したものです。',
      '- 記載は条件つきの仮説であり、障害名だけで一般化しない前提で利用してください。',
      '- このファイルに出てこない障害種類は、元ファイルでこの課題の見出しが確認できなかったものです。',
      '',
      `##掲載障害種類数: ${entries.length}`,
      '',
      '##障害種類別の記載',
    ];

    for (const entry of entries) {
      parts.push('');
      parts.push(`### ${entry.disabilityNumber}. ${entry.disabilityName}`);
      parts.push(`- source_file: ${entry.sourceFileName}`);
      parts.push('');
      parts.push(entry.body);
    }

    writeFile(path.join(CHISHIKI_OUT_DIR, fileName), parts.join('\n'));
  });

  writeFile(path.join(CHISHIKI_OUT_DIR, 'index.tsv'), itemIndexRows.join('\n'));
}

function buildKijutsuOutputs(records, disabilityMap) {
  const sectionOrder = [];
  const sectionMap = new Map();

  for (const record of records) {
    const disabilityNumber = disabilityMap.get(record.disabilityName);
    if (!disabilityNumber) {
      throw new Error(`Missing disability number mapping for ${record.disabilityName}`);
    }
    for (const section of record.sections) {
      if (!sectionMap.has(section.title)) {
        sectionMap.set(section.title, []);
        sectionOrder.push(section.title);
      }
      sectionMap.get(section.title).push({
        disabilityNumber,
        disabilityName: record.disabilityName,
        sourceFileName: record.sourceFileName,
        body: section.body,
      });
    }
  }

  ensureDir(KIJUTSU_OUT_DIR);

  const readme = `# kijutsuByItem_jac

- Source: \`data2/kijutsuOut_jac\`
- Reorganized by: exact section title in each disability-specific file
- Policy:
  - Each block keeps the original free-text content for that section.
  - Free-text includes individual experience, opinion, and situation-specific observation; do not generalize it as universal fact.
  - Disabilities with an empty section body are omitted from the corresponding item file.
`;
  writeFile(path.join(KIJUTSU_OUT_DIR, 'README.md'), readme);

  const disabilityIndexRows = ['disability_number\tdisability_name'];
  for (const [disabilityName, disabilityNumber] of Array.from(disabilityMap.entries()).sort(
    (a, b) => a[1] - b[1]
  )) {
    disabilityIndexRows.push(`${disabilityNumber}\t${disabilityName}`);
  }
  writeFile(path.join(KIJUTSU_OUT_DIR, 'disability-index.tsv'), disabilityIndexRows.join('\n'));

  const sectionIndexRows = ['file_name\tentry_count\tsection_title'];
  sectionOrder.forEach((title, index) => {
    const fileName = `${String(index + 1).padStart(2, '0')}.txt`;
    const entries = sectionMap
      .get(title)
      .slice()
      .sort((a, b) => a.disabilityNumber - b.disabilityNumber);
    sectionIndexRows.push(`${fileName}\t${entries.length}\t${title}`);

    const parts = [
      '# JAC自由記述の項目別再整理',
      `##項目番号: ${String(index + 1).padStart(2, '0')}`,
      `##項目: 「${title}」`,
      '',
      '##位置づけ',
      '- 元の障害種類別ファイルから、この項目に該当する自由記述だけを集約したものです。',
      '- 個別経験や意見が含まれるため、そのまま一般化せず、背景条件と併せて参照してください。',
      '- 空欄だった障害種類は、このファイルから省いています。',
      '',
      `##掲載障害種類数: ${entries.length}`,
      '',
      '##障害種類別の記載',
    ];

    for (const entry of entries) {
      parts.push('');
      parts.push(`### ${entry.disabilityNumber}. ${entry.disabilityName}`);
      parts.push(`- source_file: ${entry.sourceFileName}`);
      parts.push('');
      parts.push(entry.body);
    }

    writeFile(path.join(KIJUTSU_OUT_DIR, fileName), parts.join('\n'));
  });

  writeFile(path.join(KIJUTSU_OUT_DIR, 'index.tsv'), sectionIndexRows.join('\n'));
}

function main() {
  const chishikiRecords = listTextFiles(CHISHIKI_SRC_DIR).map((sourceFileName) =>
    parseChishikiFile(path.join(CHISHIKI_SRC_DIR, sourceFileName), sourceFileName)
  );
  const disabilityMap = new Map(
    chishikiRecords.map((record) => [record.disabilityName, record.disabilityNumber])
  );
  const kijutsuRecords = listTextFiles(KIJUTSU_SRC_DIR).map((sourceFileName) =>
    parseKijutsuFile(path.join(KIJUTSU_SRC_DIR, sourceFileName), sourceFileName)
  );

  buildChishikiOutputs(chishikiRecords);
  buildKijutsuOutputs(kijutsuRecords, disabilityMap);

  const uniqueChishikiItems = new Set(
    chishikiRecords.flatMap((record) => record.items.map((item) => item.title))
  ).size;
  const uniqueKijutsuSections = new Set(
    kijutsuRecords.flatMap((record) => record.sections.map((section) => section.title))
  ).size;

  console.log(
    JSON.stringify(
      {
        chishikiSourceFiles: chishikiRecords.length,
        chishikiUniqueItems: uniqueChishikiItems,
        kijutsuSourceFiles: kijutsuRecords.length,
        kijutsuUniqueSections: uniqueKijutsuSections,
        chishikiOutputDir: CHISHIKI_OUT_DIR,
        kijutsuOutputDir: KIJUTSU_OUT_DIR,
      },
      null,
      2
    )
  );
}

main();
