import React from "react";
import { useOrdenPorLiquidacionId } from "../../hooks/useOrdenesDePago";
import {
  PDFDownloadLink,
  Document,
  Page,
  View,
  Text,
} from "@react-pdf/renderer";
import { styles } from "../styles/StylesPdf";
import NumberFormatter from "../../utils/NumberFormatter";

//Componente que muestra PDF de los agentes sumariados que cobran por transferencia cuando el Honorario no tiene la OP definitiva.

export const PrintOrdenPagoPDFTransferencia = ({
  liquidacionId,
  opProvisoria,
  clicked
}) => {
  const { data, isFetched, isLoading } =
    useOrdenPorLiquidacionId(liquidacionId, clicked).ordenesPorIdQuery;
    

  const personasArray = Array.isArray(data) ? data[0] : [];

  if (isLoading) {
    return "Cargando detalles por transferencia ...";
  }

  const personasExceptLast = personasArray.slice(0, -1);

  return (
    <PDFDownloadLink
      document={
        <Document>
          <Page size="A4" style={styles.page}>
            <View style={styles.section}>
              <View style={{ justifyContent: "center", alignItems: "center" }}>
                <Text style={[styles.detalletitle]}>
                  {" "}
                  Detalle de la Orden de Pago
                </Text>
              </View>
              <View style={styles.row}>
                <Text style={[styles.cell, styles.header]}>Nombre</Text>
                <Text style={[styles.cell, styles.header]}>Legajo</Text>
                <Text style={[styles.cell, styles.header]}>CUIL</Text>
                <Text style={[styles.cell, styles.header]}>CBU</Text>
                <Text style={[styles.cell, styles.header]}>Monto Total</Text>
                <Text style={[styles.cell, styles.header]}>Tipo de Pago</Text>
              </View>
              {personasExceptLast
                .filter((personasData) => personasData.tipo_pago === "cb")
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
                        {tipo_pago ? "Transferencia" : "Transferencia"}{" "}
                      </Text>
                    </View>
                  );
                })}

              <View style={styles.totalRow}>
                <Text style={styles.totalText}>
                  Total: ${" "}
                  {personasExceptLast
                    .filter((personasData) => personasData.tipo_pago === "cb")
                    .reduce(
                      (total, personaData) => total + personaData.valor_total,
                      0
                    )
                    .toFixed(2)
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                </Text>
              </View>
            </View>
          </Page>
        </Document>
      }
      fileName={`detalle_agentesportransferencia.pdf`}
    >
      {({ loading }) =>
        loading
          ? "Cargando documento..."
          : " Imprimir listado de agentes por transferencia "
      }
    </PDFDownloadLink>
  );
};

export default PrintOrdenPagoPDFTransferencia;
