export const throttling = (throttleTimePerMs = 500) => {
  let timer: NodeJS.Timer | null = null;

  const throttleFunc = (callbackFunc: () => void) => {
    if (!timer) {
      timer = setTimeout(() => {
        timer = null;
      }, throttleTimePerMs);
      callbackFunc();
    }
  };

  return throttleFunc;
};
