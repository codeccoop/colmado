# ![Colmado](https://www.codeccoop.org/assets/images/colmado.png)

Colmado is an uncomplicated and minimal flux architecture implementation on top of [react contexts](https://reactjs.org/docs/context.html).

It proposes a singleton store with modules. Each module has a warehouse, where the data is stored, and a reducer, where actions are defineds. Colmado will create your store and dispatch your actions (change events) to the warehouses. **Yes, it's like redux, but home made**.

Insted of a framework, it's an architectonic proposal with two helper functions: **createStore** and **useStore**. The source code is only 70 lines: easy to read, easy to understand, easy to hack.

## Install

`npm i --save colmado`

## Code structure

You can use colmado on your own way, but for terms of scalability and modularity, we propose the following directory structure.

```bash
├── index.js # Your app root
├── store # Store root directory
│   ├── index.js # Your store instance
│   ├── greetings # Store module. Open a new folder for each module
│   │   ├── index.js # The module instance
│   │   └── reducer.js # Optional, but if your reducer is getting bigger, you can place your actions in a separate file
```

## Usage

To start with colmado, you have to create your store. Let's do it

```javascript
import { createStore } from "colmado";
const Store = createStore();
```

Easy! But your store is empty. So, lets create one module.

```javascript
const myModule = {
  name: "names",
  Component: ({ warehouse, children }) => {
    const [state, setState] = useState();
    return <warehouse.Provider value={[state, setState]}>{children}</warehouse.Provider>;
  }
}

const storeModules = [myModule]
const Store = createStore(storeModules);
```

Now you have your **warehouse** where you can store your data, but nobody is dispatching orders. The store isolate your state from the rest of your application into its warehouses and only allows you to place orders to the **dispatcher**. To be able to dispatch orders, you have to define your **reducer**. So, let's go.

```javascript
const myModule = {
  name: "names",
  Component: ({ warehouse, children }) => {
    const [state, setState] = useState("Garfield");
    return <warehouse.Provider value={[state, setState]}>{children}</warehouse.Provider>;
  },
  reducer: ({ state, action, payload }) => {
    switch (action) {
      case "SET_NAME":
        return payload;
    }
  }
}
```

And your colmado store is ready to open its doors. You only have to wrap your react components with the store and use the **useStore** hook to access the warehouse data and the dispatcher.

```javascript
import { useStore } from "colmado";
import Store from "./store";

function SayHelloTo() {
  const [store, dispatch] = useStore();
  
  function setName(ev) {
    const value = ev.currentTarget.name;
    dispatch({
      action: "SET_NAME",
      payload: value
    });
  }
  
  return (<>
    <select onChange={setName}>
      <option value="Gargamel">Gargamel</option>
      <option value="Suneo">Suneo</option>
    </select>
    <p>Hello, {store.name}!</p>
  </>);
}

function App () {
  return (<Store>
    <SayHelloTo />
  </Store>);
}
```
