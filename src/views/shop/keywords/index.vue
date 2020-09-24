<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-input v-model="listQuery.like_name" style="width: 200px;" class="filter-item" placeholder="名称" @keyup.enter.native="handleFilter"/>
      <el-button class="filter-item" type="primary" icon="search" @click="handleFilter">搜索</el-button>
      <el-button v-if="keywordsManager_btn_add" class="filter-item" style="margin-left: 10px;" type="primary" icon="edit" @click="handleCreate">添加</el-button>
    </div>
    <el-table v-loading.body="listLoading" :key="tableKey" :data="list" border fit highlight-current-row style="width: 100%">
      <el-table-column v-if="show" align="center" label="pk_keywords_id">
        <template slot-scope="scope">
          <span>{{ scope.row.pkKeywordsId }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="关键字">
        <template slot-scope="scope">
          <span>{{ scope.row.keyword }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="是否热门">
        <template slot-scope="scope">
          <span>{{ scope.row.isHot | isFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="是否默认">
        <template slot-scope="scope">
          <span>{{ scope.row.isDefault | isFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="是否显示">
        <template slot-scope="scope">
          <span>{{ scope.row.isShow | isFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="类型">
        <template slot-scope="scope">
          <span>{{ scope.row.type | typeFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column fixed="right" align="center" label="操作">
        <template slot-scope="scope">
          <el-button v-if="keywordsManager_btn_edit" size="small" type="success" @click="handleUpdate(scope.row)">编辑
          </el-button>
          <el-button v-if="keywordsManager_btn_del" size="small" type="danger" @click="handleDelete(scope.row)">删除
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
          <el-col :span="24">
            <el-form-item label="关键字" prop="keyword">
              <el-input v-model="form.keyword" placeholder="请输入关键字"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="关键词的跳转链接" prop="schemeUrl">
              <el-input v-model="form.schemeUrl" placeholder="请输入关键词的跳转链接"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="类型" prop="type">
              <el-radio v-model="form.type" label="SW2801">热门</el-radio>
              <el-radio v-model="form.type" label="SW2802">核心</el-radio>
              <el-radio v-model="form.type" label="SW2803">区域</el-radio>
              <el-radio v-model="form.type" label="SW2804">长尾</el-radio>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="是否默认" prop="isDefault">
              <el-radio v-model="form.isDefault" label="SW1001">是</el-radio>
              <el-radio v-model="form.isDefault" label="SW1002">否</el-radio>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="是否热门" prop="isHot">
              <el-radio v-model="form.isHot" label="SW1001">是</el-radio>
              <el-radio v-model="form.isHot" label="SW1002">否</el-radio>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="是否显示" prop="isShow">
              <el-radio v-model="form.isShow" label="SW1001">是</el-radio>
              <el-radio v-model="form.isShow" label="SW1002">否</el-radio>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="排序" prop="sortOrder">
              <el-input v-model="form.sortOrder" placeholder="请输入排序"/>
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
import { page, addObj, getObj, delObj, putObj } from '@/api/shop/keywords/index'
import { mapGetters } from 'vuex'
export default {
  name: 'Keywords',
  filters: {
    isFilter: function(val) {
      const map = {
        'SW1001': '是',
        'SW1002': '否'
      }
      return map[val]
    },
    typeFilter: function(val) {
      const map = {
        'SW2801': '热门',
        'SW2802': '核心',
        'SW2803': '区域',
        'SW2804': '长尾'
      }
      return map[val]
    }
  },
  data() {
    return {
      form: {
        keyword: undefined,
        isHot: 'SW1001',
        isDefault: 'SW1002',
        isShow: 'SW1001',
        sortOrder: undefined,
        schemeUrl: undefined,
        type: 'SW2801'
      },
      rules: {
        keyword: [
          {
            required: true,
            message: '请输入关键字',
            trigger: 'blur'
          }
        ], isHot: [
          {
            required: true,
            message: '请输入热销',
            trigger: 'blur'
          }
        ], isDefault: [
          {
            required: true,
            message: '请输入默认',
            trigger: 'blur'
          }
        ], isShow: [
          {
            required: true,
            message: '请输入显示',
            trigger: 'blur'
          }
        ], sortOrder: [
          {
            required: true,
            message: '请输入排序',
            trigger: 'blur'
          }
        ], type: [
          {
            required: true,
            message: '请输入类型',
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
      keywordsManager_btn_edit: false,
      keywordsManager_btn_del: false,
      keywordsManager_btn_add: false,
      textMap: {
        update: '编辑',
        create: '创建'
      },
      tableKey: 0,
      show: false
    }
  },
  computed: {
    ...mapGetters([
      'elements'
    ])
  },
  created() {
    this.getList()
    this.keywordsManager_btn_edit = this.elements['shop:keyword:edit']
    this.keywordsManager_btn_del = this.elements['shop:keyword:delete']
    this.keywordsManager_btn_add = this.elements['shop:keyword:add']
  },
  methods: {
    getList() {
      this.listLoading = true
      page(this.listQuery).then(response => {
        this.list = response.data.list
        this.total = response.data.total
        this.listLoading = false
      })
    },
    handleFilter() {
      this.getList()
    },
    handleSizeChange(val) {
      this.listQuery.limit = val
      this.getList()
    },
    handleCurrentChange(val) {
      this.listQuery.page = val
      this.getList()
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
    },
    handleUpdate(row) {
      getObj(row.pkKeywordsId).then(response => {
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
        delObj(row.pkKeywordsId)
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
            this.getList()
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
          putObj(this.form.pkKeywordsId, this.form).then(() => {
            this.dialogFormVisible = false
            this.getList()
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
        keyword: undefined,
        isHot: 'SW1001',
        isDefault: 'SW1002',
        isShow: 'SW1001',
        sortOrder: undefined,
        schemeUrl: undefined,
        type: 'SW2801'
      }
    }
  }
}
</script>
