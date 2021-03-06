import { TasksContextProvider } from "application/context/tasksContext";
// import "../styles/globals.css";
import "../styles/tailwind.css";

function MyApp({ Component, pageProps }) {
  return (
    <TasksContextProvider>
      <Component {...pageProps} />
    </TasksContextProvider>
  );
}

export default MyApp;
