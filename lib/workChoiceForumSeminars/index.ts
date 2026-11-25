import { draftingSeminars } from './drafting';
import { employerSeminars } from './employer';
import { healthSeminars } from './health';
import { keynote } from './keynote';
import { ordersSeminars } from './orders';
import { oversight } from './oversight';
import { participationSeminars } from './participation';
import type { Seminar } from './types';

export const seminarList: Seminar[] = [
  keynote,
  ...ordersSeminars,
  ...employerSeminars,
  ...healthSeminars,
  ...draftingSeminars,
  ...participationSeminars,
  oversight,
];

export function getSeminar(id: string): Seminar {
  const seminar = seminarList.find((item) => item.id === id);
  if (!seminar) throw new Error(`Unknown forum lecture: ${id}`);
  return seminar;
}
