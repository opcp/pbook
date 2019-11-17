import React from 'react'
import './member/lukeStyle.scss'
import swal from '@sweetalert/with-react'
import CaptchaMini from 'captcha-mini'
import { BrowserRouter as Router, Route, Link, Switch } from 'react-router-dom'
import Login from './login/Login'



class ResetPWD extends React.Component{
    constructor(){
        super()
        this.state = {
            email: '',
            password1: '',
            password2:'',
            captcha1: '',
            captcha2: '',
        }
        this.captcha1 = this.captcha1.bind(this)
        this.changePassword = this.changePassword.bind(this)
        this.handleChange = this.handleChange.bind(this)
    }




    componentDidMount(){
        this.captcha1()
      }


      setEmail(email){
        this.setState({email})
      }

      clearStyle(){
        let password1 = document.querySelector('#password1')
        let password2 = document.querySelector('#password2')
        password1.classList.remove('error')
        password2.classList.remove('error')
        let captcha2 = document.querySelector('#captcha2')
        captcha2.classList.remove('error')
        
      }

      success (status, message){
        swal({
          title: status,
          text: message,
          icon: "success",
          button: "OK",
        })
        .then((title) =>{
          if(title === "修改密碼成功"){
            swal('請重新登入!', {
              icon: 'success',
            })
          }
        })
      }
    
      fail(status, message){
        swal({
          title: status,
          text: message,
          icon: "error",
          button: "OK",
        })
      }
    

    //輸入轉值
    handleChange(e){
    //解構賦值
    const {name, value} = e.target
    // console.log(name, value);
    
    this.setState({[name]:value})
    }

     //判斷密碼格式
    checkPassword(password1, password2){
        const re =   /^(?=.*\d)(?=.*[a-z]).{4,8}$/
        console.log((password1 === password2) , re.test(password1, password2));
        const result = (password1 === password2) && re.test(password1, password2)
        return result
    }


    //驗證碼
    captcha1(){
        let captcha1 = new CaptchaMini();
        captcha1.draw(document.querySelector('#captcha1'), r => {
            // console.log(r, '验证码1');
            this.setState({captcha1: r})
        });
    }

    changePassword(){
        console.log("checkPassword");
        console.log(2, JSON.parse(localStorage.getItem('user')).MR_number);
        
        let isPass = false
        let password1 = this.state.password1
        let password2 = this.state.password2
        let captcha1 = this.state.captcha1
        let captcha2 = this.state.captcha2
        let number =JSON.parse(localStorage.getItem('user')).MR_number
        // console.log(captcha1, captcha2);
        
        if(this.checkPassword(password1, password2) === false){
            this.setState({password1: "格式或密碼有誤", password2: "請再重新輸入"})
            let password1 = document.querySelector('#password1')
            let password2 = document.querySelector('#password2')
            // password.type = (password.type === "text") ;
            // password2.type = (password2.type === "text") ;
            password1.classList.add('error')
            password2.classList.add('error')
            console.log("password err");
            }
      
            if(captcha1 !== captcha2){
              this.setState({captcha2: "驗證碼錯誤，請在核對ㄧ次"})
              let captcha2 = document.querySelector('#captcha2')
              captcha2.classList.add('error')
              console.log("captcha err");
              
            }else{
              isPass = true
            } 

        if(isPass){
            fetch('http://localhost:5555/member/changePassword',{
            method: 'POST',
            credentials: 'include',  //跨網域取得session資訊
            headers: {
            'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                password: this.state.password2,
                number: number
              })
            })
            .then(res => {
                return res.json()
            })
            .then(data => {
                // console.log(msg);
                let status = data.status
                let message = data.message
                this.success(status, message)
                setTimeout(() => {
                    window.location.href = '/login'
                  }, 2000)
            })
        }
    }



    render(){
      console.log("resetPWD",this.state.email);
      
        return(
            <>
              <div className="d-flex justify-content-center">
               <div className="passwordContent">
                    <div className="title">重設密碼</div>   
                    <div className="form-group passwordGroup">
                    <div className="item">請輸入密碼</div>
                    <input type="text" className="form-control" 
                        id="password1" 
                        name="password1" 
                        value={this.state.password1} onChange={this.handleChange} 
                    />
                    </div>
                    <div className="tip">至少有一個數字、一個小寫英文字母、密碼長度在 4~8 之間</div>
                    <div className="form-group passwordGroup">
                    <div className="item">請再次輸入密碼</div>
                    <input type="text" className="form-control" 
                    id="password2" 
                    name="password2"  
                    value={this.state.password2} onChange={this.handleChange} 
                    />
                    </div>
                    <div className="form-group passwordGroup">
                    <canvas  className="serial" id="captcha1" onClick={this.captcha1}></canvas>
                    <input type="text" className="form-control"  
                    placeholder="請輸入驗證碼"  
                    name="captcha2"
                    id="captcha2"
                    value={this.state.captcha2} onChange={this.handleChange}    
                    />
                    </div>

                    <div className="d-flex justify-content-center" 
                    style={{ width: '1280px',
                            padding: '50px',
                            }}>
                      <button
                         style={{ width: '250px' }}
                         className="btn btn-warning"
                          onClick={this.clearStyle}
                          >
                        &nbsp;取&nbsp;&nbsp;&nbsp;消&nbsp;
                        </button>
                      <button
                         style={{ width: '250px' }}
                         type="submit"
                         className="btn btn-warning"
                          id="submit_btn"
                          onClick={this.changePassword}
                          >
                        &nbsp;確&nbsp;認&nbsp;修&nbsp;改&nbsp;
                        </button>
                    </div>
                    
               </div> 
              </div>
              <Route exact path="/login" component={()=><Login setEmail={(email)=>{this.setEmail(email)}}/>} />
            </>
        )
    }
}


export default ResetPWD