// import { Provider } from "react-redux";
// import { store } from "./Store/Store";
// import DataGrid from "./components/table/DataGrid";
// import "./App.css";
// import Sidebar from "./components/table/Sidebar";

// function App() {
//   return (
//     <Provider store={store}>
//       <div className="h-screen  text-black ovverflow-auto">
//         <div className="flex  min-h-screen  overflow-auto">
//           <main className="flex-1 p-6 overflow-y-scroll h-screen">
//             <DataGrid />
//             <Sidebar />
//           </main>
//         </div>
//       </div>
//     </Provider>
//   );
// }

// export default App;

// import { useState } from "react";
// import { Provider } from "react-redux";
// import { store } from "./Store/Store";

// import DataGrid from "./components/table/DataGrid";
// import Sidebar from "./components/table/Sidebar";
// import SectionPieChart from "./components/chart/Chart";
// import Terms from "./components/terms/Terms.tsx";
// import SidePanel from "./components/SidePanel";

// import "./App.css";

// function App() {
//   const [selectedTab, setSelectedTab] = useState("table");

//   const renderContent = () => {
//     switch (selectedTab) {
//       case "chart":
//         return <SectionPieChart />;
//       case "terms":
//         return <Terms />;
//       case "table":
//       default:
//         return (
//           <>
//             <DataGrid />
//             <Sidebar />
//           </>
//         );
//     }
//   };

//   return (
//     <Provider store={store}>
//       <div className="h-screen text-black overflow-auto">
//         <div className="flex min-h-screen overflow-auto">
//           {/* Sidebar Panel */}
//           <SidePanel
//             selectedTab={selectedTab}
//             setSelectedTab={setSelectedTab}
//           />

//           {/* Main Content Area */}
//           <main className="flex-1 p-6 overflow-y-scroll h-screen">
//             {renderContent()}
//           </main>
//         </div>
//       </div>
//     </Provider>
//   );
// }

// export default App;












// import { useState } from "react";
// import { Provider } from "react-redux";
// import { BrowserRouter, Routes, Route } from "react-router-dom";
// import { store } from "./Store/Store";

// import SectionPieChart from "./components/chart/Chart";
// import Terms from "./components/terms/Terms.tsx";
// import SidePanel from "./components/SidePanel";

// import "./App.css";
// import DataGrid from "./components/table/DataGrid.tsx";
// import Extra from "./components/table/Extra.tsx";
// import AddItem from "./components/Progress/AddItem.tsx";
// import { ProgressReport } from "./components/Progress/ProgressReport.tsx";

// function MainLayout({
//   selectedTab,
//   setSelectedTab,
// }: {
//   selectedTab: string;
//   setSelectedTab: (tab: string) => void;
// }) {
//   const renderContent = () => {
//     switch (selectedTab) {
//       case "chart":
//         return (
//           <>
//             <SectionPieChart />
//             <Extra />
//           </>
//         );
//       case "terms":
//         return <Terms />;
//       case "additem":
//         return <AddItem />;
//       case "table":
//       default:
//         return (
//           <>
//             <DataGrid />
//             <Extra />
//           </>
//         );
//     }
//   };

//   return (
//     <div className="h-screen text-black overflow-auto">
//       <div className="flex min-h-screen overflow-auto">
//         <SidePanel selectedTab={selectedTab} setSelectedTab={setSelectedTab} />
//         <main className="flex-1 p-6 overflow-y-scroll h-screen">
//           {renderContent()}
//         </main>
//       </div>
//     </div>
//   );
// }

// function App() {
//   const [selectedTab, setSelectedTab] = useState("table");

//   return (
//     <Provider store={store}>
//       <BrowserRouter>
//         <Routes>
//           <Route
//             path="/"
//             element={
//               <MainLayout
//                 selectedTab={selectedTab}
//                 setSelectedTab={setSelectedTab}
//               />
//             }
//           />

//           <Route path="/chart" element={<SectionPieChart />} />

//           <Route path="/terms" element={<Terms />} />
//           <Route path="/additem" element={<AddItem />} />

         
//         <Route path="/progress-report/:id" element={<ProgressReport />} />
//         </Routes>
//       </BrowserRouter>
//     </Provider>
//   );
// }

// export default App;




// App.tsx
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
      case "additem":
        return <EstimatesDashboard />; // Use EstimatesDashboard here
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
          <Route path="/additem" element={
            <MainLayout
              selectedTab="additem"
              setSelectedTab={setSelectedTab}
            />
          } />
          <Route path="/progress-report/:id" element={<ProgressReportPage />} />
        </Routes>
      </BrowserRouter>
    </Provider>
  );
}

export default App;