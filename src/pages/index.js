import React, { useState } from "react"
import { useStaticQuery, graphql } from "gatsby"
import { ConfigProvider, Button, Flex, Menu, Avatar, Card, Collapse, Layout} from 'antd';
import FilterButton from "../components/FilterButton";

const { Meta } = Card;

const { Header, Footer, Sider, Content } = Layout;

const text = `
  A dog is a type of domesticated animal.
  Known for its loyalty and faithfulness,
  it can be found as a welcome guest in many households across the world.
`;
const items = [
  {
    key: '1',
    label: 'This is panel header 1',
    children: <p>{text}</p>,
  },
  
];

const tabItems = [
  {
    label: 'IAEA Profession',
    key: 'IAEA_Profession',
  },
  {
    label: 'Nationality',
    key: 'Nationality',
  },
  {
    label: 'Academic',
    key: 'Academic',
  },
  {
    label: 'Pre-IAEA Work Experience',
    key: 'Pre_IAEA_Work_Experience',
  },
  {
    label: 'Generational',
    key: 'Generational',
  },
];

const FilterPanel = ({data, onFilterClick}) => {
  return (
    <>
      {data.map(item => (
        <Button key={item} onClick={() => onFilterClick(item)}>{item}</Button>
      ))}
    </>
    )
}

const StaffCard = ({ filterType, filterValue, data }) => {
  const filtered = data.filter(item => !filterValue || item.node[filterType] === filterValue)
  return (
    <>
    {filtered.map(row => (
      <Card
      style={{
        width: 300,
      }}
      >
        <Meta
          avatar={<Avatar src="https://api.dicebear.com/7.x/miniavs/svg?seed=8" />}
          title={row.node.Name}
          description={row.node.IAEA_Profession}
        />
        <Collapse ghost items={items} />
      </Card>
   ))}
   </>
  )
}

const IndexPage = () => {

  const [currentTab, setCurrentTab] = useState('IAEA_Profession');
  const [filterValue, setFilterValue] = useState("");
  // const [selectedProfession, setSelectedProfession] = useState("");

  const handleMenuClick = (e) => {
    console.log('click ', e);
    setCurrentTab(e.key);
    setFilterValue("");
  };

  const handleFilterClick = (value) => {
    setFilterValue(value);
  }

  const renderContent = () => {
    switch (currentTab) {
      case 'IAEA_Profession':
        if (filterValue) 
          return (
            <Content>
            <Flex wrap="wrap" gap="middle">
              <StaffCard filterType={currentTab} filterValue={filterValue} data={data} />
            </Flex>
            <Button key="back" onClick={() => setFilterValue("")}>Back</Button>
          </Content>
          )
        else
          return (
        
        <FilterButton data={professions} onFilterClick={handleFilterClick} />
            )
      case 'Nationality':
        return (
          <Layout>
          <Flex gap="middle">
            <Sider width="25%">
              <Flex vertical gap="middle">
                <FilterPanel data={uniqueNationalities} onFilterClick={handleFilterClick} />
              </Flex>
            </Sider>
            <Content>
              <Flex wrap="wrap" gap="middle">
                <StaffCard filterType={currentTab} filterValue={filterValue} data={data} />
              </Flex>
            </Content>
          </Flex>
          </Layout>
        )

      case 'Academic':
        return (
          <Layout>
          <Flex gap="middle">
            <Sider width="25%">
              <Flex vertical gap="middle">
                <FilterPanel data={uniqueAcademic} onFilterClick={handleFilterClick} />
              </Flex>
            </Sider>
            <Content>
              <Flex wrap="wrap" gap="middle">
                <StaffCard filterType={currentTab} filterValue={filterValue} data={data} />
              </Flex>
            </Content>
          </Flex>
          </Layout>
        )
      case 'Pre_IAEA_Work_Experience':
        return (
          <Layout>
          <Flex gap="middle">
            <Sider width="25%">
              <Flex vertical gap="middle">
                <FilterPanel data={uniqueWorkExperience} onFilterClick={handleFilterClick} />
              </Flex>
            </Sider>
            <Content>
              <Flex wrap="wrap" gap="middle">
                <StaffCard filterType={currentTab} filterValue={filterValue} data={data} />
              </Flex>
            </Content>
          </Flex>
          </Layout>
        )
      case 'Generational':
        if (filterValue) 
          return (
            <Content>
            <Flex wrap="wrap" gap="middle">
              <StaffCard filterType={currentTab} filterValue={filterValue} data={data} />
            </Flex>
            <Button key="back" onClick={() => setFilterValue("")}>Back</Button>
          </Content>
          )
        else
          return (
        
        <FilterButton data={generations} onFilterClick={handleFilterClick} />
            )
      default:
        return <div>Something went wrong!</div>;
    }
  };

  const data = useStaticQuery(graphql`
    query {
      allStaffInfoCsv {
        edges {
          node {
            Staff_ID
            Name
            Gender
            IAEA_Profession
            Nationality
            Academic
            Pre_IAEA_Work_Experience
            Generational
          }
        }
      }
    }
  `).allStaffInfoCsv.edges;

  const professions = data.map(row => row.node.IAEA_Profession);

  const generations = data.map(row => row.node.Generational);

  const nationalities = data.map(row => row.node.Nationality);
  const uniqueNationalities = Array.from(new Set(nationalities));

  const academic = data.map(row => row.node.Academic);
  const uniqueAcademic = Array.from(new Set(academic));

  const workExperience = data.map(row => row.node.Pre_IAEA_Work_Experience);
  const uniqueWorkExperience = Array.from(new Set(workExperience));

  return (
    <Layout>
      <ConfigProvider
      theme={{
        components: {
          Layout: {
            bodyBg: '#599fe6',
            siderBg: '#599fe6'
          },
          Menu: {
            horizontalItemHoverColor: '#ffffff',
            horizontalItemSelectedColor: '#ffffff', 
            itemBg: '#599fe6'
          },
        },
      }}
    >
      {/* <Header> */}
        <Menu onClick={handleMenuClick} selectedKeys={[currentTab]} mode="horizontal" items={tabItems} />
      {/* </Header> */}

      {renderContent()}
      </ConfigProvider>

    
      
    </Layout>
  )
}

export default IndexPage

export const Head = () => <title>Home Page</title>
