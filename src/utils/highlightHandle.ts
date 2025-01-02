export const highlightHandle = (text: string, handles: string[]) => {
  let highlighted = text;

  handles.forEach((handle) => {
    const regex = new RegExp(`(${handle})`, "g");
    highlighted = highlighted.replace(
      regex,
      '<span style="color: #FC7B3D;">$1</span>'
    );
  });

  return highlighted;
};
