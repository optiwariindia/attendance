import { Grid } from "@mui/material";

function SectionTitle(attr) {
  const sectionHeaderStyle = {
    fontWeight: 600,
    fontSize: { xs: "16px", lg: "18px" },
    height: "45px",
    p: 2,
    color: attr.isDisabled && "grey",
    background: attr.isDisabled
      ? "#e4e5e6"
      : "linear-gradient(-45deg, rgb(191, 226, 247), #e4e5e6, rgb(191, 226, 247))",
    backgroundSize: "150% 150%",
    animation: "gradientShift 12s ease infinite",
    borderTopLeftRadius: "8px",
    borderTopRightRadius: "8px",
  };

  return (
    <>
      <style>
        {`
          @keyframes gradientShift {
            0% {
              background-position: 0% 50%;
            }
            50% {
              background-position: 100% 50%;
            }
            100% {
              background-position: 0% 50%;
            }
          }
        `}
      </style>
      <Grid
        size={12}
        sx={{
          ...sectionHeaderStyle,
          ...attr.sx,
          display: "flex",
          alignItems: "center",
        }}
      >
        {attr.title}
        {attr.children}
      </Grid>
    </>
  );
}

export default SectionTitle;
