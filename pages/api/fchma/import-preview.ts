import type { NextApiRequest, NextApiResponse } from 'next';
import {
  buildFchmaSurveyImportPreviewBundle,
  type FchmaSurveyImportPreviewBundle,
} from '@/lib/fchma/surveyImportMaterialization';

type ImportPreviewApiResponse =
  | FchmaSurveyImportPreviewBundle
  | {
      error: string;
    };

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ImportPreviewApiResponse>,
) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const datasetId = String(req.body?.datasetId || '').trim();
  const subjectKey = String(req.body?.subjectKey || '').trim();

  if (!datasetId || !subjectKey) {
    return res.status(400).json({ error: 'datasetId and subjectKey are required.' });
  }

  const bundle = await buildFchmaSurveyImportPreviewBundle(datasetId, subjectKey);
  if (!bundle) {
    return res.status(404).json({ error: 'Survey import subject was not found.' });
  }

  return res.status(200).json(bundle);
}
