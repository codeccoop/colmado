import React, { createContext, useContext } from "react";

const storeModules = [];

function noop() {}

function warehouseProxy(warehouse) {
  if (Array.isArray(warehouse)) {
    return warehouse;
  }

  return [warehouse, noop];
}

function moduleBoilerplate(module) {
  module = { ...module };
  if (!module.name) throw new Error("Unamed store module");
  module.warehouse = module.warehouse || createContext([null, noop]);
  module.Component = module.Component || Fragment;
  module.reducer = module.reducer || noop;
  return module;
}

function getStore() {
  const warehouses = storeModules.map((module) => {
    return [module.name, useContext(module.warehouse)];
  });

  return Object.fromEntries(warehouses);
}

// Return the store modules components recursively nesteds
function renderStore({ modules, children }) {
  const store = getStore();
  return modules.reduce((children, module) => {
    return (
      <module.Component store={store} Warehouse={module.warehouse.Provider}>
        {children ? children : void 0}
      </module.Component>
    );
  }, children);
}

export function createStore(modules) {
  modules.forEach((module) => storeModules.push(moduleBoilerplate(module)));
  storeModules.reduce((names, { name }) => {
    if (names.indexOf(name) >= 0) {
      throw new Error("Collision on store module names with " + name);
    }
    return names.concat(name);
  }, []);

  function Store({ children }) {
    return renderStore({ modules: storeModules, children });
  }

  return Store;
}

export function useStore() {
  const store = getStore();
  return [
    // Store state
    Object.fromEntries(
      Object.entries(store).map(([name, warehouse]) => {
        const [state] = warehouseProxy(warehouse);
        return [name, state];
      })
    ),
    // Store dispatcher
    ({ action, payload }) => {
      storeModules.forEach(({ name, reducer }) => {
        const [state, setState] = warehouseProxy(store[name]);
        try {
          const newState = reducer({ state, action, payload });
          if (newState !== void 0 && newState !== state) {
            typeof setState === "function" && setState(newState);
          }
        } catch (err) {
          console.error(err);
        }
      });
    },
  ];
}
