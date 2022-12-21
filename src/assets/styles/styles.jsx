export const loadingPhotoSpinner = {
  position: "relative",
  backdropFilter: "none",
  borderRadius: "100%",
  boxShadow: "1px 1px 15px -4px",
};

export const imageTitleBox = {
  width: { md: "160px", sm: "120px", xs: "100px" },
  height: { md: "160px", sm: "120px", xs: "100px" },
};

export const mainWindow = {
  width: "100%",
  display: "flex",
  minHeight: "100vh",
  padding: { xs: "25px", sm: "20px" },
};

export const modal = {
  position: "fixed",
  left: 0,
  bottom: 0,
  width: "100vw",
  height: "100vh",
  display: "flex",
  alignItems: "flex-end",
  justifyContent: "center",
  background: "#4e464652",
  backdropFilter: "blur(4px)",
  transition: "all 500ms ease",
};

export const modalContent = {
  display: "flex",
  flexDirection: "column",
  width: { sm: "630px", xs: "100%" },
  height: "80%",
  padding: "1rem",
  borderRadius: "1rem 1rem 0 0",
  position: "relative",
  transition: "all 500ms ease",
};

export const mainContent = {
  width: { sm: "630px", xs: "90%" },
  flexDirection: "column",
  display: "flex",
  alignItems: "center",
  marginTop: "80px",
  padding: { xs: "20px 20px 0 20px", sm: "40px 40px 0 40px", md: 0 },
  margin: "80px auto 0 auto",
};

export const productList = {
  width: "100%",
  padding: "20px 0",
  flexDirection: "column",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

export const typeBoxCss = {
  width: "90%",
  flexDirection: "column",
  marginTop: "20px",
  alignItems: "center",
  justifyContent: "center",
  display: "flex",
};

export const responsiveGrid = {
  width: "100%",
  display: "flex",
  alignItems: "center",
  flexWrap: "wrap",
  gap: "10px",
};

export const productPaper = {
  position: "relative",
  marginTop: "20px",
  width: { md: "350px", xs: "100%" },
  height: { md: "350px", xs: "auto" },
  borderRadius: "1rem",
  alignItems: "center",
};

export const mainBox = {
  padding: { md: 0, xs: "1rem" },
  display: "flex",
  cursor: "pointer",
  flexDirection: { md: "column", xs: "row" },
};

export const productImageBox = {
  width: { md: "100%", sm: "120px", xs: "100px" },
  height: { md: "160px", sm: "120px", xs: "100px" },
  minWidth: { md: "100%", sm: "120px", xs: "100px" },
  minHeight: { md: "160px", sm: "120px", xs: "100px" },
  marginRight: { md: 0, xs: "20px" },
};

export const productImage = {
  objectFit: "cover",
  width: "100%",
  height: "100%",
};

export const productContentBox = {
  flexDirection: "column",
  justifyContent: "flex-start",
  overflow: "hidden",
  width: "100%",
  display: "flex",
  gap: "10px",
  padding: { xs: 0, md: "1rem" },
};

export const productDescriptionBox = {
  height: { xs: "50px", sm: "100px" },
  lineHeight: "20px",
  boxOrient: "vertical",
  overflow: "hidden",
};
