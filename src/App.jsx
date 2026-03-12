import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { UserProvider } from "./context/UserContext";
import ModuleMap from "./components/ModuleMap";
import Module1 from "./modules/Module1";
import Module2 from "./modules/Module2";
import Module3 from "./modules/Module3";
import Module4_1 from "./modules/Module4_1";
import Module4_2 from "./modules/Module4_2";
import Module5 from "./modules/Module5";
import Module6_1 from "./modules/Module6_1";
import Module6_2 from "./modules/Module6_2";

export default function App() {
  return (
    <UserProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<ModuleMap />} />
          <Route path="/module/1"   element={<Module1 />} />
          <Route path="/module/2"   element={<Module2 />} />
          <Route path="/module/3"   element={<Module3 />} />
          <Route path="/module/4-1" element={<Module4_1 />} />
          <Route path="/module/4-2" element={<Module4_2 />} />
          <Route path="/module/5"   element={<Module5 />} />
          <Route path="/module/6-1" element={<Module6_1 />} />
          <Route path="/module/6-2" element={<Module6_2 />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </UserProvider>
  );
}