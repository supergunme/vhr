<template>
    <div>
        <!-- 顶部操作栏 -->
        <div style="display: flex; align-items: center; margin-bottom: 15px;">
            <el-select v-model="currentEid" filterable placeholder="请选择员工" size="small"
                       style="width: 280px; margin-right: 15px;" @change="loadRecords">
                <el-option v-for="emp in employees" :key="emp.id" :label="emp.name + ' (' + emp.workID + ')'"
                           :value="emp.id"></el-option>
            </el-select>
            <el-button type="primary" size="small" icon="el-icon-plus" :disabled="!currentEid"
                       @click="showAddDialog">添加奖惩记录
            </el-button>
        </div>

        <!-- 奖惩记录表格 -->
        <el-table :data="records" border stripe size="small" style="width: 100%;"
                  v-loading="loading" empty-text="请选择员工或暂无奖惩记录">
            <el-table-column prop="ecdate" label="日期" width="120">
                <template slot-scope="scope">
                    {{formatDate(scope.row.ecdate)}}
                </template>
            </el-table-column>
            <el-table-column label="类型" width="80">
                <template slot-scope="scope">
                    <el-tag :type="scope.row.ectype === 0 ? 'success' : 'danger'" size="small">
                        {{scope.row.ectype === 0 ? '奖励' : '惩罚'}}
                    </el-tag>
                </template>
            </el-table-column>
            <el-table-column prop="ecreason" label="原因"></el-table-column>
            <el-table-column prop="ecpoint" label="积分" width="80"></el-table-column>
            <el-table-column prop="remark" label="备注"></el-table-column>
            <el-table-column label="操作" width="150" fixed="right">
                <template slot-scope="scope">
                    <el-button size="mini" @click="showEditDialog(scope.row)">编辑</el-button>
                    <el-button size="mini" type="danger" @click="handleDelete(scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>

        <!-- 添加/编辑弹窗 -->
        <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="500px">
            <el-form :model="ecForm" :rules="rules" ref="ecForm" label-width="80px" size="small">
                <el-form-item label="类型" prop="ectype">
                    <el-radio-group v-model="ecForm.ectype">
                        <el-radio :label="0">奖励</el-radio>
                        <el-radio :label="1">惩罚</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="日期" prop="ecdate">
                    <el-date-picker v-model="ecForm.ecdate" type="date" placeholder="选择日期"
                                    value-format="yyyy-MM-dd" style="width: 100%;"></el-date-picker>
                </el-form-item>
                <el-form-item label="原因" prop="ecreason">
                    <el-input v-model="ecForm.ecreason" placeholder="请输入奖惩原因"></el-input>
                </el-form-item>
                <el-form-item label="积分" prop="ecpoint">
                    <el-input-number v-model="ecForm.ecpoint" :min="-100" :max="100"></el-input-number>
                </el-form-item>
                <el-form-item label="备注">
                    <el-input v-model="ecForm.remark" type="textarea" :rows="3" placeholder="备注信息"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer">
                <el-button size="small" @click="dialogVisible = false">取 消</el-button>
                <el-button size="small" type="primary" @click="submitForm">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: "PerEc",
        data() {
            return {
                employees: [],
                currentEid: null,
                records: [],
                loading: false,
                dialogVisible: false,
                dialogTitle: '添加奖惩记录',
                ecForm: {
                    id: null,
                    eid: null,
                    ectype: 0,
                    ecdate: '',
                    ecreason: '',
                    ecpoint: 0,
                    remark: ''
                },
                rules: {
                    ectype: [{required: true, message: '请选择类型', trigger: 'change'}],
                    ecdate: [{required: true, message: '请选择日期', trigger: 'change'}],
                    ecreason: [{required: true, message: '请输入原因', trigger: 'blur'}],
                    ecpoint: [{required: true, message: '请输入积分', trigger: 'blur'}]
                }
            }
        },
        mounted() {
            this.loadEmployees();
        },
        methods: {
            loadEmployees() {
                this.getRequest("/personnel/emp/?page=1&size=1000").then(resp => {
                    if (resp) {
                        this.employees = resp.data;
                    }
                })
            },
            loadRecords() {
                if (!this.currentEid) {
                    this.records = [];
                    return;
                }
                this.loading = true;
                this.getRequest("/personnel/ec/?eid=" + this.currentEid).then(resp => {
                    this.loading = false;
                    if (resp) {
                        this.records = resp;
                    }
                })
            },
            showAddDialog() {
                this.dialogTitle = '添加奖惩记录';
                this.ecForm = {
                    id: null,
                    eid: this.currentEid,
                    ectype: 0,
                    ecdate: '',
                    ecreason: '',
                    ecpoint: 0,
                    remark: ''
                };
                this.dialogVisible = true;
                this.$nextTick(() => {
                    this.$refs.ecForm && this.$refs.ecForm.clearValidate();
                });
            },
            showEditDialog(row) {
                this.dialogTitle = '编辑奖惩记录';
                this.ecForm = {
                    id: row.id,
                    eid: row.eid,
                    ectype: row.ectype,
                    ecdate: row.ecdate,
                    ecreason: row.ecreason,
                    ecpoint: row.ecpoint,
                    remark: row.remark
                };
                this.dialogVisible = true;
                this.$nextTick(() => {
                    this.$refs.ecForm && this.$refs.ecForm.clearValidate();
                });
            },
            submitForm() {
                this.$refs.ecForm.validate(valid => {
                    if (valid) {
                        if (this.ecForm.id) {
                            this.putRequest("/personnel/ec/", this.ecForm).then(resp => {
                                if (resp) {
                                    this.dialogVisible = false;
                                    this.loadRecords();
                                }
                            })
                        } else {
                            this.postRequest("/personnel/ec/", this.ecForm).then(resp => {
                                if (resp) {
                                    this.dialogVisible = false;
                                    this.loadRecords();
                                }
                            })
                        }
                    }
                });
            },
            handleDelete(row) {
                this.$confirm('确定删除该奖惩记录吗?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.deleteRequest("/personnel/ec/" + row.id).then(resp => {
                        if (resp) {
                            this.loadRecords();
                        }
                    })
                }).catch(() => {
                    this.$message({type: 'info', message: '已取消删除'});
                });
            },
            formatDate(dateStr) {
                if (!dateStr) return '';
                let d = new Date(dateStr);
                return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
            }
        }
    }
</script>

<style scoped>
</style>
