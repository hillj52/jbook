import { useEffect, useState } from 'react';
import { ResizableBox, ResizableBoxProps } from 'react-resizable';

import './resizable.css';

interface ResizableProps {
  direction: 'horizontal' | 'vertical';
}

const Resizable: React.FC<ResizableProps> = ({ direction, children }) => {
  
  const [innerHeight, setInnerHeight] = useState(window.innerHeight);
  const [innerWidth, setInnerWidth] = useState(window.innerWidth);
  const [width, setWidth] = useState(window.innerWidth * 0.75)

  useEffect(() => {
    let timer: NodeJS.Timeout;
    const listener = () => {
      if (timer) {
        clearTimeout(timer);
      }
      timer = setTimeout(() => {
        setInnerWidth(window.innerWidth);
        if (window.innerWidth * 0.75 < width) {
          setWidth(window.innerWidth * 0.75);
        }
        setInnerHeight(window.innerHeight);
      }, 100);
    }

    window.addEventListener('resize', listener);

    return () => window.removeEventListener('resize', listener);
  }, [width]);

  const getProps = (): ResizableBoxProps => {
    return direction === 'vertical' ? {
      className: 'resize-vertical',
      maxConstraints: [Infinity, innerHeight * 0.9],
      minConstraints: [Infinity, 24], 
      height: 300, 
      width: Infinity, 
      resizeHandles: ['s']
    } : {
      className: 'resize-horizontal',
      maxConstraints: [innerWidth * 0.75, Infinity],
      minConstraints: [innerWidth * 0.2, Infinity], 
      height: Infinity, 
      width, 
      resizeHandles: ['e'],
      onResizeStop: (_, { size }) => {
        setWidth(size.width);
      }
    }
  };

  return (
    <ResizableBox {...getProps()}>
      {children}
    </ResizableBox>
  );
};

export default Resizable;