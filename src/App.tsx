import { useState } from "react";
import { Provider } from "react-redux";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { store } from "./Store/Store";

import SectionPieChart from "./components/chart/Chart";
import Terms from "./components/terms/Terms.tsx";
import SidePanel from "./components/SidePanel";
import "./App.css";
import DataGrid from "./components/table/DataGrid.tsx";
import Extra from "./components/table/Extra.tsx";
import EstimatesDashboard from "./components/Progress/EstimatesDashboard.tsx";
import { ProgressReportPage } from "./components/Progress/ProgressReportPage.tsx";
import TimeCardDashboard from "./components/timeCard/TimeCardDashboard/TimeCardDashboard.tsx";
import { TimeCardProvider } from "./components/timeCard/TimeCardDashboard/TimeCardContext.tsx"; // <-- Import your provider
import Files from "./components/files/Files.tsx";

function MainLayout({
  selectedTab,
  setSelectedTab,
}: {
  selectedTab: string;
  setSelectedTab: (tab: string) => void;
}) {
  const renderContent = () => {
    switch (selectedTab) {
      case "chart":
        return (
          <>
            <SectionPieChart />
            <Extra />
          </>
        );
      case "terms":
        return <Terms />;
      case "files":
        return <Files />;
      case "additem":
        return <EstimatesDashboard />;
      case "timecard":
        return (
          <TimeCardProvider>
            <TimeCardDashboard />
          </TimeCardProvider>
        );
      case "table":
      default:
        return (
          <>
            <DataGrid />
            <Extra />
          </>
        );
    }
  };

  return (
    <div className="h-screen text-black overflow-auto">
      <div className="flex min-h-screen overflow-auto">
        <SidePanel selectedTab={selectedTab} setSelectedTab={setSelectedTab} />
        <main className="flex-1 p-6 overflow-y-scroll h-screen">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}

function App() {
  const [selectedTab, setSelectedTab] = useState("table");

  return (
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <MainLayout
                selectedTab={selectedTab}
                setSelectedTab={setSelectedTab}
              />
            }
          />
          <Route
            path="/additem"
            element={
              <MainLayout
                selectedTab="additem"
                setSelectedTab={setSelectedTab}
              />
            }
          />
          <Route path="/progress-report/:id" element={<ProgressReportPage />} />
          <Route
            path="/timecard"
            element={
              <TimeCardProvider>
                <TimeCardDashboard />
              </TimeCardProvider>
            }
          />
        </Routes>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
