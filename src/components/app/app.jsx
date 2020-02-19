import React from 'react';
import { HashRouter, Switch, Route } from "react-router-dom";
import './app.scss';
import './universal.scss';

import AppHeader from './app-header';
import AppFooter from './app-footer';
import Home from '../home';
import About from '../about';
import DataStructures from '../datastructures';

export default function App() {
    return (
            <HashRouter basename='/'>
                <div className="app">
                    <AppHeader />
                    <div className="app-content">
                        <Switch>
                            <Route exact path="/" component={Home} />
                            <Route path="/about" component={About} />
                            <Route path="/datastructures" component={DataStructures} />
                        </Switch>
                    </div>
                    <AppFooter />
                </div>
            </HashRouter>
        );
}
