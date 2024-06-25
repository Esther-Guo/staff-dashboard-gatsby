import React, { useState, useEffect } from "react"
import { useStaticQuery, graphql } from "gatsby"
import * as JsSearch from 'js-search';
import { ConfigProvider, Avatar, Button, Flex, Menu, Card, Collapse, Layout, Space, Typography, Modal, Input} from 'antd';
import FilterButton from "../components/FilterButton";
import loadCSV from '../utils/loadCSV';
import {VideoCameraTwoTone} from "@ant-design/icons"
import ReactPlayer from 'react-player'

const { Meta } = Card;

const { Header, Footer, Sider, Content } = Layout;
const { Text, Title } = Typography;
const { Search } = Input;

const siderStyle = {
  // textAlign: 'center',
  // lineHeight: '120px',
  // color: '#fff',
  backgroundColor: '#599fe6'
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

const FilterPanel = ({showFlag, data, filterValue, onFilterClick}) => {
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
              height: '50px',
              border: filterValue === item ? '3px solid #E76F00' : '',
            }}></Button>
        ))}
      </>
      )
    else
    return (
      <>
        {data.map(item => (

          <Button key={item} type={filterValue === item ? 'primary' : 'default'} onClick={() => onFilterClick(item)}
            
          >{item}</Button>
        ))}
      </>
      )
}

const StaffCard = ({ filterType, filterValue, data }) => {
  const filtered = data.filter(item => !filterValue || item.node[filterType] === filterValue)
  
  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

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
          alignItems: 'center',
          // justifyContent: 'space-between', // Not sure why it has gap pn top&bottom
          padding: '10px'
        }
      }}
      >

        <Modal 
          open={isModalOpen} 
          onCancel={handleCancel} 
          footer={null} 
          mask={false}
          centered={true}
          width={750}
        >
          {/* https://github.com/CookPete/react-player */}
          <ReactPlayer 
            url={row.node.Video}
            controls={true}
          />
        </Modal>

        <Avatar src={row.node.PFP} size={70} style={{marginBottom: "4px"}}/>
        <Title level={4}>{row.node.Name} <VideoCameraTwoTone style={{fontSize: '16px', color: ''}} onClick={showModal}/></Title>
        <Text italic>{row.node.IAEA_Profession}</Text>
        <Text>Nationality: {row.node.Nationality}</Text>
        <Text>Pre-IAEA Experience: {row.node.Pre_IAEA_Work_Experience}</Text>
        <Text>Generational: {row.node.Generational}</Text>

        {/* <Collapse ghost items={[
          {
            key: '1',
            label: 'More',
            children: <><p>Nationality: {row.node.Nationality}</p>
            <p>Pre-IAEA Experience: {row.node.Pre_IAEA_Work_Experience}</p>
            <p>Generational: {row.node.Generational}</p></>,
          }
        ]} /> */}

      </Card>
   ))}
   </>
  )
}

const SearchResultCard = ({data}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      {data.map(staff => (
        <Card
        style={{
          width: 300,
        }}
        styles={{
          body: {
            height: "100%",
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            // justifyContent: 'space-between', // Not sure why it has gap pn top&bottom
            padding: '10px'
          }
        }}
        >
          <Modal 
            open={isModalOpen} 
            onCancel={handleCancel} 
            footer={null} 
            mask={false}
            centered={true}
            width={750}
          >
            {/* https://github.com/CookPete/react-player */}
            <ReactPlayer 
              url={staff.Video}
              controls={true}
            />
          </Modal>

          <Avatar src={staff.PFP} size={70} style={{marginBottom: "4px"}}/>
          <Title level={4}>{staff.Name} <VideoCameraTwoTone style={{fontSize: '16px', color: ''}} onClick={showModal}/></Title>
          <Text italic>{staff["IAEA Profession"]}</Text>
          <Text>Nationality: {staff.Nationality}</Text>
          <Text>Pre-IAEA Experience: {staff["Pre-IAEA Work Experience"]}</Text>
          <Text>Generational: {staff.Generational}</Text>
          {/* <Meta
            avatar={<Avatar src="https://api.dicebear.com/7.x/miniavs/svg?seed=8" />}
            title={staff.Name}
            description={staff["IAEA Profession"]}
          />
          <Collapse ghost items={[
            {
              key: '1',
              label: 'More',
              children: <><p>Nationality: {staff.Nationality}</p>
              <p>Pre-IAEA Experience: {staff["Pre-IAEA Work Experience"]}</p>
              <p>Generational: {staff.Generational}</p></>,
            }
          ]} /> */}

        </Card>
    ))}
    </>
  )
}

const IndexPage = () => {

  const [currentTab, setCurrentTab] = useState('IAEA_Profession');
  const [filterValue, setFilterValue] = useState("");
  const [search, setSearch] = useState();
  const [searchVal, setSearchVal] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    async function setupSearch() {
      const staff = await loadCSV('staff-info.csv');
      const search = new JsSearch.Search('Staff ID');
      
      search.addIndex('Name');
      search.addIndex('Nationality');
      search.addIndex('IAEA Profession');
      search.addIndex('Academic');
      search.addIndex('Pre-IAEA Work Experience');
      search.addIndex('Generational');

      search.addDocuments(staff);
      setSearch(search);
    }

    setupSearch();
  }, []);

  const handleSearch = (value, _e, info) => {
    // console.log(info?.source, value);
    if (search) {
      const results = search.search(value);
      // console.log(results)
      setSearchResults(results);
      setCurrentTab("");
      setSearchVal(value);
      
    }
  }

  const handleMenuClick = (e) => {
    // console.log('click ', e);
    setCurrentTab(e.key);
    setFilterValue("");
    setSearchVal("");
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
                <Text>CATEGORY</Text>
                <Text style={{display: "block", fontSize: 20, fontWeight: "bold", marginBottom: "20px", marginLeft: "30px"}}>{filterValue}</Text>
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
                <FilterPanel showFlag={true} data={uniqueNations} filterValue={filterValue} onFilterClick={handleFilterClick} />
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
                <FilterPanel data={uniqueAcademic} filterValue={filterValue} onFilterClick={handleFilterClick} />
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
                <FilterPanel data={uniqueWorkExperience} filterValue={filterValue} onFilterClick={handleFilterClick} />
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
               <Text>CATEGORY</Text>
                <Text style={{display: "block", fontSize: 20, fontWeight: "bold", marginBottom: "20px", marginLeft: "30px"}}>{filterValue}</Text>
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
        if (searchResults) {
            return (
              <Content>
                <Title level={4}>Search result for: {searchVal}</Title>
                <Flex wrap="wrap" gap="middle">
                  <SearchResultCard data={searchResults} />
                </Flex>
                {/* <Button key="back" onClick={() => setFilterValue("")} style={{margin: "16px 0"}}>Back</Button> */}
              </Content>
            )
          }
        else
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
            Generational,
            PFP,
            Video
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
            itemBg: '#599fe6',
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
        <Menu onClick={handleMenuClick} selectedKeys={[currentTab]} mode="horizontal" items={tabItems} style={{ minWidth: 0, flex: "auto", fontWeight: "bold", fontSize: 18 }}/> 
        <Search placeholder="" onSearch={handleSearch} style={{ width: 200, marginRight: 30 }} />
      </Flex>
        <Layout style={mainContentStyle}>
        {renderContent()}
        </Layout>
      </ConfigProvider>

    
      </div>
  )
}

export default IndexPage

export const Head = () => <title>Dashboard</title>
