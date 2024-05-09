import React from "react";
import "../assets/styles/detalle.css";
import { useOrdenPorLiquidacionId } from "../hooks/useOrdenesDePago";
import Spinner from "../components/UI/Spinner";
import "../assets/styles/detalle.css";
import {
  PDFDownloadLink,
  Document,
  Page,
  View,
  Text,
  Image,
} from "@react-pdf/renderer";
import { useParams } from "react-router-dom";
import Logo from "../assets/images/LOGOSAMO.jpg";
import LOGOPCIA from "../assets/images/LOGOPCIA.png";

import NumberFormatter from "../utils/NumberFormatter";
import { styles } from "./styles/StylesPdf";

//Componente, que dentro de Ver órdenes de Pago, muestra los datos del agente dentro del Honorario creado, el operativo y las funciones que
//desempeñó, asi como el monto unitario y el monto total; Da la posibilidad de Descargar el PDF.

const TableBodyRow = ({ index, titulo, dato }) => {
  return (
    <View style={styles.tableBodyRow}>
      <View style={{ ...styles.tableRowContent, ...styles.tableFirstRow }}>
        <View>
          <Text>{index}</Text>
        </View>
        <View>
          <Text>{titulo}: </Text>
        </View>
        <View>
          <Text>{dato}</Text>
        </View>
      </View>
      <View style={styles.tableRowContent}>
        <Text></Text>
      </View>
    </View>
  );
};

const formatDate = (dateString) => {
  const options = { year: "numeric", month: "2-digit", day: "2-digit" };
  const date = new Date(dateString);
  return date.toLocaleDateString(undefined, options);
};

export const OrdenDetail = () => {
  const { liquidacion_id } = useParams();
  const { data, isFetched } =
    useOrdenPorLiquidacionId(liquidacion_id).ordenesPorIdQuery;

  const personasArray = Array.isArray(data) ? data[0] : [];
  const personasExceptLast = personasArray.slice(0, -1);

  const gastos = personasArray[personasArray.length - 1];

  //PDF

  const generatePDFContent = (personasExceptLast) => (
    <Document style={{ fontFamily: "Open Sans" }}>
      <Page size="A4">
        <View>
          <View
            style={{
              marginTop: 40,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <View
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "row",
              }}
            >
              <View style={{ marginRight: 20 }}>
                <Image src={Logo} style={styles.logo} />
                <Text style={styles.text}>FORMULARIO 20 EOC</Text>
              </View>
              <Image src={LOGOPCIA} style={styles.logopcia} />
            </View>
            <View
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text style={[styles.text, { fontWeight: "bold" }]}>
                ORDEN DE PAGO SAMO N° {gastos.gastos.da_op_nro ?? null}/
                {gastos.gastos.da_op_anio}
              </Text>
              <Text style={[styles.text, { fontWeight: "bold" }]}>
                Fecha de Emisión:
                {` ${
                  gastos.gastos.op_fecha_emision
                    ? formatDate(gastos.gastos.op_fecha_emision)
                    : "------"
                }`}
              </Text>
            </View>
            <View
              style={{
                width: "80%",
                paddingBottom: "15px",
                paddingTop: "10px",
                borderBottom: "1px solid #000",
              }}
            >
              <Text style={{ ...styles.text, textAlign: "right" }}>
                {gastos.gastos.op_expediente ?? null}
              </Text>
            </View>
          </View>
          <View style={{ marginLeft: 60 }}>
            <Text style={{ ...styles.text, marginBottom: 10 }}>
              ESTABLECIMIENTO: C.U.C.A.I.B.A
            </Text>
            <Text style={{ ...styles.text, marginBottom: 10 }}>
              POR TESORERIA PAGUESE: VARIABLES OPERATIVOS
            </Text>
            <Text style={{ ...styles.text, marginBottom: 10 }}>
              CANTIDAD DE PESOS: $
              {gastos.gastos.op_monto
                ? NumberFormatter(gastos.gastos.op_monto)
                : null}
            </Text>
            <Text style={[styles.text, { marginBottom: 10 }]}>
              POR LA SUMA DE PESOS:
              {numberInWords(gastos.gastos.op_monto).replace(
                / 00\/100 M\.N\.$/,
                ""
              )}
              .-
            </Text>
            <Text
              style={{
                ...styles.text,
                marginBottom: 10,
                textDecoration: "underline",
              }}
            >
              EN CONCEPTO DE PAGOS DE VARIABLES DE PROCURACION
            </Text>
            <View>
              <Text style={{ ...styles.text, fontWeight: "light" }}>
                CON CARGO A LA CUENTA ESPECIAL 52880/3 FONDO SOLIDARIO DE
                TRANSPLANTE
              </Text>
              <Text style={{ ...styles.text, fontWeight: "light" }}>
                SAMO DECRETO LEY 8801/77
              </Text>
              <Text style={{ ...styles.text, fontWeight: "light" }}>
                EJERCICIO {gastos.gastos.da_op_anio}
                {gastos.gastos.op_codinstitucional
                  ? gastos.gastos.op_codinstitucional
                  : null}
                {gastos.gastos.op_jurisdiccion
                  ? gastos.gastos.op_jurisdiccion
                  : null}
                {gastos.gastos.op_jurisauxiliar
                  ? gastos.gastos.op_jurisauxiliar
                  : null}
                {gastos.gastos.op_entidad ? gastos.gastos.entidad : null}
                CATEGORIA PROG:
                <Text style={{ ...styles.text, fontWeight: "light" }}>
                  {gastos.gastos.op_programa ? gastos.gastos.op_programa : null}
                </Text>
              </Text>
              <Text style={{ ...styles.text, fontWeight: "light" }}>
                FUENTE DE FINANCIAMIENTO: PROCEDENCIA
                {gastos.gastos.op_procedencia} - FUENTE
                {gastos.gastos.op_fuente}
              </Text>
              <View
                style={{
                  margin: "15px 20px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  flexDirection: "row",
                  height: "100px",
                }}
              >
                <Text style={styles.text}>Inciso 3</Text>
                <View
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    flexDirection: "column",
                  }}
                >
                  <Text
                    style={{
                      ...styles.text,
                      fontWeight: "light",
                      marginBottom: "20px",
                    }}
                  >
                    {gastos.gastos.op_inciso}.{gastos.gastos.op_partidappal}.
                    {gastos.gastos.op_partidaparcial} : $
                    {gastos.gastos.op_monto ? gastos.gastos.op_monto : null}
                  </Text>
                  <Text style={styles.text}>
                    TOTAL IMPUTADO: $
                    {gastos.gastos.op_monto
                      ? NumberFormatter(gastos.gastos.op_monto)
                      : null}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.content}>
          <View style={styles.tableContent}>
            <View style={styles.tableHeader}>
              <View style={styles.tableColumn}>
                <View
                  style={{
                    ...styles.tableColumnContent,
                    ...styles.tableFirstColumn,
                  }}
                >
                  <Text>INTERVENCION</Text>
                </View>
              </View>
              <View style={styles.tableColumn}>
                <View style={styles.tableColumnContent}>
                  <Text>V° B°</Text>
                </View>
              </View>
            </View>
            <View style={styles.tableBodyWrapper}>
              <TableBodyRow
                index={1}
                dato={
                  gastos.gastos.op_fecha_emision
                    ? formatDate(gastos.gastos.op_fecha_emision)
                    : "------"
                }
                titulo="Fecha de Liquidación del gasto"
              />
              <TableBodyRow
                index={2}
                dato={
                  gastos.gastos.op_fecha_emision
                    ? formatDate(gastos.gastos.da_fecha_dispo)
                    : "------"
                }
                titulo="Fecha Imputación"
              />
              <TableBodyRow
                index={3}
                dato={gastos.gastos.op_foliolibrobanco}
                titulo="Folio Libro Banco"
              />
              <TableBodyRow
                index={4}
                dato={gastos.gastos.op_nrochequetransferencia}
                titulo="Nro. Cheque/Transferencia"
              />
            </View>
          </View>
          <View style={styles.firmaContent}>
            <View style={styles.firmaBody}></View>
            <Text style={styles.firmaText}>
              Firma y sello del Administrador
            </Text>
          </View>
        </View>
        {!gastos.gastos.op_fecha_emision && (
          <View style={styles.marcaAgua}>
            <Text>No válido</Text>
          </View>
        )}
      </Page>
      <Page size="A4" style={styles.page}>
        <View style={styles.section}>
          <View style={{ justifyContent: "center", alignItems: "center" }}>
            <Text style={[styles.detalletitle]}>
              Detalle de la Orden de Pago {gastos.gastos.da_op_nro ?? null}
            </Text>
          </View>
          <View>
            <View style={{ ...styles.row, fontSize: "10px" }}>
              <Text style={{ ...styles.cell, ...styles.header }}>Nombre</Text>
              <Text style={{ ...styles.cell, ...styles.header }}>Legajo</Text>
              <Text style={{ ...styles.cell, ...styles.header }}>CUIL</Text>
              <Text style={{ ...styles.cell, ...styles.header }}>PD Nro</Text>
              <Text style={{ ...styles.cell, ...styles.header }}>
                Descripción
              </Text>
              <Text style={{ ...styles.cell, ...styles.header }}>Monto</Text>
              <Text style={{ ...styles.cell, ...styles.header }}>
                Monto Total
              </Text>
            </View>
            <View style={styles.table_content}>
              {personasExceptLast.map((d, ib) => {
                const { nombre, cuil, items, valor_total, legajo } = d;
                return (
                  <View
                    style={{
                      ...styles.table_row,
                      borderBottom:
                        ib == personasExceptLast.length - 1
                          ? "none"
                          : "1px solid #e0e0e0",
                    }}
                  >
                    <Text style={styles.table_column}>{nombre}</Text>
                    <Text style={styles.table_column}>{legajo}</Text>
                    <Text style={styles.table_column}>{cuil}</Text>
                    <View style={styles.table_colSpan}>
                      {items.map((o, ia) => (
                        <View
                          style={{
                            ...styles.table_colSpan_content,
                            borderBottom:
                              items.length - 1 == ia
                                ? "none"
                                : "1px solid #e0e0e0",
                          }}
                        >
                          <Text style={styles.table_column}>
                            {o.referencia}
                          </Text>
                          <View style={{ ...styles.table_list_modulo }}>
                            {o.descripciones.map((m, i) => (
                              <View
                                style={{
                                  ...styles.table_modulo,
                                  borderBottom:
                                    o.descripciones.length - 1 == i
                                      ? "none"
                                      : "1px solid #e0e0e0",
                                }}
                              >
                                <Text style={styles.table_column}>
                                  {m.descripcion}
                                </Text>
                                <Text style={styles.table_column}>
                                  $ {NumberFormatter(m.valor_unitario)}
                                </Text>
                              </View>
                            ))}
                          </View>
                        </View>
                      ))}
                    </View>
                    <Text
                      style={{ ...styles.table_column, borderRight: "none" }}
                    >
                      $ {NumberFormatter(valor_total)}
                    </Text>
                  </View>
                );
              })}
            </View>
          </View>
          {/* 
          {personasExceptLast.map((personasData, index) => {
            const { nombre, cuil, items, valor_total, legajo } = personasData;

            return (
              <View style={styles.row} key={index}>
                <Text style={styles.cell}>{nombre}</Text>
                <Text style={styles.cell}>{legajo}</Text>
                <Text style={styles.cell}>{cuil}</Text>
                <View style={styles.cell}>
                  {items.map((item, itemIndex) => (
                    <Text key={itemIndex} style={styles.valueText}>{item.referencia}</Text>
                  ))}
                  
                </View>

                <View style={styles.cell}>
                  {items.map((item, itemIndex) => (
                    <View key={itemIndex}>
                      {item.descripciones.map((descripcion, descIndex) => (
                        <View
                          style={styles.descriptionValueContainer}
                          key={descIndex}
                        >
                          <Text>{descripcion.descripcion}</Text>
                        </View>
                      ))}
                      {items.reduce(
                        (total, item) => total + item.descripciones.length,
                        0
                      ) > 1 && <View style={styles.lines}></View>}
                    </View>
                  ))}
                </View>

                <View style={styles.cell}>
                  {items.map((item, itemIndex) => (
                    <View key={itemIndex}>
                      {item.descripciones.map((descripcion, descIndex) => (
                        <View style={styles.valueContainer} key={descIndex}>
                          <Text style={styles.valueText}>
                            $ {NumberFormatter(descripcion.valor_unitario)}
                          </Text>
                        </View>
                      ))}
                    </View>
                  ))}
                </View>
                <Text style={styles.cell}>
                  $ {NumberFormatter(valor_total)}
                </Text>
              </View>
            );
          })}
        */}
          <View style={styles.totalRow}>
            <Text style={styles.totalText}>
              Total: $
              {gastos.gastos.op_monto
                ? NumberFormatter(gastos.gastos.op_monto)
                : null}
            </Text>
          </View>
        </View>
      </Page>
    </Document>
  );

  //Vista de la pagina en el navegador

  return (
    <div>
      {isFetched ? (
        <>
          <div className="table-container">
            <table className="styled-table">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Legajo</th>
                  <th>CUIL</th>
                  <th>PD Nro</th>
                  <th>Descripción</th>
                  <th>Monto</th>
                  <th>Monto Total</th>
                </tr>
              </thead>
              <tbody>
                {personasExceptLast.map((personasData, index) => {
                  const { nombre, legajo, cuil, valor_total, items } =
                    personasData;
                  const rowSpan = items.length;

                  return items.map((item, itemIndex) => (
                    <tr key={index + "-" + itemIndex}>
                      {itemIndex === 0 && <td rowSpan={rowSpan}>{nombre}</td>}
                      {itemIndex === 0 && <td rowSpan={rowSpan}>{legajo}</td>}
                      {itemIndex === 0 && <td rowSpan={rowSpan}>{cuil}</td>}
                      <td>{item.referencia}</td>
                      <td>
                        {item.descripciones.map((descripcion, descIndex) => (
                          <div key={descIndex}>{descripcion.descripcion}</div>
                        ))}
                      </td>
                      <td>
                        {item.descripciones.map((descripcion, descIndex) => (
                          <div key={descIndex}>
                            $
                            {descripcion.valor_unitario
                              .toFixed(2)
                              .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                          </div>
                        ))}
                      </td>
                      {itemIndex === 0 && (
                        <td rowSpan={rowSpan}>
                          $
                          {valor_total
                            .toFixed(2)
                            .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                        </td>
                      )}
                    </tr>
                  ));
                })}
              </tbody>
            </table>

            <div className="w-100 d-flex justify-content-end align-items-center">
              <PDFDownloadLink
                document={generatePDFContent(personasExceptLast)}
                file
                fileName="detalle_orden_pago.pdf"
                style={styles.pdfdownloadbutton}
              >
                {({ loading }) =>
                  loading ? "Cargando documento..." : "Descargar"
                }
              </PDFDownloadLink>
            </div>
          </div>
        </>
      ) : (
        <Spinner />
      )}
    </div>
  );
};
