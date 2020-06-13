// pages/user/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userinfo:{},
    collectNum:0
  },
  onShow(){
    const userinfo=wx.getStorageSync("userinfo");
    const collect=wx.getStorageSync("collect")||[];

    console.log(userinfo);
    this.setData({
      userinfo:userinfo,
      collectNum:collect.length
    })
    
  }
 
})