import type { QueryKey, UseMutationOptions, UseMutationResult, UseQueryOptions, UseQueryResult } from '@tanstack/react-query';
import type { ActivityEntry, AiReport, AuthResponse, BinaryAnalysisInput, BinaryAnalysisResult, CveMatch, CvssBreakdown, DangerousFunction, DashboardSummary, EmulationInput, EmulationLog, ExtractedFile, Firmware, FirmwareInput, HardcodedSecret, HashAnalysisInput, HealthStatus, MalwareHash, OpenPortList, ReportMeta, RiskDistribution, ScanHistoryEntry, ScanResult, ScanStartInput, SecurityScore, ThreatScore, ThreatTrendPoint, User, UserLoginInput, UserRegisterInput, Vulnerability } from './api.schemas';
import { customFetch } from '../custom-fetch';
import type { ErrorType, BodyType } from '../custom-fetch';
type AwaitedInput<T> = PromiseLike<T> | T;
type Awaited<O> = O extends AwaitedInput<infer T> ? T : never;
type SecondParameter<T extends (...args: never) => unknown> = Parameters<T>[1];
export declare const getHealthCheckUrl: () => string;
/**
 * Returns server health status
 * @summary Health check
 */
export declare const healthCheck: (options?: RequestInit) => Promise<HealthStatus>;
export declare const getHealthCheckQueryKey: () => readonly ["/api/healthz"];
export declare const getHealthCheckQueryOptions: <TData = Awaited<ReturnType<typeof healthCheck>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof healthCheck>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof healthCheck>>, TError, TData> & {
    queryKey: QueryKey;
};
export type HealthCheckQueryResult = NonNullable<Awaited<ReturnType<typeof healthCheck>>>;
export type HealthCheckQueryError = ErrorType<unknown>;
/**
 * @summary Health check
 */
export declare function useHealthCheck<TData = Awaited<ReturnType<typeof healthCheck>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof healthCheck>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getRegisterUserUrl: () => string;
/**
 * @summary Register a new user
 */
export declare const registerUser: (userRegisterInput: UserRegisterInput, options?: RequestInit) => Promise<AuthResponse>;
export declare const getRegisterUserMutationOptions: <TError = ErrorType<void>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof registerUser>>, TError, {
        data: BodyType<UserRegisterInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof registerUser>>, TError, {
    data: BodyType<UserRegisterInput>;
}, TContext>;
export type RegisterUserMutationResult = NonNullable<Awaited<ReturnType<typeof registerUser>>>;
export type RegisterUserMutationBody = BodyType<UserRegisterInput>;
export type RegisterUserMutationError = ErrorType<void>;
/**
* @summary Register a new user
*/
export declare const useRegisterUser: <TError = ErrorType<void>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof registerUser>>, TError, {
        data: BodyType<UserRegisterInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof registerUser>>, TError, {
    data: BodyType<UserRegisterInput>;
}, TContext>;
export declare const getLoginUserUrl: () => string;
/**
 * @summary Login
 */
export declare const loginUser: (userLoginInput: UserLoginInput, options?: RequestInit) => Promise<AuthResponse>;
export declare const getLoginUserMutationOptions: <TError = ErrorType<void>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof loginUser>>, TError, {
        data: BodyType<UserLoginInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof loginUser>>, TError, {
    data: BodyType<UserLoginInput>;
}, TContext>;
export type LoginUserMutationResult = NonNullable<Awaited<ReturnType<typeof loginUser>>>;
export type LoginUserMutationBody = BodyType<UserLoginInput>;
export type LoginUserMutationError = ErrorType<void>;
/**
* @summary Login
*/
export declare const useLoginUser: <TError = ErrorType<void>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof loginUser>>, TError, {
        data: BodyType<UserLoginInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof loginUser>>, TError, {
    data: BodyType<UserLoginInput>;
}, TContext>;
export declare const getGetCurrentUserUrl: () => string;
/**
 * @summary Get current user
 */
export declare const getCurrentUser: (options?: RequestInit) => Promise<User>;
export declare const getGetCurrentUserQueryKey: () => readonly ["/api/auth/me"];
export declare const getGetCurrentUserQueryOptions: <TData = Awaited<ReturnType<typeof getCurrentUser>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getCurrentUser>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getCurrentUser>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetCurrentUserQueryResult = NonNullable<Awaited<ReturnType<typeof getCurrentUser>>>;
export type GetCurrentUserQueryError = ErrorType<unknown>;
/**
 * @summary Get current user
 */
export declare function useGetCurrentUser<TData = Awaited<ReturnType<typeof getCurrentUser>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getCurrentUser>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getListFirmwareUrl: () => string;
/**
 * @summary List all firmware uploads
 */
export declare const listFirmware: (options?: RequestInit) => Promise<Firmware[]>;
export declare const getListFirmwareQueryKey: () => readonly ["/api/firmware"];
export declare const getListFirmwareQueryOptions: <TData = Awaited<ReturnType<typeof listFirmware>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listFirmware>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof listFirmware>>, TError, TData> & {
    queryKey: QueryKey;
};
export type ListFirmwareQueryResult = NonNullable<Awaited<ReturnType<typeof listFirmware>>>;
export type ListFirmwareQueryError = ErrorType<unknown>;
/**
 * @summary List all firmware uploads
 */
export declare function useListFirmware<TData = Awaited<ReturnType<typeof listFirmware>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listFirmware>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getUploadFirmwareUrl: () => string;
/**
 * @summary Upload firmware file
 */
export declare const uploadFirmware: (firmwareInput: FirmwareInput, options?: RequestInit) => Promise<Firmware>;
export declare const getUploadFirmwareMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof uploadFirmware>>, TError, {
        data: BodyType<FirmwareInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof uploadFirmware>>, TError, {
    data: BodyType<FirmwareInput>;
}, TContext>;
export type UploadFirmwareMutationResult = NonNullable<Awaited<ReturnType<typeof uploadFirmware>>>;
export type UploadFirmwareMutationBody = BodyType<FirmwareInput>;
export type UploadFirmwareMutationError = ErrorType<unknown>;
/**
* @summary Upload firmware file
*/
export declare const useUploadFirmware: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof uploadFirmware>>, TError, {
        data: BodyType<FirmwareInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof uploadFirmware>>, TError, {
    data: BodyType<FirmwareInput>;
}, TContext>;
export declare const getGetFirmwareUrl: (id: number) => string;
/**
 * @summary Get firmware details
 */
export declare const getFirmware: (id: number, options?: RequestInit) => Promise<Firmware>;
export declare const getGetFirmwareQueryKey: (id: number) => readonly [`/api/firmware/${number}`];
export declare const getGetFirmwareQueryOptions: <TData = Awaited<ReturnType<typeof getFirmware>>, TError = ErrorType<void>>(id: number, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getFirmware>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getFirmware>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetFirmwareQueryResult = NonNullable<Awaited<ReturnType<typeof getFirmware>>>;
export type GetFirmwareQueryError = ErrorType<void>;
/**
 * @summary Get firmware details
 */
export declare function useGetFirmware<TData = Awaited<ReturnType<typeof getFirmware>>, TError = ErrorType<void>>(id: number, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getFirmware>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getDeleteFirmwareUrl: (id: number) => string;
/**
 * @summary Delete firmware
 */
export declare const deleteFirmware: (id: number, options?: RequestInit) => Promise<void>;
export declare const getDeleteFirmwareMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof deleteFirmware>>, TError, {
        id: number;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof deleteFirmware>>, TError, {
    id: number;
}, TContext>;
export type DeleteFirmwareMutationResult = NonNullable<Awaited<ReturnType<typeof deleteFirmware>>>;
export type DeleteFirmwareMutationError = ErrorType<unknown>;
/**
* @summary Delete firmware
*/
export declare const useDeleteFirmware: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof deleteFirmware>>, TError, {
        id: number;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof deleteFirmware>>, TError, {
    id: number;
}, TContext>;
export declare const getStartScanUrl: () => string;
/**
 * @summary Start a firmware scan
 */
export declare const startScan: (scanStartInput: ScanStartInput, options?: RequestInit) => Promise<ScanResult>;
export declare const getStartScanMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof startScan>>, TError, {
        data: BodyType<ScanStartInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof startScan>>, TError, {
    data: BodyType<ScanStartInput>;
}, TContext>;
export type StartScanMutationResult = NonNullable<Awaited<ReturnType<typeof startScan>>>;
export type StartScanMutationBody = BodyType<ScanStartInput>;
export type StartScanMutationError = ErrorType<unknown>;
/**
* @summary Start a firmware scan
*/
export declare const useStartScan: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof startScan>>, TError, {
        data: BodyType<ScanStartInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof startScan>>, TError, {
    data: BodyType<ScanStartInput>;
}, TContext>;
export declare const getGetScanResultsUrl: (firmwareId: number) => string;
/**
 * @summary Get scan results for firmware
 */
export declare const getScanResults: (firmwareId: number, options?: RequestInit) => Promise<ScanResult[]>;
export declare const getGetScanResultsQueryKey: (firmwareId: number) => readonly [`/api/scanner/results/${number}`];
export declare const getGetScanResultsQueryOptions: <TData = Awaited<ReturnType<typeof getScanResults>>, TError = ErrorType<unknown>>(firmwareId: number, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getScanResults>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getScanResults>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetScanResultsQueryResult = NonNullable<Awaited<ReturnType<typeof getScanResults>>>;
export type GetScanResultsQueryError = ErrorType<unknown>;
/**
 * @summary Get scan results for firmware
 */
export declare function useGetScanResults<TData = Awaited<ReturnType<typeof getScanResults>>, TError = ErrorType<unknown>>(firmwareId: number, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getScanResults>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getGetExtractedFilesUrl: (firmwareId: number) => string;
/**
 * @summary Get extracted files from firmware
 */
export declare const getExtractedFiles: (firmwareId: number, options?: RequestInit) => Promise<ExtractedFile[]>;
export declare const getGetExtractedFilesQueryKey: (firmwareId: number) => readonly [`/api/scanner/files/${number}`];
export declare const getGetExtractedFilesQueryOptions: <TData = Awaited<ReturnType<typeof getExtractedFiles>>, TError = ErrorType<unknown>>(firmwareId: number, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getExtractedFiles>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getExtractedFiles>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetExtractedFilesQueryResult = NonNullable<Awaited<ReturnType<typeof getExtractedFiles>>>;
export type GetExtractedFilesQueryError = ErrorType<unknown>;
/**
 * @summary Get extracted files from firmware
 */
export declare function useGetExtractedFiles<TData = Awaited<ReturnType<typeof getExtractedFiles>>, TError = ErrorType<unknown>>(firmwareId: number, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getExtractedFiles>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getRunBinaryAnalysisUrl: (firmwareId: number) => string;
/**
 * @summary Run binary analysis on extracted binaries
 */
export declare const runBinaryAnalysis: (firmwareId: number, binaryAnalysisInput: BinaryAnalysisInput, options?: RequestInit) => Promise<BinaryAnalysisResult>;
export declare const getRunBinaryAnalysisMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof runBinaryAnalysis>>, TError, {
        firmwareId: number;
        data: BodyType<BinaryAnalysisInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof runBinaryAnalysis>>, TError, {
    firmwareId: number;
    data: BodyType<BinaryAnalysisInput>;
}, TContext>;
export type RunBinaryAnalysisMutationResult = NonNullable<Awaited<ReturnType<typeof runBinaryAnalysis>>>;
export type RunBinaryAnalysisMutationBody = BodyType<BinaryAnalysisInput>;
export type RunBinaryAnalysisMutationError = ErrorType<unknown>;
/**
* @summary Run binary analysis on extracted binaries
*/
export declare const useRunBinaryAnalysis: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof runBinaryAnalysis>>, TError, {
        firmwareId: number;
        data: BodyType<BinaryAnalysisInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof runBinaryAnalysis>>, TError, {
    firmwareId: number;
    data: BodyType<BinaryAnalysisInput>;
}, TContext>;
export declare const getGetVulnerabilitiesUrl: (firmwareId: number) => string;
/**
 * @summary Get vulnerabilities for firmware
 */
export declare const getVulnerabilities: (firmwareId: number, options?: RequestInit) => Promise<Vulnerability[]>;
export declare const getGetVulnerabilitiesQueryKey: (firmwareId: number) => readonly [`/api/security/vulnerabilities/${number}`];
export declare const getGetVulnerabilitiesQueryOptions: <TData = Awaited<ReturnType<typeof getVulnerabilities>>, TError = ErrorType<unknown>>(firmwareId: number, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getVulnerabilities>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getVulnerabilities>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetVulnerabilitiesQueryResult = NonNullable<Awaited<ReturnType<typeof getVulnerabilities>>>;
export type GetVulnerabilitiesQueryError = ErrorType<unknown>;
/**
 * @summary Get vulnerabilities for firmware
 */
export declare function useGetVulnerabilities<TData = Awaited<ReturnType<typeof getVulnerabilities>>, TError = ErrorType<unknown>>(firmwareId: number, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getVulnerabilities>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getGetSecurityScoreUrl: (firmwareId: number) => string;
/**
 * @summary Get security score for firmware
 */
export declare const getSecurityScore: (firmwareId: number, options?: RequestInit) => Promise<SecurityScore>;
export declare const getGetSecurityScoreQueryKey: (firmwareId: number) => readonly [`/api/security/score/${number}`];
export declare const getGetSecurityScoreQueryOptions: <TData = Awaited<ReturnType<typeof getSecurityScore>>, TError = ErrorType<unknown>>(firmwareId: number, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getSecurityScore>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getSecurityScore>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetSecurityScoreQueryResult = NonNullable<Awaited<ReturnType<typeof getSecurityScore>>>;
export type GetSecurityScoreQueryError = ErrorType<unknown>;
/**
 * @summary Get security score for firmware
 */
export declare function useGetSecurityScore<TData = Awaited<ReturnType<typeof getSecurityScore>>, TError = ErrorType<unknown>>(firmwareId: number, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getSecurityScore>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getGetHardcodedSecretsUrl: (firmwareId: number) => string;
/**
 * @summary Get hardcoded secrets found in firmware
 */
export declare const getHardcodedSecrets: (firmwareId: number, options?: RequestInit) => Promise<HardcodedSecret[]>;
export declare const getGetHardcodedSecretsQueryKey: (firmwareId: number) => readonly [`/api/security/secrets/${number}`];
export declare const getGetHardcodedSecretsQueryOptions: <TData = Awaited<ReturnType<typeof getHardcodedSecrets>>, TError = ErrorType<unknown>>(firmwareId: number, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getHardcodedSecrets>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getHardcodedSecrets>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetHardcodedSecretsQueryResult = NonNullable<Awaited<ReturnType<typeof getHardcodedSecrets>>>;
export type GetHardcodedSecretsQueryError = ErrorType<unknown>;
/**
 * @summary Get hardcoded secrets found in firmware
 */
export declare function useGetHardcodedSecrets<TData = Awaited<ReturnType<typeof getHardcodedSecrets>>, TError = ErrorType<unknown>>(firmwareId: number, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getHardcodedSecrets>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getGetDangerousFunctionsUrl: (firmwareId: number) => string;
/**
 * @summary Get dangerous function calls found in firmware
 */
export declare const getDangerousFunctions: (firmwareId: number, options?: RequestInit) => Promise<DangerousFunction[]>;
export declare const getGetDangerousFunctionsQueryKey: (firmwareId: number) => readonly [`/api/security/dangerous-functions/${number}`];
export declare const getGetDangerousFunctionsQueryOptions: <TData = Awaited<ReturnType<typeof getDangerousFunctions>>, TError = ErrorType<unknown>>(firmwareId: number, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getDangerousFunctions>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getDangerousFunctions>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetDangerousFunctionsQueryResult = NonNullable<Awaited<ReturnType<typeof getDangerousFunctions>>>;
export type GetDangerousFunctionsQueryError = ErrorType<unknown>;
/**
 * @summary Get dangerous function calls found in firmware
 */
export declare function useGetDangerousFunctions<TData = Awaited<ReturnType<typeof getDangerousFunctions>>, TError = ErrorType<unknown>>(firmwareId: number, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getDangerousFunctions>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getGetCveMatchesUrl: (firmwareId: number) => string;
/**
 * @summary Get CVE matches for firmware
 */
export declare const getCveMatches: (firmwareId: number, options?: RequestInit) => Promise<CveMatch[]>;
export declare const getGetCveMatchesQueryKey: (firmwareId: number) => readonly [`/api/cve/matches/${number}`];
export declare const getGetCveMatchesQueryOptions: <TData = Awaited<ReturnType<typeof getCveMatches>>, TError = ErrorType<unknown>>(firmwareId: number, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getCveMatches>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getCveMatches>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetCveMatchesQueryResult = NonNullable<Awaited<ReturnType<typeof getCveMatches>>>;
export type GetCveMatchesQueryError = ErrorType<unknown>;
/**
 * @summary Get CVE matches for firmware
 */
export declare function useGetCveMatches<TData = Awaited<ReturnType<typeof getCveMatches>>, TError = ErrorType<unknown>>(firmwareId: number, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getCveMatches>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getGetCvssScoresUrl: (firmwareId: number) => string;
/**
 * @summary Get CVSS scores breakdown for firmware
 */
export declare const getCvssScores: (firmwareId: number, options?: RequestInit) => Promise<CvssBreakdown>;
export declare const getGetCvssScoresQueryKey: (firmwareId: number) => readonly [`/api/cve/scores/${number}`];
export declare const getGetCvssScoresQueryOptions: <TData = Awaited<ReturnType<typeof getCvssScores>>, TError = ErrorType<unknown>>(firmwareId: number, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getCvssScores>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getCvssScores>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetCvssScoresQueryResult = NonNullable<Awaited<ReturnType<typeof getCvssScores>>>;
export type GetCvssScoresQueryError = ErrorType<unknown>;
/**
 * @summary Get CVSS scores breakdown for firmware
 */
export declare function useGetCvssScores<TData = Awaited<ReturnType<typeof getCvssScores>>, TError = ErrorType<unknown>>(firmwareId: number, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getCvssScores>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getAnalyzeHashUrl: () => string;
/**
 * @summary Analyze a file hash against VirusTotal
 */
export declare const analyzeHash: (hashAnalysisInput: HashAnalysisInput, options?: RequestInit) => Promise<MalwareHash>;
export declare const getAnalyzeHashMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof analyzeHash>>, TError, {
        data: BodyType<HashAnalysisInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof analyzeHash>>, TError, {
    data: BodyType<HashAnalysisInput>;
}, TContext>;
export type AnalyzeHashMutationResult = NonNullable<Awaited<ReturnType<typeof analyzeHash>>>;
export type AnalyzeHashMutationBody = BodyType<HashAnalysisInput>;
export type AnalyzeHashMutationError = ErrorType<unknown>;
/**
* @summary Analyze a file hash against VirusTotal
*/
export declare const useAnalyzeHash: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof analyzeHash>>, TError, {
        data: BodyType<HashAnalysisInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof analyzeHash>>, TError, {
    data: BodyType<HashAnalysisInput>;
}, TContext>;
export declare const getGetThreatScoreUrl: (firmwareId: number) => string;
/**
 * @summary Get threat score for firmware
 */
export declare const getThreatScore: (firmwareId: number, options?: RequestInit) => Promise<ThreatScore>;
export declare const getGetThreatScoreQueryKey: (firmwareId: number) => readonly [`/api/malware/threat-score/${number}`];
export declare const getGetThreatScoreQueryOptions: <TData = Awaited<ReturnType<typeof getThreatScore>>, TError = ErrorType<unknown>>(firmwareId: number, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getThreatScore>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getThreatScore>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetThreatScoreQueryResult = NonNullable<Awaited<ReturnType<typeof getThreatScore>>>;
export type GetThreatScoreQueryError = ErrorType<unknown>;
/**
 * @summary Get threat score for firmware
 */
export declare function useGetThreatScore<TData = Awaited<ReturnType<typeof getThreatScore>>, TError = ErrorType<unknown>>(firmwareId: number, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getThreatScore>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getGetVirusTotalResultsUrl: (firmwareId: number) => string;
/**
 * @summary Get VirusTotal scan results for firmware files
 */
export declare const getVirusTotalResults: (firmwareId: number, options?: RequestInit) => Promise<MalwareHash[]>;
export declare const getGetVirusTotalResultsQueryKey: (firmwareId: number) => readonly [`/api/malware/virustotal/${number}`];
export declare const getGetVirusTotalResultsQueryOptions: <TData = Awaited<ReturnType<typeof getVirusTotalResults>>, TError = ErrorType<unknown>>(firmwareId: number, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getVirusTotalResults>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getVirusTotalResults>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetVirusTotalResultsQueryResult = NonNullable<Awaited<ReturnType<typeof getVirusTotalResults>>>;
export type GetVirusTotalResultsQueryError = ErrorType<unknown>;
/**
 * @summary Get VirusTotal scan results for firmware files
 */
export declare function useGetVirusTotalResults<TData = Awaited<ReturnType<typeof getVirusTotalResults>>, TError = ErrorType<unknown>>(firmwareId: number, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getVirusTotalResults>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getStartEmulationUrl: () => string;
/**
 * @summary Start QEMU emulation of firmware
 */
export declare const startEmulation: (emulationInput: EmulationInput, options?: RequestInit) => Promise<EmulationLog>;
export declare const getStartEmulationMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof startEmulation>>, TError, {
        data: BodyType<EmulationInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof startEmulation>>, TError, {
    data: BodyType<EmulationInput>;
}, TContext>;
export type StartEmulationMutationResult = NonNullable<Awaited<ReturnType<typeof startEmulation>>>;
export type StartEmulationMutationBody = BodyType<EmulationInput>;
export type StartEmulationMutationError = ErrorType<unknown>;
/**
* @summary Start QEMU emulation of firmware
*/
export declare const useStartEmulation: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof startEmulation>>, TError, {
        data: BodyType<EmulationInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof startEmulation>>, TError, {
    data: BodyType<EmulationInput>;
}, TContext>;
export declare const getGetRunningServicesUrl: (firmwareId: number) => string;
/**
 * @summary Get running services from emulation
 */
export declare const getRunningServices: (firmwareId: number, options?: RequestInit) => Promise<EmulationLog[]>;
export declare const getGetRunningServicesQueryKey: (firmwareId: number) => readonly [`/api/qemu/services/${number}`];
export declare const getGetRunningServicesQueryOptions: <TData = Awaited<ReturnType<typeof getRunningServices>>, TError = ErrorType<unknown>>(firmwareId: number, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getRunningServices>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getRunningServices>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetRunningServicesQueryResult = NonNullable<Awaited<ReturnType<typeof getRunningServices>>>;
export type GetRunningServicesQueryError = ErrorType<unknown>;
/**
 * @summary Get running services from emulation
 */
export declare function useGetRunningServices<TData = Awaited<ReturnType<typeof getRunningServices>>, TError = ErrorType<unknown>>(firmwareId: number, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getRunningServices>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getGetOpenPortsUrl: (firmwareId: number) => string;
/**
 * @summary Get open ports detected during emulation
 */
export declare const getOpenPorts: (firmwareId: number, options?: RequestInit) => Promise<OpenPortList>;
export declare const getGetOpenPortsQueryKey: (firmwareId: number) => readonly [`/api/qemu/ports/${number}`];
export declare const getGetOpenPortsQueryOptions: <TData = Awaited<ReturnType<typeof getOpenPorts>>, TError = ErrorType<unknown>>(firmwareId: number, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getOpenPorts>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getOpenPorts>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetOpenPortsQueryResult = NonNullable<Awaited<ReturnType<typeof getOpenPorts>>>;
export type GetOpenPortsQueryError = ErrorType<unknown>;
/**
 * @summary Get open ports detected during emulation
 */
export declare function useGetOpenPorts<TData = Awaited<ReturnType<typeof getOpenPorts>>, TError = ErrorType<unknown>>(firmwareId: number, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getOpenPorts>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getGetPdfReportUrl: (firmwareId: number) => string;
/**
 * @summary Get PDF report for a firmware scan
 */
export declare const getPdfReport: (firmwareId: number, options?: RequestInit) => Promise<ReportMeta>;
export declare const getGetPdfReportQueryKey: (firmwareId: number) => readonly [`/api/reports/pdf/${number}`];
export declare const getGetPdfReportQueryOptions: <TData = Awaited<ReturnType<typeof getPdfReport>>, TError = ErrorType<unknown>>(firmwareId: number, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getPdfReport>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getPdfReport>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetPdfReportQueryResult = NonNullable<Awaited<ReturnType<typeof getPdfReport>>>;
export type GetPdfReportQueryError = ErrorType<unknown>;
/**
 * @summary Get PDF report for a firmware scan
 */
export declare function useGetPdfReport<TData = Awaited<ReturnType<typeof getPdfReport>>, TError = ErrorType<unknown>>(firmwareId: number, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getPdfReport>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getGetAiSummaryUrl: (firmwareId: number) => string;
/**
 * @summary Get AI-generated summary and risk analysis
 */
export declare const getAiSummary: (firmwareId: number, options?: RequestInit) => Promise<AiReport>;
export declare const getGetAiSummaryQueryKey: (firmwareId: number) => readonly [`/api/reports/ai-summary/${number}`];
export declare const getGetAiSummaryQueryOptions: <TData = Awaited<ReturnType<typeof getAiSummary>>, TError = ErrorType<unknown>>(firmwareId: number, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getAiSummary>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getAiSummary>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetAiSummaryQueryResult = NonNullable<Awaited<ReturnType<typeof getAiSummary>>>;
export type GetAiSummaryQueryError = ErrorType<unknown>;
/**
 * @summary Get AI-generated summary and risk analysis
 */
export declare function useGetAiSummary<TData = Awaited<ReturnType<typeof getAiSummary>>, TError = ErrorType<unknown>>(firmwareId: number, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getAiSummary>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getGetScanHistoryUrl: () => string;
/**
 * @summary Get full scan history
 */
export declare const getScanHistory: (options?: RequestInit) => Promise<ScanHistoryEntry[]>;
export declare const getGetScanHistoryQueryKey: () => readonly ["/api/reports/history"];
export declare const getGetScanHistoryQueryOptions: <TData = Awaited<ReturnType<typeof getScanHistory>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getScanHistory>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getScanHistory>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetScanHistoryQueryResult = NonNullable<Awaited<ReturnType<typeof getScanHistory>>>;
export type GetScanHistoryQueryError = ErrorType<unknown>;
/**
 * @summary Get full scan history
 */
export declare function useGetScanHistory<TData = Awaited<ReturnType<typeof getScanHistory>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getScanHistory>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getGetDashboardSummaryUrl: () => string;
/**
 * @summary Get dashboard overview summary
 */
export declare const getDashboardSummary: (options?: RequestInit) => Promise<DashboardSummary>;
export declare const getGetDashboardSummaryQueryKey: () => readonly ["/api/dashboard/summary"];
export declare const getGetDashboardSummaryQueryOptions: <TData = Awaited<ReturnType<typeof getDashboardSummary>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getDashboardSummary>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getDashboardSummary>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetDashboardSummaryQueryResult = NonNullable<Awaited<ReturnType<typeof getDashboardSummary>>>;
export type GetDashboardSummaryQueryError = ErrorType<unknown>;
/**
 * @summary Get dashboard overview summary
 */
export declare function useGetDashboardSummary<TData = Awaited<ReturnType<typeof getDashboardSummary>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getDashboardSummary>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getGetRecentActivityUrl: () => string;
/**
 * @summary Get recent scan activity feed
 */
export declare const getRecentActivity: (options?: RequestInit) => Promise<ActivityEntry[]>;
export declare const getGetRecentActivityQueryKey: () => readonly ["/api/dashboard/activity"];
export declare const getGetRecentActivityQueryOptions: <TData = Awaited<ReturnType<typeof getRecentActivity>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getRecentActivity>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getRecentActivity>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetRecentActivityQueryResult = NonNullable<Awaited<ReturnType<typeof getRecentActivity>>>;
export type GetRecentActivityQueryError = ErrorType<unknown>;
/**
 * @summary Get recent scan activity feed
 */
export declare function useGetRecentActivity<TData = Awaited<ReturnType<typeof getRecentActivity>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getRecentActivity>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getGetRiskDistributionUrl: () => string;
/**
 * @summary Get vulnerability risk level distribution for charts
 */
export declare const getRiskDistribution: (options?: RequestInit) => Promise<RiskDistribution>;
export declare const getGetRiskDistributionQueryKey: () => readonly ["/api/dashboard/risk-distribution"];
export declare const getGetRiskDistributionQueryOptions: <TData = Awaited<ReturnType<typeof getRiskDistribution>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getRiskDistribution>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getRiskDistribution>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetRiskDistributionQueryResult = NonNullable<Awaited<ReturnType<typeof getRiskDistribution>>>;
export type GetRiskDistributionQueryError = ErrorType<unknown>;
/**
 * @summary Get vulnerability risk level distribution for charts
 */
export declare function useGetRiskDistribution<TData = Awaited<ReturnType<typeof getRiskDistribution>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getRiskDistribution>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getGetThreatTrendUrl: () => string;
/**
 * @summary Get threat score trend over time for graphs
 */
export declare const getThreatTrend: (options?: RequestInit) => Promise<ThreatTrendPoint[]>;
export declare const getGetThreatTrendQueryKey: () => readonly ["/api/dashboard/threat-trend"];
export declare const getGetThreatTrendQueryOptions: <TData = Awaited<ReturnType<typeof getThreatTrend>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getThreatTrend>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getThreatTrend>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetThreatTrendQueryResult = NonNullable<Awaited<ReturnType<typeof getThreatTrend>>>;
export type GetThreatTrendQueryError = ErrorType<unknown>;
/**
 * @summary Get threat score trend over time for graphs
 */
export declare function useGetThreatTrend<TData = Awaited<ReturnType<typeof getThreatTrend>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getThreatTrend>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export {};
//# sourceMappingURL=api.d.ts.map