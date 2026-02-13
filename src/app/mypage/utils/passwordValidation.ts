/** 새 비밀번호는 선택 입력 — 값이 있을 때만 검증 */

function toStr(value: string | string[] | undefined): string {
  return typeof value === "string" ? value : value?.[0] ?? "";
}

export const newPasswordValidation = {
  validate: (value: string | string[] | undefined) => {
    const str = toStr(value);
    if (!str?.trim()) return true;
    if (str.length < 8) return "비밀번호는 8자리 이상이어야 합니다.";
    if (!/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]+$/.test(str))
      return "비밀번호는 영문과 숫자를 포함해야 합니다.";
    return true;
  },
};
