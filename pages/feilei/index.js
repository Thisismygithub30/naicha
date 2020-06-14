// pages/category/index.js
// 引入request 异步请求数据方法
import { request } from "../../request/index.js";
import { myrequest } from "../../request/ownIndex.js";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //左侧的菜单数据
    leftMenuList:[],
    //右侧的菜单内容数据
    rightContentList:[],
    // 被点击的左侧菜单index
    currentIndex:0,
    //右侧菜单滚动条距离顶部的距离
    scrollTop:0
  },
  //定义接口的返回数据
  Cates:[],


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    /**
     * web中本地存储和小程序的区别
     *    1 web:  localStorage.setItem("key","value")
     *            localStorage.getItem("key")
     *      wxminiapp: wx.setStorageSync("cates", {time:Date.now(),data:this.Cates});
     *                wx.getStorageSync("cates");
     *    2 web:不管存入的是什么类型的数据，最终都会调用tostring()转化为字符串再存
     *      wxminiapp:不存在类型转化的操做，是什么类型就是什么类型
     * 
     * 1 先判断一下本地存储中有没有旧的数据
     *    {time:Date.now(),data:[...]}
     * 2 没有旧数据 直接发送新请求
     * 3 有旧的数据，同时 旧数据还没有过期，就是用本地存储中的旧数据
     */
    //1 获取本地存储的数据
    const Cates = wx.getStorageSync("cates");
    //2 判断是否存在数据
    if(!Cates){
        //不存在 就获取
        this.getCates();
    }else{
      //有旧数据存在，定义一个过期时间  30s
      if(Date.now()-Cates.time>10000*120){
        //重新发送请求
        this.getCates();
      }else{
        //可以使用旧数据
        console.log("可以用旧数据");
        //把缓存中的值给本地的Cates数组
        this.Cates=Cates.data;
        //构造左侧的菜单的数据
        //.map 是ES6的数组映射用法
        let leftMenuList = this.Cates.map(val=>val.classifyname);

        //构造右侧的菜单的数据
        let rightContentList = this.Cates[0].children;

        this.setData({
          leftMenuList,
          rightContentList
        })
      }

    }

    //拉取getcates方法，获取初始数据
    //this.getCates();
  },


//获取分类界面数据
//async ES7用法，同步（实则异步请求）
 async getCates(){
    // request({
    //   url:"/categories"
    // })
    //   .then(res=>{
    //     //res=>  ES6 写法
    //     //测试数据是否成功
    //     // console.log(res);

    //     // 拿到整个接口返回的数据并赋值给Cates数组
    //     this.Cates = res.data.message;

    //     //把接口的数据存入到本地存储中
    //     wx.setStorageSync("cates", {time:Date.now(),data:this.Cates});

    //     //构造左侧的菜单的数据
    //     //.map 是ES6的数组映射用法
    //     let leftMenuList = this.Cates.map(val=>val.cat_name);

    //     //构造右侧的菜单的数据
    //     let rightContentList = this.Cates[0].children;

    //     this.setData({
    //       leftMenuList,
    //       rightContentList
    //     })

    //   })

//使用ES7的async await来发送请求
  const res = await myrequest({url:"/sort"});
  console.log(res);
  //拿到整个接口返回的数据并赋值给Cates数组
        this.Cates = res.data.data;

        //把接口的数据存入到本地存储中
        wx.setStorageSync("cates", {time:Date.now(),data:this.Cates});

        //构造左侧的菜单的数据
        //.map 是ES6的数组映射用法
        let leftMenuList = this.Cates.map(val=>val.classifyname);

        //构造右侧的菜单的数据
        let rightContentList = this.Cates[0].children;

        this.setData({
          leftMenuList,
          rightContentList
        })



  },

  //左侧菜单的点击事件
  handleItemTap(e){
    /**测试点击事件能否触发 */
    console.log(e);
    /**
     * 1 获取点击事件的标题的索引
     * 2 给data中的currentIndex赋值
     * 3 根据不同的索引来渲染右侧内容
     */
    // const {index} 解构写法 普通的index也可以 解构相对于普通的写法，更快更简洁
    // 普通的用法 const constName = e.currentTarget.dataset.自定义的名字;
    const {lcindex}=e.currentTarget.dataset;
    // console.log(lcindex);测试解构写法
    //把右边的内容换成当前被点击的标题的lcindex
    let rightContentList = this.Cates[lcindex].children;
    this.setData({
      currentIndex:lcindex,
      rightContentList,
      //重新设置 右侧的scrollview距离顶部的距离为0
      scrollTop:0
      
    })
    

  }
  
})