import { Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import {Home, Members, Projects, Faq, Team, SubmitIdea} from './pages/index';

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home/>}/>
        <Route path="/members" element={<Members/>}/>
        <Route path="/projects" element={<Projects/>} />
        <Route path="/faq" element={<Faq/>}/>
        <Route path="/team" element={<Team/>}/>
        <Route path="/submit-idea" element={<SubmitIdea/>}/>
      </Route>
    </Routes>
  );
}

export default App;