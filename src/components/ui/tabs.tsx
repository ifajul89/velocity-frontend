import React, { ReactNode, useState } from 'react';

export const Tabs = ({ children }: { children: ReactNode }) => {
  const [activeTab, setActiveTab] = useState(0);
  return <div>{React.Children.map(children, (child, index) => React.cloneElement(child as React.ReactElement<{ activeTab: number; setActiveTab: (index: number) => void; index: number }>, { activeTab, setActiveTab, index }))}</div>;
};

export const TabsList = ({ children }: { children: ReactNode }) => (
  <div className="flex border-b">{children}</div>
);

export const TabsTrigger = ({ children, index, activeTab, setActiveTab }: { children: ReactNode; index: number; activeTab: number; setActiveTab: (index: number) => void }) => (
  <button
    className={`p-2 ${activeTab === index ? 'border-b-2 border-blue-500' : ''}`}
    onClick={() => setActiveTab(index)}
  >
    {children}
  </button>
);

export const TabsContent = ({ children, index, activeTab }: { children: ReactNode; index: number; activeTab: number }) => (
  <div hidden={activeTab !== index}>{children}</div>
); 