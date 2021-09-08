import { ThemeProvider} from '@material-ui/core';
import HomeComponent from './Components/HomeComponent';
import UserContextProvider from './Context/UserContext';
import baseTheme from './Themes/baseTheme';
import EmployeeContextProvider from "./Context/EmployeeContext";


function App() {
  return (
    <ThemeProvider theme={baseTheme}>
      <UserContextProvider>
        <EmployeeContextProvider>
          <HomeComponent />
        </EmployeeContextProvider>
      </UserContextProvider>
    </ThemeProvider>
  );
} 

export default App;
