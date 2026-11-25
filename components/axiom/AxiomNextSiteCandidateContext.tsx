import { createContext, useContext, type ReactNode } from 'react';

const CandidateContext = createContext(false);

export function AxiomNextSiteCandidateProvider({ children, value = true }: { children: ReactNode; value?: boolean }) {
  return <CandidateContext.Provider value={value}>{children}</CandidateContext.Provider>;
}

export function useNextSiteCandidate() {
  return useContext(CandidateContext);
}
