import './App.css';
import Item from './Item';
import reactLogo from './assets/react.svg';
import viteLogo from './assets/vite.svg';
import { useState } from 'react';

function App() {
  // const [count, setCount] = useState(0);

  const inctrement10 = () => {
    console.log('!!!');
  };

  return (
    <>
      <Item onClick={inctrement10} />
    </>
  );
}

export default App;
