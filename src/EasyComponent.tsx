import React, { ComponentType} from 'react';
import classnames from 'classnames';
import {LocaleProvider ,Tabs,Icon, Tooltip,Modal} from 'antd';
import zhCN from 'antd/lib/locale-provider/zh_CN';
import {prefixClassName,mainClassName,OperationType,VirtualDom,undoRecordList,redoRecordList} from './constant';
import DrawingBoard from './components/drawingBoard';
import PropertyInfo from './components/propertyInfo';
import VirtualDomTree,{findNodeById,recreateNodeId} from './components/virtualDomTree';
import ElementsPane from './components/elementsPane';
import JsonView from './components/jsonView';
import {cloneDeep,isUndefined,isArray,isFunction} from 'lodash';
const TabPane = Tabs.TabPane;
const confirm = Modal.confirm;

interface EasyComponentProps{
  defaultVirtualDomData?:VirtualDom[],
  onSave?(virtualDomData:VirtualDom[]):void
}

interface ActionButton {
  title:string,
  key:string,
  icon:string,
  status?:'normal'|'no-border'|'preview',
  style?:{
    [propName:string]:number|string
  }
}
interface EasyComponentState{
  activeId:string,
  activeTab:string,
  jsonViewVisible:boolean,
  virtualDomData:VirtualDom[],
  actionButtonList:ActionButton[],
  status:string
}
export default class EasyComponent extends React.PureComponent<EasyComponentProps,EasyComponentState>{
  readonly state:EasyComponentState={
    activeId:'',
    activeTab:'virtualDomTree',
    jsonViewVisible:false,
    actionButtonList:[{
      title:'边框',
      key:'border',
      icon:'border',
      status:'normal'
    },{
      title:'无边框',
      key:'no-border',
      icon:'border',
      status:'no-border',
      style:{
        color:'rgba(170,170,170,0.7)'
      }
    },{
      title:'虚拟树Json',
      key:'virtual-dom-tree',
      icon:'code'
    },{
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
    },{
      title:'保存',
      key:'save',
      icon:'check'
    }],
    status:'normal',
    virtualDomData:[]
  }
  static getDerivedStateFromProps(nextProps:EasyComponentProps, prevState:EasyComponentState) {
    const {defaultVirtualDomData} = nextProps;
    const {virtualDomData} = prevState;
    if(virtualDomData.length===0&&isArray(defaultVirtualDomData)){
      return {
        virtualDomData:defaultVirtualDomData
      }
    }
  }
  handleVirtualDomTreeChange=(newVirtualDomData:VirtualDom[])=>{
    this.setState({
      virtualDomData:newVirtualDomData
    },this.addRecord);
  }
  handleActiveIdChange=(activeId:string)=>{
    this.setState({
      activeId
    },this.addRecord);
  }
  handleComponentDrawingBoardAction=(type:OperationType)=>{
    const {activeId,virtualDomData} = this.state;
    const data = [...virtualDomData];
    if(type==='delete'){
      findNodeById(data,activeId,true);
      this.setState({
        activeId:'',
        virtualDomData:data
      },this.addRecord);
    }else if(type==='copy'){
      const {parentNode,index,node} = findNodeById(data,activeId,false);
      const copyNode = recreateNodeId(cloneDeep(node));
      Array.isArray(parentNode.children)&&parentNode.children.splice(index+1,0,copyNode);
      this.setState({
        virtualDomData:data
      },this.addRecord);
    }else if(type==='findParent'){
      const {parentNode} = findNodeById(data,activeId,false);
      const newActiveId = parentNode.id==='root'?'':parentNode.id;
      this.setState({
        activeId: newActiveId
      },this.addRecord);
    }else{
      return;
    }
  }
  addRecord(){
    const {activeId,virtualDomData} = this.state;
    undoRecordList.unshift({
      activeId,
      virtualDomData
    });
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
    }else if(type==='border'){
      this.setState({
        status:'no-border'
      });
    }else if(type==='no-border'){
      this.setState({
        status:'normal'
      });
    }else if(type==='virtual-dom-tree'){
      this.setState({
        jsonViewVisible:true
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
    }else if(type==='save'){
      const {onSave} = this.props;
      isFunction(onSave)&&onSave(virtualDomData);
      undoRecordList.length=0;
      redoRecordList.length=0;
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
    const {virtualDomData,activeId,activeTab,actionButtonList,status,jsonViewVisible} = this.state;
    return (
      <LocaleProvider locale={zhCN}>
        <div className={classnames(mainClassName,{
          "preview":status==='preview'
        })}>
          <a className={`${prefixClassName}-btn-exit-preview`} href="javascript:void(0);" onClick={()=>this.setState({status:'normal'})}><Icon type="eye-invisible" /></a>
          <div className={`${mainClassName}-left`}>
            <header className={`${mainClassName}-header`}>
              {
                actionButtonList.filter((actionButton)=>isUndefined(actionButton.status)||actionButton.status===status).map((actionButton)=>{
                  const {title,icon,key,style} = actionButton;
                  const wrappedContent = <a className="btn-action" href="javascript:void(0);" onClick={this.handleActionButtonClick.bind(this,key)}><Icon style={style} type={icon} /></a>
                  return <Tooltip key={key} title={title}>{wrappedContent}</Tooltip>
                })
              }

            </header>
            <main className={`${mainClassName}-main`}>
              <DrawingBoard
                status={status}
                activeId={activeId}
                virtualDomData={virtualDomData}
                onChange={this.handleVirtualDomTreeChange}
                onRemove={this.handleComponentDrawingBoardAction.bind(this,'delete')}
                onCopy={this.handleComponentDrawingBoardAction.bind(this,'copy')}
                onFindParent={this.handleComponentDrawingBoardAction.bind(this,'findParent')}
                onActiveIdChange={this.handleActiveIdChange}/>
            </main>
          </div>
          <div className={`${mainClassName}-right`}>
            <Tabs onChange={this.handleTabChange} activeKey={activeTab}>
              <TabPane tab="元素" key="elementsPane"></TabPane>
              <TabPane tab="结构" key="virtualDomTree"></TabPane>
              <TabPane tab="属性" key="propertyInfo"></TabPane>
            </Tabs>
            {activeTab==='elementsPane'&&<ElementsPane key={`ElementsPane-${activeId}`} activeId={activeId}/>}
            {activeTab==='virtualDomTree'&& <VirtualDomTree key={`VirtualDomTree-${activeId}`} activeId={activeId} virtualDomData={virtualDomData} onChange={this.handleVirtualDomTreeChange} onActiveIdChange={this.handleActiveIdChange}/>}
            {activeTab==='propertyInfo'&& <PropertyInfo key={`PropertyInfo-${activeId}`} activeId={activeId} virtualDomData={virtualDomData} onChange={this.handleVirtualDomTreeChange}/>}
          </div>
          <JsonView visible={jsonViewVisible} json={virtualDomData} onCancel={()=>{this.setState({jsonViewVisible:false})}}/>
        </div>
      </LocaleProvider>
   );
  }
}
