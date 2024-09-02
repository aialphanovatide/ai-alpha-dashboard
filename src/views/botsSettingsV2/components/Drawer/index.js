import * as React from "react";
import Drawer from "@mui/material/Drawer";
import CIcon from "@coreui/icons-react";
import styles from "./index.module.css";
import { cilX } from "@coreui/icons";

export default function DrawerComponent({ children, open, toggleDrawer }) {
  return (
      <Drawer open={open} onClose={toggleDrawer(false)} anchor="right" className="drawer" >
        <div className={styles.mainContainer}>
          <div className={styles.buttonContainer}>
            <button onClick={toggleDrawer(false)} className={styles.button}>
              <CIcon icon={cilX} size="xl" />
            </button>
          </div>
          {children}
        </div>
      </Drawer>
  );
}
