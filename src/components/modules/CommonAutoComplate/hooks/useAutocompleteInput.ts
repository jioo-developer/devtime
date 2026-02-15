import { useEffect, useState } from "react";
import { AutocompleteOption } from "../component/Items";

type UseAutocompleteInputParams = {
  options: AutocompleteOption[];
  value?: string;
  onChange?: (value: string) => void;
};

export function useAutocompleteInput({
  options,
  value,
  onChange,
}: UseAutocompleteInputParams) {
  const [inputValue, setInputValue] = useState(value || "");

  useEffect(() => {
    setInputValue(value || "");
  }, [value]);

  const searchQueryLower = inputValue.toLowerCase();
  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(searchQueryLower),
  );

  const changeInput = (next: string) => {
    setInputValue(next);
    onChange?.(next);
  };

  return {
    inputValue,
    setInputValue,
    filteredOptions,
    changeInput,
  };
}
