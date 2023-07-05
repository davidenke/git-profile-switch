declare global {
  var log: {
    info: (...data: any[]) => void;
    error: (...data: any[]) => void;
    warn: (...data: any[]) => void;
  };
}

export const prepareLogger = (silent = false) => {
  // prepare minimal logger
  global.log = {
    info: silent ? () => null : console.info,
    error: silent ? () => null : console.error,
    warn: silent ? () => null : console.warn,
  };
};
