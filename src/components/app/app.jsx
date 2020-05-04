import React from 'react';
import { HashRouter, Switch, Route } from "react-router-dom";
import './app.scss';
import './universal.scss';

import AppHeader from './app-header';
import AppFooter from './app-footer';
import Main from 'components/main';
import About from 'components/about';

export default function App(props) {
    return (
            <HashRouter basename='/'>
                <div className="app">
                    <AppHeader />
                    <div className="app-content">
                        <Switch>
                            <Route exact path="/">
                                <Main />
                            </Route>
                            <Route path="/about">
                                <About />
                            </Route>
                            <Route path="/visualizer">
                                <Main />
                            </Route>
                        </Switch>
                    </div>
                    <AppFooter />
                </div>
            </HashRouter>
        );
}
