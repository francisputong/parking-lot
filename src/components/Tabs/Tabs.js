import React from "react";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";

const AppTabs = ({ activeKey, onSelect, tabsList }) => {
    return (
        <div>
            <Tabs
                defaultActiveKey='4'
                id='tab'
                variant='pills'
                justify
                onSelect={onSelect}
                activeKey={activeKey}
            >
                {tabsList.map((option) => {
                    return (
                        <Tab
                            key={option.key}
                            data-testid={option.value}
                            eventKey={option.key}
                            title={option.value}
                        ></Tab>
                    );
                })}
            </Tabs>
        </div>
    );
};

export default AppTabs;
