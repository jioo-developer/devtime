"use client";

/** 로딩/에러는 서로 동시에 뜰 일은 거의 없지만, 렌더 책임을 분리해 읽기 쉽게 */
export function RankingStatus({
  isLoading,
  isError,
}: {
  isLoading: boolean;
  isError: boolean;
}) {
  if (isLoading)
    return <p className="rankingPage__loading">랭킹을 불러오는 중...</p>;
  if (isError)
    return <p className="rankingPage__error">랭킹을 불러오지 못했습니다.</p>;
  return null;
}
