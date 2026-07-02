import AppRouter from './adapters/router/AppRouter'
import {AppProvider} from "./adapters/context/AppContext.tsx";

function App() {
  return (
      <AppProvider>
        <AppRouter />
      </AppProvider>
  );
}

export default App