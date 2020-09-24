<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-input v-model="listQuery.like_color_name" style="width: 200px;" class="filter-item" placeholder="名称" @keyup.enter.native="handleFilter"/>
      <el-input v-model="listQuery.eq_size_code" style="width: 200px;" class="filter-item" placeholder="编码" @keyup.enter.native="handleFilter"/>
      <el-select v-model="listQuery.eq_is_used" style="width: 200px;" class="filter-item" placeholder="请选择状态" @keyup.enter.native="handleFilter">
        <el-option key="" label="全部" value=""/>
        <el-option key="SW1302" label="启用" value="SW1302"/>
        <el-option key="SW1301" label="停用" value="SW1301"/>
      </el-select>
      <el-select v-model="listQuery.eq_is_default" style="width: 200px;" class="filter-item" placeholder="请选择是否默认" @keyup.enter.native="handleFilter">
        <el-option key="" label="全部" value=""/>
        <el-option key="SW1001" label="是" value="SW1001"/>
        <el-option key="SW1002" label="否" value="SW1002"/>
      </el-select>
      <el-button class="filter-item" type="primary" icon="search" @click="handleFilter">搜索</el-button>
      <el-button v-if="colorManager_btn_add" class="filter-item" style="margin-left: 10px;" type="primary" icon="edit" @click="handleCreate">添加</el-button>
    </div>
    <el-table v-loading.body="listLoading" :key="tableKey" :data="list" border fit highlight-current-row style="width: 100%">
      <el-table-column v-if="show" align="center" label="pk_color_id">
        <template slot-scope="scope">
          <span>{{ scope.row.pkColorId }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="所在分组">
        <template slot-scope="scope">
          <span>{{ groupMap[scope.row.fkColorGroupId] }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="名称">
        <template slot-scope="scope">
          <span>{{ scope.row.colorName }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="编码">
        <template slot-scope="scope">
          <span>{{ scope.row.colorCode }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="色值">
        <template slot-scope="scope">
          <span>{{ scope.row.colorAsc }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="是否启用">
        <template slot-scope="scope">
          <el-tag :type="scope.row.isUsed | statusTypeFilter">{{ scope.row.isUsed | statusFilter }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="是否默认">
        <template slot-scope="scope">
          <el-tag :type="scope.row.isDefault | defalutTypeFilter">{{ scope.row.isDefault | defalutFilter }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column fixed="right" align="center" label="操作" width="150px">
        <template slot-scope="scope">
          <el-button v-if="colorManager_btn_edit" size="small" type="success" @click="handleUpdate(scope.row)">编辑
          </el-button>
          <el-button v-if="colorManager_btn_del" size="small" type="danger" @click="handleDelete(scope.row)">删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <div v-show="!listLoading" class="pagination-container">
      <el-pagination :current-page.sync="listQuery.page" :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit" :total="total" layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="handleCurrentChange"/>
    </div>
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="所在分组" prop="fkColorGroupId">
          <el-select v-model="form.fkColorGroupId" filterable placeholder="请选择">
            <el-option
              v-for="item in colorGroupIdOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"/>
          </el-select>
        </el-form-item>
        <el-form-item label="名称" prop="colorName">
          <el-input v-model="form.colorName" placeholder="请输入名称"/>
        </el-form-item>
        <el-form-item label="编码" prop="colorCode">
          <el-input v-model="form.colorCode" placeholder="请输入编码"/>
        </el-form-item>
        <el-form-item label="色值" prop="colorAsc">
          <el-input v-model="form.colorAsc" placeholder="请输入色值"/>
        </el-form-item>
        <el-form-item label="是否启用" prop="isUsed">
          <el-radio v-model="form.isUsed" label="SW1301">停用</el-radio>
          <el-radio v-model="form.isUsed" label="SW1302">启用</el-radio>
        </el-form-item>
        <el-form-item label="是否默认" prop="isDefault">
          <el-radio v-model="form.isDefault" label="SW1001">是</el-radio>
          <el-radio v-model="form.isDefault" label="SW1002">否</el-radio>
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
import { page, addObj, getObj, delObj, putObj } from '@/api/goods/color/index'
import { list } from '@/api/goods/colorGroup/index'
import { mapGetters } from 'vuex'
export default {
  name: 'Color',
  filters: {
    statusFilter: function(val) {
      const map = {
        'SW1301': '停用',
        'SW1302': '启用'
      }
      return map[val]
    },
    defalutFilter: function(val) {
      const map = {
        'SW1001': '是',
        'SW1002': '否'
      }
      return map[val]
    },
    statusTypeFilter(val) {
      const map = {
        'SW1302': 'success',
        'SW1301': 'info'
      }
      return map[val]
    },
    defalutTypeFilter(val) {
      const map = {
        'SW1001': 'danger',
        'SW1002': 'info'
      }
      return map[val]
    }
  },
  data() {
    return {
      form: {
        fkColorGroupId: undefined,
        colorName: undefined,
        colorCode: undefined,
        colorAsc: undefined,
        isUsed: 'SW1302',
        isDefault: 'SW1001'
      },
      rules: {
        fkColorGroupId: [
          {
            required: true,
            message: '请输入分组主键',
            trigger: 'blur'
          }
        ],
        colorName: [
          {
            required: true,
            message: '请输入名称',
            trigger: 'blur'
          }
        ],
        colorCode: [
          {
            required: true,
            message: '请输入编码',
            trigger: 'blur'
          }
        ],
        isUsed: [
          {
            required: true,
            message: '请输入是否启用',
            trigger: 'blur'
          }
        ], isDefault: [
          {
            required: true,
            message: '请输入是否默认',
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
      colorGroupIdOptions: [],
      dialogFormVisible: false,
      dialogStatus: '',
      colorManager_btn_edit: false,
      colorManager_btn_del: false,
      colorManager_btn_add: false,
      textMap: {
        update: '编辑',
        create: '创建'
      },
      tableKey: 0,
      show: false,
      nameMap: {}
    }
  },
  computed: {
    ...mapGetters([
      'elements'
    ]),
    groupMap: function() {
      return this.nameMap
    }
  },
  created() {
    this.getList()
    this.getColorGroupList()
    this.colorManager_btn_edit = this.elements['goods:color:edit']
    this.colorManager_btn_del = this.elements['goods:color:delete']
    this.colorManager_btn_add = this.elements['goods:color:add']
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
    getColorGroupList() {
      list().then(response => {
        this.nameMap = response.data.map
        this.colorGroupIdOptions = response.data.list
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
      getObj(row.pkColorId)
        .then(response => {
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
      })
        .then(() => {
          delObj(row.pkColorId)
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
          addObj(this.form)
            .then(() => {
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
          putObj(this.form.pkColorId, this.form).then(() => {
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
        fkColorGroupId: undefined,
        colorName: undefined,
        colorCode: undefined,
        colorAsc: undefined,
        isUsed: 'SW1302',
        isDefault: 'SW1002'
      }
    }
  }
}
</script>
