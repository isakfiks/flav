export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'HEAD' | 'OPTIONS';
export type ProtocolType = 'REST' | 'GraphQL' | 'WebSocket' | 'gRPC';

export interface KeyValuePair {
  id: string;
  key: string;
  value: string;
  enabled: boolean;
}

export interface ApiRequest {
  id: string;
  name: string;
  method: HttpMethod;
  protocol: ProtocolType;
  url: string;
  headers: KeyValuePair[];
  params: KeyValuePair[];
  body: string;
  bodyType: 'none' | 'json' | 'form-data' | 'raw' | 'graphql';
  preRequestScript: string;
  tests: string;
  auth: {
    type: 'none' | 'bearer' | 'basic' | 'api-key';
    token?: string;
    username?: string;
    password?: string;
    key?: string;
    value?: string;
  };
}

export interface ApiResponse {
  status: number;
  statusText: string;
  headers: Record<string, string>;
  body: string;
  time: number;
  size: number;
}

export interface Collection {
  id: string;
  name: string;
  requests: ApiRequest[];
  expanded?: boolean;
}

export interface Environment {
  id: string;
  name: string;
  variables: KeyValuePair[];
  active?: boolean;
}

export interface TestResult {
  name: string;
  passed: boolean;
  message?: string;
}

export interface AppTab {
  id: string;
  requestId: string;
  name: string;
  method: HttpMethod;
  dirty?: boolean;
}

export const METHOD_COLORS: Record<HttpMethod, string> = {
  GET: 'text-emerald-500',
  POST: 'text-amber-500',
  PUT: 'text-blue-500',
  PATCH: 'text-purple-500',
  DELETE: 'text-red-500',
  HEAD: 'text-pink-400',
  OPTIONS: 'text-cyan-500',
};

export function createEmptyRequest(name = 'Untitled Request'): ApiRequest {
  return {
    id: crypto.randomUUID(),
    name,
    method: 'GET',
    protocol: 'REST',
    url: '',
    headers: [{ id: crypto.randomUUID(), key: '', value: '', enabled: true }],
    params: [{ id: crypto.randomUUID(), key: '', value: '', enabled: true }],
    body: '',
    bodyType: 'none',
    preRequestScript: '',
    tests: '',
    auth: { type: 'none' },
  };
}

export function createEmptyCollection(name = 'New Collection'): Collection {
  return {
    id: crypto.randomUUID(),
    name,
    requests: [],
    expanded: true,
  };
}

export function createDefaultEnvironment(): Environment[] {
  return [
    {
      id: crypto.randomUUID(),
      name: 'Development',
      variables: [
        { id: crypto.randomUUID(), key: 'BASE_URL', value: 'http://localhost:3000', enabled: true },
        { id: crypto.randomUUID(), key: 'API_KEY', value: '', enabled: true },
      ],
      active: true,
    },
    {
      id: crypto.randomUUID(),
      name: 'Staging',
      variables: [
        { id: crypto.randomUUID(), key: 'BASE_URL', value: 'https://staging.api.com', enabled: true },
        { id: crypto.randomUUID(), key: 'API_KEY', value: '', enabled: true },
      ],
    },
    {
      id: crypto.randomUUID(),
      name: 'Production',
      variables: [
        { id: crypto.randomUUID(), key: 'BASE_URL', value: 'https://api.com', enabled: true },
        { id: crypto.randomUUID(), key: 'API_KEY', value: '', enabled: true },
      ],
    },
  ];
}
