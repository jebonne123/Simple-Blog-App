import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../state/store';
import { increment, decrement } from '../state/counter/counterSlice';

const Counter = () => {
    const count = useSelector((state: RootState) => state.counter.value);
    const dispatch = useDispatch();
  return (
    <div>
        <h2>Counter: {count}</h2>
        <div>
            <button onClick={() => dispatch(increment())}>Increment</button>
            <button onClick={() => dispatch(decrement())}>Decrement</button>
        </div>
    </div>
  );
};

export default Counter;