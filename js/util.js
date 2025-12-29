const INPUT_DELAY_MS = 500;

const isEscapeKey = (evt) => evt.key === 'Escape';

const delayCall = (cb) => {
  let currentTimeout = null;

  return (...rest) => {
    if (currentTimeout){
      window.clearTimeout(currentTimeout);
    }
    currentTimeout = window.setTimeout(()=>{
      cb(...rest);
    }, INPUT_DELAY_MS);
  };
};

const randomizeArray = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

export {isEscapeKey,delayCall, randomizeArray};
