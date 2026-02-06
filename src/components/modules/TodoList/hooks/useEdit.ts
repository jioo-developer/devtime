import { useEffect, useState } from "react";

export interface useEditParams {
  value: string;
  disabled?: boolean;
  onCommit: (nextText: string) => void;
}

export function useEdit({ value, disabled = false, onCommit }: useEditParams) {
  const [draftText, setDraftText] = useState(value);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    setDraftText(value);
  }, [value]);

  const start = () => {
    if (disabled) return;
    setDraftText(value);
    setIsEditing(true);
  };

  const commit = (nextText?: string) => {
    setIsEditing(false);
    onCommit((nextText ?? draftText).trim());
  };

  const cancel = () => {
    setDraftText(value);
    setIsEditing(false);
  };

  const stop = () => {
    setIsEditing(false);
  };

  return {
    draftText,
    setDraftText,
    isEditing,
    start,
    commit,
    cancel,
    stop,
  };
}
