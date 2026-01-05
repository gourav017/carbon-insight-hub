import React, { createContext, useContext, useState, ReactNode } from 'react';

// Types
export type Region = 'India' | 'EU' | 'Global' | null;
export type Framework = 'GRI' | 'SASB' | 'TCFD' | 'BRSR' | 'CSRD';
export type Purpose = 'Regulatory Compliance' | 'Investor Disclosure' | 'Stakeholder Transparency' | 'Risk Assessment' | 'Integrated Reporting';

export interface MaterialTopic {
    id: string;
    name: string;
    isMaterial: boolean;
    rank?: number; // 1-5 or simple ranking
}

export interface PolicyDocument {
    id: string;
    name: string;
    category: 'Environment' | 'Social' | 'Governance' | 'Ethics' | 'Climate';
    file?: File;
    textParams?: string;
    status: 'Uploaded' | 'Pending';
}

export interface ESGDueDiligenceState {
    // Phase 1: Setup
    region: Region;
    purposes: Purpose[];
    selectedFrameworks: Framework[];

    // Phase 2: Assessments
    materialTopics: MaterialTopic[];
    policies: PolicyDocument[];
    risksAndOpportunities: any[]; // Define properly later

    // Phase 3: Data
    processAnswers: Record<string, any>;
    stakeholderEngagement: any[];
    dataPoints: any[]; // The big data table

    // Phase 4: Analysis
    scores: Record<string, number>;
}

interface ESGDueDiligenceContextType {
    state: ESGDueDiligenceState;
    setRegion: (region: Region) => void;
    setPurposes: (purposes: Purpose[]) => void;
    setSelectedFrameworks: (frameworks: Framework[]) => void;
    updateMaterialTopics: (topics: MaterialTopic[]) => void;
    addPolicy: (policy: PolicyDocument) => void;
    removePolicy: (id: string) => void;
    // Add more updates as we implement phases
}

const initialState: ESGDueDiligenceState = {
    region: null,
    purposes: [],
    selectedFrameworks: [],
    materialTopics: [],
    policies: [],
    risksAndOpportunities: [],
    processAnswers: {},
    stakeholderEngagement: [],
    dataPoints: [],
    scores: {}
};

const ESGDueDiligenceContext = createContext<ESGDueDiligenceContextType | undefined>(undefined);

export const ESGDueDiligenceProvider = ({ children }: { children: ReactNode }) => {
    const [state, setState] = useState<ESGDueDiligenceState>(initialState);

    const setRegion = (region: Region) => setState(prev => ({ ...prev, region }));
    const setPurposes = (purposes: Purpose[]) => setState(prev => ({ ...prev, purposes }));
    const setSelectedFrameworks = (frameworks: Framework[]) => setState(prev => ({ ...prev, selectedFrameworks: frameworks }));

    const updateMaterialTopics = (topics: MaterialTopic[]) => setState(prev => ({ ...prev, materialTopics: topics }));

    const addPolicy = (policy: PolicyDocument) => setState(prev => ({ ...prev, policies: [...prev.policies, policy] }));
    const removePolicy = (id: string) => setState(prev => ({ ...prev, policies: prev.policies.filter(p => p.id !== id) }));

    return (
        <ESGDueDiligenceContext.Provider value={{
            state,
            setRegion,
            setPurposes,
            setSelectedFrameworks,
            updateMaterialTopics,
            addPolicy,
            removePolicy
        }}>
            {children}
        </ESGDueDiligenceContext.Provider>
    );
};

export const useESGDueDiligence = () => {
    const context = useContext(ESGDueDiligenceContext);
    if (context === undefined) {
        throw new Error('useESGDueDiligence must be used within an ESGDueDiligenceProvider');
    }
    return context;
};
