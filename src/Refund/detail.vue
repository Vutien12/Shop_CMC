<template>
    <div class="case-detail-container">
        <div class="case-detail-header">
            <div class="header-left">
                <button class="btn-back" @click="goBack">
                    <i class="fa-solid fa-arrow-left"></i>
                    Back to List
                </button>
                <h1>Case Detail #{{ caseId }}</h1>
            </div>
            <div class="header-right">
                <span class="status-badge" :class="getStatusClass(caseDetail?.status)">
                    {{ getStatusLabel(caseDetail?.status) }}
                </span>
            </div>
        </div>

        <div v-if="loading" class="loading-container">
            <div class="spinner"></div>
            <p>Loading case details...</p>
        </div>

        <div v-else-if="caseDetail" class="case-detail-content">
            <!-- General Information -->
            <div class="info-card">
                <h3><i class="fa-solid fa-info-circle"></i> General Information</h3>
                <div class="info-grid">
                    <div class="info-item">
                        <label>Case ID</label>
                        <div class="info-value">{{ caseDetail.id }}</div>
                    </div>
                    <div class="info-item">
                        <label>Order ID</label>
                        <div class="info-value">{{ caseDetail.orderId }}</div>
                    </div>
                    <div class="info-item">
                        <label>Created At</label>
                        <div class="info-value">{{ formatDate(caseDetail.createdAt) }}</div>
                    </div>
                    <div class="info-item">
                        <label>User Name</label>
                        <div class="info-value">{{ caseDetail.userName }}</div>
                    </div>
                    <div class="info-item">
                        <label>User Email</label>
                        <div class="info-value">{{ caseDetail.userEmail }}</div>
                    </div>
                    <div class="info-item">
                        <label>User ID</label>
                        <div class="info-value">{{ caseDetail.userId }}</div>
                    </div>
                    <div class="info-item">
                        <label>Type</label>
                        <span :class="['type-badge', getTypeClass(caseDetail.type)]">
                            {{ getTypeLabel(caseDetail.type) }}
                        </span>
                    </div>
                    <div class="info-item">
                        <label>Status</label>
                        <span :class="['status-badge', getStatusClass(caseDetail.status)]">
                            {{ getStatusLabel(caseDetail.status) }}
                        </span>
                    </div>
                    <div class="info-item">
                        <label>Updated At</label>
                        <div class="info-value">{{ formatDate(caseDetail.updatedAt) }}</div>
                    </div>
                </div>
            </div>

            <!-- Request Details -->
            <div class="info-card">
                <h3><i class="fa-solid fa-message"></i> Request Details</h3>
                <div class="info-item">
                    <label>Reason</label>
                    <div class="info-text">{{ caseDetail.reason }}</div>
                </div>
            </div>

            <!-- Admin Actions -->
            <div class="info-card">
                <h3><i class="fa-solid fa-user-shield"></i> Admin Actions</h3>

                <div class="form-group">
                    <label>Refund Amount</label>
                    <input
                        type="number"
                        class="form-input"
                        v-model.number="refundAmount"
                        placeholder="Enter refund amount"
                        :disabled="submitting"
                    />
                </div>

                <div class="form-group">
                    <label>Admin Note</label>
                    <textarea
                        class="form-textarea"
                        rows="4"
                        v-model="adminNote"
                        placeholder="Add admin note or reason for decision..."
                        :disabled="submitting"
                    ></textarea>
                </div>

                <div class="form-group">
                    <label class="checkbox-label">
                        <input
                            type="checkbox"
                            v-model="needReturn"
                            :disabled="submitting"
                        >
                        <span>  Need Return</span>
                    </label>
                </div>

                <!-- Action Buttons -->
                <div class="action-buttons">
                    <!-- Request Info - Only show when not yet processed -->
                    <button
                        v-if="showRequestInfo"
                        class="btn btn-info"
                        @click="handleRequestInfo"
                        :disabled="submitting"
                    >
                        <i class="fa-solid fa-question-circle"></i>
                        Request Info
                    </button>

                    <!-- Approve - Show for all types when PENDING/REQUESTING_INFO/USER_RESPONDED -->
                    <button
                        v-if="showApprove"
                        class="btn btn-success"
                        @click="handleApprove"
                        :disabled="submitting"
                    >
                        <i class="fa-solid fa-check"></i>
                        Approve
                    </button>

                    <!-- Reject - Show for all types when PENDING/REQUESTING_INFO/USER_RESPONDED -->
                    <button
                        v-if="showReject"
                        class="btn btn-danger"
                        @click="handleReject"
                        :disabled="submitting"
                    >
                        <i class="fa-solid fa-times"></i>
                        Reject
                    </button>

                    <!-- Mark Returned - Only for REFUND/EXCHANGE when needReturn is true and status is APPROVED -->
                    <button
                        v-if="showMarkReturned"
                        class="btn btn-warning"
                        @click="handleReturned"
                        :disabled="submitting"
                    >
                        <i class="fa-solid fa-box"></i>
                        Mark Returned
                    </button>

                    <!-- Mark Refunded - Only for REFUND/EXCHANGE when refundAmount > 0 and status is APPROVED or RETURNED -->
                    <button
                        v-if="showMarkRefunded"
                        class="btn btn-refunded"
                        @click="handleRefunded"
                        :disabled="submitting"
                    >
                        <i class="fa-solid fa-money-bill-wave"></i>
                        Mark Refunded
                    </button>

                    <!-- Complete - Show when all required steps are done -->
                    <button
                        v-if="showComplete"
                        class="btn btn-primary"
                        @click="handleComplete"
                        :disabled="submitting"
                    >
                        <i class="fa-solid fa-check-double"></i>
                        Complete
                    </button>

                    <!-- Close Case - Always available -->
                    <button
                        v-if="showCloseCase"
                        class="btn btn-closed"
                        @click="handleClosed"
                        :disabled="submitting"
                    >
                        <i class="fa-solid fa-lock"></i>
                        Close Case
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { getOrderCaseById, updateOrderCase } from '@/api/orderCaseApi.js';

export default {
    name: 'AdminCaseDetail',
    setup() {
        const route = useRoute();
        const router = useRouter();
        const caseId = ref(route.params.id);
        const caseDetail = ref(null);
        const loading = ref(true);
        const submitting = ref(false);
        const adminNote = ref('');
        const refundAmount = ref(0);
        const needReturn = ref(false);

        // Computed properties for button visibility
        const isCancelType = computed(() => caseDetail.value?.type === 'CANCEL');
        const isRefundOrExchangeType = computed(() =>
            ['REFUND', 'EXCHANGE'].includes(caseDetail.value?.type)
        );
        const currentStatus = computed(() => caseDetail.value?.status);

        // Request Info - Only when status is PENDING, REQUESTING_INFO, or USER_RESPONDED
        const showRequestInfo = computed(() => {
            if (!caseDetail.value) return false;
            return ['PENDING', 'REQUESTING_INFO', 'USER_RESPONDED'].includes(currentStatus.value);
        });

        // Approve - Show when PENDING, REQUESTING_INFO, or USER_RESPONDED
        const showApprove = computed(() => {
            if (!caseDetail.value) return false;
            return ['PENDING', 'REQUESTING_INFO', 'USER_RESPONDED'].includes(currentStatus.value);
        });

        // Reject - Show when PENDING, REQUESTING_INFO, or USER_RESPONDED
        const showReject = computed(() => {
            if (!caseDetail.value) return false;
            return ['PENDING', 'REQUESTING_INFO', 'USER_RESPONDED'].includes(currentStatus.value);
        });

        // Mark Returned - Only for REFUND/EXCHANGE when needReturn is true and status is APPROVED
        const showMarkReturned = computed(() => {
            if (!caseDetail.value) return false;
            return isRefundOrExchangeType.value &&
                   needReturn.value &&
                   currentStatus.value === 'APPROVED';
        });

        const showMarkRefunded = computed(() => {
            if (!caseDetail.value) return false;
            if (!isRefundOrExchangeType.value) return false;
            if (refundAmount.value <= 0) return false;

            if (needReturn.value) {
                return currentStatus.value === 'RETURNED';
            }

            // If no need return, can refund directly from APPROVED
            return currentStatus.value === 'APPROVED';
        });

        // Complete - Show based on conditions:
        // - If refundAmount > 0: show when REFUNDED
        // - If refundAmount = 0 or no amount: show when RETURNED (if needReturn) or APPROVED (if no needReturn)
        const showComplete = computed(() => {
            if (!caseDetail.value) return false;

            // For CANCEL type - show when APPROVED
            if (isCancelType.value) {
                return currentStatus.value === 'APPROVED';
            }

            // For REFUND/EXCHANGE type
            if (isRefundOrExchangeType.value) {
                // If has refund amount, must be REFUNDED first
                if (refundAmount.value > 0) {
                    return currentStatus.value === 'REFUNDED';
                }
                // If no refund amount but need return, must be RETURNED first
                if (needReturn.value) {
                    return currentStatus.value === 'RETURNED';
                }
                // If no refund and no return needed, can complete when APPROVED
                return currentStatus.value === 'APPROVED';
            }

            return false;
        });

        // Close Case - Can close anytime except when already CLOSED
        const showCloseCase = computed(() => {
            if (!caseDetail.value) return false;
            return currentStatus.value !== 'CLOSED';
        });

        const loadCaseDetail = async () => {
            try {
                loading.value = true;
                const response = await getOrderCaseById(caseId.value);
                console.log('Case detail response:', response);

                // Support both code 200 and 1000
                if (response.code === 1000 || response.code === 200) {
                    caseDetail.value = response.result;
                    adminNote.value = caseDetail.value.adminNote || '';
                    refundAmount.value = caseDetail.value.refundAmount || 0;
                    needReturn.value = caseDetail.value.needReturn || false;
                    console.log('Loaded case detail:', caseDetail.value);
                }
            } catch (error) {
                console.error('Error loading case detail:', error);
                alert('Failed to load case detail');
                goBack();
            } finally {
                loading.value = false;
            }
        };

        const handleApprove = async () => {
            try {
                submitting.value = true;
                const updateData = {
                    status: 'APPROVED',
                    adminNote: adminNote.value,
                    refundAmount: refundAmount.value,
                    needReturn: needReturn.value
                };

                const response = await updateOrderCase(caseId.value, updateData);

                if (response.code === 1000 || response.code === 200) {
                    alert('Case approved successfully!');
                    await loadCaseDetail();
                } else {
                    alert(response.message || 'Failed to approve case');
                }
            } catch (error) {
                console.error('Error approving case:', error);
                alert('Failed to approve case. Please try again.');
            } finally {
                submitting.value = false;
            }
        };

        const handleReject = async () => {
            try {
                if (!adminNote.value || adminNote.value.trim() === '') {
                    alert('Please provide a reason for rejection in the admin note.');
                    return;
                }

                submitting.value = true;
                const updateData = {
                    status: 'REJECTED',
                    adminNote: adminNote.value
                };

                const response = await updateOrderCase(caseId.value, updateData);

                if (response.code === 1000 || response.code === 200) {
                    alert('Case rejected successfully!');
                    await loadCaseDetail();
                } else {
                    alert(response.message || 'Failed to reject case');
                }
            } catch (error) {
                console.error('Error rejecting case:', error);
                alert('Failed to reject case. Please try again.');
            } finally {
                submitting.value = false;
            }
        };

        const handleRequestInfo = async () => {
            try {
                if (!adminNote.value || adminNote.value.trim() === '') {
                    alert('Please provide details about what information is needed.');
                    return;
                }

                submitting.value = true;
                const updateData = {
                    status: 'REQUESTING_INFO',
                    adminNote: adminNote.value
                };

                const response = await updateOrderCase(caseId.value, updateData);

                if (response.code === 1000 || response.code === 200) {
                    alert('Information request sent successfully!');
                    await loadCaseDetail();
                } else {
                    alert(response.message || 'Failed to request information');
                }
            } catch (error) {
                console.error('Error requesting information:', error);
                alert('Failed to request information. Please try again.');
            } finally {
                submitting.value = false;
            }
        };

        const handleComplete = async () => {
            try {
                submitting.value = true;
                const updateData = {
                    status: 'COMPLETED',
                    adminNote: adminNote.value
                };

                const response = await updateOrderCase(caseId.value, updateData);

                if (response.code === 1000 || response.code === 200) {
                    alert('Case completed successfully!');
                    await loadCaseDetail();
                } else {
                    alert(response.message || 'Failed to complete case');
                }
            } catch (error) {
                console.error('Error completing case:', error);
                alert('Failed to complete case. Please try again.');
            } finally {
                submitting.value = false;
            }
        };

        const handleReturned = async () => {
            try {
                submitting.value = true;
                const updateData = {
                    status: 'RETURNED',
                    adminNote: adminNote.value
                };

                const response = await updateOrderCase(caseId.value, updateData);

                if (response.code === 1000 || response.code === 200) {
                    alert('Item marked as returned successfully!');
                    await loadCaseDetail();
                } else {
                    alert(response.message || 'Failed to mark as returned');
                }
            } catch (error) {
                console.error('Error marking as returned:', error);
                alert('Failed to mark as returned. Please try again.');
            } finally {
                submitting.value = false;
            }
        };

        const handleRefunded = async () => {
            try {
                submitting.value = true;
                const updateData = {
                    status: 'REFUNDED',
                    adminNote: adminNote.value,
                    refundAmount: refundAmount.value
                };

                const response = await updateOrderCase(caseId.value, updateData);

                if (response.code === 1000 || response.code === 200) {
                    alert('Refund processed successfully!');
                    await loadCaseDetail();
                } else {
                    alert(response.message || 'Failed to process refund');
                }
            } catch (error) {
                console.error('Error processing refund:', error);
                alert('Failed to process refund. Please try again.');
            } finally {
                submitting.value = false;
            }
        };

        const handleClosed = async () => {
            try {
                if (!confirm('Are you sure you want to close this case? This action cannot be undone.')) {
                    return;
                }

                submitting.value = true;
                const updateData = {
                    status: 'CLOSED',
                    adminNote: adminNote.value
                };

                const response = await updateOrderCase(caseId.value, updateData);

                if (response.code === 1000 || response.code === 200) {
                    alert('Case closed successfully!');
                    await loadCaseDetail();
                } else {
                    alert(response.message || 'Failed to close case');
                }
            } catch (error) {
                console.error('Error closing case:', error);
                alert('Failed to close case. Please try again.');
            } finally {
                submitting.value = false;
            }
        };

        const goBack = () => {
            router.push('/admin/refund');
        };

        const formatDate = (date) => {
            if (!date) return '-';
            const d = new Date(date);
            return d.toLocaleString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        };

        const getTypeLabel = (type) => {
            const labels = {
                'CANCEL': 'Cancel',
                'REFUND': 'Refund',
                'EXCHANGE': 'Exchange',
                'REQUEST_INFO': 'Request Info'
            };
            return labels[type] || type;
        };

        const getTypeClass = (type) => {
            const classes = {
                'CANCEL': 'type-cancel',
                'REFUND': 'type-refund',
                'EXCHANGE': 'type-exchange',
                'REQUEST_INFO': 'type-info'
            };
            return classes[type] || '';
        };

        const getStatusLabel = (status) => {
            const labels = {
                'PENDING': 'Pending',
                'REQUESTING_INFO': 'Requesting Info',
                'USER_RESPONDED': 'User Responded',
                'APPROVED': 'Approved',
                'REJECTED': 'Rejected',
                'RETURNING': 'Returning',
                'RETURNED': 'Returned',
                'REFUNDED': 'Refunded',
                'COMPLETED': 'Completed',
                'CLOSED': 'Closed'
            };
            return labels[status] || status;
        };

        const getStatusClass = (status) => {
            const classes = {
                'PENDING': 'status-pending',
                'REQUESTING_INFO': 'status-info',
                'USER_RESPONDED': 'status-responded',
                'APPROVED': 'status-approved',
                'REJECTED': 'status-rejected',
                'RETURNING': 'status-returning',
                'RETURNED': 'status-returned',
                'REFUNDED': 'status-refunded',
                'COMPLETED': 'status-completed',
                'CLOSED': 'status-closed'
            };
            return classes[status] || '';
        };

        onMounted(() => {
            loadCaseDetail();
        });

        return {
            caseId,
            caseDetail,
            loading,
            submitting,
            adminNote,
            refundAmount,
            needReturn,
            // Computed visibility flags
            showRequestInfo,
            showApprove,
            showReject,
            showMarkReturned,
            showMarkRefunded,
            showComplete,
            showCloseCase,
            // Handlers
            handleApprove,
            handleReject,
            handleRequestInfo,
            handleComplete,
            handleReturned,
            handleRefunded,
            handleClosed,
            goBack,
            // Formatters
            formatDate,
            getTypeLabel,
            getTypeClass,
            getStatusLabel,
            getStatusClass
        };
    }
};
</script>

<style scoped>
.case-detail-container {
    padding: 24px;
    background-color: #f8f9fa;
    min-height: 100vh;
}

.case-detail-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
    background: white;
    padding: 20px;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.header-left {
    display: flex;
    align-items: center;
    gap: 16px;
}

.btn-back {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 16px;
    background: #f3f4f6;
    border: none;
    border-radius: 8px;
    color: #374151;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
}

.btn-back:hover {
    background: #e5e7eb;
}

.header-left h1 {
    font-size: 24px;
    color: #111827;
    margin: 0;
}

.loading-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 60px 20px;
}

.spinner {
    width: 48px;
    height: 48px;
    border: 4px solid #e5e7eb;
    border-top-color: #3b82f6;
    border-radius: 50%;
    animation: spin 1s linear infinite;
}

@keyframes spin {
    to { transform: rotate(360deg); }
}

.case-detail-content {
    display: flex;
    flex-direction: column;
    gap: 24px;
}

.info-card {
    background: white;
    border-radius: 12px;
    padding: 24px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.info-card h3 {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 18px;
    color: #111827;
    margin: 0 0 20px 0;
    padding-bottom: 12px;
    border-bottom: 2px solid #f3f4f6;
}

.info-card h3 i {
    color: #3b82f6;
}

.info-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
}

.info-item {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.info-item label {
    font-size: 12px;
    font-weight: 600;
    color: #6b7280;
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

.info-value {
    font-size: 14px;
    color: #111827;
    font-weight: 500;
    padding: 10px 12px;
    background: #f9fafb;
    border-radius: 6px;
    border: 1px solid #e5e7eb;
}

.info-text {
    font-size: 14px;
    color: #374151;
    line-height: 1.6;
    background: #f9fafb;
    padding: 16px;
    border-radius: 8px;
    border: 1px solid #e5e7eb;
    white-space: pre-wrap;
}

.form-group {
    margin-bottom: 20px;
}

.form-group label {
    display: block;
    margin-bottom: 8px;
    font-weight: 600;
    color: #374151;
    font-size: 14px;
}

.form-input,
.form-textarea {
    width: 100%;
    padding: 12px;
    border: 2px solid #e5e7eb;
    border-radius: 8px;
    font-size: 14px;
    color: #111827;
    font-family: inherit;
    transition: all 0.2s;
}

.form-input:focus,
.form-textarea:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.form-textarea {
    resize: vertical;
    line-height: 1.6;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}

.checkbox-label input {
  width: 18px;
  height: 18px;
  cursor: pointer;
  margin: 0;
  vertical-align: middle;
}

.checkbox-label span {
  line-height: 18px;
  vertical-align: middle;
}

.action-buttons {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 12px;
    margin-top: 20px;
}

.btn {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 12px 20px;
    border: none;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
    font-size: 14px;
}

.btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.btn-info {
    background: #0ea5e9;
    color: white;
}

.btn-info:hover:not(:disabled) {
    background: #0284c7;
}

.btn-success {
    background: #059669;
    color: white;
}

.btn-success:hover:not(:disabled) {
    background: #047857;
}

.btn-danger {
    background: #dc2626;
    color: white;
}

.btn-danger:hover:not(:disabled) {
    background: #b91c1c;
}

.btn-primary {
    background: #3b82f6;
    color: white;
}

.btn-primary:hover:not(:disabled) {
    background: #2563eb;
}

.btn-warning {
    background: #f59e0b;
    color: white;
}

.btn-warning:hover:not(:disabled) {
    background: #d97706;
}

.btn-refunded {
    background: #059669;
    color: white;
}

.btn-refunded:hover:not(:disabled) {
    background: #047857;
}

.btn-closed {
    background: #6b7280;
    color: white;
}

.btn-closed:hover:not(:disabled) {
    background: #4b5563;
}

/* Badges */
.type-badge,
.status-badge {
    display: inline-block;
    padding: 6px 12px;
    border-radius: 12px;
    font-size: 12px;
    font-weight: 600;
}

.type-cancel { background: #fee2e2; color: #991b1b; }
.type-refund { background: #d1fae5; color: #065f46; }
.type-exchange { background: #fef3c7; color: #92400e; }
.type-info { background: #e0e7ff; color: #3730a3; }

.status-pending { background: #fef3c7; color: #92400e; }
.status-info { background: #e0e7ff; color: #3730a3; }
.status-responded { background: #dbeafe; color: #1e40af; }
.status-approved { background: #d1fae5; color: #065f46; }
.status-rejected { background: #fee2e2; color: #991b1b; }
.status-returning { background: #fef3c7; color: #92400e; }
.status-returned { background: #dbeafe; color: #1e40af; }
.status-refunded { background: #d1fae5; color: #065f46; }
.status-completed { background: #d1fae5; color: #065f46; }
.status-closed { background: #f3f4f6; color: #6b7280; }

/* Responsive */
@media (max-width: 768px) {
    .case-detail-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 16px;
    }

    .info-grid {
        grid-template-columns: 1fr;
    }

    .action-buttons {
        flex-direction: column;
    }

    .btn {
        width: 100%;
        justify-content: center;
    }
}
</style>

