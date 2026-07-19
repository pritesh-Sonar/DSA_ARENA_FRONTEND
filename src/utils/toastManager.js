let listeners = [];
let idCounter = 0;

export const toastManager = {
  subscribe(callback) {
    listeners.push(callback);
    return () => {
      listeners = listeners.filter((l) => l !== callback);
    };
  },

  show(message, type = "error", duration = 5000) {
    const id = ++idCounter;
    listeners.forEach((callback) => callback({ id, message, type, duration }));
    return id;
  },
};