import React from 'react';
import './about.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function About() {
    return (
            <div className="about">
                <h1>About CS Vis</h1>
                <p>I created this tool to visualize some of the algorithms I've been learning in my classes.
                Most of these visualizations are inspired by those found at <a href='https://csvistool.com'>csvistool.com</a>.
                I tried to make the UX here as convenient as possible, but I'd love to hear your design input;
                I'm not a front-end person, so I'm doing my best :).</p>
                <p>Check out the <a href='https://github.com/muditg317/cs-vis'>Source Code here</a>!</p>
                <h2>Tool Use</h2>
                <p>All visualization pages have the same layout. The navigation bar can be used to access any of the visualizations.
                Click the clock icon <FontAwesomeIcon icon={["far","clock"]} /> next to the visualization title to see the related Big-O data.
                Use the <code>SpaceBar</code> in combination with <code>Shift</code> and the <code>ArrowKeys</code> to pause and step through the various animations.
                Press <code>Ctrl-Z</code> to undo the most recent input.</p>
                <h2>Me!</h2>
                <p>This is something I wanted to make to learn more about these datastructures and algorithms while also learning how to use the ReactJS framework.
                Check out some of my other projects at <a href='https://muditgupta.appspot.com'>muditgupta.appspot.com</a></p>
            </div>
        );
}
