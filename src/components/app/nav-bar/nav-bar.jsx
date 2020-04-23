import React, { Component } from 'react';
import { Link } from "react-router-dom";
import './nav-bar.scss';

import logo from 'res/images/logo.svg';


export default class NavBar extends Component {

    constructor(props) {
        super(props);

        this.state = {
            responsive: false,
        };

        this.selfRef = React.createRef();
        this.handleDocumentClick = this.handleDocumentClick.bind(this);
        this.clear = this.clear.bind(this);
    }

    scrollToTop() {
        document.body.scrollTop = 0; // For Safari
        document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
        // console.log("scrolltotop");
    }

    toggleResponsiveNav() {
        this.setState((state) => {
                return {
                    responsive: !state.responsive,
                };
            });
    }


    componentDidMount() {
        document.addEventListener("mousedown", this.handleDocumentClick);
        // console.log(this.state.parentNavItem);
    }
    componentWillUnmount() {
        document.removeEventListener("mousedown", this.handleDocumentClick);
    }
    handleDocumentClick(event) {
        // console.log("doc clicked nav title");
        // console.log(this.state.containingNavItemRef);
        // console.log(this.state.containingNavItemRef.current);
        if (this.selfRef.current && !this.selfRef.current.contains(event.target)) {
            // console.log("outside nav title");
            this.clear();
        }
    }

    clear() {
        this.setState({responsive: false});
        this.scrollToTop();
    }

    render() {
        return (
                <div id="top-nav" className={`nav-bar ${this.state.responsive ? "responsive" : ""} nav-container`} ref={this.selfRef}>
                    <Link className="not-a-button" id="nav-logo" to={window.location.href.substring(window.location.href.indexOf("/#/")).length > 0 ? "/" : "" }><img src={logo} className="app-logo" alt="logo" /></Link>
                    {this.props.nav_items.map( (nav_item) => {
                        return (
                                <NavBarItem key={`nav-${nav_item.link}`} content={nav_item} container={this}/>
                            );
                    })}
                    <button className="not-a-button nav-bar-item nav-item nav-item-title" id="top-nav-menu" onClick={() => this.toggleResponsiveNav()}><i className="fa fa-bars"></i></button>
                </div>
            );
    }
}

class NavBarItem extends Component {
    constructor(props) {
        super(props);

        this.state = {
            link: this.props.content.link,
            icon: this.props.content.icon,
            title_text: this.props.content.title_text,
            drop_down_items: this.props.content.drop_down_items,
        };

        this.selfRef = React.createRef();

        if (this.state.drop_down_items) {
            this.state.showDropDown = false;
        }


        this.clear = this.clear.bind(this);
    }

    setShowDropDown(show) {
        if (this.state.drop_down_items) {
            this.setState( (state) => {
                return {
                    showDropDown: show,
                }
            }, () => {

            });
        }
    }

    toggleShowDropDown(show) {
        if (this.state.drop_down_items) {
            this.setState( (state) => {
                return {
                    showDropDown: !state.showDropDown,
                }
            }, () => {

            });
        }
    }

    clear() {
        this.setShowDropDown(false);
        this.props.container.clear();
    }

    render() {
        return (
                <div className={`nav-bar-item nav-item ${this.state.drop_down_items && this.state.showDropDown ? "active" : ""}`} ref={this.selfRef}>
                    <NavBarItemTitle link={this.state.link} icon={this.state.icon} title_text={this.state.title_text} parentRef={this.selfRef} parent={this} />
                    {this.state.drop_down_items && this.state.showDropDown ?
                        <NavBarDropDown items={this.state.drop_down_items} parentRoute={`/${this.state.link}`} parent={this} />
                    :
                        null
                    }
                </div>
            );
    }

}

class NavBarItemTitle extends Component {
    constructor(props) {
        super(props);


        this.state = {
            link: this.props.link,
            icon: this.props.icon,
            title_text: this.props.title_text,
            parentNavItem: this.props.parent,
        };

        this.handleDocumentClick = this.handleDocumentClick.bind(this);
        this.onMouseDown = this.onMouseDown.bind(this);
        this.clear = this.clear.bind(this);
    }

    componentDidMount() {
        this.setState({containingNavItemRef: this.props.parentRef}, () => {
            // console.log(this.state.containingNavItemRef);
        });
        document.addEventListener("mousedown", this.handleDocumentClick);
        // console.log(this.state.parentNavItem);
    }
    componentWillUnmount() {
        document.removeEventListener("mousedown", this.handleDocumentClick);
    }
    handleDocumentClick(event) {
        // console.log("doc clicked nav title");
        // console.log(this.state.containingNavItemRef);
        // console.log(this.state.containingNavItemRef.current);
        if (this.state.containingNavItemRef.current && !this.state.containingNavItemRef.current.contains(event.target)) {
            // console.log("outside nav title");
            this.state.parentNavItem.setShowDropDown(false);
        }
    }

    onMouseDown(e) {
        if (e.nativeEvent.which === 1) {
            if (this.state.parentNavItem.state.showDropDown || !this.state.parentNavItem.state.drop_down_items) {
                window.location.hash = `#/${this.state.parentNavItem.state.link}`;
                this.clear();
            } else {
                this.state.parentNavItem.setShowDropDown(true);
            }
        }
    }

    clear() {
        this.state.parentNavItem.clear();
    }

    render() {
        return (
                this.state.parentNavItem.state.drop_down_items ?
                    <div onMouseDown={this.onMouseDown} className="nav-bar-item-title nav-item-title" id={`nav-${this.state.link}`}><i className={`fa fa-fw fa-${this.state.icon}`}></i> {this.state.title_text}</div>
                :
                    <Link onMouseDown={this.onMouseDown} className="nav-bar-item-title nav-item-title" id={`nav-${this.state.link}`} to={`/${this.state.link}`}><i className={`fa fa-fw fa-${this.state.icon}`}></i> {this.state.title_text}</Link>
            );
    }
}

class NavBarDropDown extends Component {
    constructor(props) {
        super(props);
        this.state = {
            drop_down_items: this.props.items,
            parentNavItem: this.props.parent,
        };

        this.clear = this.clear.bind(this);
    }

    clear() {
        this.state.parentNavItem.clear();
    }

    render() {
        return (
                <div className="nav-bar-drop-down nav-container"> {
                    this.state.drop_down_items.map( (drop_down_item) => {
                    return (
                            <NavBarDropDownItem key={`nav-${drop_down_item.link}`} content={drop_down_item} parent={this} parentRoute={this.props.parentRoute} />
                        );
                })} </div>
            );
    }
}

class NavBarDropDownItem extends Component {
    constructor(props) {
        super(props);


        this.state = {
            link: this.props.content.link,
            title_text: this.props.content.title_text,
            side_pane_items: this.props.content.side_pane_items,
            parentRoute: this.props.parentRoute,
            parent: this.props.parent,
        };

        this.selfRef = React.createRef();

        if (this.state.side_pane_items) {
            this.state.showSidePane = false;
        }

        this.clear = this.clear.bind(this);
    }

    componentDidMount() {

    }

    setShowSidePane(show) {
        if (this.state.side_pane_items) {
            this.setState( (state) => {
                return {
                    showSidePane: show,
                }
            });
        }
    }

    toggleShowSidePane(show) {
        if (this.state.side_pane_items) {
            this.setState( (state) => {
                return {
                    showSidePane: !state.showSidePane,
                }
            });
        }
    }

    onMouseDown() {
        this.toggleShowSidePane();
    }

    clear() {
        this.setShowSidePane(false);
        this.state.parent.clear();
    }

    render() {
        return (
                <div className={`nav-bar-drop-down-item nav-item ${this.state.side_pane_items && this.state.showSidePane ? "active": ""}`} ref={this.selfRef}>
                    <NavBarDropDownItemTitle link={this.state.link} parentRoute={this.state.parentRoute} title_text={this.state.title_text} parentRef={this.selfRef} parent={this} />
                    {this.state.side_pane_items && this.state.showSidePane ?
                        <NavBarSidePane items={this.state.side_pane_items} parentRoute={`${this.props.parentRoute}/${this.state.link}`} parent={this}></NavBarSidePane>
                    :
                        null
                    }
                </div>
            );
    }

}

class NavBarDropDownItemTitle extends Component {
    constructor(props) {
        super(props);


        this.state = {
            link: this.props.link,
            parentRoute: this.props.parentRoute,
            title_text: this.props.title_text,
            // containingDropDownItemRef: this.props.parentRef,
            parentDropDownItem: this.props.parent,
        };

        this.handleDocumentClick = this.handleDocumentClick.bind(this);
        this.onMouseDown = this.onMouseDown.bind(this);
        this.clear = this.clear.bind(this);
    }

    componentDidMount() {
        this.setState({containingDropDownItemRef: this.props.parentRef}, () => {
            // console.log(this.state.containingDropDownItemRef);
        });
        document.addEventListener("mousedown", this.handleDocumentClick);
        // console.log(this.state.parentDropDownItem);
    }
    componentWillUnmount() {
        document.removeEventListener("mousedown", this.handleDocumentClick);
    }
    handleDocumentClick(event) {
        // console.log("doc clicked nav title");
        // console.log(this.state.containingDropDownItemRef);
        // console.log(this.state.containingDropDownItemRef.current);
        if (this.state.containingDropDownItemRef.current && !this.state.containingDropDownItemRef.current.contains(event.target)) {
            // console.log("outside nav title");
            this.state.parentDropDownItem.setShowSidePane(false);
        }
    }

    onMouseDown(e) {
        if (e.nativeEvent.which === 1) {
            if (this.state.parentDropDownItem.state.showSidePane) {
                window.location.hash = `#${this.state.parentRoute}/${this.state.link}`;
                this.clear();
            } else {
                this.state.parentDropDownItem.toggleShowSidePane();
            }
        }
    }

    clear() {
        this.state.parentDropDownItem.clear();
    }

    render() {
        return (
                this.state.parentDropDownItem.state.side_pane_items ?
                    <div onMouseDown={this.onMouseDown} className="nav-bar-drop-down-item-title nav-item-title" id={`nav-${this.state.link}`}>{this.state.title_text}</div>
                :
                    <Link onMouseDown={this.clear} className="nav-bar-drop-down-item-title nav-item-title" id={`nav-${this.state.link}`} to={`${this.state.parentRoute}/${this.state.link}`}>{this.state.title_text}</Link>
            );
    }
}

class NavBarSidePane extends Component {
    constructor(props) {
        super(props);


        this.state = {
            side_pane_items: this.props.items,
            parentDropDownItem: this.props.parent,
        };

        this.clear = this.clear.bind(this);
    }

    clear() {
        this.state.parentDropDownItem.clear();
    }

    render() {
        return (
                <div className="nav-bar-side-pane nav-container"> {
                    this.state.side_pane_items.map( (side_pane_item) => {
                        return (
                                <NavBarSideItem key={`nav-${side_pane_item.link}`} content={side_pane_item} parentRoute={this.props.parentRoute} parent={this} />
                            );
                })} </div>
            );
    }
}


class NavBarSideItem extends Component {
    constructor(props) {
        super(props);

        this.state = {
            link: this.props.content.link,
            title_text: this.props.content.title_text,
            parentRoute: this.props.parentRoute,
            parent: this.props.parent,
        };

        this.clear = this.clear.bind(this);
    }

    clear() {
        window.location.hash = `#${this.state.parentRoute}/${this.state.link}`;
        this.state.parent.clear();
    }

    render() {
        return (
                <div className="nav-bar-side-item nav-item">
                    <Link onMouseDown={this.clear} className="nav-bar-side-pane-item-title nav-item-title" id={`nav-${this.state.link}`} to={`${this.state.parentRoute}/${this.state.link}`}>{this.state.title_text}</Link>
                </div>
            );
    }

}
