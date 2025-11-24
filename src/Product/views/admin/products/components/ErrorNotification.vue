<template>
    <div class="error-notification" v-if="hasErrors">
        <div class="error-header">
            <i class="fa fa-exclamation-triangle"></i>
            <strong>{{ errorCount }} {{ errorCount === 1 ? 'lỗi' : 'lỗi' }} được tìm thấy</strong>
        </div>

        <ul class="error-list" v-if="errorList.length > 0">
            <li v-for="(error, index) in errorList" :key="index" class="error-item">
                <span class="error-field">{{ error.field }}:</span>
                <span class="error-message">{{ error.message }}</span>
                <a href="#" class="scroll-to-field" @click.prevent="scrollToField(error.field)">
                    <i class="fa fa-arrow-right"></i>
                </a>
            </li>
        </ul>
    </div>
</template>

<script>
export default {
    name: 'ErrorNotification',
    props: {
        errors: {
            type: Object,
            required: true,
        }
    },
    computed: {
        hasErrors() {
            return this.errors && this.errors.errors && Object.keys(this.errors.errors).length > 0;
        },
        errorCount() {
            return Object.keys(this.errors.errors || {}).length;
        },
        errorList() {
            const list = [];
            if (!this.errors.errors) return list;

            Object.keys(this.errors.errors).forEach(field => {
                const messages = this.errors.errors[field];
                if (Array.isArray(messages)) {
                    messages.forEach(msg => {
                        list.push({
                            field: this.formatFieldName(field),
                            message: msg
                        });
                    });
                } else {
                    list.push({
                        field: this.formatFieldName(field),
                        message: messages
                    });
                }
            });
            return list;
        }
    },
    methods: {
        formatFieldName(field) {
            // Convert field name từ camelCase hoặc snake_case sang readable format
            return field
                .replace(/([A-Z])/g, ' $1') // camelCase -> spaces
                .replace(/_/g, ' ') // snake_case -> spaces
                .replace(/\b\w/g, l => l.toUpperCase()); // capitalize
        },
        scrollToField(field) {
            // Scroll to field element
            const fieldId = field.replace(/\s+/g, '-').toLowerCase();
            const element = document.getElementById(fieldId) ||
                           document.querySelector(`[name="${field}"]`) ||
                           document.querySelector(`[name="${field.replace(/\s/g, '_')}"]`);

            if (element) {
                element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                element.focus();
                element.classList.add('shake-animation');
                setTimeout(() => element.classList.remove('shake-animation'), 500);
            }
        }
    }
};
</script>

<style scoped>
.error-notification {
    background-color: #f8d7da;
    border: 1px solid #f5c6cb;
    border-radius: 4px;
    padding: 15px;
    margin-bottom: 20px;
    animation: slideDown 0.3s ease-in-out;
}

@keyframes slideDown {
    from {
        opacity: 0;
        transform: translateY(-10px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.error-header {
    color: #721c24;
    font-weight: 600;
    margin-bottom: 10px;
    display: flex;
    align-items: center;
    gap: 8px;
}

.error-header i {
    font-size: 16px;
}

.error-list {
    list-style: none;
    padding: 0;
    margin: 0;
}

.error-item {
    padding: 8px 0;
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: #721c24;
    font-size: 13px;
}

.error-item:last-child {
    border-bottom: none;
}

.error-field {
    font-weight: 600;
    min-width: 120px;
}

.error-message {
    flex: 1;
    padding: 0 10px;
}

.scroll-to-field {
    color: #721c24;
    text-decoration: none;
    padding: 5px 10px;
    border-radius: 3px;
    transition: all 0.2s ease;
}

.scroll-to-field:hover {
    background-color: rgba(0, 0, 0, 0.1);
    text-decoration: none;
}

.shake-animation {
    animation: shake 0.3s ease-in-out;
}

@keyframes shake {
    0%, 100% {
        transform: translateX(0);
    }
    25% {
        transform: translateX(-5px);
    }
    75% {
        transform: translateX(5px);
    }
}
</style>

