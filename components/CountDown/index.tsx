import React, { useEffect, useState } from 'react';
import style from './index.module.scss';

interface IProps {
  time: number;
  onEnd: Function;

}

const CountDown:React.FC<IProps> = (props) => {
  const { time, onEnd } = props;
  const [count, setCount] = useState<number>(time || 60);

  useEffect(() => {
    const id = setInterval(() => {
      setCount((count) => {
        if(count === 0) {
          clearInterval(id);
          onEnd && onEnd();
          return count;
        }
        return count - 1;
      })
    }, 1000);

    return () => {
      clearInterval(id);
    }
  }, [time])

  return (
    <div className={style.countDown}>{count}</div>
  )
}

export default CountDown;