import React from 'react'
import { Col } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGripHorizontal, faList } from '@fortawesome/free-solid-svg-icons'
import Page1 from './Page1'
import Page2 from './Page2'
import BookInfoPic from './BookInfoPic'
import './Shop.scss'

const DataPic = props => {
  function setMode() {
    localStorage.setItem('mode', 'list')
  }
  let Page, modeLink
  if (props.keyword) {
    Page = Page2
    modeLink = '/books/search/' + props.nowPage + '/' + props.keyword
  } else if (!props.keyword) {
    Page = Page1
    modeLink = '/books/' + props.nowPage + '/' + props.nowCategories
  }
  
  let discountData = props.discountAmount && props.discountAmount.data
  return (
    <>
      <Col md={10} className="books position-relative">
        <div className="book_account mx-3 my-3">
          最新上架書籍共有
          <span className="book_number px-2">
            {props.shopPayload && props.shopPayload.totalRows}
          </span>
          本
        </div>
        <div className="book_order mx-4 my-3 px-5 d-flex justify-content-between">
          <div>
            <span className="mr-2">顯示模式</span>
            <Link to={modeLink} onClick={() => setMode()}>
              <FontAwesomeIcon icon={faList} />
            </Link>
            <Link to={modeLink}>
              <FontAwesomeIcon icon={faGripHorizontal} className="active" />
            </Link>
          </div>
          {/* <div>
            <span className="mr-2">排序依</span>
            <select>
              <option>書名(小->大)</option>
              <option>書名(大->小)</option>
              <option>書名(小->大)</option>
              <option>書名(小->大)</option>
              <option>書名(小->大)</option>
            </select>
          </div> */}
        </div>
        <div className="book_data2 d-flex flex-wrap">
          {props.shopPayload &&
            props.shopPayload.rows &&
            props.shopPayload.rows.map(data => (
              <div
                className="d-flex flex-column align-items-center data_each m-3"
                key={data.sid}
              >
                <BookInfoPic
                  data={data}
                  cartPayload={props.cartPayload}
                  history={props.history}
                  discountData={discountData}
                ></BookInfoPic>
              </div>
            ))}
        </div>
        <Page
          shopPayload={props.shopPayload}
          nowCategories={props.nowCategories}
          nowPage={props.nowPage}
          keyword={props.keyword}
        ></Page>
        {/*Pagination*/}
      </Col>
    </>
  )
}

export default DataPic
