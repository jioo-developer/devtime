"use client";
import { MdOutlineDelete } from "react-icons/md";
import CommonButton from "@/components/atoms/CommonButton/CommonButton";
import { CommonTable } from "@/components/modules/CommonTable/CommonTable";
import type { StudyLogListItem } from "../../types";
import { formatMinToHm, formatTaskRate } from "../../utils/formatStats";

type RecordsTableProps = {
  records: StudyLogListItem[];
  isLoading: boolean;
  isError: boolean;
  onGoalClick: (studyLogId: string | number) => void;
};

export function RecordsTable({
  records,
  isLoading,
  isError,
  onGoalClick,
}: RecordsTableProps) {
  return (
    <CommonTable className="recordsTableWrap" tableClassName="recordsTable">
      <CommonTable.Head>
        <CommonTable.Row>
          <CommonTable.Th>날짜</CommonTable.Th>
          <CommonTable.Th>목표</CommonTable.Th>
          <CommonTable.Th>공부 시간</CommonTable.Th>
          <CommonTable.Th>할일 갯수</CommonTable.Th>
          <CommonTable.Th>미완료 할 일</CommonTable.Th>
          <CommonTable.Th>달성률</CommonTable.Th>
          <CommonTable.Th className="colDelete" scope="col" />
        </CommonTable.Row>
      </CommonTable.Head>
      <CommonTable.Body aria-busy={isLoading}>
        {records.length === 0 && !isLoading ? (
          <CommonTable.Row>
            <CommonTable.Td colSpan={7} className="recordsEmpty">
              {isError ? "목록을 불러오지 못했습니다." : "기록이 없습니다."}
            </CommonTable.Td>
          </CommonTable.Row>
        ) : (
          records.map((record) => (
            <CommonTable.Row key={record.studyLogId}>
              <CommonTable.Td className="colDate">
                {record.date ? record.date.replace(/-/g, ".") : record.date}
              </CommonTable.Td>
              <CommonTable.Td className="colGoal">
                <CommonButton
                  type="button"
                  theme="none"
                  className="recordGoalButton"
                  onClick={() => onGoalClick(record.studyLogId)}
                >
                  {record.goal}
                </CommonButton>
              </CommonTable.Td>
              <CommonTable.Td>
                {formatMinToHm(record.studyTimeMinutes)}
              </CommonTable.Td>
              <CommonTable.Td>{record.todoCount}</CommonTable.Td>
              <CommonTable.Td>{record.unfinishedCount}</CommonTable.Td>
              <CommonTable.Td>
                {formatTaskRate(record.completionRate)}
              </CommonTable.Td>
              <CommonTable.Td className="colDelete">
                <CommonButton type="button" theme="none" aria-label="삭제">
                  <MdOutlineDelete size={18} aria-hidden />
                </CommonButton>
              </CommonTable.Td>
            </CommonTable.Row>
          ))
        )}
      </CommonTable.Body>
    </CommonTable>
  );
}
