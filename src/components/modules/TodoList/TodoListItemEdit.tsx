import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { MdCheck } from "react-icons/md";
import styles from "./style.module.css";
import codeIcon from "@/asset/images/code-icon.png";
import CommonButton from "@/components/atoms/CommonButton/CommonButton";
import CommonCheckbox from "@/components/atoms/CommonCheckbox/CommonCheckbox";
import CommonInput from "@/components/atoms/CommonInput/CommonInput";
import CommonImage from "@/components/atoms/CommonImage/CommonImage";
import { useTodoListItemController } from "./hooks/useTodoListController";
import { todoListItemEditSchema } from "@/schema/formSchemas";

type ControllerState = ReturnType<typeof useTodoListItemController>["state"];
type ControllerActions = ReturnType<
  typeof useTodoListItemController
>["actions"];

interface TodoListItemEditProps {
  state: ControllerState;
  actions: ControllerActions;
}

export default function TodoListItemEdit({
  state,
  actions,
}: TodoListItemEditProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<{
    text: string;
  }>({
    resolver: zodResolver(todoListItemEditSchema),
    defaultValues: { text: state.text },
  });

  // typing 시작 시점에 input 값을 현재 텍스트로 맞춤
  useEffect(() => {
    if (state.isTyping) reset({ text: state.text });
  }, [state.isTyping, state.text, reset]);

  return (
    <div
      className={`${styles.todoItem} ${styles[state.uiStatus]}`}
      aria-disabled={state.isDisabled}
    >
      <div className={styles.editFormWrapper}>
        <form
          onSubmit={handleSubmit(({ text }) => {
            actions.finishEditWithValue(text);
          })}
          onClick={(e) => e.stopPropagation()}
          onKeyDown={(e) => {
            if (e.key === "Escape") actions.cancelEdit();
          }}
          className={styles.editFormRow}
        >
          <div className={styles.leftSection}>
            <CommonImage
              src={codeIcon}
              alt="code icon"
              width={24}
              height={24}
              className={styles.codeIcon}
            />
            <CommonInput
              id="text"
              type="text"
              className={styles.textInput}
              register={register}
              error={errors.text}
            />
          </div>

          <div className={styles.rightSection}>
            <CommonButton
              theme="none"
              type="submit"
              className={styles.iconButton}
              disabled={state.isDisabled}
              aria-label="save"
              onClick={(e) => e.stopPropagation()}
            >
              <MdCheck size={20} />
            </CommonButton>

            <CommonCheckbox
              checked={state.isDisabled}
              onChange={actions.toggleDisabled}
              onClick={(e) => e.stopPropagation()}
              color="white"
              size={20}
            />
          </div>
        </form>
      </div>
    </div>
  );
}
