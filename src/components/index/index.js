import './index.css'
import { Input, Spin, Button, message } from 'antd';
import { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
  const [isAddress, setIsAddress] = useState(true);
  const [addressUrl, setAddressUrl] = useState('');
  const [isLian, setIsLian] = useState('28RQeSNfmiGs1GzRuobzGSM7H61WwrGbiBNzXNXGeCdc8GnUWD');
  const [isSuccess, setIsSuccess] = useState(false);
  const [spinStatus, setSpinStatus] = useState(false);

  const changeHandle = (e) =>{
    setAddressUrl(e.target.value)
  }
  const blurHandle = (e) =>{
    setAddressUrl(e.target.value)
  }
  const receiveFunc = () => {
    let _this = this
    console.log(addressUrl,'addressUrl')
    setSpinStatus(true)
    if (!addressUrl) {
        setIsAddress(false)
        setSpinStatus(false)
        return false
    } else {
      setIsAddress(true)
      axios
            .post('http://154.40.42.152:9666/ext/bc/P', {
                jsonrpc: '2.0',
                method: 'platform.getBlockchains',
                params: {},
                id: 1,
            })
            .then((res) => {
                console.log(res, 'hgjkl')
                for (let i in res.data.result.blockchains) {
                    if (res.data.result.blockchains[i].name == 'sama') {
                        let lian = res.data.result.blockchains[i].id
                        axios.post('http://154.40.42.152:9666/ext/bc/' + lian + '/public', {
                            jsonrpc: '2.0',
                            method: 'samavm.transfer',
                            params: {
                                to: addressUrl,
                                units: 10000,
                                privKey: 'PrivateKey-ewoqjP7PxY4yr3iLTpLisriqt94hdyDFNgchSxGGztUrTXtNN',
                            },
                            id: 1,
                        })
                        .then((res) => {
                          console.log(res,'hjk')
                          if(res.data.error){
                            console.log(1)
                            setIsSuccess(false)
                            message.error('error:'+res.data.error.message)
                          }else if(res.data.result){
                            setIsSuccess(true)
                            message.success('success'+res.data.result.txId)
                          }
                          setIsAddress(true)
                          setAddressUrl('')
                          setTimeout(function(){setSpinStatus(false)},1000)
                        })
                    }
                  }
            })
    }
  }
  return (
    <div className="indexBox">
      {
        spinStatus ?
        <div className="example">
          <Spin />
        </div>
        : ''
      }
        <div className="content">
            <img className="logo router-link-active" src={require("../../assets/priviteKeyBg.png")} />
            {/* <h6>Drops are limited to 1 request in 24 hours.</h6> */}
            <div>
                <Input
                    type="text"
                    value={addressUrl}
                    onChange={changeHandle}
                    onBlur={blurHandle}
                    placeholder="address"
                    style={{
                      background: '#313133',
                      lineHeight: '40px',
                      padding: '0 10px',
                      margin: '10px 0',
                      width: '100%',
                      color: 'white',
                    }}
                />
            </div>
            {
              isAddress ? '' : <div style={{color: 'red'}}>You must set the URL.</div>
            }
            {
              isSuccess ? <div style={{color: 'green'}}>Transfer succeeded</div> : ''
            }

            <div className="redWord">This is a testnet faucet. Funds are not real.</div>
            <div>
                <Button
                    onClick={()=>receiveFunc()}
                    style={{
                      backgroundColor: '#313133',
                      color: 'white',
                      textDecoration: 'none',
                      padding: '5px 10px',
                      borderRadius: '4px',
                      marginTop: '10px',
                      width: '100%',
                      textAlign: 'center',
                    }}
                >
                    REQUEST 10 SAMA
                </Button>
            </div>
        </div>
    </div>
  );
}

export default App;
