import * as React from "react";
import Box from "@mui/material/Box";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

export default function Toast() {
  const [status, setStatus] = React.useState("info");
  const [message, setMessage] = React.useState();
  const [state, setState] = React.useState({
    open: false,
    vertical: "bottom",
    horizontal: "right",
  });
  React.useEffect(() => {
    const handleToast = (e) => {
      const { detail } = e;
      setStatus(detail?.status ?? "info");
      setMessage(detail?.message ?? "");
      setState((prev) => ({
        ...prev,
        open: true,
      }));
    };

    document.addEventListener("toast", handleToast);
    return () => {
      document.removeEventListener("toast", handleToast);
    };
  }, []);
  return (
    <Box sx={{ width: 500, zIndex: 99999 }}>
      <Snackbar
        anchorOrigin={{ ...state }}
        open={state.open}
        sx={{ zIndex: 99999 }}
        autoHideDuration={2000}
        onClose={(e, reason) => {
          if (reason === "clickaway") return;
          setState({ ...state, open: false });
        }}
      >
        <Alert
          sx={{ zIndex: 99999, fontWeight: 600 }}
          severity={status} //Success (for Green), error(for Red), warning (for Orange), info (for Blue)
          //   variant="filled"
        >
          {message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
