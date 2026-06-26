<template>
    <div style="display: flex; height: calc(100vh - 160px);">
        <!-- 左侧员工列表 -->
        <div style="width: 420px; border-right: 1px solid #e6e6e6; padding-right: 15px;">
            <el-input v-model="keyword" placeholder="搜索员工姓名" prefix-icon="el-icon-search" size="small"
                      @keydown.enter.native="searchEmp" style="margin-bottom: 10px;">
            </el-input>
            <el-table :data="employees" border size="small" stripe highlight-current-row
                      @current-change="handleRowClick" style="width: 100%;" max-height="600">
                <el-table-column prop="name" label="姓名" width="80"></el-table-column>
                <el-table-column prop="workID" label="工号" width="100"></el-table-column>
                <el-table-column label="部门">
                    <template slot-scope="scope">
                        {{scope.row.department ? scope.row.department.name : ''}}
                    </template>
                </el-table-column>
                <el-table-column label="职位" width="90">
                    <template slot-scope="scope">
                        {{scope.row.position ? scope.row.position.name : ''}}
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination layout="prev, pager, next" :total="total" :page-size="size"
                           @current-change="handlePageChange" style="margin-top: 10px; text-align: center;">
            </el-pagination>
        </div>

        <!-- 右侧员工详情 -->
        <div style="flex: 1; padding-left: 20px; overflow-y: auto;">
            <div v-if="!selectedEmp" class="empty-placeholder">
                <i class="el-icon-user" style="font-size: 60px;"></i>
                <p>请在左侧选择一位员工查看资料</p>
            </div>
            <div v-else :key="selectedEmp.id" class="animate__animated animate__fadeIn">
                <!-- 员工头部信息卡片 -->
                <div class="profile-header animate__animated animate__slideInDown">
                    <img :src="selectedEmp.userface || '/avatars/cat.svg'" class="avatar" />
                    <div class="profile-info">
                        <h2>{{selectedEmp.name}}</h2>
                        <p>工号: {{selectedEmp.workID}} | {{selectedEmp.department ? selectedEmp.department.name : ''}} | {{selectedEmp.position ? selectedEmp.position.name : ''}}</p>
                    </div>
                    <div class="status-badge">
                        <el-tag :type="selectedEmp.workState === '在职' ? 'success' : 'danger'" effect="dark">
                            {{selectedEmp.workState}}
                        </el-tag>
                    </div>
                </div>

                <!-- 自定义标签区域 -->
                <div class="tags-section animate__animated animate__fadeInUp">
                    <div class="tags-header">
                        <span class="tags-title">自定义标签</span>
                        <el-button type="text" size="small" icon="el-icon-plus" @click="showTagDialog = true">添加标签</el-button>
                    </div>
                    <div class="tags-container">
                        <el-tag v-for="(tag, idx) in empTags" :key="idx" :type="tag.type" effect="dark" closable
                                class="emp-tag animate__animated animate__bounceIn"
                                :style="{'animation-delay': (idx * 0.05) + 's'}"
                                @close="removeTag(idx)">
                            {{tag.name}}
                        </el-tag>
                        <span v-if="empTags.length === 0" style="color: #aaa; font-size: 12px;">暂无标签，点击右上角添加</span>
                    </div>
                </div>

                <!-- 信息卡片区 -->
                <el-tabs v-model="activeTab" class="info-tabs">
                    <el-tab-pane label="基本信息" name="basic">
                        <div class="info-card animate__animated animate__fadeInUp">
                            <div class="info-grid">
                                <div class="info-item" v-for="(item, idx) in basicFields" :key="idx"
                                     :class="item.span === 2 ? 'span-2' : ''"
                                     :style="{'animation-delay': (idx * 0.03) + 's'}">
                                    <div class="info-label">{{item.label}}</div>
                                    <div class="info-value">{{item.value || '-'}}</div>
                                </div>
                            </div>
                        </div>
                    </el-tab-pane>
                    <el-tab-pane label="合同信息" name="contract">
                        <div class="info-card animate__animated animate__fadeInUp">
                            <div class="info-grid">
                                <div class="info-item" v-for="(item, idx) in contractFields" :key="idx"
                                     :style="{'animation-delay': (idx * 0.03) + 's'}">
                                    <div class="info-label">{{item.label}}</div>
                                    <div class="info-value">{{item.value || '-'}}</div>
                                </div>
                            </div>
                        </div>
                    </el-tab-pane>
                    <el-tab-pane label="教育信息" name="education">
                        <div class="info-card animate__animated animate__fadeInUp">
                            <div class="info-grid">
                                <div class="info-item" v-for="(item, idx) in educationFields" :key="idx"
                                     :style="{'animation-delay': (idx * 0.03) + 's'}">
                                    <div class="info-label">{{item.label}}</div>
                                    <div class="info-value">{{item.value || '-'}}</div>
                                </div>
                            </div>
                        </div>
                    </el-tab-pane>
                </el-tabs>
            </div>
        </div>

        <!-- 添加标签弹窗 -->
        <el-dialog title="添加自定义标签" :visible.sync="showTagDialog" width="400px">
            <el-form size="small">
                <el-form-item label="标签名称">
                    <el-input v-model="newTag.name" placeholder="请输入标签名称"></el-input>
                </el-form-item>
                <el-form-item label="标签颜色">
                    <el-radio-group v-model="newTag.type">
                        <el-radio label="">
                            <el-tag size="small" effect="dark">默认</el-tag>
                        </el-radio>
                        <el-radio label="success">
                            <el-tag size="small" type="success" effect="dark">绿色</el-tag>
                        </el-radio>
                        <el-radio label="warning">
                            <el-tag size="small" type="warning" effect="dark">橙色</el-tag>
                        </el-radio>
                        <el-radio label="danger">
                            <el-tag size="small" type="danger" effect="dark">红色</el-tag>
                        </el-radio>
                    </el-radio-group>
                </el-form-item>
            </el-form>
            <span slot="footer">
                <el-button size="small" @click="showTagDialog = false">取消</el-button>
                <el-button size="small" type="primary" @click="addTag">确定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: "PerEmp",
        data() {
            return {
                employees: [],
                total: 0,
                page: 1,
                size: 10,
                keyword: '',
                selectedEmp: null,
                activeTab: 'basic',
                showTagDialog: false,
                newTag: { name: '', type: '' },
                allTags: {}  // { empId: [{name, type}] }
            }
        },
        computed: {
            empTags() {
                if (!this.selectedEmp) return [];
                return this.allTags[this.selectedEmp.id] || [];
            },
            basicFields() {
                let e = this.selectedEmp;
                if (!e) return [];
                return [
                    {label: '姓名', value: e.name},
                    {label: '性别', value: e.gender},
                    {label: '出生日期', value: this.formatDate(e.birthday)},
                    {label: '身份证号', value: e.idCard},
                    {label: '婚姻状况', value: e.wedlock},
                    {label: '民族', value: e.nation ? e.nation.name : ''},
                    {label: '籍贯', value: e.nativePlace},
                    {label: '政治面貌', value: e.politicsstatus ? e.politicsstatus.name : ''},
                    {label: '电话', value: e.phone},
                    {label: '邮箱', value: e.email},
                    {label: '联系地址', value: e.address, span: 2},
                    {label: '部门', value: e.department ? e.department.name : ''},
                    {label: '职位', value: e.position ? e.position.name : ''},
                    {label: '职称', value: e.jobLevel ? e.jobLevel.name : ''},
                    {label: '聘用形式', value: e.engageForm}
                ];
            },
            contractFields() {
                let e = this.selectedEmp;
                if (!e) return [];
                return [
                    {label: '入职日期', value: this.formatDate(e.beginDate)},
                    {label: '转正日期', value: this.formatDate(e.conversionTime)},
                    {label: '合同起始日', value: this.formatDate(e.beginContract)},
                    {label: '合同终止日', value: this.formatDate(e.endContract)},
                    {label: '合同期限(年)', value: e.contractTerm},
                    {label: '在职状态', value: e.workState}
                ];
            },
            educationFields() {
                let e = this.selectedEmp;
                if (!e) return [];
                return [
                    {label: '最高学历', value: e.tiptopDegree},
                    {label: '毕业院校', value: e.school},
                    {label: '所属专业', value: e.specialty}
                ];
            }
        },
        mounted() {
            this.loadEmployees();
            this.loadTags();
        },
        methods: {
            loadEmployees() {
                this.getRequest("/personnel/emp/?page=" + this.page + "&size=" + this.size +
                    (this.keyword ? "&name=" + this.keyword : '')).then(resp => {
                    if (resp) {
                        this.employees = resp.data;
                        this.total = resp.total;
                    }
                })
            },
            searchEmp() {
                this.page = 1;
                this.loadEmployees();
            },
            handlePageChange(page) {
                this.page = page;
                this.loadEmployees();
            },
            handleRowClick(row) {
                if (row) {
                    this.getRequest("/personnel/emp/" + row.id).then(resp => {
                        if (resp) {
                            this.selectedEmp = resp;
                            this.activeTab = 'basic';
                        }
                    })
                }
            },
            addTag() {
                if (!this.newTag.name.trim()) {
                    this.$message.warning('请输入标签名称');
                    return;
                }
                let eid = this.selectedEmp.id;
                if (!this.allTags[eid]) {
                    this.$set(this.allTags, eid, []);
                }
                this.allTags[eid].push({name: this.newTag.name.trim(), type: this.newTag.type});
                this.saveTags();
                this.newTag = {name: '', type: ''};
                this.showTagDialog = false;
            },
            removeTag(idx) {
                let eid = this.selectedEmp.id;
                this.allTags[eid].splice(idx, 1);
                this.saveTags();
            },
            saveTags() {
                window.localStorage.setItem('emp_custom_tags', JSON.stringify(this.allTags));
            },
            loadTags() {
                let saved = window.localStorage.getItem('emp_custom_tags');
                if (saved) {
                    this.allTags = JSON.parse(saved);
                }
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
    .empty-placeholder {
        text-align: center;
        color: #999;
        padding-top: 100px;
    }

    .profile-header {
        background: linear-gradient(135deg, #1e88e5, #1565c0);
        border-radius: 12px;
        padding: 24px;
        display: flex;
        align-items: center;
        margin-bottom: 16px;
        box-shadow: 0 4px 15px rgba(30, 136, 229, 0.3);
    }

    .profile-header .avatar {
        width: 72px;
        height: 72px;
        border-radius: 50%;
        border: 3px solid rgba(255, 255, 255, 0.8);
        margin-right: 20px;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
    }

    .profile-header .profile-info h2 {
        margin: 0 0 6px 0;
        color: #fff;
        font-size: 22px;
        font-weight: 600;
    }

    .profile-header .profile-info p {
        margin: 0;
        color: rgba(255, 255, 255, 0.85);
        font-size: 13px;
    }

    .profile-header .status-badge {
        margin-left: auto;
    }

    .tags-section {
        background: #f0f7ff;
        border: 1px solid #d4e8fc;
        border-radius: 8px;
        padding: 12px 16px;
        margin-bottom: 16px;
    }

    .tags-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 8px;
    }

    .tags-title {
        font-size: 13px;
        font-weight: 600;
        color: #1565c0;
    }

    .tags-container {
        min-height: 28px;
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 6px;
    }

    .emp-tag {
        border-radius: 12px;
    }

    .info-tabs >>> .el-tabs__item.is-active {
        color: #1565c0;
    }

    .info-tabs >>> .el-tabs__active-bar {
        background-color: #1565c0;
    }

    .info-card {
        background: linear-gradient(180deg, #f5f9ff, #ffffff);
        border: 1px solid #e3edf7;
        border-radius: 10px;
        padding: 20px;
        box-shadow: 0 2px 8px rgba(21, 101, 192, 0.06);
    }

    .info-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 0;
    }

    .info-item {
        padding: 12px 16px;
        border-bottom: 1px solid #eef3fa;
        animation: fadeInUp 0.4s ease forwards;
        opacity: 0;
    }

    .info-item.span-2 {
        grid-column: span 2;
    }

    .info-item:hover {
        background: rgba(30, 136, 229, 0.04);
        transition: background 0.2s ease;
    }

    .info-label {
        font-size: 11px;
        color: #90a4ae;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        margin-bottom: 4px;
        font-weight: 500;
    }

    .info-value {
        font-size: 14px;
        color: #263238;
        font-weight: 500;
    }

    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
</style>
