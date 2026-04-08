const fs = require('fs');
const path = require('path');
const { TextDecoder } = require('util');

const SOURCE_DIR = path.join(__dirname, 'chishikiOut');
const OUTPUT_DIR = path.join(__dirname, 'chishikiOut_gpts10_utf8');
const PACK_COUNT = 10;
const decoder = new TextDecoder('shift_jis');

function listSourceFiles() {
  return fs
    .readdirSync(SOURCE_DIR)
    .filter((name) => name.endsWith('.txt'))
    .sort((a, b) => a.localeCompare(b, 'en', { numeric: true }));
}

function readSourceRecord(fileName) {
  const filePath = path.join(SOURCE_DIR, fileName);
  const buffer = fs.readFileSync(filePath);
  const text = decoder.decode(buffer).replace(/\r\n?/g, '\n').trim();
  const disabilityName =
    text.match(/^#機能障害・疾病：「(.+?)」で/m)?.[1]?.trim() ?? fileName.replace(/\.txt$/, '');

  return {
    fileName,
    disabilityName,
    text,
    size: text.length,
  };
}

function partitionSequentialMinimax(records, groupCount) {
  const n = records.length;
  const k = Math.min(groupCount, n);
  const prefix = [0];
  for (const record of records) {
    prefix.push(prefix[prefix.length - 1] + record.size);
  }

  const INF = Number.MAX_SAFE_INTEGER;
  const dp = Array.from({ length: k + 1 }, () => Array(n + 1).fill(INF));
  const cut = Array.from({ length: k + 1 }, () => Array(n + 1).fill(-1));
  dp[0][0] = 0;

  for (let groups = 1; groups <= k; groups += 1) {
    for (let end = 1; end <= n; end += 1) {
      for (let start = groups - 1; start < end; start += 1) {
        const segmentSize = prefix[end] - prefix[start];
        const cost = Math.max(dp[groups - 1][start], segmentSize);
        if (cost < dp[groups][end]) {
          dp[groups][end] = cost;
          cut[groups][end] = start;
        }
      }
    }
  }

  const partitions = [];
  let end = n;
  for (let groups = k; groups >= 1; groups -= 1) {
    const start = cut[groups][end];
    partitions.push(records.slice(start, end));
    end = start;
  }

  return partitions.reverse();
}

function buildPackContent(group, index, total) {
  const includedFiles = group.map((record) => record.fileName).join(', ');
  const includedNames = group.map((record) => record.disabilityName).join(' / ');
  const parts = [
    `# chishikiOut GPTs投入用パック ${String(index + 1).padStart(2, '0')}/${String(total).padStart(2, '0')}`,
    `pack_number: ${index + 1}`,
    `pack_count: ${total}`,
    'encoding: UTF-8',
    'source_encoding: CP932 (decoded as Shift_JIS)',
    `included_source_files: ${includedFiles}`,
    `included_disabilities: ${includedNames}`,
    'note: 元ファイルをUTF-8化して連番順のまま結合しています。障害名だけで一般化せず、各ブロック単位で参照してください。',
  ];

  for (const record of group) {
    parts.push('');
    parts.push('============================================================');
    parts.push(`source_file: ${record.fileName}`);
    parts.push(`disability_name: ${record.disabilityName}`);
    parts.push('============================================================');
    parts.push(record.text);
  }

  return `${parts.join('\n')}\n`;
}

function main() {
  const records = listSourceFiles().map(readSourceRecord);
  const groups = partitionSequentialMinimax(records, PACK_COUNT);

  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  groups.forEach((group, index) => {
    const fileName = `${String(index + 1).padStart(2, '0')}.txt`;
    const content = buildPackContent(group, index, groups.length);
    fs.writeFileSync(path.join(OUTPUT_DIR, fileName), content, 'utf8');
  });

  const summary = groups.map((group, index) => ({
    pack: index + 1,
    fileName: `${String(index + 1).padStart(2, '0')}.txt`,
    sourceCount: group.length,
    totalChars: group.reduce((sum, record) => sum + record.size, 0),
    firstSourceFile: group[0].fileName,
    lastSourceFile: group[group.length - 1].fileName,
    disabilities: group.map((record) => record.disabilityName),
  }));

  console.log(
    JSON.stringify(
      {
        sourceFiles: records.length,
        outputDir: OUTPUT_DIR,
        outputFiles: groups.length,
        packs: summary,
      },
      null,
      2
    )
  );
}

main();
