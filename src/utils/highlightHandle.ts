export const hightlightHandle = (text: string, handles: string[]) => {
  let hightlighted = text;

  handles.forEach((handle) => {
    const regex = new RegExp(`(${handle})`, "g");
    hightlighted = hightlighted.replace(
      regex,
      '<span style="color: blue;">$1</span>'
    );
  });
  return hightlighted;
};
