# Colmado
Flux architecture implementation with react contexts

## Install

`npm i --save colmado`

## Code structure

```bash
├── index.js # Your app root
├── store # Store directoru
│   ├── index.js # Your store instance
│   ├── greetings # Store module
│   │   ├── index.js # Store module definition
│   │   └── reducer.js # Store module reducer
```

## Usage

Your colmado store can have many modules, each with its own warehouse. A module is an object with, at least, a name attribute.

```javascript
import reducer from "./reducer.js";

const Component = ({ warehouse, children }) => {
  const [user, setUser] = useState({
    id: 0,
    name: "Noname"
  });
  
  const setState = ({ userId }) => {
    fetch(`api/users/${userId}`).then(setUser);
  }
  
  return <warehouse.Provider value={[state, setState]}>{ children }</warehouse.Provider>
}

export default { name: "greetings", Component, reducer };
```

Each module requires its own reducer.

```javascript
const reducer = ({ state, action, payload }) => {
  switch (action) {
    case "SET_NAME":
      return { userId: payload.id }
  }
}
```

In your store module, you have to import all your store modules and the `createStore` method to initialize your colmado store.

```javascript
import { createStore } from "colmado";
import greetings from "./greetings";

const storeModules = [greetings];

const Store = createStore(storeModules);

export default Store
```

You have to wrap your application inside the Store component to provide access to their context across your components with the `useStore` hook.

```javascript
import { useStore } from "colmado";
import Store from "./store";

function SayHello () {
  const [{ greetings }, dispatch] = useStore();
  
  const setUser = (ev) => {
    const userId = ev.currentTarget.value;
    dispatch({
      action: "SET_USER",
      payload: userId
    });
  }
  
  return (<>
    <select onChange={setUser}>
      <option value="1">Gargamel</option>
      <option value="2">Suneo</option>
    </select>
    <p>Hello, {greetings.name}!</p>
  </>);
}

function App () {
  return (<Store>
    <SayHello />
  </Store>);
}
```
