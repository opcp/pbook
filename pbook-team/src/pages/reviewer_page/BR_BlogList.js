import React from 'react'
import { withRouter } from 'react-router-dom'

class BR_BlogList extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
          opened:null
      }
    }
  

  handleURL=()=>{
    // let url = `${this.props.tube}`
    let url = 'https://i.imgur.com/nLnK93i.png'
    void window.open("http://www.facebook.com/share.php?u=".concat(encodeURIComponent(url)))
  }

  render() {
    return (
      <>
      <div className="Animate_Edit_Box">
              {/* <div className="Animate_Edit_btn" onClick={() => this.handleOpened(this.state.opened === 'edit' ? null : 'edit')}>
                  <img className="icon_Blog_Edit" src={require('../reviewer_page/images/icon_Blog_Edit.png')}/>
                  <h5 className="text_Blog_Edit">編輯模式</h5>
              </div> */}
      </div>
          <h5 className="h5_br">正在閱讀..<h3 className="h3_gray">{this.props.name}</h3></h5>
          <br/>
        <section className="ReviewerListAllBox reviewerList">
          <h5 className="" dangerouslySetInnerHTML={{__html:this.props.blog}}></h5>
        </section>

          <img className="pbookChick BlogMouse" onClick={this.handleURL} src={require('./images/品書印章.png')}/>
      </>
    )
  }
}

export default withRouter(BR_BlogList)