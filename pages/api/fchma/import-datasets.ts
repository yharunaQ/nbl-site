import type { NextApiRequest, NextApiResponse } from 'next';
import {
  listFchmaSurveyImportDatasets,
  type FchmaSurveyImportDatasetSummary,
} from '@/lib/fchma/surveyImportMaterialization';

type ImportDatasetsApiResponse = { datasets: FchmaSurveyImportDatasetSummary[] } | { error: string };

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ImportDatasetsApiResponse>,
) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const datasets = await listFchmaSurveyImportDatasets();
  return res.status(200).json({ datasets });
}
