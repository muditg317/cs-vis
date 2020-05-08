import React, { useEffect } from 'react';
import { HashRouter, Switch, Route } from "react-router-dom";
import './app.scss';
import './universal.scss';

import AppHeader from './app-header';
import AppFooter from './app-footer';
import Main from 'components/main';
import About from 'components/about';

import { Utils } from 'utils';

export default function App(props) {
    useEffect(() => {
        Utils.addMobileClasses();
    }, []);
    return (
            <HashRouter basename='/'>
                <React.StrictMode>
                    <div className="app">
                        <AppHeader />
                        <div className="app-content">
                            <Switch>
                                <Route path="/about">
                                    <About />
                                </Route>
                                <Route path="/">
                                    <Main />
                                </Route>
                            </Switch>
                        </div>
                        <AppFooter />
                    </div>
                </React.StrictMode>
            </HashRouter>
        );
}
