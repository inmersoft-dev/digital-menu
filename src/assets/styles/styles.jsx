export const loadingPhotoSpinner = {
  position: "relative",
  backdropFilter: "none",
  borderRadius: "100%",
  boxShadow: "1px 1px 15px -4px",
};

export const mainWindow = { width: "100vw", height: "100vh", padding: "25px" };

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
  width: { md: "800px", sm: "630px", xs: "100%" },
  height: "90%",
  padding: "1rem",
  borderRadius: "1rem",
  position: "relative",
  transition: "all 500ms ease",
};

export const mainContent = {
  width: { md: "800px", sm: "630px", xs: "100%" },
  flexDirection: "column",
  display: "flex",
  alignItems: "center",
  marginTop: "80px",
  margin: "80px auto 0 auto",
};

export const productList = {
  padding: "20px 0",
  flexDirection: "column",
};

export const typeBoxCss = {
  flexDirection: "column",
  marginTop: "20px",
  alignItems: "center",
  display: "flex",
};

export const headerBox = { width: { md: "800px", sm: "630px", xs: "100%" } };

export const productPaper = {
  cursor: "pointer",
  marginTop: "20px",
  display: "flex",
  width: { md: "800px", sm: "630px", xs: "100%" },
  padding: "1rem",
  borderRadius: "1rem",
};

export const productImageBox = {
  width: { md: "160px", sm: "120px", xs: "80px" },
  height: { md: "160px", sm: "120px", xs: "80px" },
};

export const productImage = {
  objectFit: "cover",
  width: "100%",
  height: "100%",
  borderRadius: "100%",
};

export const productContentBox = {
  flexDirection: "column",
  justifyContent: "flex-start",
  width: { md: "585px", sm: "350px", xs: "95%" },
};

export const productDescriptionBox = {
  height: { xs: "25px", sm: "50px", md: "100px" },
  lineHeight: "20px",
  wordBreak: "break-all",
  display: "-webkit-box",
  boxOrient: "vertical",
  lineClamp: 5,
  overflow: "hidden",
};
