#!/usr/bin/env node

import { promises as fs } from 'node:fs';
import path from 'node:path';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { createHash } from 'node:crypto';

const execFileAsync = promisify(execFile);

const projectRoot = '/Users/YuichiroHARUNA/SynologyDrive/NBL/nbl-site-starter';
const referencesRoot = path.join(projectRoot, 'references');
const outputDir = path.join(referencesRoot, 'index');
const recordsPath = path.join(outputDir, 'normalized-records.jsonl');
const manifestPath = path.join(outputDir, 'normalized-manifest.json');

const allowedExtensions = new Set(['.txt', '.pdf', '.xlsm', '.sav']);

function toSourceId(filePath) {
    if (filePath.includes('/documents/')) return 'nbl_guidelines';
    return 'nbl_local_research';
}

function unescapeXml(value) {
    return value
        .replaceAll('&lt;', '<')
        .replaceAll('&gt;', '>')
        .replaceAll('&amp;', '&')
        .replaceAll('&quot;', '"')
        .replaceAll('&apos;', "'");
}

function chunkText(text, maxChars = 700) {
    const blocks = text
        .split(/\n\s*\n/g)
        .map((line) => line.replace(/\s+/g, ' ').trim())
        .filter(Boolean);

    const chunks = [];
    let current = '';

    for (const block of blocks) {
        if ((current + ' ' + block).trim().length > maxChars) {
            if (current.trim()) chunks.push(current.trim());
            current = block;
        } else {
            current = `${current} ${block}`.trim();
        }
    }

    if (current.trim()) chunks.push(current.trim());

    if (chunks.length === 0 && text.trim()) {
        chunks.push(text.trim().slice(0, maxChars));
    }

    return chunks;
}

function normalizeExtractedText(raw) {
    return unescapeXml(raw.replace(/<[^>]+>/g, ' '))
        .replace(/\s+/g, ' ')
        .trim();
}

async function walk(directoryPath) {
    const entries = await fs.readdir(directoryPath, { withFileTypes: true });
    const files = [];

    for (const entry of entries) {
        const fullPath = path.join(directoryPath, entry.name);
        if (entry.isDirectory()) {
            files.push(...(await walk(fullPath)));
            continue;
        }

        const extension = path.extname(entry.name).toLowerCase();
        if (!allowedExtensions.has(extension)) continue;
        files.push(fullPath);
    }

    return files;
}

async function commandExists(command) {
    try {
        await execFileAsync('sh', ['-lc', `command -v ${command}`]);
        return true;
    } catch {
        return false;
    }
}

async function readTextFile(filePath) {
    const content = await fs.readFile(filePath, 'utf8');
    return content;
}

async function extractPdfText(filePath, canUsePdfToText) {
    if (!canUsePdfToText) {
        return {
            text: '',
            warning: 'pdftotext is not available. PDF is stored as metadata only to avoid noisy extraction.',
        };
    }

    try {
        const { stdout } = await execFileAsync('pdftotext', ['-enc', 'UTF-8', '-q', filePath, '-']);
        return { text: stdout, warning: null };
    } catch {
        return {
            text: '',
            warning: 'pdftotext failed for this file. PDF text extraction skipped.',
        };
    }
}

async function extractXlsmText(filePath) {
    try {
        const { stdout: entriesOutput } = await execFileAsync('unzip', ['-Z1', filePath]);
        const entries = entriesOutput
            .split(/\r?\n/)
            .map((line) => line.trim())
            .filter(Boolean)
            .filter((entry) => /^xl\/(sharedStrings\.xml|worksheets\/.*\.xml|tables\/.*\.xml)$/i.test(entry));

        if (entries.length === 0) {
            return {
                text: '',
                warning: 'No worksheet-related xml entries found in xlsm.',
            };
        }

        const chunks = [];
        for (const entry of entries.slice(0, 80)) {
            try {
                const { stdout } = await execFileAsync('unzip', ['-p', filePath, entry]);
                const normalized = normalizeExtractedText(stdout);
                if (normalized.length > 0) {
                    chunks.push(normalized);
                }
            } catch {
                // Continue with remaining entries.
            }
        }

        const text = chunks.join('\n');
        if (text.trim().length === 0) {
            return {
                text: '',
                warning: 'Worksheet XML was found but text extraction returned empty output.',
            };
        }

        return {
            text,
            warning: null,
        };
    } catch {
        return {
            text: '',
            warning: 'Could not extract worksheet XML from xlsm.',
        };
    }
}

async function extractSavText(filePath) {
    try {
        const { stdout } = await execFileAsync('strings', ['-n', '4', filePath]);
        const lines = stdout
            .split(/\r?\n/)
            .map((line) => line.trim())
            .filter((line) => line.length >= 4)
            .slice(0, 5000);

        if (lines.length === 0) {
            return {
                text: '',
                warning: 'strings returned no visible text from sav file.',
            };
        }

        return {
            text: lines.join('\n'),
            warning: 'Used strings fallback extraction for sav; values may include noise.',
        };
    } catch {
        return {
            text: '',
            warning: 'Could not extract text from sav with strings.',
        };
    }
}

function makeRecordId(filePath, chunkIndex) {
    return createHash('sha1').update(`${filePath}#${chunkIndex}`).digest('hex').slice(0, 16);
}

async function main() {
    const files = await walk(referencesRoot);
    const canUsePdfToText = await commandExists('pdftotext');

    const records = [];
    const warnings = [];
    const byExtension = {};
    const byContentType = {};
    let metadataOnlyCount = 0;

    for (const filePath of files) {
        const extension = path.extname(filePath).toLowerCase();
        byExtension[extension] = (byExtension[extension] || 0) + 1;

        let text = '';
        let warning = null;

        if (extension === '.txt') {
            text = await readTextFile(filePath);
        } else if (extension === '.pdf') {
            const result = await extractPdfText(filePath, canUsePdfToText);
            text = result.text;
            warning = result.warning;
        } else if (extension === '.xlsm') {
            const result = await extractXlsmText(filePath);
            text = result.text;
            warning = result.warning;
        } else if (extension === '.sav') {
            const result = await extractSavText(filePath);
            text = result.text;
            warning = result.warning;
        }

        if (warning) {
            warnings.push({ filePath, warning });
        }

        const chunks = chunkText(text);
        if (chunks.length === 0) {
            const metadataRecord = {
                id: makeRecordId(filePath, 0),
                sourceId: toSourceId(filePath),
                filePath,
                extension,
                contentType: 'metadata_only',
                text: `No extracted text available for ${path.basename(filePath)}.`,
            };
            records.push(metadataRecord);
            byContentType[metadataRecord.contentType] = (byContentType[metadataRecord.contentType] || 0) + 1;
            metadataOnlyCount += 1;
            continue;
        }

        chunks.forEach((chunk, index) => {
            const record = {
                id: makeRecordId(filePath, index),
                sourceId: toSourceId(filePath),
                filePath,
                extension,
                contentType:
                    extension === '.txt'
                        ? 'narrative'
                        : extension === '.pdf'
                            ? 'guideline'
                            : extension === '.sav'
                                ? 'structured_meta'
                                : 'table_like',
                text: chunk,
            };
            records.push(record);
            byContentType[record.contentType] = (byContentType[record.contentType] || 0) + 1;
        });
    }

    await fs.mkdir(outputDir, { recursive: true });
    await fs.writeFile(recordsPath, records.map((record) => JSON.stringify(record)).join('\n') + '\n', 'utf8');

    const manifest = {
        generatedAt: new Date().toISOString(),
        root: referencesRoot,
        fileCount: files.length,
        recordCount: records.length,
        byExtension,
        byContentType,
        metadataOnlyCount,
        extractionCoveragePct:
            files.length === 0
                ? 0
                : Number((((files.length - metadataOnlyCount) / files.length) * 100).toFixed(1)),
        warnings,
    };

    await fs.writeFile(manifestPath, JSON.stringify(manifest, null, 2), 'utf8');

    console.log(`Normalized records: ${recordsPath}`);
    console.log(`Records generated: ${records.length}`);
    console.log(`Warnings: ${warnings.length}`);
}

main().catch((error) => {
    console.error(error);
    process.exit(1);
});
