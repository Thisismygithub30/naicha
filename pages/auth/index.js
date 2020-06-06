// pages/auth/index.js
import { request } from "../../request/index.js";
import { login } from "../../utils/asyncWx.js";

Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  //获取用户信息
  async handleGetUserInfo(e){
    try {
      console.log(e);
      //1 获取用户信息
      const { encryptedData,rawData,iv,signature } = e.detail;
      //获取小程序登录成功后的code
      const {code}=await login();
      console.log(code);
      const loginParams={encryptedData,rawData,iv,signature,code};
      //发送请求 获取用户的token
      //const {token}=await request({url:"/users/wxlogin",data:loginParams,method:'post'});
      //因为没有后台 传回token 所以自定义了一个临时变量token 当后台写好后，把token再变回常量
      let {token}=await request({url:"/users/wxlogin",data:loginParams,method:'post'});
      if(!token){
        token="nullToken because no houtai"
      }
      // console.log(res);
      wx.setStorageSync("token", token);
      wx.navigateBack({
        delta: 1
      });
    } catch (error) {
      console.log(error);
    }

  }

})