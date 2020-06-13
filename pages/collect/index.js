// pages/collect/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    collect:[]
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    const collect=wx.getStorageSync("collect")||[];
    this.setData({
      collect
    });

  },

  
})