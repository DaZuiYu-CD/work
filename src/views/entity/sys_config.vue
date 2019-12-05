<!-- Created by ctsi-biyi-generator -->
<style lang="less">
@import "../../styles/common.less";
@import "../tables/components/table.less";
</style>

<template>
    <div>
        <Row>
                    <Input v-model="searchName" :placeholder="$t('sysConfig.searchName.holder')" style="width: 200px" />
          <span @click="handleSearch" style="margin: 0 10px;"><Button type="primary" icon="search">{{$t('searchText')}}</Button></span>
          <Button @click="handleCancel" type="default" >{{$t('cancelText')}}</Button>
			<Button @click="handleCreateOrEditItem({confId:0 })" type="primary" style="margin-right: 10px;float:right" icon="new">{{$t('newText')}}</Button>
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
          key: "confId",
          title: this.$t('sysConfig.confId.label')
        },
        {
          key: "name",
          title: this.$t('sysConfig.name.label')
        },
        {
          key: "parentId",
          title: this.$t('sysConfig.parentId.label')
        },
        {
          key: "nodeValue",
          title: this.$t('sysConfig.nodeValue.label')
        },
        {
          key: "code",
          title: this.$t('sysConfig.code.label')
        },
        {
          key: "sysConfDesc",
          title: this.$t('sysConfig.sysConfDesc.label')
        },
        {
          key: "statusDate",
          title: this.$t('sysConfig.statusDate.label')
        },
        {
          key: "statusCd",
          title: this.$t('sysConfig.statusCd.label')
        },
        {
          key: "createDate",
          title: this.$t('sysConfig.createDate.label')
        },
        {
          key: "updateDate",
          title: this.$t('sysConfig.updateDate.label')
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
                      this.handleCreateOrEditItem({ confId: params.row.confId });
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
                      this.delete(params.row._index, params.row.confId);
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
      searchName: "",
      dataList: []
    };
  },
  methods: {
    init() {
      this.search({ size: this.pageSize });
    },
    delete(index, confId) {
      let self = this;
      let page = this.currentPageNum;

      Util.ajax
        .delete("/api/sysConfigs" + "/" + confId)
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
        .get("/api/sysConfigsByCriteria", {
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
        "name.contains": this.searchName
      });
    },
    handleCancel() {
      this.searchName = null;
      this.init();
    },

    handlePageChange(pageNum) {
      this.currentPageNum = pageNum;

      this.search({
        size: this.pageSize,
        page: pageNum - 1,
        "name.contains": this.searchName

      });
    }
    ,
    handleCreateOrEditItem(argu) {
      this.$router.push({
        name: "sys_config_item",
        params: argu
      });
    }
  },
  mounted() {
    this.init();
  }
};
</script>
