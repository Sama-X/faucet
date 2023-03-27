import React, { Component } from 'react'
// 导入所需组件
import Index from '../components/index'
// 导入路由依赖
import {  Route,BrowserRouter } from 'react-router-dom'

export default class index extends Component {
  render() {
    return (
        // 使用BrowserRouter包裹，配置路由
      <BrowserRouter>
         {/* 使用/配置路由默认页；exact严格匹配 */}
        <Route component={Index} path='/' exact></Route>
      </BrowserRouter>
    )
  }
}