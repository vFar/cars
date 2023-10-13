import React from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  heading: {
    fontSize: "12px",
    marginLeft: "4px",
  },
  heading2: {
    margin: "10px auto 0 auto",
  },
  table: {
    display: "table",
    width: "auto",
    borderStyle: "solid",
    borderWidth: 1,
    borderRightWidth: 0,
    borderBottomWidth: 0,
    margin: "0 auto",
  },
  tableRow: {
    margin: "auto",
    flexDirection: "row",
  },

  headingRow: {
    margin: "auto",
    flexDirection: "row",
    backgroundColor: "lightgray",
  },
  totalRow: {
    margin: "auto",
    flexDirection: "row",
    backgroundColor: "orange",
  },
  tableColcar: {
    width: "15%",
    borderStyle: "solid",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  tableCol: {
    width: "30%",
    borderStyle: "solid",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  tableColapp: {
    width: "17%",
    borderStyle: "solid",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  tableCol2: {
    width: "9%",
    borderStyle: "solid",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  tableCol3: {
    width: "10%",
    borderStyle: "solid",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  tableColtotal: {
    width: "49.5%",
    borderStyle: "solid",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  tableColperiod: {
    width: "99%",
    borderStyle: "solid",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  tableCell: {
    margin: "auto",
    marginTop: 5,
    fontSize: 10,
  },
});

const PdfDocument = ({ data, startDate, endDate, rowCount, totalFullPrice }) => (
  <Document>
    <Page style={styles.body}>
      <View>
        <Text style={styles.heading2}>Sales Data</Text>
      </View>
      <View style={styles.table}>
      <View style={styles.totalRow}>
      <View style={styles.tableColperiod}>
        <Text style={styles.tableCell}>
          {startDate} - {endDate}
        </Text>
      </View>
      </View>
        <View style={styles.totalRow}>
      <View style={styles.tableColtotal}>
        <Text style={styles.tableCell}>
          Total sold: {rowCount}
        </Text>
      </View>
      <View style={styles.tableColtotal}>
        <Text style={styles.tableCell}>
          Total income: {totalFullPrice}
        </Text>
      </View>
      </View>
        <View style={styles.headingRow}>
          <View style={styles.tableColcar}>
            <Text style={styles.tableCell}>Vehicle</Text>
          </View>
          <View style={styles.tableCol}>
            <Text style={styles.tableCell}>Status</Text>
          </View>
          <View style={styles.tableColapp}>
            <Text style={styles.tableCell}>Appraiser</Text>
          </View>
          <View style={styles.tableCol2}>
            <Text style={styles.tableCell}>Neto price</Text>
          </View>
          <View style={styles.tableCol2}>
            <Text style={styles.tableCell}>VAT rate</Text>
          </View>
          <View style={styles.tableCol2}>
            <Text style={styles.tableCell}>Full price</Text>
          </View>
          <View style={styles.tableCol3}>
            <Text style={styles.tableCell}>Date</Text>
          </View>
        </View>
        {data.map((item, index) => (
          <View style={styles.tableRow}>
            <View style={styles.tableColcar}>
              <Text style={styles.tableCell}>{item.vehicle}</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>{item.salestatus}</Text>
            </View>
            <View style={styles.tableColapp}>
              <Text style={styles.tableCell}>{item.appraiser}</Text>
            </View>
            <View style={styles.tableCol2}>
              <Text style={styles.tableCell}>{item.netoprice}</Text>
            </View>
            <View style={styles.tableCol2}>
              <Text style={styles.tableCell}>{item.vatrate}</Text>
            </View>
            <View style={styles.tableCol2}>
              <Text style={styles.tableCell}>{item.fullprice}</Text>
            </View>
            <View style={styles.tableCol3}>
              <Text style={styles.tableCell}>{item.date}</Text>
            </View>
          </View>
        ))}
      </View>
    </Page>
  </Document>
);

export default PdfDocument;
