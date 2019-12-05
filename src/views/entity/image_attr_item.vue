<!-- Created by ctsi-biyi-generator -->
<template>
  <Card>
    <Form ref="formImageAttr" :model="imageAttr" :rules="ruleValidate" :label-width="100">
	        <FormItem :label="this.$t('imageAttr.imageAttrId.label')" prop="imageAttrId" v-if="this.$route.params.imageAttrId">
		            <InputNumber v-model="imageAttr.imageAttrId" disabled />		    </FormItem>        
	  	
        <FormItem :label="this.$t('imageAttr.imageId.label')" prop="imageId">
            <InputNumber v-model="imageAttr.imageId" :placeholder="this.$t('imageAttr.imageId.holder')" />
        </FormItem>        
        <FormItem :label="this.$t('imageAttr.mainAttrId.label')" prop="mainAttrId">
            <InputNumber v-model="imageAttr.mainAttrId" :placeholder="this.$t('imageAttr.mainAttrId.holder')" />
        </FormItem>        
        <FormItem :label="this.$t('imageAttr.subAttrId.label')" prop="subAttrId">
            <InputNumber v-model="imageAttr.subAttrId" :placeholder="this.$t('imageAttr.subAttrId.holder')" />
        </FormItem>        
        <FormItem :label="this.$t('imageAttr.attrValue.label')" prop="attrValue">
	        <Input v-model="imageAttr.attrValue" :placeholder="this.$t('imageAttr.attrValue.holder')" />
        </FormItem>        
        <FormItem :label="this.$t('imageAttr.statusCd.label')" prop="statusCd">
	        <Input v-model="imageAttr.statusCd" :placeholder="this.$t('imageAttr.statusCd.holder')" />
        </FormItem>        
        <FormItem :label="this.$t('imageAttr.statusDate.label')" prop="statusDate">
            <DatePicker type="datetime" v-model="imageAttr.statusDate" :placeholder="this.$t('imageAttr.statusDate.holder')" style="width: 200px" />
        </FormItem>        
        <FormItem :label="this.$t('imageAttr.updateDate.label')" prop="updateDate">
            <DatePicker type="datetime" v-model="imageAttr.updateDate" :placeholder="this.$t('imageAttr.updateDate.holder')" style="width: 200px" />
        </FormItem>        
        <FormItem :label="this.$t('imageAttr.createDate.label')" prop="createDate">
            <DatePicker type="datetime" v-model="imageAttr.createDate" :placeholder="this.$t('imageAttr.createDate.holder')" style="width: 200px" />
        </FormItem>        
        <FormItem :label="this.$t('imageAttr.remark.label')" prop="remark">
	        <Input v-model="imageAttr.remark" :placeholder="this.$t('imageAttr.remark.holder')" />
        </FormItem>        
        <FormItem>
            <Button type="primary" @click="handleSubmit('formImageAttr')">{{ $t('submitText') }}</Button>
            <Button type="default" @click="handleReset('formImageAttr')" style="margin-left: 8px"> {{ $t('cancelText') }}</Button>
        </FormItem>       
    </Form>
  </Card>
</template>
<script>
import Util from '@/libs/util.js';

export default {
  data() {
    return {
      imageAttr: {
        imageAttrId: null,
        imageId: null,
        mainAttrId: null,
        subAttrId: null,
        attrValue: null,
        statusCd: null,
        statusDate: null,
        updateDate: null,
        createDate: null,
        remark: null,
      },
      ruleValidate: {  
        imageId: [
         
        ],	        
        mainAttrId: [
         
        ],	        
        subAttrId: [
         
        ],	        
        attrValue: [
          {
            type: "string",
            max: 1000,
            message: this.$t("imageAttr.attrValue.max"),
            trigger: "blur"
          }
         
        ],	        
        statusCd: [
          {
            type: "string",
            max: 255,
            message: this.$t("imageAttr.statusCd.max"),
            trigger: "blur"
          }
         
        ],	        
        statusDate: [
         
        ],	        
        updateDate: [
         
        ],	        
        createDate: [
         
        ],	        
        remark: [
          {
            type: "string",
            max: 1000,
            message: this.$t("imageAttr.remark.max"),
            trigger: "blur"
          }
         
        ],	        
      }
    };
  },
  computed: {},
  methods: {
    init() {
      	let imageAttrId = this.$route.params.imageAttrId;
      if (imageAttrId) {
        this.getItem(imageAttrId);
      }
    },
    handleSubmit(name) {
      	let imageAttrId = this.$route.params.imageAttrId;
      this.$refs[name].validate(valid => {
        if (valid) {
          if (imageAttrId) {
            this.updateItem(this.imageAttr);
          } else {
            this.createItem(this.imageAttr);
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
        name: "image_attr"
      });
    },
    getItem(imageAttrId) {
      let self = this;
      Util.ajax
        .get(`/api/imageAttrs/${imageAttrId}`)
        .then(response => {
          self.imageAttr = response.data;
        })
        .catch(e => {
          console.log(e);
          //this.errors.push(e);
        });
    },
    createItem(postBody) {
      let self = this;
      Util.ajax
        .post(`/api/imageAttrs`, postBody)
        .then(response => {
          this.$Message.success(this.$t('successText'));

          self.$router.push({
            name: "image_attr"
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
        .put(`/api/imageAttrs`, putBody)
        .then(response => {
          this.$Message.success(this.$t('successText'));
          self.$router.push({
            name: "image_attr"
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
