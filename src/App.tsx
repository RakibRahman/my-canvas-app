import { useDispatch, useSelector } from 'react-redux'
import './App.css'
import reactLogo from './assets/react.svg'
import { decrementCount, incrementByAmount, incrementCount } from './store/counterSlice'
import { RootState } from './store/store'
import viteLogo from '/vite.svg'
import { getAllProducts } from './store/shopSlice'
import { useEffect } from 'react'


function App() {

const {count} = useSelector((state:RootState)=>state.counter);
const {products} = useSelector((state:RootState)=>state.shop);

const dispatch = useDispatch();
console.log('products',products)

  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>     count is  {count}</h1>
      <div className="card">
        <button onClick={() => dispatch(incrementCount())}>
     Increment
        </button>

        <button onClick={() => dispatch(decrementCount())}>
     Decrement
        </button>

        <button onClick={() => dispatch(incrementByAmount(10))}>
        Increment by 10
        </button>
      
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
