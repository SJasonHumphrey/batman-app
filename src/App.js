import React, { useEffect, useState } from 'react';
import { 
    Layout,  
    Row, 
    Col, 
    Card, 
    Tag, 
    Spin, 
    Alert, 
    Modal, 
    Typography 
} from 'antd';
import 'antd/dist/antd.css';

const API_KEY = '304c2fca';
const { Header, Content, Footer } = Layout;
const { Meta } = Card;
const TextTitle = Typography.Title;
const ColCardBox = ({Title, imdbID, Poster, Type, ShowDetail, DetailRequest, ActivateModal}) => {

  const clickHandler = () => {

      // Display Modal and Loading Icon
      ActivateModal(true);
      DetailRequest(true);

      fetch(`http://www.omdbapi.com/?i=${imdbID}&apikey=${API_KEY}`)
      .then(resp => resp)
      .then(resp => resp.json())
      .then(response => {
          DetailRequest(false);
          ShowDetail(response);
      })
      .catch(({message}) => {
          DetailRequest(false);
      })
  }

  return (
      <Col style={{margin: '20px 0'}} className="gutter-row" span={4}>
          <div className="gutter-box">
              <Card
                  style={{ width: 200 }}
                  cover={
                      <img
                          alt={Title}
                          src={Poster === 'N/A' ? 'https://placehold.it/198x264&text=Image+Not+Found' : Poster}
                      />
                  }
                  onClick={() => clickHandler()}
              >
                  <Meta
                          title={Title}
                          description={false}
                  />
                  <Row style={{marginTop: '10px'}} className="gutter-row">
                      <Col>
                          <Tag color="purple">{Type}</Tag>
                      </Col>
                  </Row>
              </Card>
          </div>
      </Col>
  )
}
const MovieDetail = ({Title, Poster, Rated, Runtime, Director, Plot}) => {
  return (
      <Row>
          <Col span={11}>
              <img 
                  src={Poster === 'N/A' ? 'https://placehold.it/198x264&text=Image+Not+Found' : Poster} 
                  alt={Title} 
              />
          </Col>
          <Col span={13}>
              <Row>
                  <Col span={21}>
                      <TextTitle level={4}>{Title}</TextTitle></Col>
                  <Col span={3} style={{textAlign:'right'}}>
                  </Col>
              </Row>
              <Row style={{marginBottom: '20px'}}>
                  <Col>
                      <Tag>{Rated}</Tag> 
                      <Tag>{Runtime}</Tag> 
                      <Tag>Director: {Director}</Tag>
                  </Col>
              </Row>
              <Row>
                  <Col>{Plot}</Col>
              </Row>
          </Col>
      </Row>
  )
}
const Loader = () => (
  <div style={{margin: '20px 0', textAlign: 'center'}}>
      <Spin />
  </div>
)

function App() {

  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [query] = useState('batman');
  const [activateModal, setActivateModal] = useState(false);
  const [detail, setShowDetail] = useState(false);
  const [detailRequest, setDetailRequest] = useState(false);


  useEffect(() => {

      setLoading(true);
      setError(null);
      setData(null);

      fetch(`http://www.omdbapi.com/?s=${query}&apikey=${API_KEY}`)
      .then(resp => resp)
      .then(resp => resp.json())
      .then(response => {
          if (response.Response === 'False') {
              setError(response.Error);
          }
          else {
              setData(response.Search);
          }

          setLoading(false);
      })
      .catch(({message}) => {
          setError(message);
          setLoading(false);
      })

  }, [query]);

  
  return (
      <div className="App">
          <Layout className="layout">
              <Header>
                  <div style={{ textAlign: 'center'}}>
                      <TextTitle style={{color: '#ffffff', marginTop: '14px'}} level={3}>Batman Movies</TextTitle>
                  </div>
              </Header>
              <Content style={{ padding: '0 50px' }}>
                  <div style={{ background: '#fff', padding: 24, minHeight: 280 }}>
                      
                      <Row gutter={16} type="flex" justify="center">
                          { loading &&
                              <Loader />
                          }

                          { error !== null &&
                              <div style={{margin: '20px 0'}}>
                                  <Alert message={error} type="error" />
                              </div>
                          }
                          
                          { data !== null && data.length > 0 && data.map((result, index) => (
                              <ColCardBox 
                                  ShowDetail={setShowDetail} 
                                  DetailRequest={setDetailRequest}
                                  ActivateModal={setActivateModal}
                                  key={index} 
                                  {...result} 
                              />
                          ))}
                      </Row>
                  </div>
                  <Modal
                      centered
                      visible={activateModal}
                      onCancel={() => setActivateModal(false)}
                      footer={null}
                      width={800}
                      >
                      { detailRequest === false ?
                          (<MovieDetail {...detail} />) :
                          (<Loader />) 
                      }
                  </Modal>
              </Content>
              <Footer></Footer>
          </Layout>
      </div>
  );
}

export default App;
