export type Seminar = {
  id: string;
  title: string;
  abstract: string;
  sections: { title: string; paragraphs: string[] }[];
  exhibit: { title: string; columns: string[]; rows: string[][]; note: string };
  sourceIds: string[];
};
