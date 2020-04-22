import React from 'react'
import { NavBar, List, TextareaItem, ImagePicker, WingBlank } from 'antd-mobile'
import { createForm } from 'rc-form'
import styles from './style.less'

const data = [
  {
    url: 'https://zos.alipayobjects.com/rmsportal/PZUUCKTRIHWiZSY.jpeg',
    id: '2121'
  },
  {
    url: 'https://zos.alipayobjects.com/rmsportal/hqQWgTXdrlmVVYi.jpeg',
    id: '2122'
  }
]
class SuggestionWrapper extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      files: data
    }
  }

  onChangeImage = (files)=> {
    this.setState({ files })
  }

  render() {
    const { getFieldProps } = this.props.form
    return (
      <div className={styles.suggestion}>
        <NavBar
          className={styles.navBar}
          mode="light"
          icon={<i className="iconfont icon-back" style={{ color: '#666' }}></i>}
          onLeftClick={() => this.props.history.goBack()}
        >
          处理意见
        </NavBar>

        <List>
          <TextareaItem
            {...getFieldProps('situation')}
            clear
            rows={4}
            count={300}
            placeholder="处理情况，我的意见是..."
          />
        </List>
        <div>
          <div className="am-list-header">上传照片</div>
          <WingBlank>
            <ImagePicker
              files={this.state.files}
              onChange={this.onChangeImage}
              selectable={this.state.files.length < 4}
              accept="image/gif,image/jpeg,image/jpg,image/png"
            />
          </WingBlank>
        </div>

        <button className={styles.button}>提 交</button>
      </div>
    )
  }
}

const Suggestion = createForm()(SuggestionWrapper)
export default Suggestion
