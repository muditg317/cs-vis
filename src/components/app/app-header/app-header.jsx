import React from 'react';
import './app-header.scss';
import NavBar from '../nav-bar';
import { SiteMap } from 'utils';

export default function AppHeader() {
    return (
            <header className="app-header">
                <NavBar nav_items={SiteMap} />
            </header>
        );
}
