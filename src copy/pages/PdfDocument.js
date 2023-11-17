import React from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  heading: {
    margin: "15px auto 30px auto",
    fontSize: 23
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
    backgroundColor: "#dbdbdb",
    borderStyle: "solid",
    borderTopWidth: 1,
  },
  tableColcar: {
    width: "10%",
    borderStyle: "solid",
    borderWidth: 1,
    borderLeftWidth: 1,
    borderTopWidth: 0,
  },
  tableCol: {
    width: "25%",
    borderStyle: "solid",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  tableColapp: {
    width: "23%",
    borderStyle: "solid",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  tableCol2: {
    width: "10%",
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
  tableCell: {
    margin: "auto",
    marginTop: 10,
    marginBottom: 10,
    fontSize: 10,
  },
  tableCellh: {
    margin: "auto",
    marginTop: 10,
    marginBottom: 10,
    fontSize: 12  
  },
  topText:{
    marginBottom: 10,
    marginLeft: 10, 
    fontSize: 15
  }
});

const PdfDocument = ({ data, startDate, endDate, rowCount, totalFullPrice }) => (
  <Document>
    <Page style={styles.body} size="A4" orientation="landscape">
      <View>
        <Text style={styles.heading}>Sales Data</Text>
      </View>
      <View>
      <View>
      <View>
        <Text style={styles.topText}>
          Period:   {startDate} — {endDate}
        </Text>
      </View>
      </View>
        <View>
      <View>
        <Text style={styles.topText}>
          Total vehicles sold:   {rowCount}
        </Text>
      </View>
      <View>
        <Text style={styles.topText}>
          Total income:   {`€ ${parseFloat(totalFullPrice).toLocaleString()}`}
        </Text>
      </View>
      </View>
        <View style={styles.headingRow}>
          <View style={styles.tableColcar}>
            <Text style={styles.tableCellh}>Vehicle</Text>
          </View>
          <View style={styles.tableCol}>
            <Text style={styles.tableCellh}>Status</Text>
          </View>
          <View style={styles.tableColapp}>
            <Text style={styles.tableCellh}>Appraiser</Text>
          </View>
          <View style={styles.tableCol2}>
            <Text style={styles.tableCellh}>Neto price</Text>
          </View>
          <View style={styles.tableCol2}>
            <Text style={styles.tableCellh}>VAT rate</Text>
          </View>
          <View style={styles.tableCol2}>
            <Text style={styles.tableCellh}>Full price</Text>
          </View>
          <View style={styles.tableCol3}>
            <Text style={styles.tableCellh}>Date</Text>
          </View>
        </View>
        {data.map((item, index) => (
          <View style={styles.tableRow} key={index}>
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
            <Text style={styles.tableCell}>{`€ ${parseFloat(item.netoprice).toLocaleString()}`}</Text>
          </View>
          <View style={styles.tableCol2}>
            <Text style={styles.tableCell}>{`${parseFloat(item.vatrate).toLocaleString()}%`}</Text>
          </View>
          <View style={styles.tableCol2}>
            <Text style={styles.tableCell}>{`€ ${parseFloat(item.fullprice).toLocaleString()}`}</Text>
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