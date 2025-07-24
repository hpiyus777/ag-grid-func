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


//create dashboard (like i'll given img ) in dasboard we have header ingonere th blue time card hedrer in haeder we have sidebar option serch option filter option and on right side we have 3 main option wich i need most like add tiem card , add crew card , add crew sheet thats all in heder and next on dashboard add wvrything wich i'll give u in img like Time Cards (Plural) Stats , map ,Time Spent on Current Projects,Current Week Timesheet (like table) may be that's enough for now and in sidebar we have date picker like in my img 


// jese me add time card pe saridetails add kr sku and wo sari details muje (Dhruvit Vaghasiya
// 23/Jul/2025 
// Office
// Clocked In
// Dhruvit Vaghasiya
// 23/Jan/2007 
// Office
// Crew: 1 Emp
// Dhruvit Vaghasiya
// 22/Jan/2007 
// test client access tab by Dhruv
// Crew: 1 Emp
// Vishwa Patel
// 22/Jul/2025 
// Vishwa's Infra 10_06
// 00:02 Hrs
// Vishwa Patel
// 22/Jul/2025 
// Vishwa's Infra 10_06
// 00:01 Hrs
// Vishwa Patel
// 22/Jul/2025 
// dfd
// 02:09 Hrs)
// iss hisab se show krbana hai sidebar me and sidebar ko open and close krne ka option dena hai and open close hona chiye  and add time card me timer bhi chalu ho ne ka jo option hai usse bhi active kro and time note hona chiaye and crew card me bhi sari chheze working honi chiaye like Clock-In
// Break
// Resume
// Clock-Out
// ye sab btn bhin wroking hone chiaye and crew sheet me bhi sari ceeze working honi chiaye and jo chize waha add ki ho vo wha pe hi show hona chiaye and sara and data ko local storage me strore kro and dashboard me show krvao




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
// import EstimatesDashboard from "./components/Progress/EstimatesDashboard.tsx";
// import { ProgressReportPage } from "./components/Progress/ProgressReportPage.tsx";
// import TimeCardDashboard from "./components/timeCard/TimeCardDashboard.tsx";

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
//         return <EstimatesDashboard />;
//       case "timecard":
//         return <TimeCardDashboard />
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
//           <Route
//             path="/additem"
//             element={
//               <MainLayout
//                 selectedTab="additem"
//                 setSelectedTab={setSelectedTab}
//               />
//             }
//           />
//           <Route path="/progress-report/:id" element={<ProgressReportPage />} />
//           <Route path="/timecard" element={<TimeCardDashboard />} />

//         </Routes>
//       </BrowserRouter>
//     </Provider>
//   );
// }

// export default App;



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
import TimeCardDashboard from "./components/timeCard/TimeCardDashboard.tsx";
import { TimeCardProvider } from "./components/timeCard/TimeCardContext.tsx"; // <-- Import your provider

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
        return <EstimatesDashboard />;
      case "timecard":
        // Wrap TimeCardDashboard with its provider
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