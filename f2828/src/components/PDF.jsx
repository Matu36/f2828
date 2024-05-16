import React from "react";
import {
  PDFDownloadLink,
  Document,
  Page,
  View,
  Text,
} from "@react-pdf/renderer";
import { styles } from "../components/styles/StylesPdf";

export default function ({ clicked }) {
  return (
    <PDFDownloadLink
      document={
        <Document>
          <Page size="A4" style={styles.page}>
            <View style={styles.section}>
              <View style={{ justifyContent: "center", alignItems: "center" }}>
                <Text style={[styles.detalletitle]}> Detalle del Trámite</Text>
              </View>
              {/* 
              {personasExceptLast
                .filter((personasData) => personasData.tipo_pago === "ch")
                .map((personasData, index) => {
                  const { nombre, cuil, valor_total, legajo, cbu, tipo_pago } =
                    personasData;

                  const middleIndex = Math.floor(cbu.length / 2);
                  const cbuPart1 = cbu.substring(0, middleIndex);
                  const cbuPart2 = cbu.substring(middleIndex);

                  return (
                    <View style={styles.row} key={index}>
                      <Text style={styles.cell}>{nombre}</Text>
                      <Text style={styles.cell}>{legajo}</Text>
                      <Text style={styles.cell}>{cuil}</Text>
                      <View style={styles.cbuContainer}>
                        <Text>{cbuPart1}</Text>
                        <Text>{cbuPart2}</Text>
                      </View>

                      <Text style={styles.cell}>
                        $ {NumberFormatter(valor_total)}
                      </Text>
                      <Text style={styles.cell}>
                        {tipo_pago ? "Cheque" : "Cheque"}{" "}
                      </Text>
                      <Text style={styles.cell}> </Text>
                    </View>
                  );
                })}

              <View style={styles.totalRow}>
                <Text style={styles.totalText}>
                  Total: ${" "}
                  {personasExceptLast
                    .filter((personasData) => personasData.tipo_pago === "ch")
                    .reduce(
                      (total, personaData) => total + personaData.valor_total,
                      0
                    )
                    .toFixed(2)
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                </Text>
              </View> */}
            </View>
          </Page>
        </Document>
      }
      fileName={`Trámite.pdf`}
      style={{ textDecoration: "none", color: "inherit" }}
    >
      {({ loading }) => (loading ? "Cargando documento..." : " Imprimir ")}
    </PDFDownloadLink>
  );
}
