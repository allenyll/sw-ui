<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-input v-model="listQuery.like_name" style="width: 200px;" class="filter-item" placeholder="名称" @keyup.enter.native="handleFilter"/>
      <el-button class="filter-item" type="primary" icon="search" @click="handleFilter">搜索</el-button>
      <el-button v-if="specOptionManager_btn_add" class="filter-item" style="margin-left: 10px;" type="primary" icon="edit" @click="handleCreate">添加</el-button>
    </div>
    <el-table v-loading.body="listLoading" :key="tableKey" :data="list" border fit highlight-current-row style="width: 100%">
      <el-table-column v-if="show" align="center" label="pk_spec_option_id">
        <template slot-scope="scope">
          <span>{{ scope.row.pkSpecOptionId }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="规格">
        <template slot-scope="scope">
          <span>{{ specsNameMap[scope.row.fkSpecsId] }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="名称">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="编码">
        <template slot-scope="scope">
          <span>{{ scope.row.code }}</span>
        </template>
      </el-table-column>
      <el-table-column fixed="right" align="center" label="操作" width="150px">
        <template slot-scope="scope">
          <el-button v-if="specOptionManager_btn_edit" size="small" type="success" @click="handleUpdate(scope.row)">编辑
          </el-button>
          <el-button v-if="specOptionManager_btn_del" size="small" type="danger" @click="handleDelete(scope.row)">删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <div v-show="!listLoading" class="pagination-container">
      <el-pagination :current-page.sync="listQuery.page" :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit" :total="total" layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="handleCurrentChange"/>
    </div>
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="规格" prop="fkSpecsId">
          <el-select v-model="form.fkSpecsId" filterable placeholder="请选择规格" style="wdith:236px;">
            <el-option
              v-for="item in specsOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"/>
          </el-select>
        </el-form-item>
        <el-form-item label="名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入名称"/>
        </el-form-item>
        <el-form-item label="编码" prop="code">
          <el-input v-model="form.code" placeholder="请输入编码"/>
        </el-form-item>
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
import { page, addObj, getObj, delObj, putObj } from '@/api/goods/specOption/index'
import { getSpecsList } from '@/api/goods/specs/index'
import { mapGetters } from 'vuex'
export default {
  name: 'SpecOption',
  data() {
    return {
      form: {
        fkSpecsId: undefined,
        name: undefined,
        code: undefined
      },
      rules: {
        fkSpecsId: [
          {
            required: true,
            message: '请选择规格',
            trigger: 'blur'
          }
        ], name: [
          {
            required: true,
            message: '请输入名称',
            trigger: 'blur'
          }
        ], code: [
          {
            required: true,
            message: '请输入编码',
            trigger: 'blur'
          }
        ] },
      list: null,
      total: null,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        name: undefined,
        order_code: true
      },
      dialogFormVisible: false,
      dialogStatus: '',
      specOptionManager_btn_edit: false,
      specOptionManager_btn_del: false,
      specOptionManager_btn_add: false,
      textMap: {
        update: '编辑',
        create: '创建'
      },
      tableKey: 0,
      show: false,
      specsOptions: [],
      specsNameMap: []
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
      this.getSpecsList()
    })
    this.specOptionManager_btn_edit = this.elements['goods:specOption:edit']
    this.specOptionManager_btn_del = this.elements['goods:specOption:delete']
    this.specOptionManager_btn_add = this.elements['goods:specOption:add']
  },
  methods: {
    getList(callback) {
      this.listLoading = true
      var _id = this.$route.query.id
      // eslint-disable-next-line eqeqeq
      if (_id != '' && _id != null) {
        this.listQuery.eq_fk_specs_id = _id
      }
      page(this.listQuery).then(response => {
        this.list = response.data.list
        this.total = response.data.total
        this.listLoading = false
        callback(true)
      }).catch((reject) => {
        callback(false)
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
      getObj(row.pkSpecOptionId).then(response => {
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
        delObj(row.pkSpecOptionId)
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
          putObj(this.form.pkSpecOptionId, this.form).then(() => {
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
        fkSpecsId: undefined,
        name: undefined,
        code: undefined
      }
    },
    getSpecsList() {
      getSpecsList().then(res => {
        this.specsOptions = res.data.list
        this.specsNameMap = res.data.map
      })
    }
  }
}
</script>
