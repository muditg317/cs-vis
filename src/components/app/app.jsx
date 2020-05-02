import React from 'react';
import { HashRouter, Route } from "react-router-dom";
import './app.scss';
import './universal.scss';

import AppHeader from './app-header';
import AppFooter from './app-footer';
import Main from 'components/main';
import About from 'components/about';

export default function App() {
    return (
            <HashRouter basename='/'>
                <div className="app">
                    <AppHeader />
                    <div className="app-content">
                        <Route path="/">
                            <Main />
                        </Route>
                        <Route path="/about">
                            <About />
                        </Route>
                    </div>
                    <AppFooter />
                </div>
            </HashRouter>
        );
}
