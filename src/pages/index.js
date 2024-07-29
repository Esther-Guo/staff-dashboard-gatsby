import React, { useState, useEffect } from "react"
import { useStaticQuery, graphql } from "gatsby"
import * as JsSearch from 'js-search';
import { ConfigProvider, Avatar, Button, Flex, Menu, Card, Collapse, Layout, Space, Typography, Modal, Input} from 'antd';
import FilterButton from "../components/FilterButton";
import loadCSV from '../utils/loadCSV';
import {VideoCameraTwoTone, LinkedinOutlined} from "@ant-design/icons"
import ReactPlayer from 'react-player'
import { motion, AnimatePresence } from "framer-motion";

const { Meta } = Card;

const { Header, Footer, Sider, Content } = Layout;
const { Text, Title } = Typography;
const { Search } = Input;

const pageStyles = {
  padding: "36px 12px",
  fontFamily: "Roboto",
}

const siderStyle = {
  // textAlign: 'center',
  // lineHeight: '120px',
  backgroundColor: '#0A4C98'
};

const mainContentStyle = {
  minWidth: "100%",
  padding: "24px 24px"
}

const tabItems = [
  {
    label: 'Current Position',
    key: 'Current_Position_Category',
  },
  {
    label: 'Nationality',
    key: 'Nationality',
  },
  {
    label: 'Academic',
    key: 'Degree',
  },
  {
    label: 'Pre-IAEA Work Experience',
    key: 'Pre_IAEA_Work_Experience_Category',
  },
  {
    label: 'Age Bracket',
    key: 'Age_Bracket',
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
          <ConfigProvider
            theme={{
              token: {
                colorPrimary: '#0069B4',
                borderRadius: 4,
                colorText: '#333233',
                colorBgContainer: '#EEF1F7',
              },
            }}
          >
          <Button key={item} type={filterValue === item ? 'primary' : 'default'} onClick={() => onFilterClick(item)}
            
          >{item}</Button>
          </ConfigProvider>
        ))}
      </>
      )
}

const StaffCard = ({ filterType, filterValue, data }) => {
  const filtered = data.filter(item => !filterValue || item.node[filterType] === filterValue)
  
  const [isModalOpen, setIsModalOpen] = useState(new Array(filtered.length).fill(false));

  const toggleModal = (idx) => {
    setIsModalOpen(prev => prev.map((item, i) => i === idx ? !item : item));
  };

  return (
    <>
    {filtered.map((row, idx) => (
      <ConfigProvider
        theme={{
          token: {
            colorText: '#333233',
            boxShadow: 'none',
          },
        }}
      > 
      <AnimatePresence mode="wait">
    <motion.div key={filterValue+idx}
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            // exit={{ y: -10, opacity: 0 }}
            transition={{ duration: 0.2 }}>
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
          padding: '10px',
        }
      }}
      >
 
        <Modal 
          open={isModalOpen[idx]} 
          onCancel={() => toggleModal(idx)}
          footer={null} 
          mask={true}
          centered={true}
          width={750}
        >
          <Flex vertical>
              <Text strong>
                Academic
              </Text>
              <Text>
                {row.node.Academic}
              </Text>
              <Text strong>
                Current Role Summary
              </Text>
              <Text>
                {row.node.Current_Role_Summary}
              </Text>
              <Text strong>
                Pre-IAEA Work Experience
              </Text>
              <Text>
                {row.node.Pre_IAEA_Work_Experience}
              </Text>
            </Flex>
          {/* https://github.com/CookPete/react-player */}
          <ReactPlayer 
            url={row.node.Video}
            controls={true}
          />
        </Modal>

        <Avatar src={row.node.PFP} size={70} style={{marginBottom: "4px"}}/>
        <Title level={4}>{row.node.Name} <VideoCameraTwoTone style={{fontSize: '16px', color: ''}} onClick={() => toggleModal(idx)}/></Title>
        <Text>{row.node.Pronouns}</Text>
        <Text italic style={{marginBottom: '4px', textAlign: 'center'}}>
          {row.node.Current_Position}
          {row.node.LinkedIN_Profile && <LinkedinOutlined style={{fontSize: '16px', color: '#0A4C98', marginLeft: '4px'}} onClick={() => window.open(`${row.node.LinkedIN_Profile}`)}/>}
        </Text>
        <Flex vertical>
          <Text>Nationality: {row.node.Nationality}</Text>
          <Text>Academic: {row.node.Degree}</Text>
          <Text>Pre-IAEA Experience: {row.node.Pre_IAEA_Work_Experience_Category}</Text>
          <Text>Age Bracket: {row.node.Age_Bracket}</Text>
        </Flex>
        {/* <Collapse ghost items={[
          {
            key: '1',
            label: 'More',
            children: <><p>Nationality: {row.node.Nationality}</p>
            <p>Pre-IAEA Experience: {row.node.Pre_IAEA_Work_Experience}</p>
            <p>Age Bracket: {row.node.Age_Bracket}</p></>,
          }
        ]} /> */}
      </Card>
   </motion.div>
   </AnimatePresence>
</ConfigProvider>  
   ))}
  </>
  )
}

const SearchResultCard = ({data}) => {

  const [isModalOpen, setIsModalOpen] = useState(new Array(data.length).fill(false));

  const toggleModal = (idx) => {
    setIsModalOpen(prev => prev.map((item, i) => i === idx ? !item : item));
  };

  return (
    <>
      {data.map((staff,idx) => (
        <ConfigProvider
          theme={{
            token: {
              colorText: '#333233',
              boxShadow: 'none',
            },
          }}
        >  
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
            padding: '10px',
            
          }
        }}
        >
          
          <Modal 
            open={isModalOpen[idx]} 
            onCancel={() => toggleModal(idx)} 
            footer={null} 
            mask={true}
            centered={true}
            width={750}
          >
            <Flex vertical>
              <Text strong>
                Academic
              </Text>
              <Text>
                {staff.Academic}
              </Text>
              <Text strong>
                Current Role Summary
              </Text>
              <Text>
                {staff["Current Role Summary"]}
              </Text>
              <Text strong>
                Pre-IAEA Work Experience
              </Text>
              <Text>
                {staff["Pre-IAEA Work Experience"]}
              </Text>
            </Flex>
            {/* https://github.com/CookPete/react-player */}
            <ReactPlayer 
              url={staff.Video}
              controls={true}
            />
          </Modal>

          <Avatar src={staff.PFP} size={70} style={{marginBottom: "4px"}}/>
          <Title level={4}>{staff.Name} <VideoCameraTwoTone style={{fontSize: '16px', color: ''}} onClick={() => toggleModal(idx)}/></Title>
          <Text>{staff.Pronouns}</Text>
          <Text italic style={{marginBottom: '4px', textAlign: 'center'}}>
            {staff["Current Position"]}
            {staff["LinkedIN Profile"] && <LinkedinOutlined style={{fontSize: '16px', color: '#0A4C98', marginLeft: '4px'}} onClick={() => window.open(staff["LinkedIN Profile"])}/>}
          </Text>
          <Flex vertical>
            <Text>Nationality: {staff.Nationality}</Text>
            <Text>Academic: {staff.Degree}</Text>
            <Text>Pre-IAEA Experience: {staff["Pre-IAEA Work Experience Category"]}</Text>
            <Text>Age Bracket: {staff["Age Bracket"]}</Text>
          </Flex>
          {/* <Meta
            avatar={<Avatar src="https://api.dicebear.com/7.x/miniavs/svg?seed=8" />}
            title={staff.Name}
            description={staff["Current Position"]}
          />
          <Collapse ghost items={[
            {
              key: '1',
              label: 'More',
              children: <><p>Nationality: {staff.Nationality}</p>
              <p>Pre-IAEA Experience: {staff["Pre-IAEA Work Experience"]}</p>
              <p>Age Bracket: {staff.Age_Bracket}</p></>,
            }
          ]} /> */}
          </Card>
        </ConfigProvider>
    ))}
    </>
  )
}

const IndexPage = () => {

  const [currentTab, setCurrentTab] = useState('Current_Position_Category');
  const [filterValue, setFilterValue] = useState("");
  const [search, setSearch] = useState();
  const [searchVal, setSearchVal] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    async function setupSearch() {
      const staff = await loadCSV('staff-info-new.csv');
      const search = new JsSearch.Search('Staff ID');
      
      search.addIndex('Name');
      search.addIndex('Nationality');
      search.addIndex('Current Position');
      search.addIndex('Academic');
      search.addIndex('Pre-IAEA Work Experience');
      search.addIndex('Age Bracket');

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
    switch (e.key) {
      case 'Nationality':
        return setFilterValue(uniqueNations[0]);
      case 'Degree':
        return setFilterValue(uniqueAcademic[0]);
      case 'Pre_IAEA_Work_Experience_Category':
        return setFilterValue(uniqueWorkExperience[0]);
      default:
        setFilterValue("");
    }
    setSearchVal("");
  };

  const handleFilterClick = (value) => {
    setFilterValue(value);
  }

  const renderContent = () => {
    switch (currentTab) {
      case 'Current_Position_Category':
        if (filterValue) 
          return (
              <Content>
                {/* <Text>CATEGORY</Text> */}
                <Text style={{display: "block", fontSize: 20, fontWeight: "bold", marginBottom: "20px", marginLeft: "30px"}}>{filterValue}</Text>
              <Flex wrap="wrap" gap="middle">
                <StaffCard filterType={currentTab} filterValue={filterValue} data={data} />
              </Flex>
              <Button key="back" onClick={() => setFilterValue("")} style={{margin: "16px 0", color: "#333233"}}>Back</Button>
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

      case 'Degree':
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
      case 'Pre_IAEA_Work_Experience_Category':
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
      case 'Age_Bracket':
        if (filterValue) 
          return (
            <Content>
               {/* <Text>CATEGORY</Text> */}
                <Text style={{display: "block", fontSize: 20, fontWeight: "bold", marginBottom: "20px", marginLeft: "30px"}}>{filterValue}</Text>
              <Flex wrap="wrap" gap="middle">
                <StaffCard filterType={currentTab} filterValue={filterValue} data={data} />
              </Flex>
              <Button key="back" onClick={() => setFilterValue("")} style={{margin: "16px 0", color: "#333233"}}>Back</Button>
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

  // Extract as component for setting the theme
  const SearchBar = () => {
    return (
      <div>
        <ConfigProvider
          theme={{
            token: {
              fontSize: 16,
              colorText: '#333233',
              
            },
          }}
        >
          <Search placeholder="" onSearch={handleSearch} style={{ width: 200, marginRight: 30 }} />
        </ConfigProvider>
      </div>
    );
  };

  const data = useStaticQuery(graphql`
    query {
      allStaffInfoNewCsv {
        edges {
          node {
            Staff_ID
            Name
            Pronouns
            LinkedIN_Profile
            Current_Position_Category
            Current_Position
            Current_Role_Summary
            Nationality
            iso_alpha
            Degree
            Academic
            Pre_IAEA_Work_Experience_Category
            Pre_IAEA_Work_Experience
            Age_Bracket
            PFP
            Video
          }
        }
      }
    }
  `).allStaffInfoNewCsv.edges;

  const professions = data.map(row => row.node.Current_Position_Category);

  const generations = data.map(row => row.node.Age_Bracket);

  const nationalities = data.map(row => row.node.Nationality);
  const uniqueNationalities = Array.from(new Set(nationalities));

  const nations = data.map(row => row.node.iso_alpha);
  const uniqueNations = Array.from(new Set(nations));

  const academic = data.map(row => row.node.Degree);
  const uniqueAcademic = Array.from(new Set(academic));

  const workExperience = data.map(row => row.node.Pre_IAEA_Work_Experience_Category);
  const uniqueWorkExperience = Array.from(new Set(workExperience));

  return (
    <div style={pageStyles}>
      <ConfigProvider
      theme={{
        token: {
          fontSize: 16,
          colorText: '#ffffff',
          // fontFamily: 'Roboto', // not working in Chrome
          // colorPrimary: '#333233'
          // colorBgContainer: '#0A4C98'
        },
        components: {
          Layout: {
            bodyBg: '#0A4C98',
          },
          Menu: {
            // horizontalItemHoverColor: '#ffffff',
            horizontalItemSelectedColor: '#ffffff', 
            // itemHoverColor: '#ffffff',
            itemBg: '#0A4C98',
            popupBg: '#0A4C98',
            // cardBg: '#0A4C98',
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
          <Menu 
            onClick={handleMenuClick} 
            selectedKeys={[currentTab]} 
            mode="horizontal" 
            items={tabItems} 
            style={{ 
              minWidth: 0, 
              flex: "auto", 
              fontWeight: "bold", 
              fontSize: 20 
            }}
          /> 
          <SearchBar />
        </Flex>
        <Layout style={mainContentStyle}>
        {renderContent()}
        </Layout>
      </ConfigProvider>

    
      </div>
  )
}

export default IndexPage

// export const Head = () => <title>Dashboard</title>
