<template>
    <div class="user-create">
        <PageBreadcrumb
            :title="isEditMode ? 'Edit User' : 'Create User'"
            :breadcrumbs="[
                { label: 'Users', to: { name: 'admin.users.index' } },
                { label: isEditMode ? 'Edit' : 'Create User' }
            ]"
        />

        <form @submit.prevent="handleSubmit">
            <div class="accordion-content clearfix">
                <div class="row">
                    <!-- Left Sidebar -->
                    <div class="col-lg-3 col-md-4">
                        <div class="accordion-box">
                            <div class="panel-group" id="UserTabs">
                                <div class="panel panel-default">
                                    <div class="panel-heading">
                                        <h4 class="panel-title">
                                            <a>User Information</a>
                                        </h4>
                                    </div>

                                    <div id="user_information" class="panel-collapse collapse in">
                                        <div class="panel-body">
                                            <ul class="accordion-tab nav nav-tabs">
                                                <li class="active">
                                                    <a href="#account" data-toggle="tab">Account</a>
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
                                <div class="tab-pane fade in active" id="account">
                                    <h4 class="tab-content-title">Account</h4>

                                    <div class="form-group-wrapper">
                                        <label for="first_name" class="form-label">
                                            First Name
                                            <span class="text-red">*</span>
                                        </label>
                                        <div class="form-input-wrapper">
                                            <input
                                                v-model="formData.firstName"
                                                name="first_name"
                                                class="form-control"
                                                id="first_name"
                                                type="text"
                                                placeholder="Enter first name"
                                            />
                                        </div>
                                    </div>

                                    <div class="form-group-wrapper">
                                        <label for="last_name" class="form-label">
                                            Last Name
                                            <span class="text-red">*</span>
                                        </label>
                                        <div class="form-input-wrapper">
                                            <input
                                                v-model="formData.lastName"
                                                name="last_name"
                                                class="form-control"
                                                id="last_name"
                                                type="text"
                                                placeholder="Enter last name"
                                            />
                                        </div>
                                    </div>

                                    <div class="form-group-wrapper">
                                        <label for="email" class="form-label">
                                            Email
                                            <span class="text-red">*</span>
                                        </label>
                                        <div class="form-input-wrapper">
                                            <input
                                                v-model="formData.email"
                                                name="email"
                                                class="form-control"
                                                id="email"
                                                type="email"
                                                placeholder="Enter email address"
                                            />
                                        </div>
                                    </div>

                                    <div class="form-group-wrapper">
                                        <label for="phone" class="form-label">
                                            Phone
                                        </label>
                                        <div class="form-input-wrapper">
                                            <input
                                                v-model="formData.phone"
                                                name="phone"
                                                class="form-control"
                                                id="phone"
                                                type="text"
                                                placeholder="Enter phone number"
                                            />
                                        </div>
                                    </div>

                                    <div class="form-group-wrapper">
                                        <label for="role" class="form-label">
                                            Role
                                            <span class="text-red">*</span>
                                        </label>
                                        <div class="form-input-wrapper">
                                            <select
                                                v-model="formData.role"
                                                name="role"
                                                class="form-control"
                                                id="role"
                                            >
                                                <option value="">Select role</option>
                                                <option value="USER">User</option>
                                                <option value="ADMIN">Admin</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div class="form-group-wrapper" v-if="!isEditMode">
                                        <label for="password" class="form-label">
                                            Password
                                            <span class="text-red">*</span>
                                        </label>
                                        <div class="form-input-wrapper">
                                            <input
                                                v-model="formData.password"
                                                name="password"
                                                class="form-control"
                                                id="password"
                                                type="password"
                                                placeholder="Enter password"
                                            />
                                        </div>
                                    </div>

                                    <div class="form-group-wrapper" v-if="!isEditMode">
                                        <label for="password_confirmation" class="form-label">
                                            Confirm Password
                                            <span class="text-red">*</span>
                                        </label>
                                        <div class="form-input-wrapper">
                                            <input
                                                v-model="formData.passwordConfirmation"
                                                name="password_confirmation"
                                                class="form-control"
                                                id="password_confirmation"
                                                type="password"
                                                placeholder="Confirm password"
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
import { getUserById, createUser, updateUser } from '@/api/userApi.js';

export default {
    name: 'UserCreate',
    components: {
        PageBreadcrumb
    },
    setup() {
        const router = useRouter();
        const route = useRoute();
        const notification = useNotification();
        const loading = ref(false);

        const formData = ref({
            firstName: '',
            lastName: '',
            email: '',
            phone: '',
            role: '',
            password: '',
            passwordConfirmation: ''
        });

        const isEditMode = computed(() => !!route.params.id);

        const loadUser = async () => {
            if (!isEditMode.value) return;

            loading.value = true;
            try {
                const response = await getUserById(route.params.id);
                const data = response.result || response.data || response;
                formData.value = {
                    firstName: data.firstName || '',
                    lastName: data.lastName || '',
                    email: data.email || '',
                    phone: data.phone || '',
                    role: data.role || '',
                    password: '',
                    passwordConfirmation: ''
                };
            } catch (error) {
                console.error('Failed to load user:', error);
                notification.error('Error!', 'Cannot load user information');
                router.push({ name: 'admin.users.index' });
            } finally {
                loading.value = false;
            }
        };

        const handleSubmit = async () => {
            // Validation
            if (!formData.value.firstName || formData.value.firstName.trim() === '') {
                notification.error('Validation Error', 'Please enter First Name');
                return;
            }

            if (!formData.value.lastName || formData.value.lastName.trim() === '') {
                notification.error('Validation Error', 'Please enter Last Name');
                return;
            }

            if (!formData.value.email || formData.value.email.trim() === '') {
                notification.error('Validation Error', 'Please enter Email');
                return;
            }

            if (!formData.value.role) {
                notification.error('Validation Error', 'Please select Role');
                return;
            }

            // Password validation for create mode
            if (!isEditMode.value) {
                if (!formData.value.password || formData.value.password.trim() === '') {
                    notification.error('Validation Error', 'Please enter Password');
                    return;
                }

                if (formData.value.password.length < 8) {
                    notification.error('Validation Error', 'Password must be at least 8 characters');
                    return;
                }

                if (formData.value.password !== formData.value.passwordConfirmation) {
                    notification.error('Validation Error', 'Password and Confirm Password do not match');
                    return;
                }
            }

            loading.value = true;
            try {
                const userData = {
                    firstName: formData.value.firstName.trim(),
                    lastName: formData.value.lastName.trim(),
                    email: formData.value.email.trim(),
                    role: formData.value.role
                };

                // Only add phone if it has value
                if (formData.value.phone && formData.value.phone.trim()) {
                    userData.phone = formData.value.phone.trim();
                }

                // Add password for create mode
                if (!isEditMode.value) {
                    userData.password = formData.value.password;
                }

                console.log('Sending user data:', userData);

                if (isEditMode.value) {
                    const response = await updateUser(route.params.id, userData);
                    console.log('Update response:', response);
                    notification.success('Success!', 'User updated successfully');
                } else {
                    const response = await createUser(userData);
                    console.log('Create response:', response);
                    notification.success('Success!', 'User created successfully');
                }
                
                // Redirect after successful save
                setTimeout(() => {
                    router.push({ name: 'admin.users.index' });
                }, 500);
            } catch (error) {
                console.error('Failed to save user:', error);
                console.error('Error details:', error.response?.data);
                
                // Show detailed error message
                if (error.response?.status === 400) {
                    const errorData = error.response.data;
                    if (errorData.errors) {
                        const errorMessages = Object.values(errorData.errors).flat().join(', ');
                        notification.error('Invalid Data!', errorMessages);
                    } else {
                        notification.error('Invalid Data!', errorData.message || 'Please check the information again');
                    }
                } else if (error.response?.status === 409) {
                    notification.error('Duplicate!', 'Email already exists in the system');
                } else if (error.response?.status === 500) {
                    notification.error('Server Error!', 'Please try again later');
                } else {
                    const errorMessage = error.response?.data?.message || error.message || 'An error occurred';
                    notification.error('Error!', isEditMode.value ? `Cannot update user: ${errorMessage}` : `Cannot create user: ${errorMessage}`);
                }
            } finally {
                loading.value = false;
            }
        };

        onMounted(() => {
            loadUser();
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
.user-create {
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
    align-items: flex-start;
    margin-bottom: 20px;
    gap: 20px;
}

.form-label {
    min-width: 150px;
    font-weight: 500;
    color: #374151;
    font-size: 13px;
    white-space: nowrap;
    flex-shrink: 0;
    padding-top: 7px;
}

.form-input-wrapper {
    flex: 1;
    max-width: 500px;
}

.text-left {
    text-align: left;
}

.text-red {
    color: #dc2626;
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

.row {
    margin-left: -15px;
    margin-right: -15px;
}

.col-md-3,
.col-md-9,
.col-md-8,
.col-md-10 {
    position: relative;
    min-height: 1px;
    padding-left: 15px;
    padding-right: 15px;
}

@media (min-width: 992px) {
    .col-md-3 {
        width: 25%;
        float: left;
    }

    .col-md-8 {
        width: 66.66666667%;
        float: left;
    }

    .col-md-9 {
        width: 75%;
        float: left;
    }

    .col-md-10 {
        width: 83.33333333%;
        float: left;
    }
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
