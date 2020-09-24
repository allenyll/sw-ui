<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-input v-model="listQuery.like_name" style="width: 200px;" class="filter-item" placeholder="名称" @keyup.enter.native="handleFilter"/>
      <el-button class="filter-item" type="primary" icon="search" @click="handleFilter">搜索</el-button>
      <el-button v-if="adManager_btn_add" class="filter-item" style="margin-left: 10px;" type="primary" icon="edit" @click="handleCreate">添加</el-button>
    </div>
    <el-table v-loading.body="listLoading" :key="tableKey" :data="list" border fit highlight-current-row style="width: 100%">
      <el-table-column v-if="show" align="center" label="pk_ad_id">
        <template slot-scope="scope">
          <span>{{ scope.row.pkAdId }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" width="200px" label="广告位">
        <template slot-scope="scope">
          <span>{{ adPositionNameMap[scope.row.fkAdPositionId] }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" width="200px" label="广告名称">
        <template slot-scope="scope">
          <span>{{ scope.row.adName }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" width="100px" label="广告类型">
        <template slot-scope="scope">
          <span>{{ scope.row.adType | adTypeFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" width="200px" label="图片地址">
        <template slot-scope="scope">
          <img :src="scope.row.imageUrl" min-width="120" height="80" >
        </template>
      </el-table-column>
      <el-table-column align="center" width="100px" label="是否启用">
        <template slot-scope="scope">
          <span>{{ scope.row.isUsed | statusFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" width="200px" label="开始时间">
        <template slot-scope="scope">
          <span>{{ scope.row.startTime }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" width="200px" label="结束时间">
        <template slot-scope="scope">
          <span>{{ scope.row.endTime }}</span>
        </template>
      </el-table-column>
      <el-table-column fixed="right" align="center" label="操作" width="150px">
        <template slot-scope="scope">
          <el-button v-if="adManager_btn_edit" size="small" type="success" @click="handleUpdate(scope.row)">编辑
          </el-button>
          <el-button v-if="adManager_btn_del" size="small" type="danger" @click="handleDelete(scope.row)">删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <div v-show="!listLoading" class="pagination-container">
      <el-pagination :current-page.sync="listQuery.page" :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit" :total="total" layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="handleCurrentChange"/>
    </div>
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="广告名称" prop="adName">
              <el-input v-model="form.adName" placeholder="请输入广告名称"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="广告位" prop="fkAdPositionId">
              <el-select v-model="form.fkAdPositionId" filterable placeholder="请选择" style="wdith:100%;">
                <el-option
                  v-for="item in adPositionOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"/>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="广告类型" prop="adType">
              <el-select v-model="form.adType" style="wdith:100%;">
                <el-option key="SW2601" label="促销广告" value="SW2601"/>
                <el-option key="SW2602" label="优惠广告" value="SW2602"/>
                <el-option key="SW2603" label="招商广告" value="SW2603"/>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="页面链接" prop="link">
              <el-input v-model="form.link" placeholder="请输入页面链接"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="开始时间" prop="startTime">
              <el-date-picker
                v-model="form.startTime"
                type="datetime"
                placeholder="请选择开始时间"
                default-time="12:00:00"
                style="wdith:100%;"
                value-format="yyyy-MM-dd HH:mm:ss"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="结束时间" prop="endTime">
              <el-date-picker
                v-model="form.endTime"
                type="datetime"
                placeholder="请选择结束时间"
                default-time="12:00:00"
                style="wdith:100%;"
                value-format="yyyy-MM-dd HH:mm:ss"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="是否启用" prop="isUsed">
              <el-radio v-model="form.isUsed" label="SW1301">停用</el-radio>
              <el-radio v-model="form.isUsed" label="SW1302">启用</el-radio>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="内容" prop="connent">
              <el-input v-model="form.connent" type="textarea" placeholder="请输入内容"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="图片">
              <single-upload
                v-model="form.imageUrl"
                :upload-id="form.pkAdId"
                upload-type="SW1803"
                style="width: 300px;display: inline-block;margin-left: 10px"/>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel('form')">取 消</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="create('form')">确 定</el-button>
        <el-button v-else type="primary" @click="update('form')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { page, addObj, getObj, delObj, putObj } from '@/api/market/ad/index'
import { list as getAdPositionList } from '@/api/market/adPosition/index'
import { mapGetters } from 'vuex'
import singleUpload from '@/components/Upload/singleUpload'
export default {
  name: 'Ad',
  filters: {
    statusFilter: function(val) {
      const map = {
        'SW1301': '停用',
        'SW1302': '启用'
      }
      return map[val]
    },
    adTypeFilter: function(val) {
      const map = {
        'SW2601': '促销广告',
        'SW2602': '优惠广告',
        'SW2603': '招商广告'
      }
      return map[val]
    }
  },
  components: {
    singleUpload
  },
  data() {
    return {
      form: {
        fkAdPositionId: undefined,
        adName: undefined,
        adType: undefined,
        link: undefined,
        imageUrl: undefined,
        isUsed: 'SW1302',
        connent: undefined,
        startTime: undefined,
        endTime: undefined
      },
      rules: {
        adName: [
          {
            required: true,
            message: '请输入广告名称',
            trigger: 'blur'
          }
        ], adType: [
          {
            required: true,
            message: '请输入广告类型',
            trigger: 'blur'
          }
        ], isUsed: [
          {
            required: true,
            message: '请输入是否启用',
            trigger: 'blur'
          }
        ], startTime: [
          {
            required: true,
            message: '请输入开始时间',
            trigger: 'blur'
          }
        ], endTime: [
          {
            required: true,
            message: '请输入结束时间',
            trigger: 'blur'
          }
        ] },
      list: null,
      total: null,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        name: undefined
      },
      dialogFormVisible: false,
      dialogStatus: '',
      adManager_btn_edit: false,
      adManager_btn_del: false,
      adManager_btn_add: false,
      textMap: {
        update: '编辑',
        create: '创建'
      },
      tableKey: 0,
      show: false,
      adPositionOptions: [],
      adPositionNameMap: {},
      // 图片列表（用于在上传组件中回显图片）
      fileList: [],
      fileUrl: '',
      maxCount: 1
    }
  },
  computed: {
    ...mapGetters([
      'elements'
    ])
  },
  created() {
    this.getList(data => {
      if (!data) {
        return
      }
      this.getAdPositionList()
    })
    this.adManager_btn_edit = this.elements['market:ad:edit']
    this.adManager_btn_del = this.elements['market:ad:delete']
    this.adManager_btn_add = this.elements['market:ad:add']
  },
  methods: {
    getList(callback) {
      this.listLoading = true
      page(this.listQuery).then(response => {
        this.list = response.data.list
        this.total = response.data.total
        this.listLoading = false
        callback(true)
      }).catch((reject) => {
        callback(false)
      })
    },
    getAdPositionList() {
      getAdPositionList().then(response => {
        this.adPositionNameMap = response.data.map
        this.adPositionOptions = response.data.list
      })
    },
    handleFilter() {
      this.getList(data => {})
    },
    handleSizeChange(val) {
      this.listQuery.limit = val
      this.getList(data => {})
    },
    handleCurrentChange(val) {
      this.listQuery.page = val
      this.getList(data => {})
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
    },
    handleUpdate(row) {
      getObj(row.pkAdId).then(response => {
        this.form = response.data.obj
        this.dialogFormVisible = true
        this.dialogStatus = 'update'
      })
    },
    handleDelete(row) {
      this.$confirm('此操作将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delObj(row.pkAdId)
          .then(() => {
            this.$notify({
              title: '成功',
              message: '删除成功',
              type: 'success',
              duration: 2000
            })
            const index = this.list.indexOf(row)
            this.list.splice(index, 1)
          })
      })
    },
    create(formName) {
      const set = this.$refs
      set[formName].validate(valid => {
        if (valid) {
          addObj(this.form).then(() => {
            this.dialogFormVisible = false
            this.getList(data => {})
            this.$notify({
              title: '成功',
              message: '创建成功',
              type: 'success',
              duration: 2000
            })
          })
        } else {
          return false
        }
      })
    },
    cancel(formName) {
      this.dialogFormVisible = false
      const set = this.$refs
      set[formName].resetFields()
    },
    update(formName) {
      const set = this.$refs
      set[formName].validate(valid => {
        if (valid) {
          this.dialogFormVisible = false
          this.form.password = undefined
          putObj(this.form.pkAdId, this.form).then(() => {
            this.dialogFormVisible = false
            this.getList(data => {})
            this.$notify({
              title: '成功',
              message: '创建成功',
              type: 'success',
              duration: 2000
            })
          })
        } else {
          return false
        }
      })
    },
    resetTemp() {
      this.form = {
        fkAdPositionId: undefined,
        adName: undefined,
        adType: undefined,
        link: undefined,
        imageUrl: undefined,
        isUsed: 'SW1302',
        connent: undefined,
        startTime: undefined,
        endTime: undefined
      }
    }
  }
}
</script>
<style>
  .form .el-select{width:100%;}
</style>
