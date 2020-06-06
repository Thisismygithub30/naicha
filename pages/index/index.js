//Page Object
// 引入用来发送请求的 方法 路径补全
import { request } from "../../request/index.js";
Page({
  data: {
    //轮播图数组
    swiperList:[],
    //导航数组
    catesList:[],
    //楼层数组 此处应该包含推荐数据
    floorList:[]

  },
  //options(Object)
  onLoad: function(options){
    // 1 获取异步请求获取轮播图数据
    // var reqTask = wx.request({
    //   /**
    //    * 1 url 路径可以是本地路径也可以是网络路径
    //    * 2 success 当成功获取到来自本地/网络的数据之后会传回一个result（应该是json数据格式）
    //    * 3 this.setData 将result中的数据进行一个赋值操做，赋值到本地创建的轮播图数组当中，此处只需要data中的message信息，其他的meta等等暂时用不到
    //    */
    //   url: 'https://api-hmugo-web.itheima.net/api/public/v1/home/swiperdata',
    //   success: (result)=>{
    //     console.log(result);
    //     this.setData({
    //       swiperList:result.data.message
    //     });
    //   }

    // });

    this.getSwiperList();
    this.getCatesList();
    this.getFloorList();
  
  },
  //获取轮播图数据方法
  // 防止套娃，使用promise异步处理
  getSwiperList(){
    request({url:"/home/swiperdata"})
      .then(result=>{
        this.setData({
          swiperList:result.data.message
        });
      })
  },
  getCatesList(){
    request({url:"/home/catitems"})
      .then(result=>{
        this.setData({
          catesList:result.data.message
        });
      })
  },
  getFloorList(){
    request({url:"/home/floordata"})
      .then(result=>{
        this.setData({
          floorList:result.data.message
        });
      })
  }
  

});