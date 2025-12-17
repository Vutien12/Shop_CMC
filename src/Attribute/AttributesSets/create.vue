<template>
    <div class="attribute-set-create">
        <PageBreadcrumb
            :title="isEditMode ? 'Edit Attribute Set' : 'Create Attribute Set'"
            :breadcrumbs="[
                { label: 'Attribute Sets', to: { name: 'admin.attribute-sets.index' } },
                { label: isEditMode ? 'Edit' : 'Create AttributeSets' }
            ]"
        />

        <form @submit.prevent="handleSubmit">
            <div class="accordion-content clearfix">
                <div class="row">
                    <!-- Left Sidebar -->
                    <div class="col-lg-3 col-md-4">
                        <div class="accordion-box">
                            <div class="panel-group" id="AttributeSetTabs">
                                <div class="panel panel-default">
                                    <div class="panel-heading">
                                        <h4 class="panel-title">
                                            <a>Attribute set information</a>
                                        </h4>
                                    </div>

                                    <div id="attribute_set_information" class="panel-collapse collapse in">
                                        <div class="panel-body">
                                            <ul class="accordion-tab nav nav-tabs">
                                                <li class="active">
                                                    <a href="#general" data-toggle="tab">General</a>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Right Content -->
                    <div class="col-lg-9 col-md-8">
                        <div class="accordion-box-content">
                            <div class="tab-content clearfix">
                                <div class="tab-pane fade in active" id="general">
                                    <h4 class="tab-content-title">General</h4>

                                    <div class="form-group-wrapper">
                                        <label for="name" class="form-label">
                                            Name
                                            <span class="text-red">*</span>
                                        </label>
                                        <div class="form-input-wrapper">
                                            <input
                                                v-model="formData.name"
                                                name="name"
                                                class="form-control"
                                                id="name"
                                                type="text"
                                                placeholder="Enter attribute set name"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div class="form-group">
                                    <div class="col-md-10 col-md-offset-2">
                                        <button type="submit" class="btn btn-primary" :disabled="loading">
                                            {{ loading ? 'Saving...' : 'Save' }}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useNotification } from '@/Admin/composables/useNotification.js';
import PageBreadcrumb from '@/Admin/view/components/PageBreadcrumb.vue';
import { getAttributeSet, createAttributeSet, updateAttributeSet } from '@/api/attributeSetApi.js';

export default {
    name: 'AttributeSetCreate',
    components: {
        PageBreadcrumb
    },
    setup() {
        const router = useRouter();
        const route = useRoute();
        const notification = useNotification();
        const loading = ref(false);

        const formData = ref({
            name: ''
        });

        const isEditMode = computed(() => !!route.params.id);

        const loadAttributeSet = async () => {
            if (!isEditMode.value) return;

            loading.value = true;
            try {
                const response = await getAttributeSet(route.params.id);
                const data = response.result || response;
                formData.value = {
                    name: data.name || ''
                };
            } catch (error) {
                console.error('Failed to load attribute set:', error);
                notification.error('Lỗi!', 'Không thể tải attribute set');
                router.push({ name: 'admin.attribute-sets.index' });
            } finally {
                loading.value = false;
            }
        };

        const handleSubmit = async () => {
            // Validation
            if (!formData.value.name || formData.value.name.trim() === '') {
                notification.error('Lỗi kiểm tra', 'Vui lòng nhập tên attribute set');
                return;
            }

            loading.value = true;
            try {
                if (isEditMode.value) {
                    await updateAttributeSet(route.params.id, formData.value);
                    notification.success('Thành công!', 'Đã cập nhật attribute set');
                } else {
                    await createAttributeSet(formData.value);
                    notification.success('Thành công!', 'Đã tạo attribute set');
                }
                router.push({ name: 'admin.attribute-sets.index' });
            } catch (error) {
                console.error('Failed to save attribute set:', error);
                notification.error('Lỗi!', 'Không thể lưu attribute set: ' + (error.response?.data?.message || error.message));
            } finally {
                loading.value = false;
            }
        };

        onMounted(() => {
            loadAttributeSet();
        });

        return {
            formData,
            loading,
            isEditMode,
            handleSubmit
        };
    }
};
</script>

<style scoped>
.attribute-set-create {
    padding: 20px;
}

.accordion-content {
    background: #fff;
    padding: 20px 5px;
    border-radius: 8px;
    box-shadow: 0 0 0 1px rgba(140, 140, 140, 0.2);
    margin-top: 20px;
}

.accordion-box {
    background: #fff;
    margin-left: 25px;
    margin-top: 25px;
}

.panel-group {
    margin-bottom: 0;
}

.panel {
    border-radius: 4px;
    box-shadow: none;
    border: 1px solid #e5e7eb;
}

.panel-default {
    border-color: #e5e7eb;
}

.panel-heading {
    background: linear-gradient(to bottom, #fafbfc, #ffffff);
    border-bottom: 2px solid #f0f4f8;
    padding: 15px 20px;
    border-radius: 4px 4px 0 0;
}

.panel-title {
    margin: 0;
    font-size: 14px;
    font-weight: 600;
    color: #2d3748;
}

.panel-title a {
    color: #2d3748;
    text-decoration: none;
    display: block;
}

.panel-collapse {
    border-top: none;
}

.panel-body {
    padding: 0;
}

.accordion-tab {
    list-style: none;
    padding: 0;
    margin: 0;
    border-bottom: none;
}

.accordion-tab li {
    margin: 0;
}

.accordion-tab li a {
    display: block;
    padding: 12px 20px;
    color: #4a5568;
    text-decoration: none;
    border-left: 3px solid transparent;
    transition: all 0.2s ease;
    font-size: 13px;
}

.accordion-tab li a:hover {
    background: #f7fafc;
    color: #2d3748;
    border-left-color: #cbd5e0;
}

.accordion-tab li.active a {
    background: #edf2f7;
    color: #2b6cb0;
    border-left-color: #2b6cb0;
    font-weight: 500;
}

.accordion-box-content {
    background: #fff;
}

.tab-content {
    padding: 20px;
}

.tab-pane {
    display: none;
}

.tab-pane.active {
    display: block;
}

.tab-content-title {
    font-size: 16px;
    font-weight: 600;
    color: #2d3748;
    margin: 0 0 20px 0;
    padding-bottom: 12px;
    border-bottom: 2px solid #e5e7eb;
}

.form-group-wrapper {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
    gap: 20px;
}

.form-label {
    min-width: 120px;
    font-weight: 500;
    color: #374151;
    font-size: 13px;
    white-space: nowrap;
    flex-shrink: 0;
}

.form-input-wrapper {
    flex: 1;
    max-width: 500px;
}

.form-group {
    margin-bottom: 20px;
    display: flex;
    align-items: center;
}

.text-left {
    text-align: left;
}

.text-red {
    color: #dc2626;
}

.m-l-5 {
    margin-left: 5px;
}

.form-control {
    width: 100%;
    padding: 9px 12px;
    border: 1px solid #d1d5db;
    border-radius: 6px;
    font-size: 13px;
    transition: all 0.2s ease;
    background: #ffffff;
    line-height: 1.5;
}

.form-control:focus {
    outline: none;
    border-color: #4299e1;
    box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.1);
}

.btn {
    padding: 9px 16px;
    border-radius: 6px;
    font-size: 13px;
    font-weight: 500;
    border: none;
    cursor: pointer;
    transition: all 0.2s ease;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
}

.btn-primary {
    color: white;
    background: #2b6cb0;
}

.btn-primary:hover:not(:disabled) {
    background: #2c5282;
}

.btn-primary:disabled {
    opacity: 0.6;
    cursor: not-allowed;
}

.clearfix::after {
    content: "";
    display: table;
    clear: both;
}

.col-md-offset-2 {
    margin-left: 16.66666667%;
}

@media (max-width: 992px) {
    .col-lg-3,
    .col-lg-9 {
        flex: 0 0 100%;
        max-width: 100%;
    }

    .accordion-box {
        margin-bottom: 20px;
    }
}
</style>
