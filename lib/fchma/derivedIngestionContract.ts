import derivedIngestionContractJson from '@/data/specs/ingestion/postgres-derived-contract-v0.json';
import type { FchmaDerivedIngestionContract } from '@/lib/fchma/types';

export const fchmaDerivedIngestionContract =
  derivedIngestionContractJson as FchmaDerivedIngestionContract;

export function listFchmaDerivedIngestionTables(): string[] {
  return fchmaDerivedIngestionContract.tables.map((table) => table.table_name);
}

export function getFchmaDerivedIngestionTable(tableName: string) {
  return fchmaDerivedIngestionContract.tables.find((table) => table.table_name === tableName);
}
