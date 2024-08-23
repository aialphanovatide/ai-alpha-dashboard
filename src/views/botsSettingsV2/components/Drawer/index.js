import * as React from "react";
import Drawer from "@mui/material/Drawer";

export default function DrawerComponent({ children, open, toggleDrawer }) {

  return (
    <div>
      <Drawer open={open} onClose={toggleDrawer(false)} anchor="right">
        <div style={{width:"35vw"}}>
          {children}
        </div>
      </Drawer>
    </div>
  );
}
