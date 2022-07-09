import { TasksContextProvider } from "applications/context/tasksContext";
import "../styles/globals.css";

function MyApp({ Component, pageProps }) {
  return (
    <TasksContextProvider>
      <Component {...pageProps} />
    </TasksContextProvider>
  );
}

export default MyApp;
