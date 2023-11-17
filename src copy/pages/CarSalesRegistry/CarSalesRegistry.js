import React, {
  useEffect,
  useState,
  useMemo,
  useRef,
  useCallback,
} from "react";
import { AgGridReact } from "ag-grid-react";
import {
  Button,
  Form,
  Input,
  InputNumber,
  Select,
  DatePicker,
  Modal,
  Timeline,
  Popconfirm,
  message,
  Tooltip
} from "antd";
import {
  SettingOutlined,
  InsertRowBelowOutlined,
  EditOutlined,
  FilterOutlined,
} from "@ant-design/icons";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-balham.css";
import { PDFDownloadLink } from "@react-pdf/renderer";
import PdfDocument from "../PdfDocument.js";
import "../style.css";
import Navbar from "../Navbar.js";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import ButtonGroup from "antd/es/button/button-group.js";

dayjs.extend(isBetween);
const { RangePicker } = DatePicker;

function CarSalesRegistry() {
  const saleRowData = localStorage.getItem("salesRowData");
  const carRowData = localStorage.getItem("rowData");

  //jāizveido contextHolder, kas ļauj lietot Antd Message
  const [messageApi, contextHolder] = message.useMessage();

  //mainīgie priekš noklusējuma PVN likmes datiem no localStorage
  const VATData = localStorage.getItem("defaultVAT");
  const defaultVATData = parseInt(VATData);

  //pēc AG-Grid mājaslapas resursiem, ir jālieto useMemo, lai iegūtu *nemainīgu* izmēra tabulu, 152px iekļaujas navbar augstums un atstarpe starp navbar un tabulu
  const gridStyle = useMemo(
    () => ({ height: "calc(100% - 152px)", width: "100%" }),
    []
  );

  //useState, lai pēc noklusējuma izslēgt CRUD pogas
  const [deleteDisabled, setDeleteDisabled] = useState(true);
  const [editDisabled, setEditDisabled] = useState(true);
  const [addDisabled, setAddDisabled] = useState(false);

  //nepieciešami, lai izveidotu tukšus mainīgos iekš localStorage
  if (!saleRowData) {
    const initialSalesRowData = [];
    localStorage.setItem("salesRowData", JSON.stringify(initialSalesRowData));
  }

  if (!carRowData) {
    const initialRowData = [];
    localStorage.setItem("rowData", JSON.stringify(initialRowData));
  }

  //React Hook - lietojam, lai nodrošināt formas validāciju ar noteikumiem (rules)
  const [defaultVATForm] = Form.useForm();
  const [editForm] = Form.useForm();
  const [addForm] = Form.useForm();

  var timelineChildren = [
    { children: "New request received" },
    { children: "Evaluation has begun" },
    { children: "Received a rating" },
    { children: "Car sale has begun" },
    { children: "Car sale has completed" },
    { children: "Buyer has received a sales contract" },
    { children: "Sold - Contract received from buyer" },
    { children: "Vehicle has been delivered to buyer" },
  ];

  const [editData, setEditData] = useState([]);
  const [salesFormData, setsalesFormData] = useState();
  const [salesRowData, setsalesRowData] = useState(() => {
    const savedsalesRowData = localStorage.getItem("salesRowData");
    return savedsalesRowData ? JSON.parse(savedsalesRowData) : [];
  });

  //katru reizi pirms lapu ielādes, useEffect nodrošinās AG-Grid ielādi ar jauniem datiem
  useEffect(() => {
    localStorage.setItem("salesRowData", JSON.stringify(salesRowData));
  }, [salesRowData]);

  const [defaultVATRate, setDefaultVATRate] = useState(defaultVATData);
  const [userDefinedVATRate, setUserDefinedVATRate] = useState(defaultVATData);

  //Krāsu mainīgie priekš AG-Grid 'Status' kolonnas
  const testingColors = {
    "status-pending": (params) =>
      params.value === "New request received" ||
      params.value === "Evaluation has begun" ||
      params.value === "Received a rating" ||
      params.value === "Car sale has begun" ||
      params.value === "Car sale has completed" ||
      params.value === "Buyer has received a sales contract",
    "status-sold-sale": (params) =>
      params.value === "Sold - Contract received from buyer" ||
      params.value === "Vehicle has been delivered to buyer",
    "status-canceled": (params) => params.value === "Canceled",
  };

  //AG-Grid piedāvā lietot pašveidotu renderer - šeit tas tiek pielietots, lai iekļautu statusus zem <span> tag, lai varētu atsevišķi
  //formatēt AG-Grid kolonnas elementus
  const testingRenderer = (params) => {
    return <span className="status-element">{params.value}</span>;
  };

  //Cenas formatētājs
  const currencyFormatter = (params) => {
    if (params.value === null || params.value === undefined) {
      return null;
    } else {
      return `€ ${formatNumber(params.value)}`;
    }
  };

  const formatNumber = (number) => {
    return Math.floor(number)
      .toString()
      .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
  };
  
  //Visas kolonnas priekš AG-Grid
  const [columnDefs] = useState([
    {
      field: "vehicle",
      headerName: "Vehicle",
      filter: "agTextColumnFilter",
    },
    {
      field: "salestatus",
      headerName: "Status",
      valueGetter: (params) => {
        if (params.data.salestatus) {
          return params.data.salestatus;
        }
        //visi statusi pēc noklusējuma
        return "New request received";
      },
      cellClassRules: testingColors,
      cellRenderer: testingRenderer,
    },
    {
      field: "appraiser",
      headerName: "Appraiser",
      headerTooltip: "An appraiser can have a representative who may be a person or a company",
      filter: "agTextColumnFilter",
    },
    {
      field: "netoprice",
      headerName: "Neto price",
      headerClass: "ag-right-aligned-header",
      valueFormatter: currencyFormatter,
      cellStyle: { justifyContent: "right" },
    },
    {
      field: "vatrate",
      headerName: "VAT rate",
      headerClass: "ag-right-aligned-header",
      valueGetter: (params) => {
        return params.data.vatrate || defaultVATRate;
      },
      valueFormatter: (params) => {
        return `${params.value || defaultVATRate}%`;
      },
      cellStyle: { justifyContent: "right" },
    },
    {
      field: "fullprice",
      headerName: "Full price",
      headerClass: "ag-right-aligned-header",
      valueFormatter: currencyFormatter,
      cellStyle: { justifyContent: "right" },
    },
    {
      field: "date",
      headerName: "Date",
      headerTooltip: "The format for dates is YYYY-MM-DD",
      cellDataType: "dateString",
      cellStyle: { justifyContent: "center" },
    },
  ]);

  //Noklusējuma kolonnas definējumi, kas attiecas uz visām kolonnām
  const defaultColDef = useMemo(() => {
    return {
      flex: 1,
      sortable: true,
      resizable: true,
      maxWidth: 300,
      minWidth: 100,
    };
  }, []);




  const gridRef = useRef();

  //filtrēšanas funkcija, kuru pielieto Antd Select gan pievienošanas formā, gan rediģēšanas formā
  const filterOption = (input, option) =>
    (option?.label ?? "").toLowerCase().includes(input.toLowerCase());

  //Modal useState mainīgie
  const [isModalOpen1, setIsModalOpen1] = useState(false);
  const [isModalOpen2, setIsModalOpen2] = useState(false);
  const [isModalOpen3, setIsModalOpen3] = useState(false);

  //funkcija, lai saglabātu noklusējuma PVN likmi
  const handleDefaultVAT = () => {
    setUserDefinedVATRate(defaultVATRate);
    setIsModalOpen1(false);
    localStorage.setItem("defaultVAT", defaultVATRate);
  };

  //Formas funkcijas, kas nodrošina jaunu ierakstu izveidi
  const handleFormSubmit = () => {
    const carRowData = JSON.parse(localStorage.getItem("rowData"));
    const dateValue = salesFormData.date
      ? salesFormData.date.format("YYYY-MM-DD")
      : "";

    const newsalesData = {
      ...salesFormData,
      date: dateValue,
      vatrate: defaultVATData,
      salestatus: "New request received",
    };

    setsalesRowData([newsalesData, ...salesRowData]);
    setFilteredSalesRowData((prevData) => [newsalesData, ...prevData]);

    //automašīnu meklēšanu un statusu mainīšanu arī iekļauj šeit, jo veidojas konflikti, izsaucot funkciju updateVehiclesStatus()
    const selectedVehicle = carRowData.find(
      (vehicle) => vehicle.numberplate === salesFormData.vehicle
    );

    if (selectedVehicle) {
      // Update the status of the selected vehicle to 'Reserved'
      selectedVehicle.status = "Reserved";

      // Update the car registry data in localStorage
      localStorage.setItem("rowData", JSON.stringify(carRowData));
    }

    //ziņojumu izvade caur Antd Message
    messageApi.open({
      type: "success",
      content: "New sale record has been successfully added",
    });

    setIsModalOpen2(false);
    //pēc formu iesniegšanas, atiestata visus laukus pa nullēm (šis ir vajadzīgs, citādi tam ir konflikti ar editData, skatīt handleEditSubmit() funkciju)
    addForm.resetFields();
  };

  //visu statusu masīvs
  const allStatuses = [
    "New request received",
    "Evaluation has begun",
    "Received a rating",
    "Car sale has begun",
    "Car sale has completed",
    "Buyer has received a sales contract",
    "Sold - Contract received from buyer",
    "Vehicle has been delivered to buyer",
  ];

  //funkcija, kas ļauj lietotājam mainīt statusus pakāpeniski
  const updateAvailableStatuses = (status) => {
    const selectedIndex = allStatuses.indexOf(status);

    if (selectedIndex === -1) {
      return allStatuses;
    }

    const availableStatuses = [
      allStatuses[selectedIndex - 1],
      allStatuses[selectedIndex],
      allStatuses[selectedIndex + 1],
    ].filter((status) => status !== undefined);

    return availableStatuses;
  };

  //pēc noklusējuma visiem ierakstiem statuss ir 'Saņems jauns pieprasījums'
  const [availableStatuses, setAvailableStatuses] = useState(
    updateAvailableStatuses("New request received")
  );

  //funkcija, kas ļauj manipulēt ar datiem pavisam citā reģistrā
  const updateVehicleStatus = (numberplate, newStatus) => {
    const carRowData = JSON.parse(localStorage.getItem("rowData"));

    // map atrod automašīnu ar vienādu numurzīmi automašīnu reģistrā
    const updatedCarRowData = carRowData.map((vehicle) => {
      if (vehicle.numberplate === numberplate) {
        return { ...vehicle, status: newStatus };
      }

      return vehicle;
    });

    // atjauno automašīnu reģistra localStorage
    localStorage.setItem("rowData", JSON.stringify(updatedCarRowData));
  };

  //funkcija, kas nodrošina jaunu statusu saglabāšanu
  const handleStatusChange = (value) => {
    if (availableStatuses.includes(value)) {
      setEditData({ ...editData, salestatus: value });

      if (
        value === "Sold - Contract received from buyer" ||
        value === "Vehicle has been delivered to buyer"
      ) {
        // atjauno statusu uz 'Sold' jeb pārdots automašīnu reģistrā
        const selectedVehicle = selectedRowForEdit.vehicle;
        updateVehicleStatus(selectedVehicle, "Sold");
      }
    }
  };

  //filteredSalesRowData nepieciešams, kad iestata datuma periodu
  const [filteredSalesRowData, setFilteredSalesRowData] = useState(salesRowData);
  const [downloadDisabled, setDownloadDisabled] = useState(true);

  //useState mainīgie priekš datuma perioda (RangePicker)
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  //Funkcija, kas nodrošina datuma perioda izvēli un tās ietekmi uz AG-Grid ierakstiem
  const handleDateRangeChange = (dates, dateStrings) => {
    setStartDate(dateStrings[0]);
    setEndDate(dateStrings[1]);

    const filteredData = salesRowData.filter((row) => {
      //Ja ierakstā ir datums
      if (row.date) {
        const date = dayjs(row.date, "YYYY-MM-DD");
        setAddDisabled(true);
        //DayJS isBetween ļauj uzzināt vai datums ietilpst norādītajā periodā (boolean)
        return date.isBetween(dateStrings[0], dateStrings[1], null, "[]");
      }
      return false;
    });

    //pārbaude "Download" pogai priekš PDF
    if (dateStrings[0] && dateStrings[1] && filteredData.length > 0) {
      setDownloadDisabled(false); // Ieslēdz pogu, ja datums ir norādīts un *tajā* ir dati
    } else {
      setDownloadDisabled(true); // Izslēdz pogu, ja datums nav norādīts vai nav datu
    }

    //pārbauda vai tika veiktas jebkādas CRUD funkcijas kamēr datuma periods ir izvēlēts
    setFilteredSalesRowData(filteredData);
    if (dates === null) {
      setAddDisabled(false);
      setFilteredSalesRowData(salesRowData);
    }
  };

  //datepicker limit
  const minDate = dayjs().subtract(1, 'month').format('YYYY-MM-DD');
  const maxDate = dayjs().format('YYYY-MM-DD');
  
  const disabledDate = (current) => {
    const currentDate = current.format('YYYY-MM-DD');
    return current && (currentDate < minDate || currentDate > maxDate);
  };

  const [selectedRowForEdit, setSelectedRowForEdit] = useState(null);

  const filteredDataWithStatus = filteredSalesRowData.filter((item) => {
    return (
      item.salestatus === "Sold - Contract received from buyer" ||
      item.salestatus === "Vehicle has been delivered to buyer"
    );
  });

  const rowCount = filteredDataWithStatus.length;
  const totalFullPrice = filteredDataWithStatus.reduce((total, item) => {
    return total + parseFloat(item.fullprice);
  }, 0);
  
  //funkcija, kas pārbauda izvēlēto rindu un attiecīgi izslēdz CRUD pogas
  const onSelectionChanged = useCallback(() => {
    //iegūst datus no izvēlētā ieraksta
    const selectedRows = gridRef.current.api.getSelectedRows();
    
    // const selectedNodes = gridRef.current.api.getSelectedNodes();

    
    const singleSelectedRow = selectedRows[0];

    const isSingleRowSelected = selectedRows.length === 1;
    const isCancelledOrDelivered =
      singleSelectedRow &&
      (singleSelectedRow.salestatus === "Canceled" ||
        singleSelectedRow.salestatus === "Vehicle has been delivered to buyer");

    setEditDisabled(!isSingleRowSelected || isCancelledOrDelivered);
    setDeleteDisabled(!isSingleRowSelected || isCancelledOrDelivered);
  }, []);

  //Funkcija nolasa datus no Localstorage par automašīnas
  const getAvailableNumberplates = () => {
    const carRowData = JSON.parse(localStorage.getItem("rowData"));
    const availableNumberplates = carRowData
      .filter((row) => row.status === "Available")
      .map((row) => row.numberplate);

    return availableNumberplates;
  };

  //funkcija nodrošina statusu / automašīnas pārdošanu atcelšanu
  const cancelSale = (isEdit = false) => {
      // Get localStorage data from the car registry
      const carRowData = JSON.parse(localStorage.getItem("rowData"));
    
      // Get selected rows from AG-Grid
      const selectedRows = gridRef.current.api.getSelectedRows();
    
      if (selectedRows.length > 0) {
        // Update car registry status to 'Available' for the selected vehicles
        const updatedCarRowData = carRowData.map((vehicle) =>
          selectedRows.some((row) => row.vehicle === vehicle.numberplate)
            ? { ...vehicle, status: "Available" }
            : vehicle
        );
    
        // Update localStorage with the new car registry data
        localStorage.setItem("rowData", JSON.stringify(updatedCarRowData));
    
        // Update sale status to 'Canceled' for selected sales in the filtered data
        const updatedData = salesRowData.map((row) =>
          selectedRows.includes(row)
            ? { ...row, salestatus: "Canceled" }
            : row
        );
    
        // Update AG-Grid tables with new data
        setsalesRowData(updatedData);
    
        // If the exclusion filter is active, update filtered data as well
        if (excludeSoldAndCanceled) {
          const filteredData = updatedData.filter(
            (row) =>
              !(
                row.salestatus === "Sold - Contract received from buyer" ||
                row.salestatus === "Vehicle has been delivered to buyer" ||
                row.salestatus === "Canceled"
              )
          );
          setFilteredSalesRowData(filteredData);
          setDownloadDisabled(filteredData.length === 0);
        } else {
          // If the exclusion filter is not active, update filtered data with all sales
          setFilteredSalesRowData(updatedData);
          setDownloadDisabled(updatedData.length === 0);
        }
    
        // Display success message for sale cancellation
        messageApi.open({
          type: "warning",
          content: "Sale has been canceled!",
        });
    
        // Close modal if sale cancellation is done through editing modal
        if (isEdit) {
          setIsModalOpen3(false);
        }
      }
  };

  //funkcija, kas ļauj rediģēt ierakstu caur dubult-klikšķa uz rindas
  const onRowDoubleClicked = (event) => {
    const selectedRows = gridRef.current.api.getSelectedRows();

    //Rediģēšana ir izslēgta, ja statuss ir atcelts vai automašīna ir pārdota un jau nogādāta pircējam
    if (
      event.data.salestatus !== "Canceled" &&
      event.data.salestatus !== "Vehicle has been delivered to buyer"
    ) {
      setIsModalOpen3(true);
      setSelectedRowForEdit(event.data);

      setEditData(selectedRows[0]);
      handleEdit();
    }
  };

  //Noklusējuma PVN procentu formas validācija
  const onDefaultVATFinish = () => {
    defaultVATForm
      .validateFields()
      .then(() => {
        handleDefaultVAT();
      })
      .catch((error) => {
        console.error("Validation form error:", error);
      });
  };

  //Ierakstu pievienošanas formas validācija
  const onFormFinish = () => {
    //Ja forma / modals tiek aizvērts, tad pogas tiek izslēgtas
    setEditDisabled(true);
    setDeleteDisabled(true);
    addForm
      .validateFields()
      .then(() => {
        handleFormSubmit();
      })
      .catch((error) => {
        console.error("Validation form error:", error);
      });
  };

  //Rediģēšanas formas validācija
  const onEditFinish = () => {
    //Ja forma / modals tiek aizvērts, tad pogas tiek izslēgtas
    setEditDisabled(true);
    setDeleteDisabled(true);
    editForm
      .validateFields()
      .then(() => {
        handleEditSubmit();
      })
      .catch((error) => {
        console.error("Validation edit error:", error);
      });
  };

  //funkcija priekš Form saglabāšanas, kad rediģē ierakstu
  const handleEditSubmit = () => {
    if (selectedRowForEdit && editData) {
      const dateValue = editData.date;
      // Remove leading and trailing whitespaces from the "Appraiser" field in editData
      editData.appraiser = editData.appraiser.trim();

      // Check if "Appraiser" field is empty after removing whitespaces
      if (editData.appraiser === "") {
        messageApi.open({
          type: "error",
          content:
            "Appraiser field is required and cannot be empty or contain only whitespaces.",
        });
        return; // Don't proceed with the edit submission
      }

      let updatedFullPrice = editData.fullprice;

      if (editData.salestatus === "Buyer has received a sales contract") {
        const today = dayjs().format("YYYY-MM-DD");
        editData.date = today;
      } else if (editData.salestatus === "Car sale has completed") {
        updatedFullPrice = (editData.netoprice * (100 + editData.vatrate)) / 100;
      }

      if (selectedRowForEdit.vehicle !== editData.vehicle) {
        // Update the current vehicle to 'Available' in the car registry
        updateVehicleStatus(selectedRowForEdit.vehicle, "Available");

        // Update the new vehicle to 'Reserved' in the car registry
        updateVehicleStatus(editData.vehicle, "Reserved");
      }

      const updatedData = salesRowData.map((row) =>
        row === selectedRowForEdit
          ? { ...row, ...editData, fullprice: updatedFullPrice, date: dateValue }
          : row
      );

      setsalesRowData(updatedData);

      // IF pārbaude, ja lietotājs ir izvēlējies datuma periodu
      if (startDate && endDate) {
        //Filtrē datus attiecīgi pret datuma periodu
        const filteredData = updatedData.filter((row) => {
          if (row.date) {
            const date = dayjs(row.date, "YYYY-MM-DD");
            return date.isBetween(startDate, endDate, null, "[]");
          }
          return false;
        });

        //Atjaunina jaunus filtrētus datus
        setFilteredSalesRowData(filteredData);
      } else {
        //Ja datuma periods nav noteikts, tad atjaunina filtrētos datus ar *visiem* datiem
        setFilteredSalesRowData(salesRowData);
      }

      setIsModalOpen3(false);
      // editForm.resetFields();
    }
  };

  //Nepieciešamie UseState priekš Edit ievades laukiem un Timeline
  const [isVehicleSelectionDisabled, setIsVehicleSelectionDisabled] = useState(false);
  const [isNetoInputDisabled, setIsNetoInputDisabled] = useState(false);
  const [isDateInputDisabled, setIsDateInputDisabled] = useState(false);
  const [timelineColor, setTimelineColor] = useState("gray");

  const handleEdit = () => {
    //iegūst datus mainīgā, pielietojot AG-Grid API
    const selectedRows = gridRef.current.api.getSelectedRows();

    const timelineColors = () => {
      const selectedIndex = allStatuses.indexOf(selectedRows[0].salestatus);

      for (let i = 0; i < timelineChildren.length; i++) {
        if (selectedIndex >= i) {
          timelineChildren[i] = {
            children: timelineChildren[i].children,
            color: "#6E6EE8",
          };
          setTimelineColor();
        } else {
          timelineChildren[i] = {
            children: timelineChildren[i].children,
            color: "gray",
          };
          setTimelineColor();
        }
      }
      return timelineChildren;
    };

    //palaiž izveidoto funkciju, lai rādītu krāsas no Antd Timeline komponentes
    setTimelineColor(timelineColors());

    const selectedSale = selectedRows[0];
    setEditData(selectedRows[0]);

    //UseState mainīgie, kuri sastāv no IF sazarojumiem, lai kontrolētu disabled prop priekš Button
    setIsVehicleSelectionDisabled(selectedSale.salestatus !== "New request received");
    setIsNetoInputDisabled(selectedSale.salestatus !== "Received a rating");
    setIsDateInputDisabled(selectedSale.salestatus !== "Buyer has received a sales contract");

    setAvailableStatuses(updateAvailableStatuses(selectedRows[0].salestatus));
    setIsModalOpen3(true);
  };

  //ja localstorage atribūts ir null vai 0 vai NaN, tad pēc noklusējuma pārveidos ciparu uz 21
  useEffect(() => {
    if (
      isNaN(defaultVATData) ||
      defaultVATData === null ||
      defaultVATData === 0
    ) {
      // Set defaultVAT to 21
      localStorage.setItem("defaultVAT", "21");
      setDefaultVATRate(21);
    }
  }, [defaultVATData]);

  const handleInputChange = (field, value) => {
    setEditData({ ...editData, [field]: value });
  };

  const [excludeSoldAndCanceled, setExcludeSoldAndCanceled] = useState(false);

  const handleExcludeSoldAndCanceled = () => {
    setExcludeSoldAndCanceled(!excludeSoldAndCanceled);
  };

  useEffect(() => {
    const updateFilteredData = () => {
      let updatedData = salesRowData;

      if (excludeSoldAndCanceled) {
        updatedData = updatedData.filter(
          (row) =>
            !(
              row.salestatus === "Sold - Contract received from buyer" ||
              row.salestatus === "Vehicle has been delivered to buyer" ||
              row.salestatus === "Canceled"
            )
        );
      }

      if (startDate && endDate) {
        const filteredData = updatedData.filter((row) => {
          if (row.date) {
            const date = dayjs(row.date, "YYYY-MM-DD");
            return date.isBetween(startDate, endDate, null, "[]");
          }
          return false;
        });

        setDownloadDisabled(filteredData.length === 0);
        setFilteredSalesRowData(filteredData);
      } else {
        setDownloadDisabled(updatedData.length === 0);
        setFilteredSalesRowData(updatedData);
      }
    };

    updateFilteredData();
  }, [excludeSoldAndCanceled, salesRowData, startDate, endDate]);

  useEffect(() => {
    if (editData) {
      editForm.setFieldsValue({
        neto: editData.netoprice,
        appraiser: editData.appraiser,
        vatrate: editData.vatrate,
        date: editData.date ? dayjs(editData.date, "YYYY-MM-DD") : '',
      });
    }
  }, [editData, editForm]);
  
  
  return (
    <>
      <Navbar />
      {contextHolder}

      <div style={{ display: "flex", justifyContent: "flex-start" }}>
        <ButtonGroup>
          <Tooltip
            title="Set your default VAT rate here!"
            color="rgb(64,150,255)"
            placement="topRight"
          >
            <Button
              icon={<SettingOutlined />}
              onClick={() => setIsModalOpen1(true)}
            ></Button>
          </Tooltip>

          <Modal
            title="VAT value"
            keyboard={false}
            maskClosable={false}
            open={isModalOpen1}
            onOk={onDefaultVATFinish}
            okText="Set"
            cancelText="Quit"
            onCancel={() => setIsModalOpen1(false)}
          >
            <Form
              form={defaultVATForm}
              initialValues={{ defaultVAT: defaultVATData }}
            >
              <Form.Item
                label="Default VAT rate:"
                name="defaultVAT"
                rules={[
                  {
                    required: true,
                    message: "Please input a valid default VAT rate!",
                  },
                ]}
              >
                <InputNumber
                  className="inputNumberWidth"
                  type="number"
                  controls={false}
                  min={0}
                  max={100}
                  maxLength={4}
                  suffix="%"
                  value={defaultVATRate}
                  onChange={(value) => setDefaultVATRate(value)}
                  formatter={(value) => value.replace(/\.\d*/, "")} // Remove decimal parts
                />
              </Form.Item>
            </Form>
          </Modal>

          <Button
            icon={<InsertRowBelowOutlined />}
            onClick={() => setIsModalOpen2(true)}
            disabled={addDisabled}
          >
            Add
          </Button>

          <Modal
            width={600}
            title="Add Sale"
            keyboard={false}
            maskClosable={false}
            open={isModalOpen2}
            onOk={onFormFinish}
            okText="Add"
            onCancel={() => {
              addForm.resetFields();
              setIsModalOpen2(false);
            }}
            cancelText="Quit"
          >
            <div style={{ display: "flex", gap: "130px" }}>
              <Form
                form={addForm}
                className="form"
                layout="vertical"
                name="addForm"
              >
                <div style={{ width: 210 }}>
                  <Form.Item
                    label="Vehicle"
                    name="vehicle"
                    rules={[
                      {
                        required: true,
                        message: "Please select vehicle!",
                      },
                    ]}
                  >
                    <Select
                      showSearch
                      optionFilterProp="children"
                      filterOption={filterOption}
                      onChange={(value) => {
                        setsalesFormData({ ...salesFormData, vehicle: value });
                      }}
                      options={getAvailableNumberplates().map(
                        (numberplate) => ({
                          value: numberplate,
                          label: numberplate,
                        })
                      )}
                    />
                  </Form.Item>
                  <Form.Item
                    label="Appraiser"
                    name="appraiser"
                    rules={[
                      {
                        required: true,
                        message: "Please input appraiser!",
                      },
                    ]}
                  >
                    <Input
                      maxLength={80}
                      onChange={(e) => {
                        setsalesFormData({
                          ...salesFormData,
                          appraiser: e.target.value,
                        });
                      }}
                    />
                  </Form.Item>
                </div>
              </Form>

              <Timeline items={timelineChildren}></Timeline>
            </div>
          </Modal>

          <Button
            icon={<EditOutlined />}
            disabled={editDisabled}
            onClick={handleEdit}
          >
            Edit
          </Button>

          <Popconfirm
            title="Cancel sale"
            description="Are you sure you want to cancel car sale?"
            okText="Yes"
            cancelText="No"
            onConfirm={cancelSale}
          >
            <Button danger disabled={deleteDisabled}>
              Cancel Sale
            </Button>
          </Popconfirm>

          <Modal
            width={750}
            keyboard={false}
            maskClosable={false}
            title="Edit Sale"
            open={isModalOpen3}
            okText={"Save"}
            cancelText={"Quit"}
            onOk={onEditFinish}
            onCancel={() => {
              setIsModalOpen3(false);
            }}
            footer={(_, { OkBtn, CancelBtn }) => (
              <>
                <Popconfirm
                  title="Cancel sale"
                  description="Are you sure you want to cancel car sale?"
                  okText="Yes"
                  cancelText="No"
                  onConfirm={() => cancelSale(true)}
                >
                  <Button danger disabled={deleteDisabled}>
                    Cancel Sale
                  </Button>
                </Popconfirm>
                <CancelBtn />
                <OkBtn disabled />
              </>
            )}
          >
            <div style={{ display: "flex", gap: "160px" }}>
              <Form
                form={editForm}
                className="form"
                layout="vertical"
                // initialValues={{
                //   neto: editData.netoprice,
                //   appraiser: editData.appraiser,
                //   vatrate: editData.vatrate,
                //   date: dayjs(editData.date, "YYYY-MM-DD"),
                // }}
                name="editForm"
              >

                <div style={{ width: 280 }}>
                  <Form.Item label="Vehicle">
                    <Select
                      value={editData.vehicle}
                      showSearch
                      optionFilterProp="children"
                      filterOption={filterOption}
                      onChange={(value) => {
                        handleInputChange("vehicle", value);
                        // setEditData({ ...editData, vehicle: value });
                      }}
                      options={getAvailableNumberplates().map(
                        (numberplate) => ({
                          value: numberplate,
                          label: numberplate,
                        })
                      )}
                      disabled={isVehicleSelectionDisabled}
                    />
                  </Form.Item>

                  <Form.Item label="Status">
                    <Select
                      value={editData.salestatus} // Pašreizējais statuss, kad rediģē
                      onChange={(value) => {
                        handleStatusChange(value);
                      }}
                    >
                      {availableStatuses.map((status) => (
                        <Select.Option key={status} value={status}>
                          {status}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>

                  <Form.Item
                    label="Appraiser"
                    name="appraiser"
                    rules={[
                      {
                        required: true,
                        message: "Please input appraiser!",
                      },
                    ]}
                  >
                    <Input
                      maxLength={80}
                      value={editData.appraiser}
                      onChange={(e) => {
                        handleInputChange("appraiser", e.target.value);
                        // setEditData({ ...editData, appraiser: e.target.value });
                      }}
                    />
                  </Form.Item>

                  <Form.Item
                    label="Neto"
                    name="neto"
                    rules={[
                      {
                        required: !isNetoInputDisabled,
                        message: "Please input neto!",
                      },
                    ]}
                  >
                    <InputNumber
                      className="inputNumberWidth"
                      controls={false}
                      type="number"
                      prefix="€"
                      max={100000000}
                      min={50}
                      value={editData.netoprice}
                      onChange={(value) => {
                        handleInputChange("netoprice", value);
                        // setEditData({ ...editData, netoprice: value });
                      }}
                      disabled={isNetoInputDisabled}
                    />
                  </Form.Item>

                  <Form.Item
                    label="VAT Rate"
                    name="vatrate"
                    rules={[
                      {
                        required: true,
                        message: "Please input VAT rate!",
                      },
                    ]}
                  >
                    <InputNumber
                      className="inputNumberWidth"
                      disabled={isNetoInputDisabled}
                      max={100}
                      controls={false}
                      precision={1}
                      suffix="%"
                      type="number"
                      value={editData.vatrate}
                      onChange={(value) => {
                        handleInputChange("vatrate", value);
                        // setEditData({ ...editData, vatrate: value });
                      }}
                    />
                  </Form.Item>

                  <Form.Item label="Date" name="date">
                    <DatePicker
                      className="inputNumberWidth"
                      placeholder=""
                      value={ editData ? dayjs(editData.date, "YYYY-MM-DD") : null }
                      onChange={(date) => {
                        handleInputChange("date", date ? date.format("YYYY-MM-DD") : null);
                      }}
                      disabledDate={disabledDate}
                      disabled={isDateInputDisabled}
                    />
                  </Form.Item>
                </div>
              </Form>

              <div style={{ display: "flex", alignItems: "center" }}>
                <Timeline items={timelineColor}></Timeline>
              </div>
            </div>
          </Modal>

          <RangePicker
            style={{ borderRadius: 0 }}
            onChange={handleDateRangeChange}
          />
          <Button disabled={downloadDisabled}>
            <PDFDownloadLink
              document={
                <PdfDocument
                  data={filteredDataWithStatus}
                  startDate={startDate}
                  endDate={endDate}
                  rowCount={rowCount}
                  totalFullPrice={totalFullPrice}
                />
              }
              fileName="sales_data.pdf"
            >
              {({ loading }) => (loading ? "Download" : "Download")}
            </PDFDownloadLink>
          </Button>

          <Tooltip
            title="Filter out canceled and sold statuses"
            color="rgb(64,150,255)"
          >
            <Button onClick={handleExcludeSoldAndCanceled}>
              <FilterOutlined />
            </Button>
          </Tooltip>
        </ButtonGroup>
      </div>

      <div className="ag-theme-balham" style={gridStyle}>
        <AgGridReact
          ref={gridRef}
          rowData={filteredSalesRowData}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          rowSelection="single"
          pagination={true}
          paginationPageSize={50}
          onSelectionChanged={onSelectionChanged}
          animateRows={true}
          rowHeight={35}
          onRowSelected={(event) => {
            if (event.node.isSelected()) {
              setSelectedRowForEdit(event.data);
              setEditData(event.data);
            } else {
              setSelectedRowForEdit(null);
            }
          }}
          alwaysShowVerticalScroll={true}
          onRowDoubleClicked={onRowDoubleClicked}
        ></AgGridReact>
      </div>
    </>
  );
}

export default CarSalesRegistry;
