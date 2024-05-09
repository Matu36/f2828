import { Font, StyleSheet } from "@react-pdf/renderer";

Font.register({
  family: "Open Sans",
  fonts: [
    {
      src: "https://cdn.jsdelivr.net/npm/open-sans-all@0.1.3/fonts/open-sans-regular.ttf",
    },
    {
      src: "https://cdn.jsdelivr.net/npm/open-sans-all@0.1.3/fonts/open-sans-600.ttf",
      fontWeight: 600,
    },
  ],
});

export const styles = StyleSheet.create({
  page: {
    padding: 10,
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1,
    borderWidth: 1,
    borderColor: "#000",
    borderRadius: 5,
  },

  cbu: {
    padding: 2,
    flex: 1,
    borderWidth: 0.5,
    borderColor: "gray",
    fontSize: "10px",
    flexShrink: 1,
    flexWrap: "wrap",
  },

  cbuContainer: {
    padding: 4,
    flex: 1,
    margin: "auto",
    fontSize: 10,
    flexShrink: 1,
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "center",
  },

  header: {
    fontWeight: "bold",
    fontSize: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#000",
    backgroundColor: "#e0e0e0",
    padding: 5,
    width: "20%",
  },
  row: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#000",
  },
  cell: {
    padding: 5,
    flex: 1,
    borderWidth: 0.5,
    borderColor: "gray",
    fontSize: "10px",
    flexShrink: 1,
    flexWrap: "wrap",
  },

  totalRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 10,
  },
  totalText: {
    fontWeight: "bold",
    fontSize: 12,
  },

  label: {
    fontWeight: "bold",
    fontSize: "10px",
  },

  logoContainer: {
    marginBottom: 20,
    alignItems: "center",
  },
  logo: {
    width: 150,
    height: 60,
  },

  hr: {
    borderBottomWidth: 2,
    borderBottomColor: "black",
    width: "100%",
  },
  hr1: {
    borderBottomWidth: 2,
    borderBottomColor: "black",
    width: "100%",
  },

  text: {
    fontSize: "10px",
    fontWeight: "extrabold",
  },

  detalletitle: {
    fontSize: "18px",
    color: "gray",
    paddingBottom: "15px",
  },

  container: {
    border: 2,
    borderColor: "#000",
    // padding: 10,
    flexDirection: "row",
    justifyContent: "center",
    maxWidth: "80%",
    marginLeft: 60,
  },
  table: {
    flexDirection: "column",
    flex: 1,
    margin: 0,
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderColor: "#000",
    border: "1px solid black",
    padding: 5,
  },
  tableCell: {
    flex: 1,
    padding: 5,
  },
  cellText: {
    fontSize: 10,
    fontWeight: "bold",
  },
  columnSeparator: {
    borderRightWidth: 1,
    borderColor: "#000",
  },
  logopcia: {
    maxWidth: "50%",
    marginLeft: 60,
  },
  cell1: {
    fontSize: 10,
    fontWeight: "bold",
    marginLeft: 80,
  },
  line: {
    borderTopWidth: 1,
    borderTopColor: "#000",
    marginVertical: 5,
  },

  pdfdownloadbutton: {
    color: "white",
    backgroundColor: "#419bf6",
    padding: 10,
    border: "none",
    borderRadius: 4,
    cursor: "pointer",
    fontSize: 16,
    textDecoration: "none",
    width: "120px",
    marginTop: 20,
    transition: "background-color 0.8s",
    marginRight: 10,
    textAlign: "center",
  },

    marcaAgua: {
      textTransform: "uppercase",
      position: "absolute",
      top: 350,
      fontSize: 90,
      color: "#0078b3",
      transform: "rotate(45deg)",
      left: 50,
      fontWeight: 100,
      opacity: 0.3,
    },
    content: {
      display: "flex",
      flexDirection: "row",
      border: "1px solid black",
      justifyContent: "space-between",
      fontSize: 10,
      maxWidth: "80%",
      margin: "5px auto"
    },
    tableContent:{
      display: "flex",
      flexDirection: "column",
      height: "100px",
      borderRight: "1px solid black",
      borderBottom: "1px solid black",
      marginRight: "10px",
      marginBottom: "20px",
      maxWidth: "80%"
    },
    tableHeader: {
      maxWidth: "100%",
      maxHeight: "30px",
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      borderBottom: "1px solid black",
      
    },
    tableColumnContent: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      paddingBottom: "5px",
      paddingTop: "4px",
      minWidth: "20%",
      fontWeight: "bold"
    },
    tableFirstColumn:{
      minWidth: "80%",
      borderRight: "1px solid black",
    },
    tableBodyWrapper: {
      display: "flex",
      flexDirection: "column",
    },
    tableBodyRow: {
      display: "flex",
      flexDirection: "row",
      width: "100%",
      borderBottom: "1px solid black",
    },
    tableRowContent: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "5px",
      textAlign: "left",
      minWidth: "20%"
    },
    tableFirstRow: {
      minWidth: "80%",
      borderRight: "1px solid black",
      flexDirection: "row",
      justifyContent: "space-between"
    },
    tableLastChild: {
      borderBottom: "none"
    },
    firmaContent: {
      width: "50%",
      fontSize: 10,
      display: "flex",
      padding: "5px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    },
    firmaBody: {
      minHeight: "100px",
      marginBottom: "5px"
    },
    firmaText: {
      paddingTop: "5px",
      borderTop: "1px solid black"
    },
    table_content: {
      fontSize: "8px",
      border: "1px solid #e0e0e0"
    },
    table_row: {
      display: "flex",
      width: "100%",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      borderBottom: "1px solid #e0e0e0"
    },
    table_colSpan: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "space-between",
      height: "100%",
      // borderRight: "1px solid #e0e0e0",
    },
    table_colSpan_content: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      maxHeight: "100%"
    },
    table_modulo: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
      borderBottom: "1px solid #e0e0e0"
    },
    table_column: {
      width: "75px",
      borderRight: "1px solid #e0e0e0",
      padding: "0px",
      height: "100%"
    },
    table_list_modulo: {
      display: "flex"
    }
  });