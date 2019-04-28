const singletons = {};

export const setSingleton = (key, instance) => {
  singletons[key] = instance;
};

export default singletons;
