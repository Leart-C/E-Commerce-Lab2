import React, { useState, ReactNode } from 'react';

// Define the interface for a single tab configuration
export interface TabConfig {
  id: string; // Unique identifier for the tab
  label: string; // Text to display on the tab button
  // content: React.ReactNode; // Option 1: Pass raw ReactNode for content
  // Option 2 (more flexible): Pass a function that returns ReactNode,
  // allowing props to be passed dynamically if needed.
  // For this generic component, passing a direct component or a ReactNode is simpler.
  // Let's go with a simple component prop for now, allowing props if it's a ComponentType.
  component: React.ComponentType<any> | React.ReactNode;
  // If it's a ComponentType, you might want to pass props.
  // Let's simplify and assume the component/node is already configured with its props.
  // If you need to pass props from the TabsComponent level, you'd need a different approach.
}

// Props for the TabsComponent itself
interface TabsComponentProps {
  tabs: TabConfig[]; // Array of tab configurations
  initialTabId?: string; // Optional: ID of the tab to be active on initial load
}

const TabsComponent: React.FC<TabsComponentProps> = ({ tabs, initialTabId }) => {
  // Determine the initial active tab
  const [activeTabId, setActiveTabId] = useState<string>(
    initialTabId && tabs.some(tab => tab.id === initialTabId)
      ? initialTabId
      : (tabs.length > 0 ? tabs[0].id : '') // Default to the first tab if initialTabId is not found or not provided
  );

  // If there are no tabs, don't render anything
  if (tabs.length === 0) {
    return null;
  }

  // Find the component to render for the active tab
  const ActiveComponent = tabs.find(tab => tab.id === activeTabId)?.component;

  return (
    <div style={{ fontFamily: 'Arial, sans-serif' }}>
      {/* Tab Buttons */}
      <div style={{ display: 'flex', borderBottom: '1px solid #ccc', marginBottom: '20px' }}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTabId(tab.id)}
            style={{
              padding: '10px 20px',
              border: 'none',
              backgroundColor: activeTabId === tab.id ? '#007bff' : '#f0f0f0',
              color: activeTabId === tab.id ? 'white' : '#333',
              cursor: 'pointer',
              fontWeight: activeTabId === tab.id ? 'bold' : 'normal',
              borderTopLeftRadius: '5px',
              borderTopRightRadius: '5px',
              outline: 'none',
              transition: 'background-color 0.3s ease, color 0.3s ease',
              marginRight: '2px', // Small gap between tabs
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div style={{ padding: '10px' }}>
        {/* Render the component if it's a React Component Type */}
        {typeof ActiveComponent === 'function' && React.isValidElement(<ActiveComponent />) ? (
          // This check is a bit tricky for FunctionComponent vs ReactNode.
          // A simpler approach for `component: React.ReactNode` would be direct render.
          // Let's refine `component` type for clarity.
          // If `ActiveComponent` is a React Component Type, render it.
          // Otherwise, it's a ReactNode, just render it directly.
          <>{ActiveComponent}</> // If it's a ReactNode (JSX), render directly.
        ) : typeof ActiveComponent === 'function' ? (
          // If it's a function component (e.g., `ProductList` component class/function)
          // We need to instantiate it. For simplicity, if it needs props, you'll pass them from here.
          // However, for generic tabs, usually you'd wrap the component with its props beforehand.
          <ActiveComponent />
        ) : (
          // Fallback if it's not a component or is JSX already
          <>{ActiveComponent}</>
        )}
      </div>
    </div>
  );
};

export default TabsComponent;