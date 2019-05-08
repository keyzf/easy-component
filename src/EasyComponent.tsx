import React, { FunctionComponent} from 'react';
import classnames from 'classnames';
import {LocaleProvider ,Tabs,Button,Row,Col,Icon, Tooltip,Modal,Layout} from 'antd';
import zhCN from 'antd/lib/locale-provider/zh_CN';
import {OperationType,VirtualDom,undoRecordList,redoRecordList} from '@/constant';
import {createID} from '@/utils';
import ComponentDrawingBoard from '@/components/componentDrawingBoard';
import PropertyInfo from '@/components/propertyInfo';
import VirtualDomTree,{findNodeById,recreateNodeId} from '@/components/virtualDomTree';
import ElementsPane from '@/components/elementsPane';
import {cloneDeep} from 'lodash';
import '@/scss/main.scss';
const TabPane = Tabs.TabPane;
const confirm = Modal.confirm;

interface EasyComponentProps{

}

interface ActionButton {
  title:string,
  icon:string|FunctionComponent
}
interface EasyComponentState{
  activeId:string,
  activeTab:string,
  virtualDomData:VirtualDom[],
  actionButtonList:ActionButton[],
  status:string
}
export default class EasyComponent extends React.PureComponent<EasyComponentProps,EasyComponentState>{
  readonly state={
    activeId:'',
    activeTab:'virtualDomTree',
    actionButtonList:[{
      title:'预览',
      key:'preview',
      icon:'eye'
    },{
      title:'撤销',
      key:'undo',
      icon:'undo'
    },{
      title:'重做',
      key:'redo',
      icon:'redo'
    },{
      title:'清空画布',
      key:'delete',
      icon:'delete'
    }],
    status:'normal',
    virtualDomData:[{
      id:createID(),
      type:'div',
      style:{
        padding:'10px'
      },
      children:[{
        id:createID(),
        type:'div',
        props:{
          className:'table-wrapper',
        },
        style:{
          color:'red',
          padding:'10px'
        },
        children:[{
          id:createID(),
          type:Button,
          props:{
            type:'primary',
            icon:'search'
          },
          children:'点击'
        },{
          id:createID(),
          type:Button,
          style:{
            marginLeft:'10px'
          },
          children:'hello'
        }]
      },{
        id:createID(),
        type:Row,
        style:{
          paddingTop:'10px',
          paddingRight:'20px',
          paddingBottom:'10px',
          paddingLeft:'10px'
        },
        children:[{
          id:createID(),
          type:Col,
          props:{
            span:4
          },
          style:{
            padding:'10px'
          },
          children:[{
            id:createID(),
            type:Icon,
            props:{
              type:'caret-left'
            }
          }]
        }]
      }]
    }]
  }
  handleVirtualDomTreeChange=(newVirtualDomData:VirtualDom[])=>{
    const {activeId} = this.state;
    this.setState({
      virtualDomData:newVirtualDomData
    });
    undoRecordList.unshift({
      activeId,
      virtualDomData:newVirtualDomData
    });
  }
  handleActiveIdChange=(activeId:string)=>{
    const {virtualDomData} = this.state;
    this.setState({
      activeId
    });
    undoRecordList.unshift({
      activeId,
      virtualDomData
    });
  }
  handleComponentDrawingBoardAction=(type:OperationType)=>{
    const {activeId,virtualDomData} = this.state;
    const data = [...virtualDomData];
    if(type==='delete'){
      findNodeById(data,activeId,true);
      this.setState({
        activeId:'',
        virtualDomData:data
      });
      undoRecordList.unshift({
        activeId,
        virtualDomData:data
      });
    }else if(type==='copy'){
      const {parentNode,index,node} = findNodeById(data,activeId,false);
      const copyNode = recreateNodeId(cloneDeep(node));
      Array.isArray(parentNode.children)&&parentNode.children.splice(index+1,0,copyNode);
      this.setState({
        virtualDomData:data
      });
      undoRecordList.unshift({
        activeId,
        virtualDomData
      });
    }else if(type==='findParent'){
      const {parentNode} = findNodeById(data,activeId,false);
      const newActiveId = parentNode.id==='root'?'':parentNode.id;
      this.setState({
        activeId: parentNode.id==='root'?'':parentNode.id
      });
      undoRecordList.unshift({
        activeId:newActiveId,
        virtualDomData
      });
    }else{
      return;
    }
  }
  handleActionButtonClick=(type:string)=>{
    const {activeId,virtualDomData} = this.state;
    if(type==='delete'){
      confirm({
        title:'确认操作',
        content:'确认是否清空画布？',
        onOk:()=>{
          const newVirtualDomData:VirtualDom[] = [];
          undoRecordList.unshift({
            activeId,
            virtualDomData:newVirtualDomData
          });
          this.setState({
            virtualDomData:newVirtualDomData
          });
        }
      })
    }else if(type==='preview'){
      this.setState({
        status:'preview'
      });
    }else if(type==='undo'&&undoRecordList.length>1){
      const{activeId,virtualDomData} = undoRecordList[1];
      redoRecordList.unshift(undoRecordList[0]);
      undoRecordList.shift();
      this.setState({
        activeId,
        virtualDomData
      });
    }else if(type==='redo'&&redoRecordList.length>0){
      const{activeId,virtualDomData} = redoRecordList[0];
      undoRecordList.unshift(redoRecordList[0]);
      redoRecordList.shift();
      this.setState({
        activeId,
        virtualDomData
      });
    }
  }
  handleTabChange=(key:string)=>{
    this.setState({
      activeTab:key
    });
  }
  componentDidMount(){
    const {activeId,virtualDomData} = this.state;
    undoRecordList.push({
      activeId,
      virtualDomData
    });
  }
  render() {
    const {virtualDomData,activeId,activeTab,actionButtonList,status} = this.state;
    return (
      <LocaleProvider locale={zhCN}>
        <div className={classnames("easy-component",{
          "preview":status==='preview'
        })}>
          <a className="btn-exit-preview" href="javascript:void(0);" onClick={()=>this.setState({status:'normal'})}><Icon type="eye-invisible" /></a>
          <div className="left">
            <header className="header">
              {
                actionButtonList.map((actionButton)=>{
                  const {title,icon,key} = actionButton;
                  const wrappedContent = <a className="btn-action" href="javascript:void(0);" onClick={this.handleActionButtonClick.bind(this,key)}><Icon type={icon} /></a>
                  return <Tooltip key={key} title={title}>{wrappedContent}</Tooltip>
                })
              }

            </header>
            <main className="main">
              <ComponentDrawingBoard
                status={status}
                activeId={activeId}
                virtualDomData={virtualDomData}
                onRemove={this.handleComponentDrawingBoardAction.bind(this,'delete')}
                onCopy={this.handleComponentDrawingBoardAction.bind(this,'copy')}
                onFindParent={this.handleComponentDrawingBoardAction.bind(this,'findParent')}
                onActiveIdChange={this.handleActiveIdChange}/>
            </main>
          </div>
          <div className="right">
            <Tabs onChange={this.handleTabChange} activeKey={activeTab}>
              <TabPane tab="元素" key="elementsPane"></TabPane>
              <TabPane tab="结构" key="virtualDomTree"></TabPane>
              <TabPane tab="属性" key="propertyInfo"></TabPane>
            </Tabs>
            {
              activeTab==='elementsPane'&&<ElementsPane activeId={activeId}/>
            }
            {
              activeTab==='virtualDomTree'&& <VirtualDomTree
                                  activeId={activeId}
                                  virtualDomData={virtualDomData}
                                  onChange={this.handleVirtualDomTreeChange}
                                  onActiveIdChange={this.handleActiveIdChange}/>
            }
            {
              activeTab==='propertyInfo'&& <PropertyInfo
                                  activeId={activeId}
                                  virtualDomData={virtualDomData}
                                  onChange={this.handleVirtualDomTreeChange}/>
            }
          </div>
        </div>
      </LocaleProvider>
   );
  }
}
