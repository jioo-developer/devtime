"use client";
import type {
  TableBodyProps,
  TableHeadProps,
  TableProps,
  TableRowProps,
  TableTdProps,
  TableThProps,
} from "./types";
import styles from "./style.module.css";

function TableRoot({
  children,
  className,
  tableClassName,
  "data-testid": testId,
}: TableProps) {
  return (
    <div className={className ?? styles.wrap} data-testid={testId}>
      <table className={tableClassName ?? styles.table}>{children}</table>
    </div>
  );
}

function TableHead({ children, className }: TableHeadProps) {
  return <thead className={className}>{children}</thead>;
}

function TableBody({
  children,
  className,
  "aria-busy": ariaBusy,
}: TableBodyProps) {
  return (
    <tbody className={className} aria-busy={ariaBusy}>
      {children}
    </tbody>
  );
}

function TableRow({ children, className }: TableRowProps) {
  return <tr className={className}>{children}</tr>;
}

function TableTh({ children, className, scope }: TableThProps) {
  return (
    <th className={className} scope={scope}>
      {children}
    </th>
  );
}

function TableTd({ children, className, colSpan }: TableTdProps) {
  return (
    <td className={className} colSpan={colSpan}>
      {children}
    </td>
  );
}

export const CommonTable = Object.assign(TableRoot, {
  Head: TableHead,
  Body: TableBody,
  Row: TableRow,
  Th: TableTh,
  Td: TableTd,
});

export default CommonTable;
