import React, { useState } from "react"
import { useStaticQuery, graphql } from "gatsby"
import { ConfigProvider, Button, Flex, Menu, Avatar, Card, Collapse, Layout, Typography, Input} from 'antd';
import FilterButton from "../components/FilterButton";

const { Meta } = Card;

const { Header, Footer, Sider, Content } = Layout;
const { Title } = Typography;
const { Search } = Input;

const siderStyle = {
  // textAlign: 'center',
  // lineHeight: '120px',
  // color: '#fff',
  backgroundColor: '#599fe6',
};

const mainContentStyle = {
  minWidth: "100%",
  padding: "24px 24px"
}

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

const FilterPanel = ({showFlag, data, onFilterClick}) => {
  if (showFlag) 
    return (
      <>
        {data.map(item => (
          <Button key={item} onClick={() => onFilterClick(item)} 
            style={{
              backgroundImage: `url(https://flagcdn.com/w80/${item.toLowerCase()}.png)`,
              backgroundRepeat: 'no-repeat',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              width: '80px',
              height: '50px'
            }}></Button>
        ))}
      </>
      )
    else
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
      styles={{
        body: {
          height: "100%",
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between', // Not sure why it has gap pn top&bottom
          padding: '10px'
        }
      }}
      >

        <Meta
          avatar={<Avatar src="https://api.dicebear.com/7.x/miniavs/svg?seed=8" />}
          title={row.node.Name}
          description={row.node.IAEA_Profession}
        />
        <Collapse ghost items={[
          {
            key: '1',
            label: 'More',
            children: <><p>Nationality: {row.node.Nationality}</p>
            <p>Pre-IAEA Experience: {row.node.Pre_IAEA_Work_Experience}</p>
            <p>Generational: {row.node.Generational}</p></>,
          }
        ]} />

      </Card>
   ))}
   </>
  )
}

const IndexPage = () => {

  const [currentTab, setCurrentTab] = useState('IAEA_Profession');
  const [filterValue, setFilterValue] = useState("");
  const onSearch = (value, _e, info) => console.log(info?.source, value);

  const handleMenuClick = (e) => {
    // console.log('click ', e);
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
              <Button key="back" onClick={() => setFilterValue("")} style={{margin: "16px 0"}}>Back</Button>
            </Content>

          )
        else
          return (

            <Content>
        
        <FilterButton data={professions} onFilterClick={handleFilterClick} />
        </Content>

            )
      case 'Nationality':
        return (
          <Flex gap="large">
            <Sider width="180" style={siderStyle}>
              <Flex gap="middle" wrap="wrap">
                <FilterPanel showFlag={true} data={uniqueNations} onFilterClick={handleFilterClick} />
              </Flex>
            </Sider>
            <Content>
              <Flex wrap="wrap" gap="middle">
                <StaffCard filterType="iso_alpha" filterValue={filterValue} data={data} />
              </Flex>
            </Content>
          </Flex>
        )

      case 'Academic':
        return (
          <Flex gap="large">
            <Sider width="250" style={siderStyle}>
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
        )
      case 'Pre_IAEA_Work_Experience':
        return (
          <Flex gap="large">
            <Sider width="200" style={siderStyle}>
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
        )
      case 'Generational':
        if (filterValue) 
          return (
            <Content>
              <Flex wrap="wrap" gap="middle">
                <StaffCard filterType={currentTab} filterValue={filterValue} data={data} />
              </Flex>
              <Button key="back" onClick={() => setFilterValue("")} style={{margin: "16px 0"}}>Back</Button>
            </Content>
          )
        else
          return (
            <Content>
              <FilterButton data={generations} onFilterClick={handleFilterClick} />
            </Content>
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
            iso_alpha
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

  const nations = data.map(row => row.node.iso_alpha);
  const uniqueNations = Array.from(new Set(nations));

  const academic = data.map(row => row.node.Academic);
  const uniqueAcademic = Array.from(new Set(academic));

  const workExperience = data.map(row => row.node.Pre_IAEA_Work_Experience);
  const uniqueWorkExperience = Array.from(new Set(workExperience));

  return (
    <div style={{padding: "36px 12px"}}>
      <ConfigProvider
      theme={{
        token: {
          fontSize: 16
        },
        components: {
          Layout: {
            bodyBg: '#599fe6',
          },
          Menu: {
            horizontalItemHoverColor: '#ffffff',
            horizontalItemSelectedColor: '#ffffff', 
            itemHoverColor: '#ffffff',
            itemBg: '#599fe6'
          },
          Collapse: {
            headerPadding: "16px 0 0 0",
            contentPadding: "0"
          }
        },
      }}
    >
      <Title style={{paddingLeft: "12px"}}>Department of Safeguards Dashboard</Title>
      <Flex justify="space-between">
        <Menu onClick={handleMenuClick} selectedKeys={[currentTab]} mode="horizontal" items={tabItems} style={{ minWidth: 0, flex: "auto" }}/>
        <Search placeholder="input search text" onSearch={onSearch} style={{ width: 200, marginRight: 30 }} />
      </Flex>
        <Layout style={mainContentStyle}>
        {renderContent()}
        </Layout>
      </ConfigProvider>

    
      </div>
  )
}

export default IndexPage

export const Head = () => <title>Home Page</title>
