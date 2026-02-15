import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { CommonTable } from "./CommonTable";

const meta: Meta<typeof CommonTable> = {
  title: "Modules/CommonTable",
  component: CommonTable,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof CommonTable>;

export const Default: Story = {
  render: () => (
    <CommonTable>
      <CommonTable.Head>
        <CommonTable.Row>
          <CommonTable.Th>이름</CommonTable.Th>
          <CommonTable.Th>이메일</CommonTable.Th>
          <CommonTable.Th>역할</CommonTable.Th>
        </CommonTable.Row>
      </CommonTable.Head>
      <CommonTable.Body>
        <CommonTable.Row>
          <CommonTable.Td>김철수</CommonTable.Td>
          <CommonTable.Td>kim@example.com</CommonTable.Td>
          <CommonTable.Td>개발자</CommonTable.Td>
        </CommonTable.Row>
        <CommonTable.Row>
          <CommonTable.Td>이영희</CommonTable.Td>
          <CommonTable.Td>lee@example.com</CommonTable.Td>
          <CommonTable.Td>디자이너</CommonTable.Td>
        </CommonTable.Row>
        <CommonTable.Row>
          <CommonTable.Td>박민수</CommonTable.Td>
          <CommonTable.Td>park@example.com</CommonTable.Td>
          <CommonTable.Td>기획자</CommonTable.Td>
        </CommonTable.Row>
      </CommonTable.Body>
    </CommonTable>
  ),
};

export const Empty: Story = {
  render: () => (
    <CommonTable>
      <CommonTable.Head>
        <CommonTable.Row>
          <CommonTable.Th>날짜</CommonTable.Th>
          <CommonTable.Th>목표</CommonTable.Th>
          <CommonTable.Th>상태</CommonTable.Th>
        </CommonTable.Row>
      </CommonTable.Head>
      <CommonTable.Body>
        <CommonTable.Row>
          <CommonTable.Td colSpan={3} className="recordsEmpty">
            기록이 없습니다.
          </CommonTable.Td>
        </CommonTable.Row>
      </CommonTable.Body>
    </CommonTable>
  ),
};

export const Loading: Story = {
  render: () => (
    <CommonTable>
      <CommonTable.Head>
        <CommonTable.Row>
          <CommonTable.Th>날짜</CommonTable.Th>
          <CommonTable.Th>목표</CommonTable.Th>
          <CommonTable.Th>공부 시간</CommonTable.Th>
        </CommonTable.Row>
      </CommonTable.Head>
      <CommonTable.Body aria-busy={true}>
        <CommonTable.Row>
          <CommonTable.Td colSpan={3}>로딩 중...</CommonTable.Td>
        </CommonTable.Row>
      </CommonTable.Body>
    </CommonTable>
  ),
};

export const WithScopeColumn: Story = {
  render: () => (
    <CommonTable>
      <CommonTable.Head>
        <CommonTable.Row>
          <CommonTable.Th>날짜</CommonTable.Th>
          <CommonTable.Th>목표</CommonTable.Th>
          <CommonTable.Th scope="col" />
        </CommonTable.Row>
      </CommonTable.Head>
      <CommonTable.Body>
        <CommonTable.Row>
          <CommonTable.Td>2025.02.10</CommonTable.Td>
          <CommonTable.Td>React 공부하기</CommonTable.Td>
          <CommonTable.Td className="colDelete">삭제</CommonTable.Td>
        </CommonTable.Row>
      </CommonTable.Body>
    </CommonTable>
  ),
};
