import React, { useState } from 'react';
import T from 'prop-types';
import './Expander.css';

const Expander = ({ children, title, className, defaultCollapsed }) => {
  const [expanded, setExpanded] = useState(!defaultCollapsed);

  const contentClassName = expanded ? "expanderContent expanderContentExpanded" : "expanderContent expanderContentCollapsed";

  return (
    <div className={`expanderContainer ${className ? className : ''}`}>
      <div className="expanderTitle" onClick={() => setExpanded(!expanded)}>
        {expanded ? "▾" : "▸"}
        {'  '} 
        {title}
      </div>
      <div className={contentClassName}>
        {children}
      </div>
    </div>
  );
}

Expander.defaultProps = {
  defaultCollapsed: false,
}

Expander.propTypes = {
  defaultCollapsed: T.bool,
}

export default Expander;