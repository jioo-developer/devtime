import { useState } from "react";
import type { AutocompleteOption } from "../component/Items";

type UseMultiSelectParams = {
  selectedItems?: string[];
  onSelectedItemsChange?: (items: string[]) => void;
  onAddNew?: (inputValue: string) => void;
};

export type SelectOptionFlags = {
  multiSelect: boolean;
  showAddButton: boolean;
};

/** 훅은 "의도"만 반환. setInputValue/close는 컴포넌트에서 처리 */
export type SelectOptionResult =
  | { action: "single"; label: string }
  | { action: "multiAdded" }
  | { action: "fillInput"; label: string };

export function useMultiSelect({
  selectedItems: externalSelectedItems,
  onSelectedItemsChange,
  onAddNew,
}: UseMultiSelectParams) {
  const [internalSelectedItems, setInternalSelectedItems] = useState<string[]>(
    [],
  );

  const selectedItems = externalSelectedItems ?? internalSelectedItems;

  const setSelectedItems = (
    next: string[] | ((prev: string[]) => string[]),
  ) => {
    const prev = selectedItems;
    const resolved = typeof next === "function" ? next(prev) : next;

    if (onSelectedItemsChange) onSelectedItemsChange(resolved);
    else setInternalSelectedItems(resolved);
  };

  const addSelectedItem = (label: string) => {
    setSelectedItems((prev) =>
      prev.includes(label) ? prev : [...prev, label],
    );
  };

  const removeSelectedItem = (label: string) => {
    setSelectedItems((prev) => prev.filter((item) => item !== label));
  };

  /** 새 항목 추가 의도. 호출 후 컴포넌트에서 setInputValue(""), close() 처리 */
  const addItem = (label: string, multiSelect: boolean) => {
    const trimmed = label.trim();
    if (!trimmed) return;

    if (multiSelect) {
      addSelectedItem(trimmed);
      onAddNew?.(trimmed);
      return;
    }
    onAddNew?.(trimmed);
  };

  /** 옵션 선택 의도. 반환값에 따라 컴포넌트에서 setInputValue/onChange/close 처리 */
  const selectOption = (
    option: AutocompleteOption,
    flags: SelectOptionFlags,
  ): SelectOptionResult => {
    const { multiSelect, showAddButton } = flags;
    const label = option.label;

    if (!multiSelect) {
      return { action: "single", label };
    }

    if (showAddButton) {
      return { action: "fillInput", label };
    }

    addSelectedItem(label);
    return { action: "multiAdded" };
  };

  return {
    selectedItems,
    addItem,
    selectOption,
    handleRemoveItem: removeSelectedItem,
  };
}
