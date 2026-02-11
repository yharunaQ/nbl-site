#!/usr/bin/env node

const baseUrl = process.env.JAC_TEST_BASE_URL || 'http://127.0.0.1:3000';
const token = process.env.JAC_ACCESS_TOKEN || '';
const endpoint = `${baseUrl.replace(/\/+$/, '')}/api/jac-assess`;

const basePayload = {
  selectedTags: {
    task: [],
    symptom: [],
    environment: [],
    preference: [],
  },
  followUpAnswers: [],
  responseMode: 'full',
};

const scenarios = [
  {
    id: 'strict_aggregated_index',
    expectedMode: 'strict',
    expectedReasonAny: [
      'high_risk_without_specific_case',
      'aggregated_evidence_dominant',
      'high_risk_dominant',
    ],
    payload: {
      ...basePayload,
      consultation:
        'EU Member states grant tax subsidies direct provision equipment reasonable accommodation',
      enabledSourceIds: ['eu_reasonable_accommodation'],
    },
  },
  {
    id: 'caution_specific_case_mix',
    expectedMode: 'caution',
    expectedReasonAny: ['medium_risk_present', 'partial_context_present'],
    payload: {
      ...basePayload,
      consultation: 'askjan disability accommodation meeting fatigue specific tasks',
      selectedTags: {
        task: ['会議・対話'],
        symptom: ['疲労・倦怠（慢性疲労含む）'],
        environment: [],
        preference: [],
      },
      enabledSourceIds: ['askjan_website'],
    },
  },
];

async function postAssessment(payload) {
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['x-jac-access-token'] = token;

  const response = await fetch(endpoint, {
    method: 'POST',
    headers,
    body: JSON.stringify(payload),
  });

  const body = await response.json().catch(() => ({}));
  if (!response.ok) {
    const reason = body?.error || `HTTP ${response.status}`;
    throw new Error(`Request failed: ${reason}`);
  }

  return body;
}

function assertScenarioResult(scenario, result) {
  const gate = result?.process?.safetyGate;
  if (!gate) {
    throw new Error(`[${scenario.id}] process.safetyGate is missing`);
  }
  if (gate.mode !== scenario.expectedMode) {
    throw new Error(`[${scenario.id}] expected mode=${scenario.expectedMode}, got ${gate.mode}`);
  }
  if (scenario.expectedReason && !gate.reasonCodes?.includes(scenario.expectedReason)) {
    throw new Error(`[${scenario.id}] expected reason code "${scenario.expectedReason}"`);
  }
  if (scenario.expectedReasonAny) {
    const hit = scenario.expectedReasonAny.some((code) => gate.reasonCodes?.includes(code));
    if (!hit) {
      throw new Error(
        `[${scenario.id}] expected one of reason codes: ${scenario.expectedReasonAny.join(', ')}`,
      );
    }
  }
}

async function main() {
  const outputs = [];
  for (const scenario of scenarios) {
    const result = await postAssessment(scenario.payload);
    assertScenarioResult(scenario, result);
    outputs.push({
      id: scenario.id,
      mode: result.process.safetyGate.mode,
      reasonCodes: result.process.safetyGate.reasonCodes,
      evidenceCount: result.process.evidenceCount,
    });
  }

  console.log(
    JSON.stringify(
      {
        endpoint,
        scenarioCount: outputs.length,
        results: outputs,
      },
      null,
      2,
    ),
  );
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
