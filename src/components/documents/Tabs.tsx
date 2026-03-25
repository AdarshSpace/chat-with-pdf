interface TabItem {
    name: string;
    label: string;
    content: React.ReactNode;
  }
  
  interface TabsProps {
    tabs: TabItem[];
    activeTab: string;
    setActiveTab: (tab: string) => void;
  }
  
  const Tabs = ({ tabs, activeTab, setActiveTab }: TabsProps) => {
    return (
      <div className="w-full">
        <div className="relative border-b-2 border-slate-100">
          <nav className="flex gap-2">
            {tabs.map((tab) => (
              <button
                key={tab.name}
                onClick={() => setActiveTab(tab.name)}
                className={`relative pb-4 px-2 md:px-6 text-sm font-semibold transition-all duration-200 ${
                  activeTab === tab.name
                    ? "text-emerald-600"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <span className="relative z-10">{tab.label}</span>
  
                {activeTab === tab.name && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full" />
                )}
              </button>
            ))}
          </nav>
        </div>
  
        <div className="py-6">
          {tabs.map((tab) =>
            tab.name === activeTab ? (
              <div
                key={tab.name}
                className="animate-in fade-in duration-300"
              >
                {tab.content}
              </div>
            ) : null
          )}
        </div>
      </div>
    );
  };
  
  export default Tabs;