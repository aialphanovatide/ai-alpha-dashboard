import React from "react";
import Tooltip, { tooltipClasses } from "@mui/material/Tooltip";
import { styled } from "@mui/material/styles";

const HtmlTooltip = styled(({ className, isError, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ isError }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: isError ? "red" : "#ffffff",
    color: isError ? "white" : "#525252",
    border: "1px solid",
    borderColor: isError ? "red" : "#525252",
    fontSize: 14,
    borderRadius: 50,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    textAlign: "center",
  },
  [`& .${tooltipClasses.arrow}`]: {
    color: isError ? "red" : "#ffffff",
    "&::before": {
      border: "1px solid",
      borderColor: isError ? "red" : "#525252",
    },
  },
}));

const CustomTooltip = ({ title, content, children, isError, hide = false }) => {
  if (hide) {
    return children;
  }

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
      arrow
      isError={isError}
    >
      {children}
    </HtmlTooltip>
  );
};

export default CustomTooltip;
