#!/usr/bin/env node

import { promises as fs } from 'node:fs';
import path from 'node:path';

const projectRoot = '/Users/YuichiroHARUNA/SynologyDrive/NBL/nbl-site-starter';
const inputPath = path.join(projectRoot, 'references', 'index', 'normalized-records.jsonl');
const outputPath = path.join(projectRoot, 'references', 'index', 'embeddings.jsonl');
const OPENAI_URL = 'https://api.openai.com/v1/embeddings';

async function readJsonl(filePath) {
    const raw = await fs.readFile(filePath, 'utf8');
    return raw
        .split(/\r?\n/)
        .filter((line) => line.trim().length > 0)
        .map((line) => JSON.parse(line));
}

async function loadExistingMap() {
    try {
        const rows = await readJsonl(outputPath);
        const map = new Map();
        rows.forEach((row) => {
            map.set(row.id, row.vector);
        });
        return map;
    } catch {
        return new Map();
    }
}

async function embedBatch(apiKey, model, inputs) {
    const response = await fetch(OPENAI_URL, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            model,
            input: inputs,
        }),
    });

    if (!response.ok) {
        const message = await response.text();
        throw new Error(message || 'Embedding request failed');
    }

    const payload = await response.json();
    return payload.data.map((item) => item.embedding);
}

function chunk(list, size) {
    const batches = [];
    for (let i = 0; i < list.length; i += size) {
        batches.push(list.slice(i, i + size));
    }
    return batches;
}

async function main() {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
        throw new Error('OPENAI_API_KEY is required for embedding generation.');
    }

    const model = process.env.OPENAI_EMBED_MODEL || 'text-embedding-3-small';
    const records = await readJsonl(inputPath);
    const existing = await loadExistingMap();

    const targets = records.filter((record) => {
        return (
            ['narrative', 'guideline', 'table_like'].includes(record.contentType) &&
            typeof record.text === 'string' &&
            record.text.trim().length > 0 &&
            !existing.has(record.id)
        );
    });

    const targetBatches = chunk(targets, 32);
    const allRows = [];

    existing.forEach((vector, id) => {
        allRows.push({ id, vector });
    });

    for (const batch of targetBatches) {
        const vectors = await embedBatch(
            apiKey,
            model,
            batch.map((record) => record.text.slice(0, 6000)),
        );

        batch.forEach((record, index) => {
            allRows.push({
                id: record.id,
                vector: vectors[index],
            });
        });

        console.log(`Embedded ${allRows.length} records...`);
    }

    await fs.writeFile(outputPath, allRows.map((row) => JSON.stringify(row)).join('\n') + '\n', 'utf8');

    console.log(`Embeddings written: ${outputPath}`);
    console.log(`Total vectors: ${allRows.length}`);
}

main().catch((error) => {
    console.error(error);
    process.exit(1);
});
