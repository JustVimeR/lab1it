import {Route, Routes} from "react-router-dom";
import Layout from "./layout/Layout.jsx";
import Index from "./pages/index.jsx";
function App() {

  return (
    <>
        <Routes>
            <Route element={<Layout />}>
                <Route index element={<Index />} />
            </Route>
        </Routes>
    </>
  )
}

export default App
