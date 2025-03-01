import React, { memo, useCallback } from 'react';
import PropTypes from 'prop-types';
import { Nav, NavItem, NavLink } from 'reactstrap';
import classnames from 'classnames';
import { UncontrolledTooltip } from 'reactstrap';
import { formTabs } from './formConfig';


const NavigationTabs = memo(({ tabs=formTabs, activeTab, setActiveTab }) => {

  const handleTabClick = useCallback((tabId) => {
    setActiveTab(tabId);
  }, [setActiveTab]);

  const handleKeyDown = useCallback((e, tabId) => {
    if (e.key === 'Enter' || e.key === ' ') {
      setActiveTab(tabId);
    }
  }, [setActiveTab]);

  return (
    <Nav 
      role="tablist"
      className="nav-pills nav-justified scrollable-tabs"
      style={{
        display: 'flex',
        overflowX: 'auto',
        scrollbarWidth: 'none',
        msOverflowStyle: 'none'
      }}
    >
      {tabs.map((tab) => {
        const tooltipId = `tab-${tab.id}-tooltip`;
        return (
          <NavItem
            key={tab.id}
            className="flex-sm-fill text-sm-center"
            style={{ flex: '0 0 33.33%', minWidth: '120px' }}
          >
            <NavLink
              role="tab"
              id={`tab-${tab.id}`}
              className={classnames({ active: activeTab === tab.id })}
              tabIndex={activeTab === tab.id ? 0 : -1}
              aria-selected={activeTab === tab.id}
              aria-controls={`tabpanel-${tab.id}`}
              onClick={() => handleTabClick(tab.id)}
              onKeyDown={(e) => handleKeyDown(e, tab.id)}
              style={{ cursor: 'pointer' }}
            >
              <div className="step-icon" id={tooltipId}>
                <i className={`bx ${tab.icon}`} aria-hidden="true" />
                <span className="visually-hidden">
                  {(`form.tabs.${tab.title}`)}
                </span>
              </div>
              <UncontrolledTooltip
                placement="top"
                target={tooltipId}
                delay={{ show: 100, hide: 0 }}
              >
                {tab.title}
              </UncontrolledTooltip>
            </NavLink>
          </NavItem>
        );
      })}
    </Nav>
  );
});
NavigationTabs.displayName = "NavigationTabs";
NavigationTabs.propTypes = {
  tabs: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      title: PropTypes.string.isRequired,
      icon: PropTypes.string.isRequired
    })
  ).isRequired,
  activeTab: PropTypes.number.isRequired,
  setActiveTab: PropTypes.func.isRequired
};

export default NavigationTabs;