import { useTypedSelector } from './use-typed-selector';

export const useCumulativeCode = (id: string) => {
  return useTypedSelector(({ cells: { data, order } }) => {
    const orderedCells = order.map((id) => data[id]);
    const showFunc = `
      import _React from 'react';
      import _ReactDOM from 'react-dom';
      var show = (value) => {
        const root = document.getElementById('root');
        if (typeof value === 'object') {
          if(value.$$typeof && value.props) {
            _ReactDOM.render(value, root);
          } else {
            root.innerHTML = JSON.stringify(value);
          }
        } else {
          root.innerHTML = value;
        }
      };
    `;
    const showFuncNoop = 'var show = () => {}';
    const cumulativeCode = [];
    for (let c of orderedCells) {
      if (c.type === 'code') {
        c.id === id
          ? cumulativeCode.push(showFunc)
          : cumulativeCode.push(showFuncNoop);
        cumulativeCode.push(c.content);
      }
      if (c.id === id) {
        break;
      }
    }
    return cumulativeCode.join('\n');
  });
};
