// pages/tst/index.js
import { login,getUserInfo } from "../../utils/asyncWx.js";
Page({

  

  async handleGetUserInfo(e){
    const res=await login();
    console.log(res);
    const code=res.code;
    const userinfo=await getUserInfo();
    const { encryptedData,iv } =userinfo;
    const paramsuser={ encryptedData,iv,code };
    console.log(userinfo);
    console.log(paramsuser);
    var reqTask = wx.request({
      url: '',
      data: {paramsuser},
      success: (result)=>{
       console.log("成功发送请求！");
        
      }
    });
    
  }
})