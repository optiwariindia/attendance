import { Grid, Button } from "@mui/material";
import { api } from "../utils";
import React from "react";

export default function SelectedActions({
  selected,
  actions,
  reloadData,
  onLoadingStatusChange,
  endpoint,
  ...attr
}) {
  async function bulkUpdate(data) {
    if (!!onLoadingStatusChange)
      onLoadingStatusChange({
        isVisible: true,
        current: 0,
      });
    for (let index = 0; index < selected.length; index++) {
      const element = selected[index];
      try {
        await api.put(`${endpoint}${element}`, data);
        if (!!onLoadingStatusChange)
          onLoadingStatusChange({
            isVisible: true,
            current: index + 1,
          });
      } catch (err) {
        if (!!onLoadingStatusChange)
          onLoadingStatusChange({
            isVisible: false,
            current: 0,
          });
        console.error(`Error activating element ${element}:`, err);
      }
    }
    if (!!onLoadingStatusChange)
      onLoadingStatusChange({
        isVisible: false,
        current: selected.length,
      });
    reloadData();
  }
  const actionHandlers = {
    activate: {
      label: "Activate",
      bgcolor: "#2a7a2a",
      onClick: async () => {
        await bulkUpdate({ isActive: true });
      },
    },
    deactivate: {
      label: "Deactivate",
      bgcolor: "#a12a2a",
      onClick: async () => {
        await bulkUpdate({ isActive: false });
      },
    },
    addFavourite: {
      label: "Add to Favourites",
      bgcolor: "#b68a24",

      onClick: async () => {
        await bulkUpdate({ sortOrder: 1 });
      },
    },
    removeFavourite: {
      label: "Remove from Favourites",
      color: "black",
      bgcolor: "#ffce31",
      onClick: async () => {
        await bulkUpdate({ sortOrder: 0 });
      },
    },
    delete: {
      label: "Delete",
      bgcolor: "#d12727ff",
      onClick: async () => {
        if (attr.onDelete) await attr.onDelete(selected);
        else await bulkUpdate({ isDeleted: true });
      },
    },
    holdAll: {
      label: "Hold All Projects",
      bgcolor: "#b68a24",
      onClick: async () => {
        await bulkUpdate({ status: "hold" });
      },
    },
    goLive: {
      label: "Switch to Live",
      bgcolor: "#2a7a2a",
      onClick: async () => {
        await bulkUpdate({ status: "live" });
      },
    },
    archive: {
      label: "Archive",
      bgcolor: "#a12a2a",
      onClick: async () => {
        await bulkUpdate({ isActive: "false" });
      },
    },
  };

  return (
    <Grid container gap={1} sx={{ ml: 2, pb: 1 }}>
      {actions.map((action) => (
        <Button
          sx={{
            height: "26px",
            fontSize: "12px",
            color: actionHandlers[action].color || "white",
            bgcolor: actionHandlers[action].bgcolor || "primary.main",
            "&:hover": { boxShadow: 8 },
            textShadow: "1px 1px 1px rgba(0, 0, 0, 0.2)",
            textTransform: "none",
          }}
          variant="contained"
          key={action}
          onClick={actionHandlers[action].onClick}
        >
          {actionHandlers[action].label}
        </Button>
      ))}
    </Grid>
  );
}
