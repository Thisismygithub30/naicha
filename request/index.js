//同时发送异步代码的次数
let ajaxTimes=0;

export const request=(params)=>{
    //判断url中是否带有私有路径参数/my/
    let header={...params.header};
    if(params.url.includes("/my/")){
        //拼接 header 带上token
        header["Authorization"]=wx.getStorageSync("token");
    }



    ajaxTimes++;
    //显式加载中的效果
    wx.showLoading({
        title: "加载中",
        mask: true,
    });



    //定义公共的url
    //提高项目的可维护性，避免服务器宕机要大量修改代码
    const baseUrl="https://api-hmugo-web.itheima.net/api/public/v1";
    return new Promise((resolve,reject)=>{
        var reqTask = wx.request({
            ...params,
            header:header,
            url:baseUrl+params.url,
            success:(result)=>{
                resolve(result);
            },
            fail:(err)=>{
                reject(err);
            },
            complete:()=>{
                ajaxTimes--;
                if(ajaxTimes==0){
                    //关闭正在等待的图标
                    wx.hideLoading();
                }
                
            }
        });
          
    });
}