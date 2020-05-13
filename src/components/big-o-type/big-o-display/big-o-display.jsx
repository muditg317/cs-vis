import React, { useEffect } from 'react';
import {StickyTable, Row, Cell} from 'react-sticky-table';
import './big-o-display.scss';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { SiteMap, Utils } from 'utils';

const bigODatumToDivClass = (bigODatum) => {
    return bigODatum.replace(/[( ^+/]/g,"-").replace(/\)/g,"") + " data-cell";
}

const extractDataFromSpecs = (BIG_O_DATA, bigOSpecs) => {
    const DATA = [];
    let headers = [bigOSpecs.col1Name, ...bigOSpecs.cols].map(header => { return { dataString: header, styleClass: "big-o-header col"}});
    DATA.push(headers);
    for (let row of bigOSpecs.rows) {
        const ROW = [{ dataString: row, styleClass: "big-o-header row"}];
        for (let col of bigOSpecs.cols) {
            let regexIgnoreSymbol = /[\W]/;
            let row_ = row.substring(0, row.search(regexIgnoreSymbol)) || row;
            let col_ = col.substring(0, col.search(regexIgnoreSymbol)) || col;
            // console.log([`${row_}_${col_}`] , [row_] , [col_]);
            const BIG_O_OP_INFO = bigOSpecs[`${row_}_${col_}`] || bigOSpecs[row_] || bigOSpecs[col_];
            let extraConfigData = [];
            if (BIG_O_DATA) {
                Object.keys(BIG_O_DATA).forEach(config => {
                    if (config !== "defaultConfig" && (BIG_O_DATA[config][`${row_}_${col_}`] || BIG_O_DATA[config][row_] || BIG_O_DATA[config][col_])) {
                        extraConfigData.push({name: BIG_O_DATA[config].name, data: BIG_O_DATA[config][`${row_}_${col_}`] || BIG_O_DATA[config][row_] || BIG_O_DATA[config][col_]});
                    }
                });
            }
            let dataString = "";
            let styleClass = "";
            if (BIG_O_OP_INFO && BIG_O_OP_INFO.__proto__.constructor.name !== "Array") {
                if (BIG_O_OP_INFO.best) {
                    dataString += `Best: ${BIG_O_OP_INFO.best}`;
                    styleClass = bigODatumToDivClass(BIG_O_OP_INFO.best);
                }
                if (BIG_O_OP_INFO.average) {
                    dataString += `\nAverage: ${BIG_O_OP_INFO.average}`;
                    styleClass = bigODatumToDivClass(BIG_O_OP_INFO.average);
                }
                if (BIG_O_OP_INFO.amortized) {
                    dataString += `\nAmortized: ${BIG_O_OP_INFO.amortized}`;
                    if (!BIG_O_OP_INFO.average) {
                        styleClass = bigODatumToDivClass(BIG_O_OP_INFO.amortized);
                    }
                }
                if (BIG_O_OP_INFO.worst) {
                    dataString += `\nWorst: ${BIG_O_OP_INFO.worst}`;
                    if (!styleClass) {
                        styleClass = bigODatumToDivClass(BIG_O_OP_INFO.worst);
                    }
                }
                if (BIG_O_OP_INFO.unamortized) {
                    dataString += `\nUnamortized: ${BIG_O_OP_INFO.unamortized}`;
                    if (!styleClass) {
                        styleClass = bigODatumToDivClass(BIG_O_OP_INFO.unamortized);
                    }
                }
                if (extraConfigData.length > 0) {
                    extraConfigData.forEach((extraConfig) => {
                        dataString += `\n${extraConfig.name}: ${extraConfig.data.newBigO}`;
                    });
                }
                dataString = dataString.trim();
                if (!dataString.includes("\n") && dataString.includes("Average")) {
                    dataString = dataString.substring(dataString.indexOf(":")+2);
                }
                if (BIG_O_OP_INFO.tier) {
                    styleClass = bigODatumToDivClass(`tier-${BIG_O_OP_INFO.tier}`);
                }
            } else if (BIG_O_OP_INFO) {
                dataString = <FontAwesomeIcon icon={BIG_O_OP_INFO} size="2x" />;
                styleClass = "data-cell big-o-icon-cell";
            }
            if (!styleClass) {
                styleClass = bigODatumToDivClass("");
            }
            let explanation = (!!BIG_O_OP_INFO && BIG_O_OP_INFO.explanation) || null;
            ROW.push({ dataString, styleClass, explanation });
        }
        DATA.push(ROW);
    }
    return DATA;
}

export const BigODisplay = (props) => {
    let bigOSpecs = props.data;
    let BIG_O_DATA;
    if (!bigOSpecs) {
        BIG_O_DATA = SiteMap.filter(group => group.link === props.group)[0]
                .types.filter(type => type.link === props.type)[0]
                .classes.filter(visualizer => visualizer.link === props.class)[0]
                .bigOData;

        if (BIG_O_DATA.__proto__.constructor.name === "Array") {
            BIG_O_DATA = SiteMap.filter(group => group.link === BIG_O_DATA[0])[0]
                    .types.filter(type => type.link === BIG_O_DATA[1])[0]
                    .classes.filter(visualizer => visualizer.link === BIG_O_DATA[2])[0]
                    .bigOData;
        }

        // console.log(BIG_O_DATA);

        bigOSpecs = BIG_O_DATA.defaultConfig;
    }

    const DATA = extractDataFromSpecs(BIG_O_DATA, bigOSpecs);

    useEffect(() => {
        const mouseEnterHandler = (event) => {
            let explanationNode = event.target.lastChild;
            let tableCellBounds = event.target.getBoundingClientRect();
            let explanationNodeBounds = explanationNode.getBoundingClientRect();
            let left, top;
            if (tableCellBounds.right + explanationNodeBounds.width <= Utils.windowWidth()) {
                left = tableCellBounds.left + tableCellBounds.width / 2;
            } else {
                left = tableCellBounds.right - tableCellBounds.width / 2 - explanationNodeBounds.width;
            }
            if (tableCellBounds.bottom + explanationNodeBounds.height <= Utils.windowHeight()) {
                top = tableCellBounds.top + tableCellBounds.height / 2;
            } else {
                top = tableCellBounds.bottom - tableCellBounds.height / 2 - explanationNodeBounds.height;
            }
            left = Math.max(5, Math.min(left, Utils.windowWidth() - explanationNodeBounds.width));
            top = Math.max(5, Math.min(top, Utils.windowHeight() - explanationNodeBounds.height - 5));
            explanationNode.style.left = `${left}px`;
            explanationNode.style.top = `${top}px`;
        };

        let cellsWithExplanations = document.querySelectorAll(".big-o-cell.big-o-has-explanation");
        cellsWithExplanations.forEach((explanationCell) => {
            explanationCell.addEventListener("mouseenter", mouseEnterHandler);
        });

        return () => {
            cellsWithExplanations.forEach((explanationCell) => {
                explanationCell.removeEventListener("mouseenter", mouseEnterHandler);
            });
        };
    }, []);

    return (
            <div className="big-o-display">
                <StickyTable className="big-o-table" borderColor={`#778bebcc`}>
                    {DATA.map((row, i) =>
                        <Row key={i} className={`big-o-row${i === 0 ? " big-o-header-row" : ""}`}>
                            {row.map((cell, j) =>
                                <Cell key={j} className={`big-o-cell ${cell.styleClass}${cell.explanation ? " big-o-has-explanation" : ""}`}>
                                    {(typeof cell.dataString === "string")
                                        ? cell.dataString.split("\n").map((line, k, arr) => {
                                            return (
                                                    <div key={k} className="big-o-datum">
                                                        {line.includes(":")
                                                            ? <div className="big-o-datum-inner">
                                                                <span className="big-o-datum-label">
                                                                    {line.substring(0, line.indexOf(":"))}
                                                                </span>
                                                                <span className="big-o-datum-colon">
                                                                    :
                                                                </span>
                                                                <span className="big-o-datum-value">
                                                                    {line.substring(line.indexOf(":") + 1)}
                                                                </span>
                                                            </div>
                                                            : line
                                                        }
                                                    </div>
                                                );
                                            })
                                        : cell.dataString
                                    }
                                    {cell.explanation
                                        ? <p className="big-o-explanation-container">{cell.explanation}</p>
                                        : null
                                    }
                                </Cell>
                            )}
                        </Row>
                    )}
                </StickyTable>
            </div>
        );
}
