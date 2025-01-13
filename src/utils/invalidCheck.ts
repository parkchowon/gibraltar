// 아이디 체크
export const invalidCheckId = (id: string) => {
  if (id.length === 0) {
    return "";
  }
  if (!findSpecialSymbol(id)) {
    return "영문자, 숫자 및 언더바(_)만 이용해서 만들어주세요.";
  }
  if (id.length < 7) {
    return "최소 7글자 이상 입력해주세요!";
  }
  if (!!Number(id)) {
    return "영문자를 포함해주세요.";
  } else {
    return "사용가능한 아이디예요.";
  }
};

// 특수기호, 한글 x
const findSpecialSymbol = (id: string) => {
  const specialSymbol = /^[a-zA-Z0-9_]+$/;
  return specialSymbol.test(id);
};

export const handleSearchInvalidCheck = (handle: string) => {
  const permittedChar = /^[a-zA-Z0-9_]+$/;
  return permittedChar.test(handle);
};

// 배틀태그 유효성 검사
export const invalidCheckBattleTag = (battleTag: string) => {
  const format = /^.{2,}#\d{3,}$/;
  const result = format.test(battleTag);
  return result;
};
