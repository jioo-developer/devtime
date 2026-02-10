import type { ReactNode } from "react";

export type TableProps = {
  children: ReactNode;
  className?: string;
  tableClassName?: string;
  "data-testid"?: string;
};

export type TableHeadProps = {
  children: ReactNode;
  className?: string;
};

export type TableBodyProps = {
  children: ReactNode;
  className?: string;
  "aria-busy"?: boolean;
};

export type TableRowProps = {
  children: ReactNode;
  className?: string;
};

export type TableThProps = {
  children?: ReactNode;
  className?: string;
  scope?: "col" | "row";
};

export type TableTdProps = {
  children?: ReactNode;
  className?: string;
  colSpan?: number;
};
