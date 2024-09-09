import React from "react";
import Tooltip, { tooltipClasses } from "@mui/material/Tooltip";
import { styled } from "@mui/material/styles";
import { HelpOutline, Padding } from "@mui/icons-material";

const HtmlTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: "red",
    color: "white",
    border: "1px solid red",
    fontSize: 14,
    borderRadius: 50,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    textAlign: "center",
  },
  [`& .${tooltipClasses.arrow}`]: {
    color: "red",
    "&::before": {
      border: "1px solid red",
    },
  },
}));

const CustomTooltip = ({ title, content, children }) => {
  return (
    <HtmlTooltip
      title={
        <React.Fragment>
          {title && (
            <span style={{ fontSize: 14, margin: 0 }}>
              <strong>{title}</strong>
            </span>
          )}
          <p style={{ margin: 0 }}>{content}</p>
        </React.Fragment>
      }
      arrow // Add this prop to show the arrow
    >
      {children}
    </HtmlTooltip>
  );
};

export default CustomTooltip;
