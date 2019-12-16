<!-- Created by ctsi-biyi-generator -->
<style lang="less">
@import "../../styles/common.less";
@import "../tables/components/table.less";
</style>

<template>
    <div>
        <Modal v-model="modal1" title="镜像属性" width="900">
          <i-table :columns="columns2" :data="imageAttrs"></i-table>
          <div slot="footer">
            <i-button type="primary" size="small"  @click="cancelImageAttr">确定</i-button>
          </div>
        </Modal>
        <Row>
          <Input v-model="searchImageName" :placeholder="$t('image.searchImageName.holder')" style="width: 200px" />
          <span @click="handleSearch" style="margin: 0 10px;"><Button type="primary" icon="search">{{$t('searchText')}}</Button></span>
          <Button @click="handleCancel" type="default" >{{$t('cancelText')}}</Button>
			    <Button @click="handleCreateOrEditItem({imageId:0 })" type="primary" style="margin-right: 10px;float:right" icon="new">{{$t('newText')}}</Button>
        </Row>
        <Row class="margin-top-10 searchable-table-con1" style="width:100%">
          <Table :columns="columns"  :data="dataList" @on-row-click="showImageAttrs"></Table>
          <Row type="flex" justify="end" align="middle">
            <Page :total="dataCount" :page-size="pageSize" @on-change="handlePageChange" show-elevator show-total style="padding: 10px;"></Page>
          </Row>
        </Row>
    </div>
</template>

<script>
import Util from '@/libs/util.js';


export default {
  name: "searchable-table",

  data() {
    return {
      responseData: null,
      imageAttrName: [],
      modal1:false,
      dataCount: 0,
      currentPageNum: 0,
      pageSize: 5,
      columns: [
        {
          key: "imageId",
          title: this.$t('image.imageId.label'),
          width: '80px'
        },
        {
          key: "imageName",
          title: this.$t('image.imageName.label')
        },
        {
          key: "imageType",
          title: this.$t('image.imageType.label')
        },
        {
          key: "version",
          title: this.$t('image.version.label')
        },
        {
          key: "subVersion",
          title: this.$t('image.subVersion.label')
        },
        {
          key: "format",
          title: this.$t('image.format.label')
        },
        {
          key: "checkSum",
          title: this.$t('image.checkSum.label'),
          render:(h,params)=> {
            return h('span',{
              style: {
                display: 'inline-block',
                width: '100%',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              },
              attrs: {title:  params.row.checkSum}
            },params.row.checkSum)
          }
        },
        {
          key: "uri",
          title: this.$t('image.uri.label'),
          render:(h,params)=> {
            return h('span',{
              style: {
                display: 'inline-block',
                width: '100%',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              },
              attrs: {title:  params.row.uri}
            },params.row.uri)
          }
        },
        {
          key: "fileKey",
          title: this.$t('image.fileKey.label')
        },
        {
          key: "statusCd",
          title: this.$t('image.statusCd.label')
        },
        // {
        //   key: "statusDate",
        //   title: this.$t('image.statusDate.label')
        // },
        // {
        //   key: "updateDate",
        //   title: this.$t('image.updateDate.label')
        // },
        // {
        //   key: "createDate",
        //   title: this.$t('image.createDate.label')
        // },
        {
          key: "remark",
          title: this.$t('image.remark.label'),
          render:(h,params)=> {
            return h('span',{
              style: {
                display: 'inline-block',
                width: '100%',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              },
              attrs: {title:  params.row.remark}
            },params.row.remark)
          }
        },
        {
          key: "updateDate",
          title: '更新时间',
          // render: (h,params)=>{
          //   return h('div',
          //       myFormatDate(params.row.updateDate)
          //   )
          // }
          render:(h,params)=> {
            return h('span',{
              style: {
                display: 'inline-block',
                width: '100%',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              },
              attrs: {title:  myFormatDate(params.row.updateDate)}
            },params.row.updateDate)
          }
        },
        {
          title: this.$t('operateText'),
          align: "center",
          width: 190,
          key: "handle",
          render: (h, params) => {
            return h("div", [
              h(
                "Button",
                {
                  props: {
                    type: "primary",
                    size: 'small'
                  },
                  on: {
                    click: () => {
                      this.handleCreateOrEditItem({ imageId: params.row.imageId });
                    }
                  }
                },
                this.$t("editText")
              ),
              h(
                "Poptip",
                {
                  props: {
                    confirm: true,
                    title: this.$t('deletePopTip'),
                    transfer: true,
                  },
                  on: {
                    "on-ok": () => {
                      this.delete(params.row._index, params.row.imageId);
                    }
                  }
                },
                [
                  h(
                    "Button",
                    {
                      style: {
                        margin: "0 5px"
                      },
                      props: {
                        type: "error",
                        placement: "top",
                        size: 'small'
                      }
                    },
                   this.$t("deleteText")
                  )
                ]
              )
            ]);
          }
        }
      ],
      columns2:[
        {
          title: '主属性',
          key: 'mainAttrId'
        },
        {
          title: '副属性',
          key: 'subAttrId'
        },
        {
          title: '属性值',
          key: 'attrValue'
        },
        {
          title: '状态',
          key: 'statusCd'
        },
        {
          title: '备注',
          key: 'remark'
        }

      ],
      searchImageName: "",
      dataList: [],
      imageAttrs: []
    };
  },
  methods: {
    init() {
      this.search({ size: this.pageSize });
      // test(this.dataList);
      this.fetchSysData();
    },
    delete(index, imageId) {
      let self = this;
      let page = this.currentPageNum;

      Util.ajax
        .delete("/api/images" + "/" + imageId)
        .then(function(response) {
          self.dataList.splice(index, 1);
          self.dataCount--;
          //console.log("delete....",self.dataList.length,page)
          if(self.dataList.length == 0 && page > 1) {
            self.handlePageChange(page-1)
          }
          self.$Message.success(self.$t('successText'));
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    search(argumentObj) {
      let self = this;

      Util.ajax
        .get("/api/imagesByCriteria", {
          params: argumentObj
        })
        .then(function(response) {
          self.dataList = response.data.data;
          self.dataCount = response.data.recordsTotal;
          console.log('ajax init')
          console.log('ajax responseData')
          console.log(response.data)
          console.log('ajax dataList')
          console.log(self.dataList)
          self.typeAndFormat();
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    showImageAttrs(data){
      console.log(data)
      this.modal1 = true
      let vm = this
      Util.ajax
          .get(`/api/getImageAttrsByImageId/` + data.imageId)
          .then(response => {
            vm.imageAttrs = response.data
              for (let i of vm.imageAttrs){
                for (let j of vm.imageAttrName){
                  if (i.mainAttrId == j.confId){
                    i.mainAttrId = j.name
                  }else {
                    if (i.subAttrId == j.confId){
                      i.subAttrId = j.name
                  }
                }
              }
            }
          })
          .catch(error =>{
            console.log('getImageAttrsByImageId Error')
            console.log(error)
          })
    },
    cancelImageAttr(){
      this.modal1 = false
    },
    handleSearch() {
      this.search({
        size: this.pageSize,
        "imageName.contains": this.searchImageName
      });
    },
    handleCancel() {
      this.searchImageName = null;
      this.init();
    },
    handlePageChange(pageNum) {
      this.currentPageNum = pageNum;

      this.search({
        size: this.pageSize,
        page: pageNum - 1,
        "imageName.contains": this.searchImageName

      });
    },
    handleCreateOrEditItem(argu) {
      this.$router.push({
        name: "image_item",
        params: argu
      });
    },
    typeAndFormat() {
      let vm = this
      // console.log('intotype')
      // // console.log(this)
      //  console.log(this.dataList)
      console.log('修改前')
      console.log(vm.dataList)
      Util.ajax.get('/api/myImageTypeAndFormat')
          .then(response =>{
            for(let i of response.data){
              if(i.parentId == 1000){
                for(let j in vm.dataList){
                  if (vm.dataList[j].imageType == i.nodeValue)
                    vm.dataList[j].imageType = i.name
                }
              }else if (i.parentId == 2000){
                for(let j in vm.dataList){
                  if (vm.dataList[j].format == i.nodeValue)
                    vm.dataList[j].format = i.name
                }
              }
            }
            console.log('修改后')
            console.log(vm.dataList)
          }).catch()
    },
    fetchSysData(){
      let vm = this
      Util.ajax
          .get(`/api/myGetSysConfigsList`)
          .then(response =>{
            console.log('into myGetSysConfigsList')
            // vm.imageAttrName = response.data
            for (let i of response.data){
              if (i.confId >= 12000 )
                vm.imageAttrName.push(i)
            }
          })
          .catch(error => {
            console.log('myGetSysConfigsList Error')
            console.log(error)
          })
    }
  },
  mounted() {
    this.init();
  }
};
function myFormatDate(date) {
  if (!date || date == '')
    return '222'
  let dates = date.split('T')
  let res = dates[0]
  dates = dates[1].split('+')
  res += ' ' + dates[0]
  return res
}
</script>
