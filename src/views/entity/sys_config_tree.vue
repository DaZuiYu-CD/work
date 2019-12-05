<template>
  <div>
    <Row  :gutter="16" type="flex" justify="center" align="top">
      <Col span="11" style="border: #f0f0f0 1px solid; margin:5px;">
      <Tree :data="sysConfigTreeData" :render="renderContent" :key="flushValue"></Tree>
      </Col>
      <Col span="11" style="border: #f0f0f0 1px solid; margin:5px;padding:5px;">
      <Form ref="sysConfig" :model="sysConfig" :label-width="100" >
        <Row type="flex" justify="center" :gutter="16">
          <Col span="18">
          <FormItem prop="confId" label="confId">
            <Input type="text" v-model="sysConfig.confId" placeholder="confId"/>
          </FormItem>
          <FormItem prop="name" label="name">
            <Input type="text" v-model="sysConfig.name" placeholder="name">
            <Icon type="md-create" size="18" slot="prepend"></Icon>
            </Input>
          </FormItem>
          <FormItem prop="nodeValue" label="nodeValue">
            <Input type="text" v-model="sysConfig.nodeValue" placeholder="nodeValue">
            </Input>
          </FormItem>
          <FormItem prop="code" label="code">
            <Input type="text" v-model="sysConfig.code" placeholder="code">
            </Input>
          </FormItem>
         <FormItem prop="sysConfDesc" label="sysConfDesc">
              <Input type="text" v-model="sysConfig.sysConfDesc" placeholder="sysConfDesc">
              </Input>
         </FormItem>

          </Col>
        </Row>
      </Form>
      </Col>
    </Row>
    <Row>
      <Col span="6" offset="17">
      <ctsi-button code="cscp.org.edit" type="primary" @click="saveSysConfig()">提交</ctsi-button>
      </Col>
    </Row>
  </div>
</template>

<script>
  import util from '@/libs/util.js';
  import sys_config from "../../locale/sys_config";

  let treeLeafFontSize = '12pt';
  export default {
      components: {},
      data() {
        return {
          sysConfigTreeData: [],
          flushValue: 1,
          responseData:[],
          buttonProps: {
            type: 'default',
            size: 'small',
          },
          sysConfig: {
            confId: '',
            name: '',
            nodeValue: '',
            code: '',
            sysConfDesc: ''
          }
        }
      },
      methods: {
          renderContent (h, { root, node, data }) {
            return h('span', {
              style: {
                display: 'inline-block',
                width: '100%',
                fontSize: treeLeafFontSize
              }
            }, [
              h('span', [
                h('Icon', {
                  props: {
                    type: 'ios-folder-open'
                  },
                  style: {
                    marginRight: '8px'
                  }
                }),
                h('span', {style: { cursor: 'pointer',fontSize: treeLeafFontSize}, on: { click: (event) => {
                      this.sysConfig = node.node;
                    } } } , data.name)
              ]),
              h('span', {
                style: {
                  display: 'inline-block',
                  float: 'right',
                  marginRight: '32px'
                }
              }, [
                h('Button', {
                  props: Object.assign({}, this.buttonProps, {
                    icon: 'md-add'
                  }),
                  style: {
                    marginRight: '8px'
                  },
                  on: {
                    click: () => {
                      this.append(data)
                    }
                  }
                }),

                h(
                    "Poptip",
                    {
                      props: {
                        confirm: true,
                        title: this.$t('deletePopTip'),
                        transfer: true
                      },
                      on: {
                        "on-ok": () => { this.remove(root, node, data) }
                      }
                    },
                    [
                      h(
                          "Button",
                          {
                            // style: {
                            //   margin: "0 5px"
                            // },
                            props: Object.assign({}, this.buttonProps, {
                              icon: 'md-remove',
                              disabled: node.node.parentId == null
                            }),
                          },
                          // this.$t("deleteText")
                      )
                    ]
                )
              ])
            ]);
          },
          fetchData(){
            console.log('into fetchData');
            let vm = this
            this.$Spin.show()
            util.ajax.get('/api/myGetSysConfigsList').then(response => {
              vm.sysConfigTreeData = formatFetchedData(response.data);
              vm.responseData=response.data;
              console.log('into ajax.get');
              // console.log('--------------------------------------');
              // console.log(response.data);
              // console.log('--------------------------------------');
              vm.sysConfig = vm.sysConfigTreeData[0];
              // console.log('sysConfig')
              // console.log(vm.sysConfig)
              vm.$Spin.hide();
            }).catch(error => {
              console.log('error')
              console.log(error)
              vm.$Spin.hide();
            });
          },
          append (data) {
            const children = data.children || [];
            children.push({
              title: 'newNode',
              expand: true,
              confId: nextConfId(this.responseData)+this.flushValue,
              parentId: data.confId,
              name: 'new',
              nodeValue: '',
              code: '',
              sysConfDesc: ''
            });
            this.$set(data, 'children', children);
            this.flushValue++;
          },
          remove (root, node, data) {
            // console.log('remove')
            // console.log(node)
            // console.log(data)
            const parentKey = root.find(el => el == node).parent;
            const parent = root.find(el => el.nodeKey == parentKey).node;
            const index = parent.children.indexOf(data);
            removeDatabase(data);
            parent.children.splice(index, 1);
          },
          saveSysConfig(){
            // console.log('save')
            // console.log(this.sysConfig)
            let current = this.sysConfig
            let vm = this
            // console.log(typeof current.title)
              util.ajax
                  .post(`/api/myAddSysConfig`,current)
                  .then(response => {
                    console.log('add success'+current.name)
                    vm.flushValue++;
                    this.$Message.info('提交成功')
                    // vm.fetchData();
                  }).catch(error =>{
                    console.log('add error')
                this.$Message.info('提交失败')
                    console.log(error)
              })
          }
      },
    //methods结束
      created () {
        // console.log('create fetchData')
        this.fetchData()
      },
      watch:{
        flushValue:function(){
          // console.log('flushValue change')
        }
     }
   }
   //export结束
  function formatFetchedData(data){
    console.log('into formatData')
    // console.log(data)
    let temp = {}
    let tempArray = []
    let res = []
    tempArray = data
    for(let i in data){
      tempArray[i].keynode = tempArray[i].confId
      tempArray[i].title = tempArray[i].name
      // tempArray[i].expand= false
    }
    // console.log('tempArray')
    //
    // console.log(tempArray)

    for(let i in tempArray){
      temp[tempArray[i].confId] = tempArray[i]
    }
    // console.log('temp')
    // console.log(temp)
    //通过一次遍历
    for (let i in temp) {
      if (temp[i].parentId != 0 && temp[i].parentId != null) {//部位
        if (!temp[temp[i].parentId].children) {//当前元素的父元素如果没有children属性，则创建
          temp[temp[i].parentId].children = [];
        }
        //将当前元素放到父元素的children里
        temp[temp[i].parentId].children.push(temp[i]);
      } else {
        res.push(temp[i]);
      }
    }
    return res;
  }
  function removeDatabase (data) {
    // console.log('into delete')
    // console.log(data.children)
    if(data.children != undefined){
      for (let i of data.children){
        removeDatabase(i)
      }
    }
    removeDatabaseById(data.confId)
  }

  function removeDatabaseById (confId) {
    // console.log('into delete'+confId)
    util.ajax
        .delete(`/api/myDeleteById/`+confId)
        .then(response => {
          // console.log('delete success'+confId)
        })
  }


  function nextConfId(root){
    // console.log('maxLeaf')
    console.log(root)
    let max = root[root.length-1].confId;
    return max;
  }

</script>

<style scoped>
  .ivu-tree ul li{
    margin: 4px 0px;
  }
</style>
