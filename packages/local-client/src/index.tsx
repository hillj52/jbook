import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { store } from './state';
import CellList from './components/cell-list';

import 'bulmaswatch/superhero/bulmaswatch.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

const App = () => ( 
    <Provider store={store}>
      <main>
        <CellList />
      </main>
    </Provider>
);

ReactDOM.render(<App />, document.getElementById('root'));