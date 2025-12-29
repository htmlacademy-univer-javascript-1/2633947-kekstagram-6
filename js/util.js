const DEBOUNCE_DELAY = 500;

const isEscapeKey = (evt) => evt.key === 'Escape';

const debounce = (cb) => {
  let lastTimeout = null;

  return (...rest) => {
    if (lastTimeout){
      window.clearTimeout(lastTimeout);
    }
    lastTimeout = window.setTimeout(()=>{
      cb(...rest);
    }, DEBOUNCE_DELAY);
  };
};

const shuffleArray = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

export {isEscapeKey,debounce, shuffleArray};
