import React, { useEffect } from 'react';
import { useRouteMatch } from "react-router-dom";
import './big-o-type.scss';

import { SiteMap, Utils } from 'utils';
import { default as BigODisplay } from './big-o-display';

export const BigOType = (props) => {
    let match = useRouteMatch({
        path: `/${props.group}/${props.type}`
    });
    useEffect(() => {
        document.querySelector(".app-content").style["overflow-y"] = match ? "" : "scroll";
    });
    let type = SiteMap.filter(group => group.link === props.group)[0].types.filter(type => type.link === props.type)[0];
    let classes = type.bigOOverride ? [] : type.classes;
    let unalignedTables = false;
    if (type.bigOOverride) {
        if (type.bigOOverride.includes("ADT_INFOS")) {
            classes = type.bigOData.map(bigOType => {
                let cls = type.classes.filter(cls => cls.link === bigOType.class)[0];
                // console.log({ ...cls, title_text: bigOType.title_text });
                return { ...cls, title_text: bigOType.title_text };
            });
        } else if (type.bigOOverride.includes("MERGE_ROWS")) {
            classes = [{
                ...type.classes[0],
                title_text: "",
                data: type.classes.reduce((data, currClass) => {
                    // console.log(data, currClass);
                    data.rows.push(currClass.title_text);
                    if (currClass.bigOData.defaultConfig.cols.length > data.cols.length) {
                        data.cols = currClass.bigOData.defaultConfig.cols;
                        data.colExplanations = currClass.bigOData.defaultConfig.colExplanations;
                    }
                    let title = currClass.title_text.substring(0, currClass.title_text.search(/\W|$/));
                    for (let col in currClass.bigOData.defaultConfig) {
                        if (col !== "rows" && col !== "cols" && col !== "col1Name") {
                            // console.log(col, currClass.title_text, title);
                            data[`${title}_${col}`] = currClass.bigOData.defaultConfig[col];
                        }
                    }
                    for (let config in currClass.bigOData) {
                        if (config !== "defaultConfig") {
                            console.log(config);
                            for (let col in currClass.bigOData[config]) {
                                if (col !== "name") {
                                    console.log(col);
                                    data[`${title}_${col}`][currClass.bigOData[config].name] = currClass.bigOData[config][col].newBigO;
                                }
                            }
                        }
                    }
                    console.log(data);
                    return data;
                }, {
                    rows: [],
                    cols: [],
                    col1Name: "",
                })
            }];
            // console.log(classes);
            unalignedTables = true;
        } else if (type.bigOOverride.includes("MERGE_COLS")) {
            classes = [{
                ...type.classes[0],
                title_text: "",
                data: type.classes.reduce((data, currClass) => {
                    // console.log(data, currClass);
                    data.cols.push(currClass.title_text);
                    data.rows = currClass.bigOData.defaultConfig.cols;
                    let title = currClass.title_text.substring(0, currClass.title_text.search(/\W|$/));
                    for (let col in currClass.bigOData.defaultConfig) {
                        if (col !== "rows" && col !== "cols" && col !== "col1Name") {
                            // console.log(col, currClass.title_text, title);
                            data[`${col}_${title}`] = currClass.bigOData.defaultConfig[col];
                        }
                    }
                    for (let config in currClass.bigOData) {
                        if (config !== "defaultConfig") {
                            console.log(config);
                            for (let col in currClass.bigOData[config]) {
                                if (col !== "name") {
                                    data[`${col}_${title}`][currClass.bigOData[config].name] = currClass.bigOData[config][col].newBigO;
                                }
                            }
                        }
                    }
                    return data;
                }, {
                    rows: [],
                    cols: [],
                    col1Name: "",
                })
            }];
            unalignedTables = true;
        }
        if (type.bigOOverride.includes("EXTRA_TABLES")) {
            classes.push(...type.bigOData.map((extraTableData, i) => {
                return { ...extraTableData, link: `fakeLink:${i}` };
            }));
            unalignedTables = true;
        }
    }
    return (
            <div className="big-o-type">
                    <h3 className="big-o-type-title">
                        {Utils.spannifyText(type.title_text,"CAPITALS")} Big-O Summary
                    </h3>
                    <div className="big-o-display-list-container">
                        {classes.map( (visualizer) => {
                            return (
                                    <div key={visualizer.link} className={`big-o-display-container${unalignedTables ? " one-table" : ""}`}>
                                        <h4 className="big-o-display-title">{visualizer.title_text}</h4>
                                        <BigODisplay group={props.group} type={props.type} class={visualizer.link} data={visualizer.data}/>
                                    </div>
                                );
                        })}
                    </div>
            </div>
        );
}
