import * as React from "react";
import Drawer from "@mui/material/Drawer";
import CIcon from "@coreui/icons-react";
import styles from "./index.module.css";
import { cilX } from "@coreui/icons";

export default function DrawerComponent({
  children,
  open,
  toggleDrawer,
  anchor,
}) {
  return (
    <Drawer
      open={open}
      onClose={toggleDrawer(false)}
      anchor={anchor}
      className={styles.drawer}
    >
      <div className={anchor == "right" ? styles.rightContainer : styles.bottomContainer}>
        <div className={anchor == "right" ? styles.buttonContainer : styles.buttonContainerBottom}>
          <button onClick={toggleDrawer(false)} className={styles.button}>
            <CIcon icon={cilX} size="xl" />
          </button>
        </div>
        {children}
      </div>
    </Drawer>
  );
}
