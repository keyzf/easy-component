import React ,{FC} from 'react';
import {Modal} from 'antd';
import ReactJson from 'react-json-view';

interface JsonViewProps {
  json:object,
  visible:boolean
  onCancel():void
}
const JsonView = React.memo((props:JsonViewProps)=>{
  const {json,visible=false,onCancel} = props;
  const width = 850;
  const height = 576;
  return <Modal
    visible={visible}
    width={width}
    maskClosable={true}
    bodyStyle={{
      padding:0
    }}
    style={{
      top:'50%',
      marginTop:-height/2
    }}
    onCancel={onCancel}
    footer={null}>
      <ReactJson style={{height,overflow:'scroll'}} theme="apathy" src={json}/>
  </Modal>
})
export default JsonView;