import * as React from "react";
import Drawer from "@mui/material/Drawer";
import CIcon from "@coreui/icons-react";
import { cilX } from "@coreui/icons";

export default function DrawerComponent({ children, open, toggleDrawer }) {
  return (
    <div>
      <Drawer open={open} onClose={toggleDrawer(false)} anchor="right">
        <div style={styles.mainContainer}>
          <div style={styles.buttonContainer}>
            <button onClick={toggleDrawer(false)} style={styles.button}>
              <CIcon icon={cilX} size="xl" />
            </button>
          </div>
          {children}
        </div>
      </Drawer>
    </div>
  );
}

const styles = {
  button: { border: "none", background: "transparent", color: "gray" },
  buttonContainer: { width: "100%", display: "flex", justifyContent: "right" },
  mainContainer: { width: "35vw", padding: "7%" },
};
