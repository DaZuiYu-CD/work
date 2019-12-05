<!-- Created by ctsi-biyi-generator -->
<style lang="less">
@import "../../styles/common.less";
@import "../tables/components/table.less";
</style>

<template>
    <div>
        <Row>
         <Input v-model="searchAttrValue" :placeholder="$t('imageAttr.searchAttrValue.holder')" style="width: 200px" />
          <span @click="handleSearch" style="margin: 0 10px;"><Button type="primary" icon="search">{{$t('searchText')}}</Button></span>
          <Button @click="handleCancel" type="default" >{{$t('cancelText')}}</Button>
			<Button @click="handleCreateOrEditItem({imageAttrId:0 })" type="primary" style="margin-right: 10px;float:right" icon="new">{{$t('newText')}}</Button>
        </Row>
        <Row class="margin-top-10 searchable-table-con1" style="width:100%">
          <Table :columns="columns"  :data="dataList"></Table>
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
      dataCount: 0,
      currentPageNum: 0,
      pageSize: 5,
      columns: [
        {
          key: "imageAttrId",
          title: this.$t('imageAttr.imageAttrId.label')
        },
        {
          key: "imageId",
          title: this.$t('imageAttr.imageId.label')
        },
        {
          key: "mainAttrId",
          title: this.$t('imageAttr.mainAttrId.label')
        },
        {
          key: "subAttrId",
          title: this.$t('imageAttr.subAttrId.label')
        },
        {
          key: "attrValue",
          title: this.$t('imageAttr.attrValue.label')
        },
        {
          key: "statusCd",
          title: this.$t('imageAttr.statusCd.label')
        },
        {
          key: "statusDate",
          title: this.$t('imageAttr.statusDate.label')
        },
        {
          key: "updateDate",
          title: this.$t('imageAttr.updateDate.label')
        },
        {
          key: "createDate",
          title: this.$t('imageAttr.createDate.label')
        },
        {
          key: "remark",
          title: this.$t('imageAttr.remark.label')
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
                    type: "primary"
                  },
                  on: {
                    click: () => {
                      this.handleCreateOrEditItem({ imageAttrId: params.row.imageAttrId });
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
                    transfer: true
                  },
                  on: {
                    "on-ok": () => {
                      this.delete(params.row._index, params.row.imageAttrId);
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
                        placement: "top"
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
      searchAttrValue: "",
      dataList: []
    };
  },
  methods: {
    init() {
      this.search({ size: this.pageSize });
    },
    delete(index, imageAttrId) {
      let self = this;
      let page = this.currentPageNum;

      Util.ajax
        .delete("/api/imageAttrs" + "/" + imageAttrId)
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
        .get("/api/imageAttrsByCriteria", {
          params: argumentObj
        })
        .then(function(response) {
          self.dataList = response.data.data;
          self.dataCount = response.data.recordsTotal;

        })
        .catch(function(error) {
          console.log(error);
        });
    },

    handleSearch() {
      this.search({
        size: this.pageSize,
        "attrValue.contains": this.searchAttrValue
      });
    },
    handleCancel() {
      this.searchAttrValue = null;
      this.init();
    },
    handlePageChange(pageNum) {
      this.currentPageNum = pageNum;

      this.search({
        size: this.pageSize,
        page: pageNum - 1,
        "attrValue.contains": this.searchAttrValue

      });
    }
    ,
    handleCreateOrEditItem(argu) {
      this.$router.push({
        name: "image_attr_item",
        params: argu
      });
    }
  },
  mounted() {
    this.init();
  }
};
</script>
