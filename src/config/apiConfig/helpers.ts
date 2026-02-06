type UnknownRecord = Record<string, unknown>;

export function mergeHeaders(
  baseHeaders: Record<string, string>,
  extra?: HeadersInit,
): HeadersInit {
  return { ...baseHeaders, ...(extra ?? {}) };
}

// API 호출에 사용할 최종 URL 생성 함수
export function createApiUrl(
  endpoint: string,
  options?: { pathParams?: unknown; query?: unknown },
): string {
  // 1) API 기본 URL 가져오기 (환경변수 필수)
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (!baseUrl) {
    throw new Error("NEXT_PUBLIC_API_BASE_URL is not configured");
  }

  // 객체 형태인지 확인하는 간단한 타입 가드
  const isRecord = (value: unknown): value is UnknownRecord =>
    typeof value === "object" && value !== null && !Array.isArray(value);

  // 2) pathParams를 endpoint 템플릿에 치환
  // 예: "/users/{id}" + { id: 3 } → "/users/3"
  let path = endpoint;

  if (isRecord(options?.pathParams)) {
    for (const [key, value] of Object.entries(options.pathParams)) {
      path = path.replaceAll(`{${key}}`, encodeURIComponent(String(value)));
    }
  }

  // 3) query 객체를 query string으로 변환
  // 예: { page: 1, size: 10 } → "?page=1&size=10"
  let queryString = "";

  if (isRecord(options?.query)) {
    const params = new URLSearchParams();
    Object.entries(options.query).forEach(([key, value]) => {
      // options.query as Record<string, string>
      // 예: { page: 1, size: 10 } → "?page=1&size=10"
      if (value != null) params.set(key, String(value));
    });

    queryString = params.toString() ? `?${params.toString()}` : "";
  }

  // 4) baseUrl + path + queryString 결합 후 반환
  return `${baseUrl}${path}${queryString}`;
}

// JSON 기반 API 요청 공통 처리 함수
export async function requestJson<TResponse>(options: {
  method: "GET" | "POST" | "PUT" | "DELETE"; // HTTP 메서드
  endpoint: string; // API 엔드포인트 (ex: "/users/{id}")
  baseHeaders: Record<string, string>; // 기본 헤더 (Content-Type 등)
  pathParams?: unknown; // 경로 치환 파라미터
  query?: unknown; // 쿼리스트링 파라미터
  headers?: HeadersInit; // 추가 헤더
  body?: unknown; // 요청 바디 (JSON 직렬화 대상)
  onNotOk?: (response: Response) => Promise<TResponse>; // 에러 응답 커스텀 처리
}): Promise<TResponse> {
  // 1) endpoint + pathParams + query를 조합해서 최종 API URL 생성
  const url = createApiUrl(options.endpoint, {
    pathParams: options.pathParams,
    query: options.query,
  });

  // 2) fetch 요청 실행
  const response = await fetch(url, {
    method: options.method,
    headers: mergeHeaders(options.baseHeaders, options.headers),
    body:
      options.body === undefined
        ? undefined // 바디 없으면 전송 안 함 (GET 등)
        : JSON.stringify(options.body), // JSON 요청일 경우 직렬화
  });

  // 3) HTTP 상태 코드가 OK가 아니면 공통 에러 처리 로직으로 위임
  if (!response.ok) {
    return handleNotOk(
      options.method,
      options.endpoint,
      response,
      options.onNotOk,
    );
  }

  // 4) 정상 응답이면 JSON 파싱 후 반환 (빈 바디도 안전 처리)
  return parseJson<TResponse>(response);
}

/** 빈 바디(204 등) 대비: text로 먼저 받고 비어있으면 {} 반환 */
export async function parseJson<T>(response: Response): Promise<T> {
  const text = await response.text();
  if (!text.trim()) return {} as T;
  return JSON.parse(text) as T;
}

/** response.ok === false 처리: onNotOk 우선, 없으면 기본 throw */
export async function handleNotOk<T>(
  method: string,
  endpoint: string,
  response: Response,
  onNotOk?: (response: Response) => Promise<T>,
): Promise<T> {
  if (onNotOk) return onNotOk(response);
  throw new Error(`${method} ${endpoint} failed`);
}
