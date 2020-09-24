<template xmlns:on-progress="">
  <div class="app-container calendar-list-container">
    <el-card class="filter-container" shadow="never">
      <div>
        <i class="el-icon-search"/>
        <span>筛选搜索</span>
        <el-button
          style="float:right"
          type="primary"
          size="small"
          @click="handleSearchList()">
          查询搜索
        </el-button>
        <el-button
          style="float:right;margin-right: 15px"
          size="small"
          @click="handleResetSearch()">
          重置
        </el-button>
      </div>
      <div style="margin-top: 30px">
        <el-form :inline="true" :model="listQuery" size="small" label-width="140px">
          <el-form-item label="商品名称：">
            <el-input v-model="listQuery.like_goods_name" class="input-width" placeholder="商品名称"/>
          </el-form-item>
          <el-form-item label="商品编码：">
            <el-input v-model="listQuery.eq_goods_code" class="input-width" placeholder="商品编号"/>
          </el-form-item>
          <el-form-item label="品牌：">
            <el-select v-model="listQuery.eq_fk_brand_id" class="input-width" filterable placeholder="请选择品牌">
              <el-option key="" label="全部" value=""/>
              <el-option
                v-for="item in brandOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"/>
            </el-select>
          </el-form-item>
          <el-form-item label="商品分类：">
            <el-select v-model="listQuery.eq_fk_category_id" class="input-width" filterable placeholder="请选择分类">
              <el-option key="" label="全部" value=""/>
              <el-option
                v-for="item in categoryOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"/>
            </el-select>
          </el-form-item>
          <el-form-item label="启用状态：">
            <el-select v-model="listQuery.eq_is_used" class="input-width" placeholder="请选择启用状态">
              <el-option key="" label="全部" value=""/>
              <el-option key="SW1302" label="启用" value="SW1302"/>
              <el-option key="SW1301" label="停用" value="SW1301"/>
            </el-select>
          </el-form-item>
          <el-form-item label="商品状态：">
            <el-select v-model="listQuery.eq_status" class="input-width" placeholder="请选择商品状态">
              <el-option key="" label="全部" value=""/>
              <el-option key="SW1401" label="上架" value="SW1401"/>
              <el-option key="SW1402" label="下架" value="SW1402"/>
              <el-option key="SW1403" label="预售" value="SW1403"/>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <!-- <div class="filter-container">
      <el-input v-model="listQuery.like_goods_name" style="width: 190px;" class="filter-item" placeholder="名称" @keyup.enter.native="handleFilter"/>
      <el-input v-model="listQuery.eq_goods_code" style="width: 190px;" class="filter-item" placeholder="编码" @keyup.enter.native="handleFilter"/>
      <el-select v-model="listQuery.eq_fk_brand_id" style="width: 190px;" class="filter-item" filterable placeholder="请选择品牌" @keyup.enter.native="handleFilter">
        <el-option key="" label="全部" value=""/>
        <el-option
          v-for="item in brandOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"/>
      </el-select>
      <el-select v-model="listQuery.eq_fk_category_id" style="width: 190px;" class="filter-item" filterable placeholder="请选择分类" @keyup.enter.native="handleFilter">
        <el-option key="" label="全部" value=""/>
        <el-option
          v-for="item in categoryOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"/>
      </el-select>
      <el-select v-model="listQuery.eq_is_used" style="width: 190px;" class="filter-item" placeholder="请选择启用状态" @keyup.enter.native="handleFilter">
        <el-option key="" label="全部" value=""/>
        <el-option key="SW1302" label="启用" value="SW1302"/>
        <el-option key="SW1301" label="停用" value="SW1301"/>
      </el-select>
      <el-select v-model="listQuery.eq_status" style="width: 190px;" class="filter-item" placeholder="请选择商品状态" @keyup.enter.native="handleFilter">
        <el-option key="" label="全部" value=""/>
        <el-option key="SW1401" label="上架" value="SW1401"/>
        <el-option key="SW1402" label="下架" value="SW1402"/>
        <el-option key="SW1403" label="预售" value="SW1403"/>
      </el-select>
      <el-button class="filter-item" type="primary" icon="search" @click="handleFilter">搜索</el-button>
      <el-button v-if="goodsManager_btn_add" class="filter-item" style="margin-left: 10px;" type="primary" icon="edit" @click="handleCreate">添加</el-button>
    </div> -->
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets"/>
      <span>数据列表</span>
    </el-card>
    <el-table v-loading.body="listLoading" :key="tableKey" :data="list" border fit highlight-current-row style="width: 100%" @selection-change="handleSelectionChange">
      <el-table-column
        type="selection"
        width="55"/>
      <el-table-column v-if="show" align="center" label="pk_goods_id">
        <template slot-scope="scope">
          <span>{{ scope.row.pkGoodsId }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="图片">
        <template slot-scope="scope">
          <img :src="scope.row.fileUrl" min-width="120" height="80" >
        </template>
      </el-table-column>
      <el-table-column align="center" width="120" label="商品名称">
        <template slot-scope="scope">
          <p>{{ scope.row.goodsName }}</p>
          <p>品牌：{{ brandNameMap[scope.row.fkBrandId] }}</p>
        </template>
      </el-table-column>
      <el-table-column align="center" width="150" label="商品价格/编码">
        <template slot-scope="scope">
          <p>￥{{ scope.row.price }}</p>
          <p>货号：{{ scope.row.goodsCode }}</p>
        </template>
      </el-table-column>
      <el-table-column align="center" label="分类">
        <template slot-scope="scope">
          <span>{{ categoryNameMap[scope.row.fkCategoryId] }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="库存量">
        <template slot-scope="scope">
          <span>{{ scope.row.stock }}</span>
        </template>
      </el-table-column>
      <el-table-column label="标签" width="140" align="center">
        <template slot-scope="scope">
          <p>启用：
            <el-switch
              v-model="scope.row.isUsed"
              active-value="SW1302"
              inactive-value="SW1301"
              @change="handleLabel(scope.$index, scope.row.pkGoodsId, scope.row.isUsed, 'isUsed')"/>
          </p>
          <p>推荐：
            <el-switch
              v-model="scope.row.isRecom"
              active-value="SW1001"
              inactive-value="SW1002"
              @change="handleLabel(scope.$index, scope.row.pkGoodsId, scope.row.isRecom, 'isRecom')"/>
          </p>
          <p>规格：
            <el-switch
              v-model="scope.row.isSpec"
              active-value="SW1001"
              inactive-value="SW1002"
              @change="handleLabel(scope.$index, scope.row.pkGoodsId, scope.row.isSpec, 'isSpec')"/>
          </p>
        </template>
      </el-table-column>
      <el-table-column label="标签" width="140" align="center">
        <template slot-scope="scope">
          <p>精品：
            <el-switch
              v-model="scope.row.isBest"
              active-value="SW1001"
              inactive-value="SW1002"
              @change="handleLabel(scope.$index, scope.row.pkGoodsId, scope.row.isBest, 'isBest')"/>
          </p>
          <p>热卖：
            <el-switch
              v-model="scope.row.isHot"
              active-value="SW1001"
              inactive-value="SW1002"
              @change="handleLabel(scope.$index, scope.row.pkGoodsId, scope.row.isHot, 'isHot')"/>
          </p>
          <p>新品：
            <el-switch
              v-model="scope.row.isNew"
              active-value="SW1001"
              inactive-value="SW1002"
              @change="handleLabel(scope.$index, scope.row.pkGoodsId, scope.row.isNew, 'isNew')"/>
          </p>
        </template>
      </el-table-column>
      <el-table-column align="center" label="商品状态">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status | statusTypeFilter">{{ scope.row.status | statusFilter }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="SKU库存" width="100" align="center">
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" circle @click="showSkuStockDialog(scope.$index, scope.row)"/>
        </template>
      </el-table-column>
      <el-table-column fixed="right" align="center" label="操作" width="150px">
        <template slot-scope="scope">
          <el-button v-if="goodsManager_btn_edit" size="small" type="success" @click="handleUpdate(scope.row)">编辑
          </el-button>
          <el-button v-if="goodsManager_btn_del" size="small" type="danger" @click="handleDelete(scope.row)">删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <div v-show="!listLoading" class="pagination-container">
      <el-pagination :current-page.sync="listQuery.page" :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit" :total="total" layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="handleCurrentChange"/>
    </div>
    <el-dialog
      :visible.sync="skuStockForm.dialogVisible"
      title="编辑货品信息"
      width="60%">
      <span>商品货号：</span>
      <span>{{ skuStockForm.goodsCode }}</span>
      <el-input v-model="skuStockForm.keyword" placeholder="按sku编号搜索" size="small" style="width: 50%;margin-left: 20px">
        <el-button slot="append" icon="el-icon-search" @click="handleSearchEditSku"/>
      </el-input>
      <el-table
        :data="skuStockForm.stockList"
        style="width: 100%;margin-top: 20px"
        border>
        <el-table-column
          label="SKU编号"
          align="center">
          <template slot-scope="scope">
            <el-input v-model="scope.row.skuCode"/>
          </template>
        </el-table-column>
        <el-table-column
          v-for="(item,index) in skuStockForm.specList"
          :label="item"
          :key="item"
          align="center">
          <template slot-scope="scope">
            {{ getSpecs(scope.row, index) }}
          </template>
        </el-table-column>
        <el-table-column
          label="销售价格"
          width="100"
          align="center">
          <template slot-scope="scope">
            <el-input v-model="scope.row.skuPrice"/>
          </template>
        </el-table-column>
        <el-table-column
          label="商品库存"
          width="80"
          align="center">
          <template slot-scope="scope">
            <el-input v-model="scope.row.skuStock"/>
          </template>
        </el-table-column>
        <el-table-column
          label="库存预警值"
          width="100"
          align="center">
          <template slot-scope="scope">
            <el-input v-model="scope.row.warnStock"/>
          </template>
        </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button @click="skuStockForm.dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="updateSkuStock">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { page, addObj, delObj, putObj, updateLabel } from '@/api/goods/goods/index'
import { getSkuStockList, updateSkuStock } from '@/api/goods/sku/index'
import { getFileList, delFile } from '@/api/admin/file/index'
import { getBrandList } from '@/api/goods/brand/index'
import { getCategoryList } from '@/api/goods/category/index'
import { getList } from '@/api/admin/dict/index'
import { mapGetters } from 'vuex'
import Tinymce from '@/components/Tinymce'
const defaultListQuery = {
  page: 1,
  limit: 10,
  name: undefined,
  like_goods_name: '',
  eq_goods_code: '',
  eq_fk_brand_id: '',
  eq_fk_category_id: '',
  eq_is_used: '',
  eq_status: ''
}
export default {
  name: 'Goods',
  components: { Tinymce },
  filters: {
    statusFilter: function(val) {
      const map = {
        'SW1401': '上架',
        'SW1402': '下架',
        'SW1403': '预售'
      }
      return map[val]
    },
    statusTypeFilter(val) {
      const map = {
        'SW1401': 'success',
        'SW1402': 'danger',
        'SW1403': 'info'
      }
      return map[val]
    },
    isUsedFilter: function(val) {
      const map = {
        'SW1301': '停用',
        'SW1302': '启用'
      }
      return map[val]
    },
    isUsedTypeFilter(val) {
      const map = {
        'SW1302': 'success',
        'SW1301': 'info'
      }
      return map[val]
    },
    seasonFilter: function(val) {
      const map = {
        'SW1701': '春季',
        'SW1702': '夏季',
        'SW1703': '秋季',
        'SW1704': '冬季'
      }
      return map[val]
    },
    isOrNoFilter: function(val) {
      const map = {
        'SW1001': '是',
        'SW1002': '否'
      }
      return map[val]
    }

  },
  data() {
    return {
      skuStockForm: {
        dialogVisible: false,
        goodsId: null,
        goodsCode: '',
        stockList: [],
        specList: [],
        keyword: null
      },
      form: {
        fkBrandId: undefined,
        fkCategoryId: undefined,
        fkColorId: undefined,
        fkUnitId: undefined,
        fkSizeId: undefined,
        goodsName: undefined,
        goodsCode: undefined,
        goodsBarCode: undefined,
        goodsLabel: undefined,
        price: undefined,
        marketPrice: undefined,
        costPrice: undefined,
        stock: undefined,
        warningStock: undefined,
        goodsIntegral: undefined,
        goodsUrl: undefined,
        goodsBrief: undefined,
        goodsDesc: undefined,
        season: undefined,
        unit: undefined,
        goodsSeq: undefined,
        isUsed: undefined,
        status: undefined,
        isSpec: undefined,
        isBest: undefined,
        isHot: undefined,
        isNew: undefined,
        isRecom: undefined,
        saleNum: undefined,
        saleTime: undefined,
        visitNum: undefined,
        appraiseNum: undefined,
        goodsTips: undefined,
        remark: undefined
      },
      rules: {
        fkBrandId: [
          {
            required: true,
            message: '请输入品牌主键',
            trigger: 'blur'
          }
        ], fkCategoryId: [
          {
            required: true,
            message: '请输入分类主键',
            trigger: 'blur'
          }
        ], fkColorId: [
          {
            required: true,
            message: '请输入颜色主键',
            trigger: 'blur'
          }
        ],
        fkSizeId: [
          {
            required: true,
            message: '请输入尺码主键',
            trigger: 'blur'
          }
        ],
        goodsName: [
          {
            required: true,
            message: '请输入商品名称',
            trigger: 'blur'
          }
        ],
        goodsCode: [
          {
            required: true,
            message: '请输入商品编码',
            trigger: 'blur'
          }
        ],
        price: [
          {
            required: true,
            message: '请输入商品价格',
            trigger: 'blur'
          }
        ],
        stock: [
          {
            required: true,
            message: '请输入库存量',
            trigger: 'blur'
          }
        ],
        season: [
          {
            required: true,
            message: '请输入季节性',
            trigger: 'blur'
          }
        ],
        unit: [
          {
            required: true,
            message: '请输入单位',
            trigger: 'blur'
          }
        ],
        isUsed: [
          {
            required: true,
            message: '请输入是否启用',
            trigger: 'blur'
          }
        ],
        status: [
          {
            required: true,
            message: '请输入商品状态',
            trigger: 'blur'
          }
        ],
        saleTime: [
          {
            required: true,
            message: '请选择上架时间',
            trigger: 'blur'
          }
        ]
      },
      list: null,
      total: null,
      listLoading: true,
      listQuery: Object.assign({}, defaultListQuery),
      dialogFormVisible: false,
      dialogStatus: '',
      goodsManager_btn_edit: false,
      goodsManager_btn_del: false,
      goodsManager_btn_add: false,
      textMap: {
        update: '编辑',
        create: '创建'
      },
      tableKey: 0,
      show: false,
      multipleSelection: [],
      brandMap: [],
      brandOptions: [],
      categoryMap: [],
      categoryOptions: [],
      unitMap: [],
      unitOptions: [],
      dialogImageUrl: '',
      dialogImageVisible: false,
      goodsId: '',
      fileList: [],
      activeName: 'first'
    }
  },
  computed: {
    ...mapGetters([
      'elements'
    ]),
    brandNameMap: function() {
      return this.brandMap
    },
    categoryNameMap: function() {
      return this.categoryMap
    }
  },
  created() {
    this.getList(data => {
      if (!data) {
        return
      }
      this.getBrandList()
      this.getCategoryList()
      this.getUnitList()
      this.download()
    })
    this.goodsManager_btn_edit = this.elements['goods:goods:edit']
    this.goodsManager_btn_del = this.elements['goods:goods:delete']
    this.goodsManager_btn_add = this.elements['goods:goods:add']
  },
  methods: {
    handleResetSearch() {
      this.listQuery = Object.assign({}, defaultListQuery)
    },
    handleSearchList() {
      this.listQuery.page = 1
      this.getList(data => {})
    },
    closeDialog() {
      this.fileList = []
      this.form.goodsDesc = ''
      this.activeName = 'first'
    },
    download() {
      // download('group1/M00/00/00/rBsAA1yY_5iALGj7AAt46MDfrYg67.jpeg').then(response => {
      //   console.log(response)
      // })
    },
    getFileList(id) {
      const param = {
        id: id,
        type: 'SW1801'
      }
      getFileList(param).then(response => {
        this.fileList = response.data.list
        console.log(this.fileList)
      })
    },
    handleRemove(file, fileList) {
      const param = {
        eq_id: file.id,
        url: file.url
      }
      delFile(param).then(response => {
        if (response.data.code === '100000') {
          this.getFileList(this.goodsId)
          this.$notify({
            title: '成功',
            message: '删除成功',
            type: 'success',
            duration: 2000
          })
        } else {
          this.getFileList(this.goodsId)
          this.$notify({
            title: '失败',
            message: response.data.message,
            type: 'fail',
            duration: 2000
          })
        }
      })
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
      this.dialogImageVisible = true
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    getList(callback) {
      this.listLoading = true
      page(this.listQuery)
        .then(response => {
          this.list = response.data.list
          this.total = response.data.total
          this.listLoading = false
          callback(true)
        }).catch((reject) => {
          callback(false)
        })
    },
    getBrandList() {
      getBrandList().then(response => {
        this.brandMap = response.data.map
        this.brandOptions = response.data.list
      })
    },
    getCategoryList() {
      getCategoryList().then(response => {
        this.categoryMap = response.data.map
        this.categoryOptions = response.data.list
      })
    },
    getUnitList() {
      getList('SW16').then(response => {
        this.unitMap = response.data.map
        this.unitOptions = response.data.list
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
      this.$refs.tinymce.setContent(this.form.goodsDesc)
    },
    handleUpdate(row) {
      this.$router.push({ path: '/goods/updateGoods', query: { id: row.pkGoodsId }})
      // this.goodsId = row.pkGoodsId
      // this.getFileList(this.goodsId)
      // getObj(row.pkGoodsId)
      //   .then(response => {
      //     this.form = response.data.obj
      //     this.dialogFormVisible = true
      //     this.dialogStatus = 'update'
      //     this.$refs.tinymce.setContent(this.form.goodsDesc)
      //   })
    },
    handleDelete(row) {
      this.$confirm('此操作将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          delObj(row.pkGoodsId)
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
      this.activeName = 'first'
    },
    update(formName) {
      const set = this.$refs
      set[formName].validate(valid => {
        if (valid) {
          this.dialogFormVisible = false
          putObj(this.form.pkGoodsId, this.form).then(() => {
            this.dialogFormVisible = false
            this.getList(data => {})
            this.$notify({
              title: '成功',
              message: '更新成功',
              type: 'success',
              duration: 2000
            })
          })
        } else {
          return false
        }
      })
    },
    handleLabel(index, id, status, label) {
      const params = {
        id: id,
        label: label,
        status: status
      }
      updateLabel(params).then(res => {
        this.$message({
          message: '修改成功',
          type: 'success',
          duration: 1000
        })
      })
    },
    getSpecs(row, index) {
      if (index === 0) {
        return row.value0
      } else if (index === 1) {
        return row.value1
      } else {
        return row.value2
      }
    },
    handleSearchEditSku() {
      getSkuStockList(this.skuStockForm.goodsId, { keyword: this.skuStockForm.keyword }).then(response => {
        this.skuStockForm.specList = response.data.specList
        this.skuStockForm.stockList = response.data.stockList
      })
    },
    showSkuStockDialog(index, row) {
      this.skuStockForm.dialogVisible = true
      this.skuStockForm.goodsId = row.pkGoodsId
      this.skuStockForm.goodsCode = row.goodsCode
      this.skuStockForm.keyword = null
      getSkuStockList(row.pkGoodsId, { keyword: this.skuStockForm.keyword }).then(response => {
        this.skuStockForm.specList = response.data.specList
        this.skuStockForm.stockList = response.data.stockList
      })
    },
    updateSkuStock() {
      if (this.skuStockForm.stockList == null || this.skuStockForm.stockList.length <= 0) {
        this.$message({
          message: '暂无sku信息',
          type: 'warning',
          duration: 1000
        })
        return
      }
      this.$confirm('是否要进行修改', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        updateSkuStock(this.skuStockForm.goodsId, this.skuStockForm.stockList).then(response => {
          this.$message({
            message: '修改成功',
            type: 'success',
            duration: 1000
          })
          this.skuStockForm.dialogVisible = false
        })
      })
      console.log('updateSkuStock')
    },
    resetTemp() {
      this.form = {
        fkBrandId: undefined,
        fkCategoryId: undefined,
        fkColorId: undefined,
        fkUnitId: undefined,
        fkSizeId: undefined,
        goodsName: undefined,
        goodsCode: undefined,
        goodsBarCode: undefined,
        goodsLabel: undefined,
        price: undefined,
        marketPrice: undefined,
        costPrice: undefined,
        stock: undefined,
        warningStock: undefined,
        goodsIntegral: undefined,
        goodsUrl: undefined,
        goodsBrief: undefined,
        goodsDesc: '',
        season: undefined,
        unit: undefined,
        goodsSeq: undefined,
        isUsed: 'SW1302',
        status: undefined,
        isSpec: 'SW1002',
        isBest: 'SW1002',
        isHot: 'SW1002',
        isNew: 'SW1001',
        isRecom: 'SW1002',
        saleNum: undefined,
        saleTime: undefined,
        visitNum: undefined,
        appraiseNum: undefined,
        goodsTips: undefined,
        remark: undefined
      }
    }
  }
}
</script>
<style>
  .form .el-select{width:100%;}
  .input-width {
    width: 203px;
  }
</style>
