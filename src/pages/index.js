import React, { useState, useEffect } from "react"
import { useStaticQuery, graphql } from "gatsby"
import * as JsSearch from 'js-search';
import { ConfigProvider, Avatar, Button, Flex, Menu, Card, Collapse, Layout, Space, Typography, Modal, Input, Col, Row} from 'antd';
import FilterButton from "../components/FilterButton";
import loadCSV from '../utils/loadCSV';
import Icon, {VideoCameraTwoTone, LinkedinOutlined, RightCircleOutlined, GlobalOutlined, BankOutlined, TagOutlined, TrophyOutlined,} from "@ant-design/icons"
import ReactPlayer from 'react-player'
import { motion, AnimatePresence } from "framer-motion";

const { Meta } = Card;

const { Header, Footer, Sider, Content } = Layout;
const { Text, Title } = Typography;
const { Search } = Input;

const HatSvg = () => (
  <svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="20" height="20" viewBox="0 0 20 20">
  <path fill="#000000" d="M18.658 7.026l-9-3c-0.103-0.034-0.214-0.034-0.316 0l-9 3c-0.204 0.068-0.342 0.259-0.342 0.474s0.138 0.406 0.342 0.474l2.658 0.886v2.64c0 0.133 0.053 0.26 0.146 0.354 0.088 0.088 2.194 2.146 6.354 2.146 1.513 0 2.924-0.272 4.195-0.809 0.254-0.107 0.373-0.401 0.266-0.655s-0.401-0.373-0.655-0.266c-1.147 0.485-2.427 0.73-3.805 0.73-1.945 0-3.376-0.504-4.234-0.926-0.635-0.313-1.060-0.629-1.266-0.799v-2.081l5.342 1.781c0.051 0.017 0.105 0.026 0.158 0.026s0.107-0.009 0.158-0.026l5.342-1.781v0.892c-0.582 0.206-1 0.762-1 1.414 0 0.611 0.367 1.137 0.892 1.371l-0.877 3.508c-0.037 0.149-0.004 0.308 0.091 0.429s0.24 0.192 0.394 0.192h2c0.154 0 0.299-0.071 0.394-0.192s0.128-0.28 0.091-0.429l-0.877-3.508c0.525-0.234 0.892-0.76 0.892-1.371 0-0.652-0.418-1.208-1-1.414v-1.226l2.658-0.886c0.204-0.068 0.342-0.259 0.342-0.474s-0.138-0.406-0.342-0.474zM15.5 11c0.276 0 0.5 0.224 0.5 0.5s-0.224 0.5-0.5 0.5-0.5-0.224-0.5-0.5 0.224-0.5 0.5-0.5zM15.14 16l0.36-1.438 0.36 1.438h-0.719zM15.46 7.986l-5.877-0.98c-0.273-0.045-0.53 0.139-0.575 0.411s0.139 0.53 0.411 0.575l4.014 0.669-3.932 1.311-7.419-2.473 7.419-2.473 7.419 2.473-1.459 0.486z"/>
  </svg>
);

const HatIcon = (props) => <Icon component={HatSvg} {...props} />;

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

const FilterPanel = ({showFlag, data, isoAlphaMapping, filterValue, onFilterClick}) => {
  if (showFlag) {
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
          <Button key={item} onClick={() => onFilterClick(item)} 
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-start',
              width: '250px',
              height: '40px',
              border: filterValue === item ? '3px solid #E76F00' : '',
              fontWeight: 'bold'

            }}>
              <img 
                src={`https://flagcdn.com/w80/${isoAlphaMapping[item].toLowerCase()}.png`} 
                style={{
                  width: '40px',
                  marginRight: '10px'
                }}
              />
              {item}
            </Button>
          </ConfigProvider>
        ))}
      </>
    )}
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
              <Button key={item} 
                type={filterValue === item ? 'primary' : 'default'} 
                onClick={() => onFilterClick(item)}
                style={{
                  height: '40px',
                  paddingTop: '10px',
                  paddingBottom: '10px',
                  fontWeight: 'bold'
                }}
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
                {
                  row.node.Academic
                    .split('\n')
                    .map(line=>line.trim())
                    .filter(line=>line.startsWith('•'))
                      .map(item => (<Text>{item}</Text>))
                }
              <Text strong>
                Current Role Summary
              </Text>
              <Text>
                {row.node.Current_Role_Summary}
              </Text>
              <Text strong>
                Pre-IAEA Work Experience
              </Text>
                {
                  row.node.Pre_IAEA_Work_Experience
                    .split('\n')
                    .map(line=>line.trim())
                    .filter(line=>line.startsWith('•'))
                      .map(item => (<Text>{item}</Text>))
                }
            </Flex>
          {/* https://github.com/CookPete/react-player */}
          <ReactPlayer 
            // url={'/video/demo.mp4'}
            url={row.node.Video}
            controls={true}
          />
        </Modal>
      <AnimatePresence mode="wait">
    <motion.div key={filterValue+idx}
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            // exit={{ y: -10, opacity: 0 }}
            transition={{ duration: 0.2 }}>
      <Card  
      onClick={() => toggleModal(idx)}
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
 
        

        {/* <Avatar src={row.node.PFP} size={70} style={{marginBottom: "4px"}}/> */}
        <Avatar src={'pfp/woman_1.png'} size={70} style={{marginBottom: "4px"}}/>
        <Title level={4}>{row.node.Name}</Title>
        <Text>{row.node.Pronouns}</Text>
        <Text italic style={{marginBottom: '4px', textAlign: 'center'}}>
          {row.node.Current_Position}
          {row.node.LinkedIN_Profile && <LinkedinOutlined style={{fontSize: '16px', color: '#0A4C98', marginLeft: '4px'}} onClick={() => window.open(`${row.node.LinkedIN_Profile}`)}/>}
        </Text>
        <Row gutter={[16, 16]} style={{margin: '10px 0'}}>
            <Col span={12}>
              <Flex vertical align="center">
                <GlobalOutlined style={{fontSize: '20px', color: '#0A4C98', marginBottom: '4px'}}/>
                <Text style={{textAlign: 'center'}}>{row.node.Nationality}</Text>
              </Flex>
            </Col>
            
            <Col span={12}>
              <Flex vertical align="center">
                {/* <HatIcon style={{fontSize: '20px', color: '#0A4C98', marginBottom: '4px'}}/> */}
                <BankOutlined style={{fontSize: '20px', color: '#0A4C98', marginBottom: '4px'}} />
                <Text style={{textAlign: 'center'}}>{row.node.Degree}</Text>
              </Flex>
            </Col>


            <Col span={12}>
              <Flex vertical align="center">
                <TrophyOutlined style={{fontSize: '20px', color: '#0A4C98', marginBottom: '4px'}} />
                <Text style={{textAlign: 'center'}}>{row.node.Pre_IAEA_Work_Experience_Category}</Text>
              </Flex>
            </Col>
             
            <Col span={12}>
              <Flex vertical align="center">
                <TagOutlined style={{fontSize: '20px', color: '#0A4C98', marginBottom: '4px'}} />
                <Text style={{textAlign: 'center'}}>{row.node.Age_Bracket}</Text>
              </Flex>
            </Col>
          </Row>
        {/* <Flex vertical>
          <Text>Nationality: {row.node.Nationality}</Text>
          <Text>Academic: {row.node.Degree}</Text>
          <Text>Pre-IAEA Experience: {row.node.Pre_IAEA_Work_Experience_Category}</Text>
          <Text>Age Bracket: {row.node.Age_Bracket}</Text>
        </Flex> */}
        <Text onClick={(e) => {toggleModal(idx); e.stopPropagation();}}>Click for details <RightCircleOutlined style={{fontSize: '16px', color: ''}} /></Text>
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
                {
                  staff.Academic
                    .split('\n')
                    .map(line=>line.trim())
                    .filter(line=>line.startsWith('•'))
                      .map(item => (<Text>{item}</Text>))
                }
              <Text strong>
                Current Role Summary
              </Text>
              <Text>
                {staff["Current Role Summary"]}
              </Text>
              <Text strong>
                Pre-IAEA Work Experience
              </Text>
                {
                  staff["Pre-IAEA Work Experience"]
                    .split('\n')
                    .map(line=>line.trim())
                    .filter(line=>line.startsWith('•'))
                      .map(item => (<Text>{item}</Text>))
                }
            </Flex>
            {/* https://github.com/CookPete/react-player */}
            <ReactPlayer 
              url={staff.Video}
              controls={true}
            />
          </Modal>
        <Card
          onClick={() => toggleModal(idx)}
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
          
          {/* <Avatar src={staff.PFP} size={70} style={{marginBottom: "4px"}}/> */}
          <Avatar src={'pfp/woman_1.png'} size={70} style={{marginBottom: "4px"}}/>
          <Title level={4}>{staff.Name}</Title>
          <Text>{staff.Pronouns}</Text>
          <Text italic style={{marginBottom: '4px', textAlign: 'center'}}>
            {staff["Current Position"]}
            {staff["LinkedIN Profile"] && <LinkedinOutlined style={{fontSize: '16px', color: '#0A4C98', marginLeft: '4px'}} onClick={() => window.open(staff["LinkedIN Profile"])}/>}
          </Text>
          <Row gutter={[16, 16]} style={{margin: '10px 0'}}>
            <Col span={12}>
              <Flex vertical align="center">
                <GlobalOutlined style={{fontSize: '20px', color: '#0A4C98', marginBottom: '4px'}}/>
                <Text style={{textAlign: 'center'}}>{staff.Nationality}</Text>
              </Flex>
            </Col>
            
            <Col span={12}>
              <Flex vertical align="center">
                {/* <HatIcon style={{fontSize: '20px', color: '#0A4C98', marginBottom: '4px'}}/> */}
                <BankOutlined style={{fontSize: '20px', color: '#0A4C98', marginBottom: '4px'}} />
                <Text style={{textAlign: 'center'}}>{staff.Degree}</Text>
              </Flex>
            </Col>


            <Col span={12}>
              <Flex vertical align="center">
                <TrophyOutlined style={{fontSize: '20px', color: '#0A4C98', marginBottom: '4px'}} />
                <Text style={{textAlign: 'center'}}>{staff["Pre-IAEA Work Experience Category"]}</Text>
              </Flex>
            </Col>
             
            <Col span={12}>
              <Flex vertical align="center">
                <TagOutlined style={{fontSize: '20px', color: '#0A4C98', marginBottom: '4px'}} />
                <Text style={{textAlign: 'center'}}>{staff["Age Bracket"]}</Text>
              </Flex>
            </Col>
          </Row>
          {/* <Flex vertical>
            <Text>Nationality: {staff.Nationality}</Text>
            <Text>Academic: {staff.Degree}</Text>
            <Text>Pre-IAEA Experience: {staff["Pre-IAEA Work Experience Category"]}</Text>
            <Text>Age Bracket: {staff["Age Bracket"]}</Text>
          </Flex> */}
        <Text onClick={(e) => {toggleModal(idx); e.stopPropagation();}}>Click for details <RightCircleOutlined style={{fontSize: '16px', color: ''}} /></Text>

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
        return setFilterValue(uniqueNationalities[0]);
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
            <Sider width="250" style={siderStyle}>
              <Flex gap="middle" wrap="wrap">
                <FilterPanel showFlag={true} data={uniqueNationalities} isoAlphaMapping={isoAlphaMapping} filterValue={filterValue} onFilterClick={handleFilterClick} />
              </Flex>
            </Sider>
            <Content>
              <Flex wrap="wrap" gap="middle">
                <StaffCard filterType={currentTab} filterValue={filterValue} data={data} />
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
            <Sider width="250" style={siderStyle}>
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
            // components: {
            //   Input: {
            //     activeBorderColor: '#fff'
            //   }
            // },
            token: {
              fontSize: 16,
              colorText: '#333233',
            },
          }}
        >
          <Search placeholder="" onSearch={handleSearch} style={{ width: 200, marginRight: 30, marginTop: 10 }} />
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
  const uniqueNationalities = Array.from(new Set(nationalities)).sort();

  // const nations = data.map(row => row.node.iso_alpha);
  // const uniqueNations = Array.from(new Set(nations)).sort();

  const isoAlphaMapping = data.reduce((acc, row) => {
    const {Nationality, iso_alpha} = row.node;
    if (!acc.hasOwnProperty(Nationality)) {
      acc[Nationality] = iso_alpha;
    }
    return acc;
  }, {})

  const academic = data.map(row => row.node.Degree);
  const uniqueAcademic = Array.from(new Set(academic)).sort();

  const workExperience = data.map(row => row.node.Pre_IAEA_Work_Experience_Category);
  const uniqueWorkExperience = Array.from(new Set(workExperience)).sort();

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
      {/* <Title style={{paddingLeft: "12px"}}>Department of Safeguards Dashboard</Title> */}
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
              fontSize: 20,
              border: "none"
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
