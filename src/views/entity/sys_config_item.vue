<!-- Created by ctsi-biyi-generator -->
<template>
  <Card>
    <Form ref="formSysConfig" :model="sysConfig" :rules="ruleValidate" :label-width="100">
	        <FormItem :label="this.$t('sysConfig.confId.label')" prop="confId" >
		            <InputNumber v-model="sysConfig.confId" disabled v-if="this.$route.params.confId"/>
		            <InputNumber v-model="sysConfig.confId" v-else />
		    </FormItem>        
	  	
        <FormItem :label="this.$t('sysConfig.name.label')" prop="name">
	        <Input v-model="sysConfig.name" :placeholder="this.$t('sysConfig.name.holder')" />
        </FormItem>        
        <FormItem :label="this.$t('sysConfig.parentId.label')" prop="parentId">
            <InputNumber v-model="sysConfig.parentId" :placeholder="this.$t('sysConfig.parentId.holder')" />
        </FormItem>        
        <FormItem :label="this.$t('sysConfig.nodeValue.label')" prop="nodeValue">
	        <Input v-model="sysConfig.nodeValue" :placeholder="this.$t('sysConfig.nodeValue.holder')" />
        </FormItem>        
        <FormItem :label="this.$t('sysConfig.code.label')" prop="code">
	        <Input v-model="sysConfig.code" :placeholder="this.$t('sysConfig.code.holder')" />
        </FormItem>        
        <FormItem :label="this.$t('sysConfig.sysConfDesc.label')" prop="sysConfDesc">
	        <Input v-model="sysConfig.sysConfDesc" :placeholder="this.$t('sysConfig.sysConfDesc.holder')" />
        </FormItem>        
        <FormItem :label="this.$t('sysConfig.statusDate.label')" prop="statusDate">
            <DatePicker type="datetime" v-model="sysConfig.statusDate" :placeholder="this.$t('sysConfig.statusDate.holder')" style="width: 200px" />
        </FormItem>        
        <FormItem :label="this.$t('sysConfig.statusCd.label')" prop="statusCd">
	        <Input v-model="sysConfig.statusCd" :placeholder="this.$t('sysConfig.statusCd.holder')" />
        </FormItem>        
        <FormItem :label="this.$t('sysConfig.createDate.label')" prop="createDate">
            <DatePicker type="datetime" v-model="sysConfig.createDate" :placeholder="this.$t('sysConfig.createDate.holder')" style="width: 200px" />
        </FormItem>        
        <FormItem :label="this.$t('sysConfig.updateDate.label')" prop="updateDate">
            <DatePicker type="datetime" v-model="sysConfig.updateDate" :placeholder="this.$t('sysConfig.updateDate.holder')" style="width: 200px" />
        </FormItem>        
        <FormItem>
            <Button type="primary" @click="handleSubmit('formSysConfig')">{{ $t('submitText') }}</Button>
            <Button type="default" @click="handleReset('formSysConfig')" style="margin-left: 8px"> {{ $t('cancelText') }}</Button>
        </FormItem>       
    </Form>
  </Card>
</template>
<script>
import Util from '@/libs/util.js';

export default {
  data() {
    return {
      sysConfig: {
        confId: null,
        name: null,
        parentId: null,
        nodeValue: null,
        code: null,
        sysConfDesc: null,
        statusDate: null,
        statusCd: null,
        createDate: null,
        updateDate: null,
      },
      ruleValidate: {  
      	confId: [
          {
            type: "integer",
            required: true,
            message: this.$t("sysConfig.confId.required"),
            trigger: "blur"
          }
        ],	
        name: [
          {
            type: "string",
            max: 255,
            message: this.$t("sysConfig.name.max"),
            trigger: "blur"
          }
         
        ],	        
        parentId: [
         
        ],	        
        nodeValue: [
          {
            type: "string",
            max: 1000,
            message: this.$t("sysConfig.nodeValue.max"),
            trigger: "blur"
          }
         
        ],	        
        code: [
          {
            required: true,
            message: this.$t("sysConfig.code.required"),
            trigger: "blur"
          },
          {
            type: "string",
            max: 100,
            message: this.$t("sysConfig.code.max"),
            trigger: "blur"
          }
         
        ],	        
        sysConfDesc: [
          {
            type: "string",
            max: 255,
            message: this.$t("sysConfig.sysConfDesc.max"),
            trigger: "blur"
          }
         
        ],	        
        statusDate: [
         
        ],	        
        statusCd: [
          {
            type: "string",
            max: 6,
            message: this.$t("sysConfig.statusCd.max"),
            trigger: "blur"
          }
         
        ],	        
        createDate: [
         
        ],	        
        updateDate: [
         
        ],	        
      }
    };
  },
  computed: {},
  methods: {
    init() {
      	let confId = this.$route.params.confId;
      if (confId) {
        this.getItem(confId);
      }
    },
    handleSubmit(name) {
      	let confId = this.$route.params.confId;
      this.$refs[name].validate(valid => {
        if (valid) {
          if (confId) {
            this.updateItem(this.sysConfig);
          } else {
            this.createItem(this.sysConfig);
          }
        } else {
          this.$Message.error(this.$t('errorText'));
        }
      });
    },
    handleReset(name) {
      this.$refs[name].resetFields();

      let tagName = this.$route.name;
      //this.$store.commit("removeTag", tagName);
      //this.$store.commit("closePage", tagName);

      this.$router.push({
        name: "sys_config"
      });
    },
    getItem(confId) {
      let self = this;
      Util.ajax
        .get(`/api/sysConfigs/${confId}`)
        .then(response => {
          self.sysConfig = response.data;
        })
        .catch(e => {
          console.log(e);
          //this.errors.push(e);
        });
    },
    createItem(postBody) {
      let self = this;
      Util.ajax
        .post(`/api/sysConfigs`, postBody)
        .then(response => {
          this.$Message.success(this.$t('successText'));

          self.$router.push({
            name: "sys_config"
          });
        })
        .catch(e => {
          console.log(e);
          //this.errors.push(e);
        });
    }
    ,
    updateItem(putBody) {
      let self = this;
      Util.ajax
        .put(`/api/sysConfigs`, putBody)
        .then(response => {
          this.$Message.success(this.$t('successText'));
          self.$router.push({
            name: "sys_config"
          });
        })
        .catch(e => {
          console.log(e);
          //this.errors.push(e);
        });
    }
  },
  mounted() {
    this.init();
  },
  activated() {
    this.init();
  }
};
</script>
