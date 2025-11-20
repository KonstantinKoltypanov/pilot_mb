import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import { Provider } from 'react-redux';
import { store } from './store/store';
import './App.css';

function App() {
  return (
    <Provider store={store}>
      <ConfigProvider>
        <BrowserRouter>
          <div className="app">
            {/* Здесь будут ваши страницы */}
          </div>
        </BrowserRouter>
      </ConfigProvider>
    </Provider>
  );
}

export default App;

