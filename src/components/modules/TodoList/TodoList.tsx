import React from "react";
import { MdEdit, MdDelete } from "react-icons/md";
import styles from "./style.module.css";
import codeIcon from "@/asset/images/code-icon.png";
import CommonButton from "@/components/atoms/CommonButton/CommonButton";
import CommonCheckbox from "@/components/atoms/CommonCheckbox/CommonCheckbox";
import CommonImage from "@/components/atoms/CommonImage/CommonImage";
import {
  TodoStatus,
  useTodoListItemController,
} from "./hooks/useTodoListController";
import type { FormMode } from "@/app/Home/component/Form/types";
import TodoListItemEdit from "./TodoListItemEdit";

interface TodoListItemProps {
  text: string;
  initialStatus?: TodoStatus;
  mode?: FormMode;
  onTextChange?: (nextText: string) => void;
  onStatusChange?: (nextStatus: TodoStatus) => void;
  onDelete?: () => void;
}

export default function TodoListItem(props: TodoListItemProps) {
  const { state, actions } = useTodoListItemController(props);

  if (props.mode === "edit" && state.isTyping) {
    return <TodoListItemEdit state={state} actions={actions} />;
  }

  return (
    <div
      className={`${styles.todoItem} ${styles[state.uiStatus]}`}
      aria-disabled={state.isDisabled}
      onClick={actions.onItemClick}
    >
      <div className={styles.leftSection}>
        <CommonImage
          src={codeIcon}
          alt="code icon"
          width={24}
          height={24}
          className={styles.codeIcon}
        />
        <span className={styles.text}>{state.text}</span>
      </div>

      {props.mode === "edit" && (
        <div className={styles.rightSection}>
          {(state.uiStatus === "active" || state.uiStatus === "default") &&
            !state.isDisabled && (
              <>
                <CommonButton
                  theme="none"
                  className={styles.iconButton}
                  aria-label="edit"
                  onClick={(e) => {
                    e.stopPropagation();
                    actions.startEdit();
                  }}
                >
                  <MdEdit size={20} />
                </CommonButton>

                <CommonButton
                  theme="none"
                  style={{ paddingRight: 8 }}
                  className={styles.iconButton}
                  aria-label="delete"
                  onClick={(e) => {
                    e.stopPropagation();
                    actions.requestDelete();
                  }}
                >
                  <MdDelete size={20} />
                </CommonButton>
              </>
            )}

          <CommonCheckbox
            checked={state.isDisabled}
            onChange={actions.toggleDisabled}
            onClick={(e) => e.stopPropagation()}
            color="white"
            size={20}
          />
        </div>
      )}
    </div>
  );
}
