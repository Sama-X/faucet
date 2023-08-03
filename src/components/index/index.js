import './index.css'
import { Input, Spin, Button, message } from 'antd';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { BASE_URL } from '../../utils/axios';

function App() {
  const [addressUrl, setAddressUrl] = useState('');
  const [lian, setLian] = useState('28RQeSNfmiGs1GzRuobzGSM7H61WwrGbiBNzXNXGeCdc8GnUWD');
  const [errorText, setErrorText] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [spinStatus, setSpinStatus] = useState(false);

  const changeHandle = (e) =>{
    setAddressUrl(e.target.value)
  }
  const blurHandle = (e) =>{
    if (!e.target.value) {
      setErrorText('Please enter the address')
      return false
    }
    setAddressUrl(e.target.value)
  }
  const receiveFunc = () => {
    setSpinStatus(true)
    if (!addressUrl) {
      setErrorText('Please enter the address')
      setSpinStatus(false)
      return false
    }
    if (localStorage.getItem(addressUrl)) {
      let time = new Date().getTime() - localStorage.getItem(addressUrl)
      if (time < 24 * 60 * 60 * 1000) {
        setErrorText('Current address has been requested, please try again after 24 hours')
        setSpinStatus(false)
        return false
      }
    }
    setErrorText('')
    axios.post(BASE_URL + "/ext/bc/" + lian + '/public', {
        jsonrpc: '2.0',
        method: 'samavm.transfer',
        params: {
            to: addressUrl,
            units: 10000,
            privKey: 'PrivateKey-ewoqjP7PxY4yr3iLTpLisriqt94hdyDFNgchSxGGztUrTXtNN',
        },
        id: 1,
    }, {
      timeout: 10000
    }).then((res) => {
      if(res.data.error){
        setIsSuccess(false)
        message.error('error:'+res.data.error.message)
        setErrorText(res.data.error.message)
      }else if(res.data.result){
        setIsSuccess(true)
        localStorage.setItem(addressUrl, new Date().getTime())
        setErrorText('')
        message.success('success'+res.data.result.txId)
      }
      setAddressUrl('')
      setTimeout(function(){setSpinStatus(false)},1000)
    }).catch((err) => {
      setErrorText(err.message)
      setTimeout(function(){setSpinStatus(false)},1000)
    })
  }

  useEffect(() => {
    axios.post(BASE_URL + '/ext/bc/P', {
      jsonrpc: '2.0',
      method: 'platform.getBlockchains',
      params: {},
      id: 1,
    }, {
      timeout: 3000
    }).then((res) => {
        let lian = ''
        for (let i in res.data.result.blockchains) {
          if (res.data.result.blockchains[i].name === 'lq') {
            lian = res.data.result.blockchains[i].id
            break
          }
        }
        setLian(lian)
    }).catch((err) => {
      console.log(err);
      setErrorText(err.message)
    })
  }, []);

  return (
    <div className="indexBox">
      <div className="header">
        <img className="logo" src={require("../../assets/logo.png")} />
        <div className="logo-text">Dripto</div>
      </div>
      <div className="content">
        <div className="content-item logo-header">
          <img className="logo" src={require("../../assets/logo.png")} />
          <div className="logo-text">Dripto</div>
        </div>
        <div className='content-item'>
          <Input
            type="text"
            value={addressUrl}
            onChange={changeHandle}
            onBlur={blurHandle}
            placeholder="address"
            className={'input' + (errorText ? " error" : "")}
          />
        </div>
        <div className="error-item">
        {
          errorText ? <div className='error-text'>{errorText}</div> :  isSuccess ? <div className='success-text'>Transfer succeeded</div> : ''
        }
          <div className="redWord">This is a testnet faucet. Funds are not real.</div>
        </div>

        <div className="content-item">
            <Button
              onClick={()=>receiveFunc()}
              className='submit'
            >
              {spinStatus ? <Spin /> : 'Request 10 DND'}
            </Button>
        </div>
        </div>
    </div>
  );
}

export default App;
