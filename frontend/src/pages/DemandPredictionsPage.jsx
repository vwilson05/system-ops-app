import React from "react";
import { Table, Card, Typography, Button} from "antd";
import { useFilters } from "../context/FilterContext";
import { useNavigate } from "react-router-dom";

const { Title, Paragraph } = Typography;

// Hard-coded fake demand events dataset (3 events per region)
const fakeDemandEvents = [
  // North region (region_id: 1)
  {
    id: 1,
    region_id: 1,
    region: "North",
    event: "North Concert",
    description: "A major concert in the North, expected increase in beverage demand.",
    recommended_action: "Order more beverages",
  },
  {
    id: 2,
    region_id: 1,
    region: "North",
    event: "North Sports Event",
    description: "A sports event in the North, high demand for snacks.",
    recommended_action: "Order more snacks",
  },
  {
    id: 3,
    region_id: 1,
    region: "North",
    event: "North Festival",
    description: "A festival in the North, check price adjustments on produce.",
    recommended_action: "Check price adjustments on produce",
  },
  // South region (region_id: 2)
  {
    id: 4,
    region_id: 1,
    region: "South",
    event: "South Concert",
    description: "Concert in the South, expected high demand for drinks.",
    recommended_action: "Order more drinks",
  },
  {
    id: 5,
    region_id: 2,
    region: "South",
    event: "South Sports Event",
    description: "Sports event in the South, require extra snacks.",
    recommended_action: "Order more snacks",
  },
  {
    id: 6,
    region_id: 2,
    region: "South",
    event: "South Festival",
    description: "Festival in the South, monitor inventory for beverages.",
    recommended_action: "Monitor inventory for beverages",
  },
  // East region (region_id: 3)
  {
    id: 7,
    region_id: 3,
    region: "East",
    event: "East Concert",
    description: "Concert in the East, increased demand for beverages.",
    recommended_action: "Order more beverages",
  },
  {
    id: 8,
    region_id: 3,
    region: "East",
    event: "East Sports Event",
    description: "Sports event in the East, check price adjustments for snacks.",
    recommended_action: "Check price adjustments on snacks",
  },
  {
    id: 9,
    region_id: 3,
    region: "East",
    event: "East Festival",
    description: "Festival in the East, monitor inventory for fresh produce.",
    recommended_action: "Monitor inventory for produce",
  },
  // West region (region_id: 4)
  {
    id: 10,
    region_id: 4,
    region: "West",
    event: "West Concert",
    description: "Concert in the West, expected surge in drink orders.",
    recommended_action: "Order more drinks",
  },
  {
    id: 11,
    region_id: 4,
    region: "West",
    event: "West Sports Event",
    description: "Sports event in the West, require extra snack supplies.",
    recommended_action: "Order more snacks",
  },
  {
    id: 12,
    region_id: 4,
    region: "West",
    event: "West Festival",
    description: "Festival in the West, check price adjustments on regional items.",
    recommended_action: "Check price adjustments on regional items",
  },
];

const DemandPredictionPage = () => {
  const { selectedRegion } = useFilters();
  const navigate = useNavigate();

  // Filter the fake events based on the selected region (if any)
  const filteredEvents = selectedRegion
    ? fakeDemandEvents.filter(
        (event) => event.region_id === Number(selectedRegion)
      )
    : fakeDemandEvents;

  // Define table columns with a new "Region" column and "Take Action" column.
  const columns = [
    {
      title: "Region",
      dataIndex: "region",
      key: "region",
    },
    {
      title: "Event",
      dataIndex: "event",
      key: "event",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Recommended Action",
      dataIndex: "recommended_action",
      key: "recommended_action",
    },
    {
      title: "Take Action",
      key: "action",
      render: (_, record) => {
        // Determine the destination and button label based on the recommended action.
        const actionText = record.recommended_action.toLowerCase();
        let buttonLabel = "";
        let destination = "/";
        if (actionText.includes("order")) {
          buttonLabel = "Order More";
          destination = "/orders";
        } else if (actionText.includes("monitor")) {
          buttonLabel = "Monitor Inventory";
          destination = "/inventory";
        } else if (actionText.includes("check price")) {
          buttonLabel = "Check Pricing";
          destination = "/pricing-adjustments";
        } else {
          buttonLabel = "Take Action";
        }
        return (
          <Button type="primary" onClick={() => navigate(destination)}>
            {buttonLabel}
          </Button>
        );
      },
    },
  ];

  return (
    <div style={{ padding: "20px" }}>
      <Card>
        <Title level={3}>Demand Prediction & Recommendations</Title>
        <Paragraph>
          These recommendations are based on upcoming events and external data.
          {selectedRegion && ` (Filtered for Region ${selectedRegion})`}
        </Paragraph>
        {filteredEvents.length > 0 ? (
          <Table
            dataSource={filteredEvents.map((item) => ({ ...item, key: item.id }))}
            columns={columns}
            pagination={{ pageSize: 5 }}
          />
        ) : (
          <Paragraph>No demand events for the selected region.</Paragraph>
        )}
      </Card>
    </div>
  );
};

export default DemandPredictionPage;
